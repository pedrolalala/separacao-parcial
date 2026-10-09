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
  Eye,
  Printer,
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

// SPEC-192: endereço do Supabase vem da configuração (migração Ohio -> São Paulo).
const LOGO_URL = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/Logo/lucenera-vertical.png`

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

const fmtDataCurta = (iso: string | null) => (iso ? fmtData(iso) : '-')

// SPEC-176: coluna `date` (ex.: previsao_entrega) chega como "AAAA-MM-DD";
// new Date() leria como meia-noite UTC e mostraria o dia anterior no Brasil.
const fmtDia = (v: string | null) => {
  if (!v) return '-'
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v)
  return m ? `${m[3]}/${m[2]}/${m[1]}` : fmtData(v)
}

// SPEC-176: na listagem o número aparece sem o prefixo ("VENDA-0001" → "0001");
// o dado gravado e a busca continuam com o número completo.
const semPrefixo = (numero: string | null) => (numero ? numero.replace(/^[A-Za-z]+-/, '') : null)

// Reunião de 05/10 [08:48]: lista "sempre na ordem" dos L (L1, L1, L2, L3...).
// Sem L vai para o fim; empate mantém a ordem original.
const numeroDoL = (l: string | null | undefined) => {
  const m = /(\d+)/.exec(l || '')
  return m ? Number(m[1]) : Number.MAX_SAFE_INTEGER
}
function ordenarPorL<T>(itens: T[], l: (i: T) => string | null | undefined): T[] {
  return itens
    .map((item, idx) => ({ item, idx }))
    .sort((a, b) => numeroDoL(l(a.item)) - numeroDoL(l(b.item)) || a.idx - b.idx)
    .map((x) => x.item)
}

// SPEC-091 + SPEC-093: gera e já abre o diálogo de impressão (o usuário
// escolhe "Salvar como PDF" ou imprimir direto) assim que uma separação é
// confirmada — sem precisar de biblioteca de PDF nova nem Edge Function,
// reaproveita a impressão nativa do navegador. Mesmo documento serve pra
// imprimir a lista de separação (não existia nenhum layout de impressão
// antes desta SPEC).
// SPEC-144: layout redesenhado a partir do "Pedido em Separação" do Connect
// (documento físico que a equipe de expedição já conhece) — número da
// parcial+venda no topo, empresa real da venda (Foco/Manoella/Islight),
// dados completos do cliente/vendedor, e os dois blocos de assinatura de
// conferência do documento original.
function imprimirListaSeparacao(params: {
  venda: VendaInfo
  numeroSeparacao: number
  dataEntregaInformada: string
  itensSeparados: {
    descricao: string
    codigo: number | null
    referencia: string | null
    classificacao: string | null
    quantidade: number
  }[]
}) {
  const janela = window.open('', '_blank', 'width=800,height=900')
  if (!janela) return

  const { venda } = params

  // SPEC-138 (Prompt 6): localizador "L" (mesmo dado da coluna
  // "Classificação" em tela, vindo de projeto_itens.l_fixo), totalizador no
  // rodapé e campo de observações.
  // SPEC-176: logo no cabeçalho, sem a coluna "Conf.", referência + descrição
  // numa linha só (cortada com reticências, texto completo no title), Cód.
  // Ref. e Quantidade centralizados, e rodapé só com Entregador e Recebedor.
  // Reunião de 05/10: Cód. e Ref. em colunas separadas, "Quant." abreviado,
  // descrição em letra menor e quebrando linha (antes era cortada com "...") e
  // itens em ordem de L.
  const itensOrdenados = ordenarPorL(params.itensSeparados, (i) => i.classificacao)
  const totalItens = itensOrdenados.length
  const totalPecas = itensOrdenados.reduce((soma, i) => soma + i.quantidade, 0)

  const esc = (v: unknown) =>
    String(v ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')

  const linhas = itensOrdenados
    .map(
      (i) => `
        <tr>
          <td class="centro">${esc(i.classificacao || '-')}</td>
          <td class="centro">${esc(i.codigo ?? '-')}</td>
          <td class="ref">${esc(i.referencia || '-')}</td>
          <td class="descricao">${esc(i.descricao || '-')}</td>
          <td class="centro">${i.quantidade}</td>
        </tr>`,
    )
    .join('')

  // SPEC-176: só o número da venda (sem prefixo) + a parcial, ex.: "0001-P3".
  // Venda sem número (aprovada antes da SPEC-136) cai no número do orçamento.
  const numeroPedido = `${semPrefixo(venda.vendaNumero) || venda.orcamentoNumero}-P${params.numeroSeparacao}`
  const endereco = venda.clienteEndereco
    ? `${venda.clienteEndereco}${venda.clienteNumero ? ', ' + venda.clienteNumero : ''}`
    : '-'
  const cidadeEstado = venda.clienteCidade
    ? `${venda.clienteCidade}${venda.clienteEstado ? '-' + venda.clienteEstado : ''}`
    : '-'

  const assinatura = (papel: string) => `
    <div class="assinatura">
      <div class="papel">${papel}</div>
      <div class="campo"><span>Nome</span></div>
      <div class="campo"><span>RG/CPF</span></div>
      <div class="campo"><span>Data/Hora</span></div>
    </div>`

  janela.document.write(`
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Pedido em Separação ${esc(numeroPedido)}</title>
        <style>
          @page { margin: 14mm; }
          body { font-family: Arial, sans-serif; margin: 0; color: #111; font-size: 12px; }
          .cabecalho { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 16px; padding-bottom: 10px; border-bottom: 2px solid #111; }
          .cabecalho img { height: 56px; width: auto; }
          .cabecalho .titulo { text-align: center; }
          .cabecalho .titulo h1 { font-size: 15px; margin: 0; letter-spacing: 0.5px; }
          .cabecalho .titulo .num { font-size: 13px; font-weight: bold; margin-top: 4px; }
          .cabecalho .datas { text-align: right; font-size: 11px; line-height: 1.6; color: #333; }
          .empresa { margin-top: 10px; font-weight: bold; font-size: 13px; }
          .dados-cliente { margin-top: 8px; display: grid; grid-template-columns: 2fr 1fr; gap: 4px 24px; padding: 8px 10px; border: 1px solid #ccc; border-radius: 4px; }
          .dados-cliente .rotulo { color: #666; }
          table { width: 100%; border-collapse: collapse; table-layout: fixed; font-size: 12px; margin-top: 14px; }
          th, td { border: 1px solid #ccc; padding: 6px 8px; text-align: left; }
          th { background: #f3f3f3; font-size: 11px; text-transform: uppercase; letter-spacing: 0.3px; }
          th.centro, td.centro { text-align: center; }
          td.ref { font-size: 11px; word-break: break-word; }
          td.descricao { font-size: 10px; line-height: 1.25; word-break: break-word; }
          tfoot td { font-weight: bold; background: #f9f9f9; }
          .observacoes { margin-top: 18px; }
          .observacoes .linha { border-bottom: 1px solid #999; height: 22px; margin-top: 8px; }
          .declaracao { margin-top: 22px; font-size: 11px; font-weight: bold; text-align: center; text-transform: uppercase; line-height: 1.5; }
          .assinaturas { margin-top: 32px; display: grid; grid-template-columns: 1fr 1fr; gap: 48px; }
          .assinatura .papel { font-weight: bold; font-size: 12px; text-transform: uppercase; border-top: 1px solid #111; padding-top: 4px; text-align: center; }
          .assinatura .campo { margin-top: 18px; border-bottom: 1px solid #999; height: 16px; font-size: 10px; color: #666; }
        </style>
      </head>
      <body>
        <div class="cabecalho">
          <div><img src="${LOGO_URL}" alt="Lucenera" /></div>
          <div class="titulo">
            <h1>PEDIDO EM SEPARAÇÃO</h1>
            <div class="num">Venda ${esc(numeroPedido)}</div>
          </div>
          <div class="datas">
            Impressão: ${new Date().toLocaleString('pt-BR')}<br />
            Data orçamento: ${fmtDataCurta(venda.dataEmissaoOrcamento)}<br />
            Previsão de entrega: ${params.dataEntregaInformada ? fmtDia(params.dataEntregaInformada) : 'A combinar'}
          </div>
        </div>
        <div class="empresa">${esc(venda.empresaNome || 'LUCENERA')}</div>
        <div class="dados-cliente">
          <div><span class="rotulo">Cliente:</span> ${esc(venda.clienteNome || '-')}${venda.clienteCpfCnpj ? ' · ' + esc(venda.clienteCpfCnpj) : ''}</div>
          <div><span class="rotulo">Projeto:</span> ${esc(venda.projetoCodigo || '-')}</div>
          <div><span class="rotulo">Endereço:</span> ${esc(endereco)}${venda.clienteBairro ? ' - ' + esc(venda.clienteBairro) : ''}</div>
          <div><span class="rotulo">Telefone:</span> ${esc(venda.clienteTelefone || '-')}</div>
          <div><span class="rotulo">Cidade:</span> ${esc(cidadeEstado)}</div>
          <div><span class="rotulo">Vendedor:</span> ${esc(venda.vendedorNome || '-')}</div>
        </div>
        <table>
          <colgroup>
            <col style="width:9%" /><col style="width:9%" /><col style="width:18%" /><col /><col style="width:8%" />
          </colgroup>
          <thead>
            <tr><th class="centro">ID</th><th class="centro">Cód.</th><th>Ref.</th><th>Descrição</th><th class="centro">Quant.</th></tr>
          </thead>
          <tbody>${linhas}</tbody>
          <tfoot>
            <tr><td colspan="4">Total de itens: ${totalItens}</td><td class="centro">${totalPecas}</td></tr>
          </tfoot>
        </table>
        <div class="observacoes">
          <strong>Observações (pendências, avarias, substituições):</strong>
          <div class="linha"></div>
          <div class="linha"></div>
          <div class="linha"></div>
        </div>
        <!-- Reunião de 05/10 [08:02]: declaração do documento do Connect (SPEC-144), obrigatória. -->
        <div class="declaracao">
          Assumo total responsabilidade pelas mercadorias correspondentes a esta entrega,
          bem como declaro correto o conteúdo e as quantidades mencionadas acima.
        </div>
        <div class="assinaturas">
          ${assinatura('Entregador')}
          ${assinatura('Recebedor')}
        </div>
      </body>
    </html>
  `)
  janela.document.close()
  // Espera a logo carregar para ela não sair em branco na impressão.
  const imprimir = () => {
    janela.focus()
    janela.print()
  }
  const logo = janela.document.querySelector('img')
  if (logo && !logo.complete) {
    logo.onload = imprimir
    logo.onerror = imprimir
  } else {
    imprimir()
  }
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
  // SPEC-149: fluxo parte sempre da venda que PRECISA da peça — o item
  // clicado na tela (`trocaVendaAtual`) é sempre o DESTINO da troca (recebe
  // reserva, abate entrega futura); o item escolhido na lista "Reservado
  // por Cliente/Projeto" (`trocaOrigemEscolhida`) é sempre a ORIGEM (cede
  // reserva, ganha entrega futura). Antes desta SPEC os papéis estavam
  // invertidos.
  const [podeTrocar, setPodeTrocar] = useState(false)
  const [trocaVendaAtual, setTrocaVendaAtual] = useState<ItemVenda | null>(null)
  const [reservasOutras, setReservasOutras] = useState<ReservaOutroProjeto[]>([])
  const [carregandoReservas, setCarregandoReservas] = useState(false)
  const [trocaOrigemEscolhida, setTrocaOrigemEscolhida] = useState<ReservaOutroProjeto | null>(null)
  const [trocaQuantidade, setTrocaQuantidade] = useState('')
  const [trocaMotivo, setTrocaMotivo] = useState('')
  const [trocando, setTrocando] = useState(false)
  const [logAberto, setLogAberto] = useState(false)
  const [logTrocas, setLogTrocas] = useState<LogTroca[]>([])
  const [carregandoLog, setCarregandoLog] = useState(false)
  // SPEC-182 (S1): ver o que foi em cada parcial (e reimprimir).
  const [verParcial, setVerParcial] = useState<ParcialHistorico | null>(null)
  const [verItens, setVerItens] = useState<ItemParcial[]>([])
  const [carregandoVer, setCarregandoVer] = useState(false)

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
        (v.projetoCodigo || '').toLowerCase().includes(termo) ||
        (v.empresaNome || '').toLowerCase().includes(termo),
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
      // SPEC-144: número da parcial impressa = próximo da sequência já
      // exibida em "Parciais desta venda" (parciais.length ainda não inclui
      // a que acabou de ser criada, pois o refetch só acontece depois).
      imprimirListaSeparacao({
        venda,
        numeroSeparacao: parciais.length + 1,
        dataEntregaInformada: dataEntrega,
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

  // SPEC-182 (S1): itens de uma parcial — quanto foi separado de cada peça e
  // quanto já foi estornado; a mesma lista alimenta a reimpressão.
  const handleVerParcial = async (parcial: ParcialHistorico) => {
    setVerParcial(parcial)
    setVerItens([])
    setCarregandoVer(true)
    try {
      setVerItens(await listarItensDaParcial(parcial.id))
    } catch (err: any) {
      toast.error('Erro ao carregar itens da parcial', { description: err?.message })
    } finally {
      setCarregandoVer(false)
    }
  }

  const itemDaVenda = (i: ItemParcial) =>
    venda?.itens.find((v) => v.projeto_item_id === i.projetoItemId) ?? null

  // Dados gerais da venda para a janela "Ver itens" (a previsão de entrega
  // vem da listagem de vendas, que já a carrega).
  const previsaoDaVenda = venda
    ? (vendasDisponiveis.find((v) => v.orcamentoNumero === venda.orcamentoNumero)
        ?.previsaoEntrega ?? null)
    : null
  const verItensOrdenados = ordenarPorL(verItens, (i) => itemDaVenda(i)?.classificacao)
  const totalVerSeparado = verItens.reduce((s, i) => s + i.quantidade, 0)
  const totalVerEstornado = verItens.reduce((s, i) => s + i.quantidadeEstornada, 0)

  const handleReimprimir = () => {
    if (!venda || !verParcial) return
    const itensSeparados = verItens
      .map((i) => {
        const original = itemDaVenda(i)
        return {
          descricao: i.descricao,
          codigo: original?.codigo ?? null,
          referencia: original?.referencia ?? null,
          classificacao: original?.classificacao ?? null,
          quantidade: i.quantidade - i.quantidadeEstornada,
        }
      })
      .filter((i) => i.quantidade > 0)
    if (itensSeparados.length === 0) {
      toast.error('Esta parcial não tem peças (tudo foi estornado).')
      return
    }
    imprimirListaSeparacao({
      venda,
      numeroSeparacao: numerosParciais.get(verParcial.id) ?? 0,
      dataEntregaInformada: previsaoDaVenda || '',
      itensSeparados,
    })
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

  // SPEC-098 + SPEC-149: abre o modal de troca a partir da venda que
  // PRECISA da peça (tem `q_entrega_futura > 0`) e carrega, na hora, quem
  // mais tem essa mesma peça reservada (painel "Reservado por
  // Cliente/Projeto", mesma fonte de dado do card de peça do Cadastro
  // Lucenera) — essa lista serve de seletor de ORIGEM (de onde puxar a
  // peça), não mais de destino.
  const handleAbrirTroca = async (item: ItemVenda) => {
    setTrocaVendaAtual(item)
    setTrocaOrigemEscolhida(null)
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
    setTrocaVendaAtual(null)
    setTrocaOrigemEscolhida(null)
    setTrocaQuantidade('')
    setTrocaMotivo('')
    setReservasOutras([])
  }

  // SPEC-149: a venda atual (clicada) é sempre o DESTINO — recebe a peça e
  // abate a entrega futura pendente. O projeto escolhido na lista é sempre
  // a ORIGEM — cede a peça da própria reserva. O limite de quantidade é a
  // reserva de quem está cedendo (origem escolhida), não da venda atual.
  const handleConfirmarTroca = async () => {
    if (!trocaVendaAtual || !trocaOrigemEscolhida || !venda) return
    const quantidade = Number(trocaQuantidade)
    if (!quantidade || quantidade <= 0) {
      toast.error('Informe uma quantidade válida.')
      return
    }
    if (quantidade > trocaOrigemEscolhida.qReserva) {
      toast.error('Quantidade maior que a reserva disponível do projeto escolhido.')
      return
    }
    setTrocando(true)
    try {
      await trocarReserva({
        origemProjetoItemId: trocaOrigemEscolhida.projetoItemId,
        destinoProjetoItemId: trocaVendaAtual.projeto_item_id,
        quantidade,
        motivo: trocaMotivo.trim() || undefined,
      })
      toast.success(
        `${quantidade} unidade(s) trocada(s) de ${trocaOrigemEscolhida.projetoCodigo || semPrefixo(trocaOrigemEscolhida.orcamentoNumero) || 'outro projeto'} para esta venda.`,
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

      {/* pr-16/sm:pr-20 (2026-09-16): reserva espaço pro SystemSwitcher
          (SPEC-120), fixo na borda direita — sem isso o card de busca de
          venda e a tabela de itens (coluna "Trocar", sticky right-0)
          esticavam até embaixo do menu. */}
      <main className="flex-1 p-4 sm:p-6 pr-16 sm:pr-20 flex flex-col gap-4 w-full">
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
                placeholder="Filtrar por número da venda, cliente, projeto ou empresa..."
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
                      {/* SPEC-176: sem a coluna do orçamento; cliente e
                          projeto na mesma linha; empresa e datas da venda. */}
                      <TableHead>Venda</TableHead>
                      <TableHead>Cliente — Projeto</TableHead>
                      <TableHead>Empresa</TableHead>
                      <TableHead className="text-center">Data da Venda</TableHead>
                      <TableHead className="text-center">Previsão de Entrega</TableHead>
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
                          {semPrefixo(v.vendaNumero) || '—'}
                        </TableCell>
                        <TableCell className="text-sm whitespace-nowrap">
                          {v.clienteNome || 'Cliente não identificado'}
                          {v.projetoCodigo && (
                            <span className="text-muted-foreground"> — {v.projetoCodigo}</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm">{v.empresaNome || '-'}</TableCell>
                        <TableCell className="text-sm text-center">
                          {fmtDataCurta(v.dataVenda)}
                        </TableCell>
                        <TableCell className="text-sm text-center">
                          {fmtDia(v.previsaoEntrega)}
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
                {/* SPEC-136: número da venda é distinto do orçamento de
                origem — null em orçamentos aprovados antes desta SPEC.
                SPEC-176: só a venda, sem prefixo e sem o orçamento. */}
                <span className="text-muted-foreground">Venda: </span>
                <span className="font-medium">{semPrefixo(venda.vendaNumero) || '—'}</span>
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
                      <TableHead className="whitespace-nowrap px-3">Código</TableHead>
                      <TableHead className="px-3">Referência</TableHead>
                      <TableHead className="min-w-[220px]">Descrição</TableHead>
                      <TableHead className="whitespace-nowrap px-3">Local (L)</TableHead>
                      <TableHead className="text-right whitespace-nowrap px-2">Q. Dev.</TableHead>
                      <TableHead className="text-right whitespace-nowrap px-2">Q. Venda</TableHead>
                      <TableHead className="text-right whitespace-nowrap px-2">E. Futura</TableHead>
                      <TableHead className="text-right whitespace-nowrap px-2">
                        Transferido
                      </TableHead>
                      <TableHead className="text-right whitespace-nowrap px-2">Reserva</TableHead>
                      <TableHead className="text-right whitespace-nowrap px-2 bg-primary/5">
                        À Separar
                      </TableHead>
                      <TableHead className="text-right whitespace-nowrap px-2">
                        Ag. Separar
                      </TableHead>
                      <TableHead className="text-right whitespace-nowrap px-2">Separado</TableHead>
                      <TableHead className="text-right whitespace-nowrap px-2">Entregue</TableHead>
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
                        <TableCell className="font-mono font-semibold text-[#333333] tracking-wide text-sm whitespace-nowrap px-3">
                          {item.codigo ?? '-'}
                        </TableCell>
                        <TableCell className="text-sm break-words px-3">
                          {item.referencia || '-'}
                        </TableCell>
                        <TableCell className="text-sm break-words min-w-[220px]">
                          {item.descricao || '-'}
                        </TableCell>
                        <TableCell className="text-sm whitespace-nowrap px-3">
                          {item.classificacao || '-'}
                        </TableCell>
                        <TableCell className="text-right text-sm whitespace-nowrap px-2">
                          {item.q_devolvida}
                        </TableCell>
                        <TableCell className="text-right text-sm font-semibold whitespace-nowrap px-2">
                          {item.q_venda}
                        </TableCell>
                        <TableCell className="text-right text-sm whitespace-nowrap px-2">
                          {item.q_entrega_futura}
                        </TableCell>
                        <TableCell className="text-right text-sm whitespace-nowrap px-2">
                          {item.q_transferida_saida}
                        </TableCell>
                        <TableCell className="text-right text-sm font-semibold text-emerald-700 whitespace-nowrap px-2">
                          {item.q_reserva}
                        </TableCell>
                        <TableCell className="bg-primary/5 px-2">
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
                        <TableCell className="text-right text-sm whitespace-nowrap px-2">
                          {item.q_ag_separar}
                        </TableCell>
                        <TableCell className="text-right text-sm whitespace-nowrap px-2">
                          {item.q_separado}
                        </TableCell>
                        <TableCell className="text-right text-sm whitespace-nowrap px-2">
                          {item.q_entregue}
                        </TableCell>
                        {podeTrocar && (
                          <TableCell className="sticky right-0 bg-card shadow-[-4px_0_4px_-4px_rgba(0,0,0,0.15)]">
                            {/* SPEC-149: o botão parte de quem PRECISA da
                                peça (saldo pendente em Entrega Futura), não
                                mais de quem já tem a reserva. */}
                            {item.q_entrega_futura > 0 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                title="Trocar: puxar peça reservada de outro projeto para esta venda"
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
                aqui. Correção (2026-09-14, mesmo dia): "Dar Baixa" NÃO
                pertence a este sistema — é o "Registro de Entrega" que já
                existe na Logística. Esta tela só cuida de "Separar"; a
                seção abaixo é só o histórico das separações já feitas. */}
            {parciais.length > 0 && (
              <div ref={parciaisSectionRef} className="bg-card border rounded-xl p-4 scroll-mt-4">
                <div className="flex items-center gap-2 mb-1">
                  <History className="w-4 h-4 text-muted-foreground" />
                  <h2 className="font-semibold text-sm">Parciais desta venda</h2>
                </div>
                {/* SPEC-182 (S1/S2) */}
                <p className="text-xs text-muted-foreground mb-3">
                  "Ver itens" mostra o que foi separado em cada parcial e permite reimprimir a
                  lista. "Estornar" desfaz a separação (inteira ou só algumas peças): as peças
                  voltam para a Reserva da venda — use quando a separação foi feita por engano ou
                  antes de uma devolução.
                </p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Parcial</TableHead>
                      <TableHead>Funcionário</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parciais.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-mono text-xs">
                          {semPrefixo(venda.vendaNumero) || venda.orcamentoNumero}-P
                          {numerosParciais.get(p.id) ?? '?'}
                        </TableCell>
                        <TableCell className="text-sm">{p.responsavelNome || '-'}</TableCell>
                        <TableCell className="text-sm">{fmtData(p.criadoEm)}</TableCell>
                        <TableCell>
                          <Badge variant={p.status === 'Cancelado' ? 'destructive' : 'outline'}>
                            {p.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right whitespace-nowrap">
                          <Button variant="ghost" size="sm" onClick={() => handleVerParcial(p)}>
                            <Eye className="w-4 h-4 mr-1" />
                            Ver itens
                          </Button>
                          {p.status !== 'Cancelado' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              title="Desfaz a separação: as peças voltam para a Reserva"
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

      {/* SPEC-182 (S1) + pedido de 06/10: janela maior com os dados gerais da
          venda e da parcial, itens em ordem de L e reimpressão. */}
      <Dialog open={!!verParcial} onOpenChange={(open) => !open && setVerParcial(null)}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex flex-wrap items-center gap-2">
              Parcial {venda ? semPrefixo(venda.vendaNumero) || venda.orcamentoNumero : ''}-P
              {verParcial ? (numerosParciais.get(verParcial.id) ?? '?') : ''}
              {verParcial && (
                <Badge variant={verParcial.status === 'Cancelado' ? 'destructive' : 'outline'}>
                  {verParcial.status}
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>
          {venda && verParcial && (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="rounded-lg border bg-muted/30 p-3 text-sm space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                  Venda
                </p>
                <p>
                  <span className="text-muted-foreground">Número:</span>{' '}
                  <span className="font-semibold">
                    {semPrefixo(venda.vendaNumero) || venda.orcamentoNumero}
                  </span>
                  {venda.empresaNome ? ` · ${venda.empresaNome}` : ''}
                </p>
                <p>
                  <span className="text-muted-foreground">Cliente:</span>{' '}
                  <span className="font-semibold">{venda.clienteNome || '-'}</span>
                </p>
                <p>
                  <span className="text-muted-foreground">Projeto:</span>{' '}
                  {venda.projetoCodigo || '-'} ·{' '}
                  <span className="text-muted-foreground">Vendedor:</span>{' '}
                  {venda.vendedorNome || '-'}
                </p>
                <p>
                  <span className="text-muted-foreground">Endereço:</span>{' '}
                  {venda.clienteEndereco
                    ? `${venda.clienteEndereco}${venda.clienteNumero ? ', ' + venda.clienteNumero : ''}${venda.clienteBairro ? ' - ' + venda.clienteBairro : ''}${venda.clienteCidade ? ' · ' + venda.clienteCidade + (venda.clienteEstado ? '-' + venda.clienteEstado : '') : ''}`
                    : '-'}
                </p>
                <p>
                  <span className="text-muted-foreground">Telefone:</span>{' '}
                  {venda.clienteTelefone || '-'}
                </p>
              </div>
              <div className="rounded-lg border bg-muted/30 p-3 text-sm space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                  Parcial
                </p>
                <p>
                  <span className="text-muted-foreground">Separada em:</span>{' '}
                  <span className="font-semibold">{fmtData(verParcial.criadoEm)}</span>
                </p>
                <p>
                  <span className="text-muted-foreground">Funcionário:</span>{' '}
                  {verParcial.responsavelNome || '-'}
                </p>
                <p>
                  <span className="text-muted-foreground">Data do orçamento:</span>{' '}
                  {fmtDataCurta(venda.dataEmissaoOrcamento)} ·{' '}
                  <span className="text-muted-foreground">Previsão de entrega:</span>{' '}
                  {previsaoDaVenda ? fmtDia(previsaoDaVenda) : 'A combinar'}
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <Badge variant="secondary">{verItens.length} item(ns)</Badge>
                  <Badge variant="secondary">{totalVerSeparado} peça(s) separada(s)</Badge>
                  {totalVerEstornado > 0 && (
                    <Badge variant="destructive">{totalVerEstornado} estornada(s)</Badge>
                  )}
                  <Badge>{totalVerSeparado - totalVerEstornado} na parcial</Badge>
                </div>
              </div>
            </div>
          )}
          {carregandoVer ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="border rounded-lg overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">L</TableHead>
                    <TableHead className="w-20">Código</TableHead>
                    <TableHead className="w-40">Referência</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead className="text-right w-24">Separado</TableHead>
                    <TableHead className="text-right w-24">Estornado</TableHead>
                    <TableHead className="text-right w-24">Na parcial</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {verItensOrdenados.map((i) => {
                    const original = itemDaVenda(i)
                    return (
                      <TableRow key={i.id}>
                        <TableCell className="font-mono text-xs">
                          {original?.classificacao || '-'}
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {original?.codigo ?? '-'}
                        </TableCell>
                        <TableCell className="text-xs">{original?.referencia || '-'}</TableCell>
                        <TableCell className="text-xs">{i.descricao || '-'}</TableCell>
                        <TableCell className="text-right">{i.quantidade}</TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {i.quantidadeEstornada || '-'}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {i.quantidade - i.quantidadeEstornada}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setVerParcial(null)}>
              Fechar
            </Button>
            <Button onClick={handleReimprimir} disabled={carregandoVer || verItens.length === 0}>
              <Printer className="w-4 h-4 mr-2" />
              Reimprimir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* SPEC-099: estorno granular — escolhe peça + quantidade, ou reverte
          a separação inteira de uma vez ("Reverter tudo"). */}
      <Dialog open={!!estornoAlvo} onOpenChange={(open) => !open && handleFecharEstorno()}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Estornar separação</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Escolha a peça e a quantidade a devolver para a Reserva, ou reverta a separação inteira
            de uma vez.
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
                        <TableCell
                          className="text-sm max-w-[200px] truncate"
                          title={item.descricao}
                        >
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

      {/* SPEC-098 + SPEC-149: modal de troca — parte da venda atual (que
          precisa da peça, destino) e a lista "Reservado por
          Cliente/Projeto" (mesma informação do card de peça do Cadastro
          Lucenera) funciona como seletor de ORIGEM: escolhe de qual outro
          projeto puxar, informa quantidade e motivo, confirma. */}
      <Dialog open={!!trocaVendaAtual} onOpenChange={(open) => !open && handleFecharTroca()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Trocar peça reservada</DialogTitle>
          </DialogHeader>
          {trocaVendaAtual && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">
                  {trocaVendaAtual.codigo ?? '-'} —{' '}
                  {trocaVendaAtual.descricao || 'Item sem descrição'}
                </span>
                <br />
                Falta atender nesta venda:{' '}
                <span className="font-semibold text-amber-700">
                  {trocaVendaAtual.q_entrega_futura}
                </span>
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
                            onClick={() => setTrocaOrigemEscolhida(r)}
                            className={`cursor-pointer hover:bg-primary/5 ${
                              trocaOrigemEscolhida?.projetoItemId === r.projetoItemId
                                ? 'bg-primary/10'
                                : ''
                            }`}
                          >
                            <TableCell className="text-sm font-medium">
                              {r.projetoCodigo || semPrefixo(r.orcamentoNumero) || '-'}
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

              {trocaOrigemEscolhida && (
                <div className="space-y-3 border-t pt-4">
                  <p className="text-sm">
                    Puxar de:{' '}
                    <span className="font-semibold">
                      {trocaOrigemEscolhida.projetoCodigo ||
                        semPrefixo(trocaOrigemEscolhida.orcamentoNumero)}{' '}
                      — {trocaOrigemEscolhida.clienteNome || 'Cliente não identificado'}
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
                        max={trocaOrigemEscolhida.qReserva}
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
              disabled={trocando || !trocaOrigemEscolhida || !trocaQuantidade}
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
