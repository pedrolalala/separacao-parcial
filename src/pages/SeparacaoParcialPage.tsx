import { useState, useMemo, useEffect, useRef } from 'react'
import {
  Loader2,
  Scissors,
  LogOut,
  History,
  ArrowLeft,
  Search,
  Building2,
  Truck,
  ArrowLeftRight,
  ScrollText,
  Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/AuthContext'
import {
  buscarVendaPorNumero,
  criarSeparacaoParcial,
  estornarSeparacaoParcial,
  finalizarSeparacaoPronta,
  listarParciaisPorVenda,
  listarVendasDisponiveis,
  podeTrocarReserva,
  getReservasOutrosProjetos,
  trocarReserva,
  listarLogTrocas,
  listarItensDaParcial,
  estornarItemSeparacao,
  type VendaInfo,
  type ParcialHistorico,
  type VendaDisponivel,
  type ItemVenda,
  type ReservaOutroProjeto,
  type LogTroca,
  type ItemParcial,
} from '@/services/separacaoParcialService'

const LOGO_URL =
  'https://vcvcwzmbiftcawncibke.supabase.co/storage/v1/object/public/Logo/lucenera-vertical.png'

const fmtData = (iso: string) =>
  new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })

const fmtDataHora = (iso: string) =>
  new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

// SPEC-091 + SPEC-093: gera e já abre o diálogo de impressão (o usuário
// escolhe "Salvar como PDF" ou imprimir direto) assim que uma separação é
// confirmada — sem precisar de biblioteca de PDF nova nem Edge Function,
// reaproveita a impressão nativa do navegador. Mesmo documento serve pra
// imprimir a lista de separação (não existia nenhum layout de impressão
// antes desta SPEC).
function imprimirListaSeparacao(params: {
  venda: VendaInfo
  itensSeparados: {
    descricao: string
    codigo: number | null
    referencia: string | null
    classificacao: string | null
    quantidade: number
  }[]
  responsavelNome: string
}) {
  const janela = window.open('', '_blank', 'width=800,height=900')
  if (!janela) return

  // SPEC-138 (Prompt 6): localizador "L" (mesmo dado da coluna
  // "Classificação" em tela, vindo de projeto_itens.l_fixo), coluna de
  // marcação em branco pra conferência física, totalizador no rodapé e
  // campo de observações — pra alinhar a lista impressa com o que a
  // equipe de expedição já pedia pra marcar nas caixas.
  const totalItens = params.itensSeparados.length
  const totalPecas = params.itensSeparados.reduce((soma, i) => soma + i.quantidade, 0)

  const linhas = params.itensSeparados
    .map(
      (i) => `
        <tr>
          <td class="marcar">&#9633;</td>
          <td>${i.classificacao || '-'}</td>
          <td>${i.codigo ?? '-'}</td>
          <td>${i.referencia || '-'}</td>
          <td>${i.descricao || '-'}</td>
          <td style="text-align:right">${i.quantidade}</td>
        </tr>`,
    )
    .join('')

  janela.document.write(`
    <html>
      <head>
        <title>Separação ${params.venda.orcamentoNumero}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 24px; color: #111; }
          h1 { font-size: 18px; margin-bottom: 4px; }
          .meta { font-size: 13px; color: #555; margin-bottom: 16px; }
          table { width: 100%; border-collapse: collapse; font-size: 13px; }
          th, td { border: 1px solid #ccc; padding: 6px 8px; text-align: left; }
          th { background: #f3f3f3; }
          td.marcar { text-align: center; font-size: 16px; width: 28px; }
          tfoot td { font-weight: bold; background: #f9f9f9; }
          .observacoes { margin-top: 20px; font-size: 13px; }
          .observacoes .linha { border-bottom: 1px solid #999; height: 22px; margin-top: 10px; }
        </style>
      </head>
      <body>
        <h1>Lista de Separação — Orçamento ${params.venda.orcamentoNumero}</h1>
        <div class="meta">
          Venda: ${params.venda.vendaNumero || '-'}<br />
          Cliente: ${params.venda.clienteNome || '-'}<br />
          Projeto: ${params.venda.projetoCodigo || '-'}<br />
          Separado por: ${params.responsavelNome}<br />
          Data: ${new Date().toLocaleString('pt-BR')}
        </div>
        <table>
          <thead>
            <tr><th>Conf.</th><th>Local (L)</th><th>Código</th><th>Referência</th><th>Descrição</th><th>Qtd.</th></tr>
          </thead>
          <tbody>${linhas}</tbody>
          <tfoot>
            <tr><td colspan="5">Total de itens: ${totalItens}</td><td style="text-align:right">${totalPecas}</td></tr>
          </tfoot>
        </table>
        <div class="observacoes">
          <strong>Observações (pendências, avarias, substituições):</strong>
          <div class="linha"></div>
          <div class="linha"></div>
          <div class="linha"></div>
        </div>
      </body>
    </html>
  `)
  janela.document.close()
  janela.focus()
  janela.print()
}

export default function SeparacaoParcialPage() {
  const { user, signOut } = useAuth()
  const [vendasDisponiveis, setVendasDisponiveis] = useState<VendaDisponivel[]>([])
  const [carregandoVendas, setCarregandoVendas] = useState(true)
  const [filtro, setFiltro] = useState('')
  const [numeroVenda, setNumeroVenda] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [venda, setVenda] = useState<VendaInfo | null>(null)
  const [parciais, setParciais] = useState<ParcialHistorico[]>([])
  // SPEC-072: quantidade digitada na coluna "À Separar", por projeto_item_id
  // — zerada a cada "Separar" bem-sucedido.
  const [quantidades, setQuantidades] = useState<Record<string, string>>({})
  // SPEC-089: opcional — só usada se essa ação de "Separar" deixar a venda
  // inteira sem saldo em reserva (nada mais a separar), disparando a
  // integração automática com Logística.
  const [dataEntrega, setDataEntrega] = useState('')
  // Achado no teste de ponta a ponta 13-14/08: se a venda ficar sem
  // reserva SEM que dataEntrega tenha sido preenchida na mesma ação (ou a
  // finalização automática falhar por qualquer motivo), a separação fica
  // travada em "Pendente" para sempre — o campo "À Separar" fica
  // desabilitado (reserva zerada) e não há nenhum outro jeito de chamar
  // finalizar_separacao_parcial_pronta depois. Único jeito de sair era
  // Estornar tudo. Este estado cobre o resgate manual.
  const [dataEntregaFinal, setDataEntregaFinal] = useState('')
  const [finalizando, setFinalizando] = useState(false)
  // SPEC-090: estorno de uma separação já registrada.
  // SPEC-099: granular — lista os itens da separação (com quanto já foi
  // estornado) pra escolher peça + quantidade, mantendo "Reverter tudo".
  const [estornoAlvo, setEstornoAlvo] = useState<ParcialHistorico | null>(null)
  const [estornoObservacao, setEstornoObservacao] = useState('')
  const [estornando, setEstornando] = useState(false)
  const [estornoItens, setEstornoItens] = useState<ItemParcial[]>([])
  const [carregandoEstornoItens, setCarregandoEstornoItens] = useState(false)
  const [estornoQuantidades, setEstornoQuantidades] = useState<Record<string, string>>({})

  // SPEC-098: troca de peça em Reserva entre projetos (Projetista/gerente/
  // admin) — a permissão é decidida inteiramente no banco
  // (pode_trocar_reserva), carregada uma vez no login.
  const [podeTrocar, setPodeTrocar] = useState(false)
  const [trocaAlvo, setTrocaAlvo] = useState<ItemVenda | null>(null)
  const [reservasOutras, setReservasOutras] = useState<ReservaOutroProjeto[]>([])
  const [carregandoReservas, setCarregandoReservas] = useState(false)
  const [trocaDestino, setTrocaDestino] = useState<ReservaOutroProjeto | null>(null)
  const [trocaQuantidade, setTrocaQuantidade] = useState('')
  const [trocaMotivo, setTrocaMotivo] = useState('')
  const [trocando, setTrocando] = useState(false)
  const [logAberto, setLogAberto] = useState(false)
  const [logTrocas, setLogTrocas] = useState<LogTroca[]>([])
  const [carregandoLog, setCarregandoLog] = useState(false)

  // SPEC-072: antes disso o campo "Venda" era texto livre sem nenhuma forma
  // de descobrir quais números existem — carrega as vendas com saldo
  // operacional (aprovadas e com projeto_itens) pra virar um seletor de
  // busca em vez de um campo de texto cego.
  useEffect(() => {
    listarVendasDisponiveis()
      .then(setVendasDisponiveis)
      .catch((err) =>
        toast.error('Erro ao carregar lista de vendas', { description: err?.message }),
      )
      .finally(() => setCarregandoVendas(false))
  }, [])

  useEffect(() => {
    podeTrocarReserva()
      .then(setPodeTrocar)
      .catch(() => setPodeTrocar(false))
  }, [])

  const vendasFiltradas = useMemo(() => {
    const termo = filtro.trim().toLowerCase()
    if (!termo) return vendasDisponiveis
    return vendasDisponiveis.filter(
      (v) =>
        v.orcamentoNumero.toLowerCase().includes(termo) ||
        (v.vendaNumero || '').toLowerCase().includes(termo) ||
        (v.clienteNome || '').toLowerCase().includes(termo) ||
        (v.projetoCodigo || '').toLowerCase().includes(termo),
    )
  }, [vendasDisponiveis, filtro])

  // SPEC-092: unifica o código exibido da "parcial" com o código da venda
  // (antes era um fragmento de UUID sem relação nenhuma com o número da
  // venda) — numeração sequencial por ordem de criação, estável mesmo com
  // a lista exibida em ordem decrescente.
  const numerosParciais = useMemo(() => {
    const porDataAsc = [...parciais].sort(
      (a, b) => new Date(a.criadoEm).getTime() - new Date(b.criadoEm).getTime(),
    )
    const mapa = new Map<string, number>()
    porDataAsc.forEach((p, idx) => mapa.set(p.id, idx + 1))
    return mapa
  }, [parciais])

  // Achado no teste de ponta a ponta 13-14/08: venda sem nenhum saldo em
  // reserva mas com parcial(is) ainda "Pendente" — precisa de um jeito de
  // finalizar a entrega manualmente, já que "Separar" fica inutilizável
  // (nenhum item tem reserva > 0 pra digitar quantidade).
  const parciaisPendentes = useMemo(
    () => parciais.filter((p) => p.status === 'Pendente'),
    [parciais],
  )
  const vendaSemReserva = venda != null && venda.itens.every((i) => i.q_reserva <= 0)
  const precisaFinalizarManualmente = vendaSemReserva && parciaisPendentes.length > 0
  // Instrução do usuário (2026-09-14): "Boletos desta venda" removido por
  // completo (nenhuma informação financeira nesta tela) e a área de baixa
  // ("Parciais desta venda") só aparece depois da 1ª baixa registrada —
  // confirmado com o usuário que "dar baixa" é a mesma ação que já existe
  // (clicar "Separar", que cria uma linha em `parciais`), então o próprio
  // `parciais.length > 0` já é a condição.

  // Achado 14/08: usuário reportou "não consigo adicionar quantidade" e "não
  // tem como reverter" — na prática o campo "À Separar" fica corretamente
  // desabilitado quando Reserva = 0 (só dá pra separar do que está
  // reservado), mas isso ficava mudo: nenhuma explicação de que a
  // quantidade já foi pra uma parcial "Ag. Separar" nem link pro Estornar,
  // que existe mas fica numa seção separada, fácil de não notar.
  const parciaisSectionRef = useRef<HTMLDivElement>(null)
  const scrollToParciais = () => {
    parciaisSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleLocalizar = async (numero: string) => {
    setNumeroVenda(numero)
    setLoading(true)
    setVenda(null)
    setParciais([])
    setQuantidades({})
    try {
      const [vendaInfo, historico] = await Promise.all([
        buscarVendaPorNumero(numero),
        listarParciaisPorVenda(numero),
      ])
      if (!vendaInfo) {
        toast.error('Nenhuma venda encontrada com esse número.', {
          description: 'Confira o número ou se o orçamento já foi aprovado.',
        })
        return
      }
      setVenda(vendaInfo)
      setParciais(historico)
    } catch (err: any) {
      toast.error('Erro ao buscar venda', { description: err?.message })
    } finally {
      setLoading(false)
    }
  }

  // SPEC-072: usuário reportou que não tinha como voltar da tela de detalhe
  // pra lista de busca — reseta tudo e volta pro estado inicial.
  const handleVoltar = () => {
    setVenda(null)
    setNumeroVenda('')
    setParciais([])
    setQuantidades({})
    setDataEntrega('')
    setDataEntregaFinal('')
  }

  const handleSeparar = async () => {
    if (!venda) return

    const itens = venda.itens
      .map((item) => ({
        projetoItemId: item.projeto_item_id,
        produtoId: item.produto_id,
        descricao: item.descricao,
        quantidade: Number(quantidades[item.projeto_item_id]) || 0,
      }))
      .filter((i) => i.quantidade > 0)

    if (itens.length === 0) {
      toast.error('Informe a quantidade a separar em ao menos um item.')
      return
    }

    const excedente = itens.find((i) => {
      const item = venda.itens.find((v) => v.projeto_item_id === i.projetoItemId)
      return item && i.quantidade > item.q_reserva
    })
    if (excedente) {
      toast.error('Quantidade maior que a reserva disponível.', {
        description:
          'Separação só pode sair do que já está reservado para este cliente (coluna "Reserva").',
      })
      return
    }

    setSaving(true)
    try {
      const { separacaoId } = await criarSeparacaoParcial({
        numeroVenda: venda.orcamentoNumero,
        clienteId: venda.clienteId,
        clienteNome: venda.clienteNome,
        projetoCodigo: venda.projetoCodigo,
        itens,
      })
      toast.success('Separação parcial registrada com sucesso.')

      // SPEC-091: gera e abre a impressão da lista assim que a separação é
      // confirmada — sem precisar de um clique extra.
      imprimirListaSeparacao({
        venda,
        itensSeparados: itens.map((i) => {
          const original = venda.itens.find((v) => v.projeto_item_id === i.projetoItemId)
          return {
            descricao: i.descricao,
            codigo: original?.codigo ?? null,
            referencia: original?.referencia ?? null,
            classificacao: original?.classificacao ?? null,
            quantidade: i.quantidade,
          }
        }),
        responsavelNome: user?.email || 'Não identificado',
      })

      const [vendaAtualizada, historico] = await Promise.all([
        buscarVendaPorNumero(venda.orcamentoNumero),
        listarParciaisPorVenda(venda.orcamentoNumero),
      ])

      // SPEC-089: se essa ação deixou a venda inteira sem saldo em reserva
      // (nada mais a separar) e a pessoa informou data de entrega, finaliza
      // a separação como 'Pronto' — dispara automaticamente a criação da
      // entrega em Logística, sem precisar reentrar isso lá.
      const vendaCompleta =
        vendaAtualizada != null && vendaAtualizada.itens.every((i) => i.q_reserva <= 0)
      if (vendaCompleta && dataEntrega) {
        try {
          await finalizarSeparacaoPronta(separacaoId, dataEntrega)
          toast.success('Venda totalmente separada — entrega criada automaticamente na Logística.')
        } catch (err: any) {
          toast.error('Separação salva, mas não foi possível criar a entrega automática.', {
            description: err?.message,
          })
        }
      }

      setVenda(vendaAtualizada)
      setParciais(historico)
      setQuantidades({})
      setDataEntrega('')
    } catch (err: any) {
      toast.error('Erro ao registrar separação', { description: err?.message })
    } finally {
      setSaving(false)
    }
  }

  // Achado no teste de ponta a ponta 13-14/08: resgate manual para quando a
  // venda já está sem reserva (nada mais a separar) mas ainda há parcial(is)
  // "Pendente" sem entrega criada — finaliza cada uma delas com a mesma
  // data de entrega informada aqui.
  const handleFinalizarEntrega = async () => {
    if (!venda || parciaisPendentes.length === 0) return
    if (!dataEntregaFinal) {
      toast.error('Informe a data de entrega.')
      return
    }
    setFinalizando(true)
    try {
      for (const parcial of parciaisPendentes) {
        await finalizarSeparacaoPronta(parcial.id, dataEntregaFinal)
      }
      toast.success('Entrega finalizada — criada automaticamente na Logística.')
      const [vendaAtualizada, historico] = await Promise.all([
        buscarVendaPorNumero(venda.orcamentoNumero),
        listarParciaisPorVenda(venda.orcamentoNumero),
      ])
      setVenda(vendaAtualizada)
      setParciais(historico)
      setDataEntregaFinal('')
    } catch (err: any) {
      toast.error('Erro ao finalizar entrega', { description: err?.message })
    } finally {
      setFinalizando(false)
    }
  }

  // SPEC-099: abre o modal de estorno já carregando os itens da separação
  // (peça, quantidade, quanto já foi estornado) — antes o botão só revertia
  // a separação inteira, sem opção de escolher peça/quantidade.
  const handleAbrirEstorno = async (parcial: ParcialHistorico) => {
    setEstornoAlvo(parcial)
    setEstornoObservacao('')
    setEstornoQuantidades({})
    setCarregandoEstornoItens(true)
    try {
      const itens = await listarItensDaParcial(parcial.id)
      setEstornoItens(itens)
    } catch (err: any) {
      toast.error('Erro ao carregar itens da separação', { description: err?.message })
    } finally {
      setCarregandoEstornoItens(false)
    }
  }

  const handleFecharEstorno = () => {
    setEstornoAlvo(null)
    setEstornoObservacao('')
    setEstornoItens([])
    setEstornoQuantidades({})
  }

  // SPEC-099: estorna só as peças/quantidades preenchidas nos campos —
  // resolve o caso relatado (separação com 2 peças, usuário queria desfazer
  // só 1 das 2, e só parte da quantidade de uma delas).
  const handleEstornarItens = async () => {
    if (!venda) return
    if (!estornoObservacao.trim()) {
      toast.error('Informe o motivo do estorno.')
      return
    }
    const itensParaEstornar = estornoItens
      .map((item) => ({ item, quantidade: Number(estornoQuantidades[item.id]) || 0 }))
      .filter(({ quantidade }) => quantidade > 0)

    if (itensParaEstornar.length === 0) {
      toast.error('Informe a quantidade a estornar em ao menos uma peça.')
      return
    }
    const excedente = itensParaEstornar.find(
      ({ item, quantidade }) => quantidade > item.quantidade - item.quantidadeEstornada,
    )
    if (excedente) {
      toast.error('Quantidade maior que o restante ainda não estornado dessa peça.')
      return
    }

    setEstornando(true)
    try {
      for (const { item, quantidade } of itensParaEstornar) {
        await estornarItemSeparacao(item.id, quantidade, estornoObservacao.trim())
      }
      toast.success('Peça(s) estornada(s). O saldo voltou para a reserva.')
      const [vendaAtualizada, historico] = await Promise.all([
        buscarVendaPorNumero(venda.orcamentoNumero),
        listarParciaisPorVenda(venda.orcamentoNumero),
      ])
      setVenda(vendaAtualizada)
      setParciais(historico)
      handleFecharEstorno()
    } catch (err: any) {
      toast.error('Erro ao estornar item', { description: err?.message })
    } finally {
      setEstornando(false)
    }
  }

  // SPEC-090: estorna a separação inteira selecionada — devolve o saldo
  // pra reserva, exige motivo, e avisa a entrega vinculada (se já existir)
  // pelas observações dela. SPEC-099: continua existindo como atalho
  // "Reverter tudo" dentro do mesmo modal granular.
  const handleReverterTudo = async () => {
    if (!estornoAlvo || !venda) return
    if (!estornoObservacao.trim()) {
      toast.error('Informe o motivo do estorno.')
      return
    }
    setEstornando(true)
    try {
      await estornarSeparacaoParcial(estornoAlvo.id, estornoObservacao.trim())
      toast.success('Separação estornada. O saldo voltou para a reserva.')
      const [vendaAtualizada, historico] = await Promise.all([
        buscarVendaPorNumero(venda.orcamentoNumero),
        listarParciaisPorVenda(venda.orcamentoNumero),
      ])
      setVenda(vendaAtualizada)
      setParciais(historico)
      handleFecharEstorno()
    } catch (err: any) {
      toast.error('Erro ao estornar separação', { description: err?.message })
    } finally {
      setEstornando(false)
    }
  }

  // SPEC-098: abre o modal de troca pra um item específico e carrega, na
  // hora, quem mais tem essa mesma peça reservada (painel "Reservado por
  // Cliente/Projeto", mesma fonte de dado do card de peça do Cadastro
  // Lucenera) — essa lista também serve de seletor de destino.
  const handleAbrirTroca = async (item: ItemVenda) => {
    setTrocaAlvo(item)
    setTrocaDestino(null)
    setTrocaQuantidade('')
    setTrocaMotivo('')
    if (!item.produto_id) {
      setReservasOutras([])
      return
    }
    setCarregandoReservas(true)
    try {
      const rows = await getReservasOutrosProjetos(item.produto_id, item.projeto_item_id)
      setReservasOutras(rows)
    } catch (err: any) {
      toast.error('Erro ao buscar outras reservas desta peça', { description: err?.message })
    } finally {
      setCarregandoReservas(false)
    }
  }

  const handleFecharTroca = () => {
    setTrocaAlvo(null)
    setTrocaDestino(null)
    setTrocaQuantidade('')
    setTrocaMotivo('')
    setReservasOutras([])
  }

  const handleConfirmarTroca = async () => {
    if (!trocaAlvo || !trocaDestino || !venda) return
    const quantidade = Number(trocaQuantidade)
    if (!quantidade || quantidade <= 0) {
      toast.error('Informe uma quantidade válida.')
      return
    }
    if (quantidade > trocaAlvo.q_reserva) {
      toast.error('Quantidade maior que a reserva disponível para troca.')
      return
    }
    setTrocando(true)
    try {
      await trocarReserva({
        origemProjetoItemId: trocaAlvo.projeto_item_id,
        destinoProjetoItemId: trocaDestino.projetoItemId,
        quantidade,
        motivo: trocaMotivo.trim() || undefined,
      })
      toast.success(
        `${quantidade} unidade(s) trocada(s) para ${trocaDestino.projetoCodigo || trocaDestino.orcamentoNumero || 'o outro projeto'}.`,
      )
      const vendaAtualizada = await buscarVendaPorNumero(venda.orcamentoNumero)
      setVenda(vendaAtualizada)
      handleFecharTroca()
    } catch (err: any) {
      toast.error('Erro ao trocar reserva', { description: err?.message })
    } finally {
      setTrocando(false)
    }
  }

  // SPEC-098: "Log de Trocas" — histórico completo de trocas já aprovadas,
  // não só desta venda, pra ficar fácil de auditar quem fez o quê.
  const handleAbrirLog = async () => {
    setLogAberto(true)
    setCarregandoLog(true)
    try {
      const rows = await listarLogTrocas()
      setLogTrocas(rows)
    } catch (err: any) {
      toast.error('Erro ao carregar log de trocas', { description: err?.message })
    } finally {
      setCarregandoLog(false)
    }
  }

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      <header className="sticky top-0 z-10 bg-card border-b px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img src={LOGO_URL} alt="Lucenera" className="h-8 w-auto object-contain" />
          <div className="h-6 w-px bg-border hidden sm:block" />
          <h1 className="font-bold text-lg hidden sm:block">Separação Parcial</h1>
        </div>
        <div className="flex items-center gap-3">
          {podeTrocar && (
            <Button variant="outline" size="sm" onClick={handleAbrirLog}>
              <ScrollText className="w-4 h-4 mr-2" />
              Log de Trocas
            </Button>
          )}
          <span className="text-sm text-muted-foreground hidden sm:inline">{user?.email}</span>
          <Button variant="ghost" size="icon" asChild title="Voltar para a Central Lucenera">
            <a href="https://central-lucenera-dashboard-1c9ba.goskip.app/dashboard">
              <Building2 className="w-4 h-4" />
            </a>
          </Button>
          <Button variant="ghost" size="icon" onClick={() => signOut()} title="Sair">
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </header>

      <main className="flex-1 p-4 sm:p-6 flex flex-col gap-4 max-w-[1400px] w-full mx-auto">
        {!venda ? (
          <div className="bg-card border rounded-xl p-4">
            <label className="text-xs font-semibold uppercase text-muted-foreground">
              Buscar venda
            </label>
            <div className="relative mt-1 mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                placeholder="Filtrar por número da venda ou cliente..."
                className="pl-9"
                disabled={carregandoVendas}
              />
            </div>

            {carregandoVendas ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : vendasFiltradas.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-10">
                {vendasDisponiveis.length === 0
                  ? 'Nenhuma venda aprovada com saldo encontrada.'
                  : 'Nenhuma venda encontrada com esse filtro.'}
              </p>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {/* Pedido do usuário (2026-09-14): Venda antes de
                          Orçamento — antes o número da venda ficava
                          escondido depois do orçamento. */}
                      <TableHead>Venda</TableHead>
                      <TableHead>Orçamento</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Projeto</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vendasFiltradas.map((v) => (
                      <TableRow
                        key={v.orcamentoNumero}
                        onClick={() => !loading && handleLocalizar(v.orcamentoNumero)}
                        className={`cursor-pointer hover:bg-primary/5 ${loading ? 'pointer-events-none opacity-50' : ''}`}
                      >
                        {/* SPEC-138 (Prompt 4): referências de orçamento/venda em
                            cor escura + semibold + leve letter-spacing, pra
                            leitura rápida em tela de gestão. */}
                        <TableCell className="font-semibold text-[#333333] tracking-wide text-sm">
                          {v.vendaNumero || '—'}
                        </TableCell>
                        <TableCell className="text-sm">{v.orcamentoNumero}</TableCell>
                        <TableCell className="text-sm">
                          {v.clienteNome || 'Cliente não identificado'}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {v.projetoCodigo || '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-card border rounded-xl p-4 flex flex-wrap items-center gap-4">
            <Button variant="outline" size="sm" onClick={handleVoltar}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar à busca
            </Button>
            <div className="flex-1 min-w-[240px] flex flex-wrap gap-x-6 gap-y-1 text-sm">
              <div>
                <span className="text-muted-foreground">Orçamento: </span>
                <span className="font-medium">{venda.orcamentoNumero}</span>
              </div>
              <div>
                {/* SPEC-136: número da venda é distinto do orçamento de
                origem — null em orçamentos aprovados antes desta SPEC. */}
                <span className="text-muted-foreground">Venda: </span>
                <span className="font-medium">{venda.vendaNumero || '—'}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Cliente: </span>
                <span className="font-medium">{venda.clienteNome || '-'}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Projeto: </span>
                <span className="font-medium">{venda.projetoCodigo || '-'}</span>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        )}

        {venda && (
          <>
            <div className="bg-card border rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead className="max-w-[140px]">Referência</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead className="max-w-[110px]">Local (L)</TableHead>
                      <TableHead className="text-right">Q. Dev.</TableHead>
                      <TableHead className="text-right">Q. Venda</TableHead>
                      <TableHead className="text-right">E. Futura</TableHead>
                      <TableHead className="text-right">Transferido</TableHead>
                      <TableHead className="text-right">Reserva</TableHead>
                      <TableHead className="text-right bg-primary/5">À Separar</TableHead>
                      <TableHead className="text-right">Ag. Separar</TableHead>
                      <TableHead className="text-right">Separado</TableHead>
                      <TableHead className="text-right">Entregue</TableHead>
                      {/* SPEC-138 (Prompt 5): coluna de ação fixa à direita
                          dentro do overflow-x-auto — evita rolar até o fim
                          pra alcançar o botão "Trocar". */}
                      {podeTrocar && (
                        <TableHead className="sticky right-0 bg-card shadow-[-4px_0_4px_-4px_rgba(0,0,0,0.15)]" />
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {venda.itens.map((item) => (
                      <TableRow key={item.projeto_item_id}>
                        <TableCell className="font-mono font-semibold text-[#333333] tracking-wide text-sm">
                          {item.codigo ?? '-'}
                        </TableCell>
                        <TableCell
                          className="text-sm max-w-[140px] truncate"
                          title={item.referencia || ''}
                        >
                          {item.referencia || '-'}
                        </TableCell>
                        <TableCell
                          className="text-sm max-w-[240px] truncate"
                          title={item.descricao || ''}
                        >
                          {item.descricao || '-'}
                        </TableCell>
                        <TableCell
                          className="text-sm max-w-[110px] truncate"
                          title={item.classificacao || ''}
                        >
                          {item.classificacao || '-'}
                        </TableCell>
                        <TableCell className="text-right text-sm">{item.q_devolvida}</TableCell>
                        <TableCell className="text-right text-sm font-semibold">
                          {item.q_venda}
                        </TableCell>
                        <TableCell className="text-right text-sm">
                          {item.q_entrega_futura}
                        </TableCell>
                        <TableCell className="text-right text-sm">
                          {item.q_transferida_saida}
                        </TableCell>
                        <TableCell className="text-right text-sm font-semibold text-emerald-700">
                          {item.q_reserva}
                        </TableCell>
                        <TableCell className="bg-primary/5">
                          {item.q_reserva <= 0 && item.q_ag_separar > 0 ? (
                            <button
                              type="button"
                              onClick={scrollToParciais}
                              className="text-xs text-amber-700 underline decoration-dotted underline-offset-2 hover:text-amber-900 text-left leading-tight"
                            >
                              Sem reserva — {item.q_ag_separar} já enviado(s), ver abaixo p/
                              estornar
                            </button>
                          ) : (
                            <Input
                              type="number"
                              min={0}
                              max={item.q_reserva}
                              step="1"
                              value={quantidades[item.projeto_item_id] ?? ''}
                              onChange={(e) =>
                                setQuantidades((q) => ({
                                  ...q,
                                  [item.projeto_item_id]: e.target.value,
                                }))
                              }
                              disabled={item.q_reserva <= 0}
                              className="w-20 h-8 text-right text-sm"
                              placeholder="0"
                            />
                          )}
                        </TableCell>
                        <TableCell className="text-right text-sm">{item.q_ag_separar}</TableCell>
                        <TableCell className="text-right text-sm">{item.q_separado}</TableCell>
                        <TableCell className="text-right text-sm">{item.q_entregue}</TableCell>
                        {podeTrocar && (
                          <TableCell className="sticky right-0 bg-card shadow-[-4px_0_4px_-4px_rgba(0,0,0,0.15)]">
                            {item.q_reserva > 0 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                title="Trocar peça reservada com outro projeto"
                                onClick={() => handleAbrirTroca(item)}
                              >
                                <ArrowLeftRight className="w-4 h-4 mr-1" />
                                Trocar
                              </Button>
                            )}
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="p-4 border-t flex flex-wrap items-end justify-end gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold uppercase text-muted-foreground">
                    Data de entrega (se esta ação completar a venda)
                  </label>
                  <Input
                    type="date"
                    value={dataEntrega}
                    onChange={(e) => setDataEntrega(e.target.value)}
                    className="h-9 w-44"
                  />
                </div>
                <Button onClick={handleSeparar} disabled={saving}>
                  {saving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Scissors className="w-4 h-4 mr-2" />
                  )}
                  Separar
                </Button>
              </div>
            </div>

            {precisaFinalizarManualmente && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="font-semibold text-sm text-amber-900">
                    Venda sem saldo em reserva — falta finalizar a entrega
                  </h2>
                  <p className="text-sm text-amber-800">
                    Todos os itens já foram separados, mas ainda há {parciaisPendentes.length}{' '}
                    separação(ões) pendente(s) sem data de entrega. Informe a data para criar a
                    entrega na Logística.
                  </p>
                </div>
                <div className="flex items-end gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold uppercase text-muted-foreground">
                      Data de entrega
                    </label>
                    <Input
                      type="date"
                      value={dataEntregaFinal}
                      onChange={(e) => setDataEntregaFinal(e.target.value)}
                      className="h-9 w-44"
                    />
                  </div>
                  <Button onClick={handleFinalizarEntrega} disabled={finalizando}>
                    {finalizando ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Truck className="w-4 h-4 mr-2" />
                    )}
                    Finalizar Entrega
                  </Button>
                </div>
              </div>
            )}

            {/* Instrução do usuário (2026-09-14): "Boletos desta venda" foi
                removido por completo desta tela — nenhuma informação
                financeira (boleto, valor, parcela, vencimento) aparece
                aqui. A área de baixa ("Parciais desta venda") fica
                totalmente oculta até a 1ª baixa (mesma ação de "Separar")
                acontecer; quando aparece, só tem dados de controle
                operacional: Código, Data Baixa, Funcionário e Responsável
                Retirou (mesmo dado do Funcionário — confirmado com o
                usuário que não existe pessoa distinta registrada pra
                quem retirou). */}
            {parciais.length > 0 && (
              <div ref={parciaisSectionRef} className="bg-card border rounded-xl p-4 scroll-mt-4">
                <div className="flex items-center gap-2 mb-3">
                  <History className="w-4 h-4 text-muted-foreground" />
                  <h2 className="font-semibold text-sm">Parciais desta venda</h2>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Data Baixa</TableHead>
                      <TableHead>Funcionário</TableHead>
                      <TableHead>Responsável Retirou</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parciais.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-mono text-xs">
                          {venda.orcamentoNumero}-P{numerosParciais.get(p.id) ?? '?'}
                        </TableCell>
                        <TableCell className="text-sm">{fmtData(p.criadoEm)}</TableCell>
                        <TableCell className="text-sm">{p.responsavelNome || '-'}</TableCell>
                        <TableCell className="text-sm">{p.responsavelNome || '-'}</TableCell>
                        <TableCell>
                          <Badge variant={p.status === 'Cancelado' ? 'destructive' : 'outline'}>
                            {p.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {p.status !== 'Cancelado' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleAbrirEstorno(p)}
                            >
                              Estornar
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </>
        )}
      </main>

      {/* SPEC-099: estorno granular — escolhe peça + quantidade, ou reverte
          a separação inteira de uma vez ("Reverter tudo"). */}
      <Dialog open={!!estornoAlvo} onOpenChange={(open) => !open && handleFecharEstorno()}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Estornar separação</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Escolha a peça e a quantidade a devolver para a Reserva, ou reverta a separação
            inteira de uma vez.
          </p>
          {carregandoEstornoItens ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden max-h-64 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Peça</TableHead>
                    <TableHead className="text-right">Restante</TableHead>
                    <TableHead className="text-right w-28">Estornar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {estornoItens.map((item) => {
                    const restante = item.quantidade - item.quantidadeEstornada
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="text-sm max-w-[200px] truncate" title={item.descricao}>
                          {item.descricao}
                        </TableCell>
                        <TableCell className="text-right text-sm">{restante}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min={0}
                            max={restante}
                            step="1"
                            value={estornoQuantidades[item.id] ?? ''}
                            onChange={(e) =>
                              setEstornoQuantidades((q) => ({ ...q, [item.id]: e.target.value }))
                            }
                            disabled={restante <= 0}
                            className="w-20 h-8 text-right text-sm ml-auto"
                            placeholder="0"
                          />
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase text-muted-foreground">
              Motivo do estorno *
            </label>
            <Textarea
              value={estornoObservacao}
              onChange={(e) => setEstornoObservacao(e.target.value)}
              placeholder="Ex.: separei 3, era pra ser 2"
              rows={3}
            />
          </div>
          <DialogFooter className="flex-wrap gap-2">
            <Button variant="outline" onClick={handleFecharEstorno} disabled={estornando}>
              Cancelar
            </Button>
            <Button
              variant="secondary"
              onClick={handleReverterTudo}
              disabled={estornando || !estornoObservacao.trim()}
            >
              {estornando ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Reverter tudo
            </Button>
            <Button
              variant="destructive"
              onClick={handleEstornarItens}
              disabled={estornando || !estornoObservacao.trim()}
            >
              {estornando ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Estornar peça(s) selecionada(s)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* SPEC-098: modal de troca — a lista "Reservado por Cliente/Projeto"
          (mesma informação do card de peça do Cadastro Lucenera) funciona
          como seletor de destino: escolhe a linha, informa quantidade e
          motivo, confirma. */}
      <Dialog open={!!trocaAlvo} onOpenChange={(open) => !open && handleFecharTroca()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Trocar peça reservada</DialogTitle>
          </DialogHeader>
          {trocaAlvo && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">
                  {trocaAlvo.codigo ?? '-'} — {trocaAlvo.descricao || 'Item sem descrição'}
                </span>
                <br />
                Reserva disponível para troca:{' '}
                <span className="font-semibold text-emerald-700">{trocaAlvo.q_reserva}</span>
              </p>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <h3 className="text-sm font-semibold">Reservado por Cliente/Projeto</h3>
                </div>
                {carregandoReservas ? (
                  <div className="flex items-center justify-center py-6">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  </div>
                ) : reservasOutras.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center border rounded-lg">
                    Nenhum outro projeto tem essa peça reservada no momento.
                  </p>
                ) : (
                  <div className="border rounded-lg overflow-hidden max-h-64 overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Projeto</TableHead>
                          <TableHead>Cliente</TableHead>
                          <TableHead>Equipe</TableHead>
                          <TableHead className="text-right">Reservado</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {reservasOutras.map((r) => (
                          <TableRow
                            key={r.projetoItemId}
                            onClick={() => setTrocaDestino(r)}
                            className={`cursor-pointer hover:bg-primary/5 ${
                              trocaDestino?.projetoItemId === r.projetoItemId
                                ? 'bg-primary/10'
                                : ''
                            }`}
                          >
                            <TableCell className="text-sm font-medium">
                              {r.projetoCodigo || r.orcamentoNumero || '-'}
                            </TableCell>
                            <TableCell className="text-sm">{r.clienteNome || '-'}</TableCell>
                            <TableCell className="text-sm">{r.equipeNome || '-'}</TableCell>
                            <TableCell className="text-right text-sm font-semibold">
                              {r.qReserva}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>

              {trocaDestino && (
                <div className="space-y-3 border-t pt-4">
                  <p className="text-sm">
                    Destino selecionado:{' '}
                    <span className="font-semibold">
                      {trocaDestino.projetoCodigo || trocaDestino.orcamentoNumero} —{' '}
                      {trocaDestino.clienteNome || 'Cliente não identificado'}
                    </span>
                  </p>
                  <div className="flex flex-wrap items-end gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold uppercase text-muted-foreground">
                        Quantidade *
                      </label>
                      <Input
                        type="number"
                        min={1}
                        max={trocaAlvo.q_reserva}
                        value={trocaQuantidade}
                        onChange={(e) => setTrocaQuantidade(e.target.value)}
                        className="w-28 h-9"
                        placeholder="0"
                      />
                    </div>
                    <div className="flex flex-col gap-1 flex-1 min-w-[220px]">
                      <label className="text-xs font-semibold uppercase text-muted-foreground">
                        Motivo (opcional)
                      </label>
                      <Input
                        value={trocaMotivo}
                        onChange={(e) => setTrocaMotivo(e.target.value)}
                        placeholder="Ex.: projeto mais urgente precisa da peça"
                        className="h-9"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={handleFecharTroca} disabled={trocando}>
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmarTroca}
              disabled={trocando || !trocaDestino || !trocaQuantidade}
            >
              {trocando ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Confirmar troca
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* SPEC-098: log de trocas já aprovadas — fácil de consultar sem
          precisar abrir o banco. */}
      <Dialog open={logAberto} onOpenChange={setLogAberto}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Log de Trocas</DialogTitle>
          </DialogHeader>
          {carregandoLog ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : logTrocas.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-10">
              Nenhuma troca registrada ainda.
            </p>
          ) : (
            <div className="max-h-[60vh] overflow-y-auto border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Peça</TableHead>
                    <TableHead>De</TableHead>
                    <TableHead>Para</TableHead>
                    <TableHead className="text-right">Qtd.</TableHead>
                    <TableHead>Feito por</TableHead>
                    <TableHead>Motivo</TableHead>
                    <TableHead>Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logTrocas.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="text-sm">
                        <span className="font-mono font-semibold text-[#333333] tracking-wide">
                          {t.produtoCodigo ?? '-'}
                        </span>
                        <br />
                        <span className="text-xs text-muted-foreground">
                          {t.produtoDescricao || '-'}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm">
                        {t.origemProjetoCodigo || '-'}
                        <br />
                        <span className="text-xs text-muted-foreground">
                          {t.origemClienteNome || '-'}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm">
                        {t.destinoProjetoCodigo || '-'}
                        <br />
                        <span className="text-xs text-muted-foreground">
                          {t.destinoClienteNome || '-'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right text-sm font-semibold">
                        {t.quantidade}
                      </TableCell>
                      <TableCell className="text-sm">{t.solicitanteNome || '-'}</TableCell>
                      <TableCell className="text-sm max-w-[180px] truncate" title={t.motivo || ''}>
                        {t.motivo || '-'}
                      </TableCell>
                      <TableCell className="text-sm whitespace-nowrap">
                        {fmtDataHora(t.solicitadoEm)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
