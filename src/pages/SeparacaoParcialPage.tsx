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
  X,
  Pencil,
  ArrowUpDown,
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
  TableFooter,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase/client'
import { NovaSeparacaoModal, type DadosNovaSeparacao } from '@/components/NovaSeparacaoModal'
import {
  buscarVendaPorNumero,
  criarSeparacaoParcial,
  estornarSeparacaoParcial,
  finalizarSeparacaoPronta,
  listarParciaisPorVenda,
  listarVendasDisponiveis,
  podeTrocarReserva,
  podeAjustarReservaVenda,
  podeTratarHerancaConnect,
  buscarProjetosParaLigar,
  ligarProjetoConnect,
  tratarHerancaConnect,
  listarTratamentosHeranca,
  ajustarReservaVenda,
  type AjusteReservaAcao,
  type AcaoHeranca,
  type TratamentoHeranca,
  type ProjetoBusca,
  getReservasOutrosProjetos,
  trocarReserva,
  listarLogTrocas,
  listarItensDaParcial,
  estornarItemSeparacao,
  atualizarDadosEntregaParcial,
  STATUS_PARCIAL_EDITAVEL,
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
// SPEC-207: busca sem diferenciar maiúscula nem acento.
const normalizar = (t: string | null | undefined) =>
  (t ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()

// SPEC-243 fase 2: o que cada ação faz no estoque (a conta é a mesma da SPEC-232)
const ROTULO_ACAO_HERANCA: Record<string, string> = {
  entregue_baixa_estoque: 'Já entregue (baixou o estoque)',
  entregue_estoque_ja_ajustado: 'Já entregue (estoque já estava certo)',
  nao_sera_entregue: 'Não será entregue (voltou a ficar disponível)',
  mantida_confirmada: 'Mantida (venda real)',
  observacao: 'Observação',
}

const semPrefixo = (numero: string | null) => (numero ? numero.replace(/^[A-Za-z]+-/, '') : null)

// SPEC-231 D3: status da separação como aparece para as meninas (o mesmo andamento da Logística).
const STATUS_PARCIAL_LABEL: Record<string, string> = {
  Pendente: 'Aguardando data de entrega',
  material_solicitado: 'Solicitado ao estoque',
  'Em separação': 'Em separação',
  separado: 'Separado',
  Pronto: 'Separado',
  finalizado: 'Entregue',
  Cancelado: 'Estornado',
  recusado: 'Recusado pelo estoque',
}
const statusParcial = (s: string) => STATUS_PARCIAL_LABEL[s] ?? s

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
    marca: string | null
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
          <td class="ref">${esc(i.marca || '-')}</td>
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
          /* SPEC-231 (27/10): processo interno em duas etapas — quem separou e quem conferiu */
          .internas { margin-top: 28px; padding-top: 8px; border-top: 1px dashed #999; page-break-inside: avoid; }
          .internas .titulo-internas { font-size: 10px; color: #666; text-transform: uppercase; letter-spacing: 0.3px; }
          .internas .assinaturas { margin-top: 26px; }
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
            <col style="width:8%" /><col style="width:8%" /><col style="width:16%" /><col style="width:13%" /><col /><col style="width:7%" />
          </colgroup>
          <thead>
            <tr><th class="centro">ID</th><th class="centro">Cód.</th><th>Ref.</th><th>Marca</th><th>Descrição</th><th class="centro">Quant.</th></tr>
          </thead>
          <tbody>${linhas}</tbody>
          <tfoot>
            <tr><td colspan="5">Total de itens: ${totalItens}</td><td class="centro">${totalPecas}</td></tr>
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
        <div class="internas">
          <div class="titulo-internas">Controle interno</div>
          <div class="assinaturas">
            ${assinatura('Separado por')}
            ${assinatura('Conferido por')}
          </div>
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
  // SPEC-243: segunda lista = vendas da Connect (histórico herdado, somente consulta)
  const [vendasConnect, setVendasConnect] = useState<VendaDisponivel[]>([])
  const [aba, setAba] = useState<'sistema' | 'connect'>('sistema')
  const [carregandoVendas, setCarregandoVendas] = useState(true)
  const [filtro, setFiltro] = useState('')
  const [numeroVenda, setNumeroVenda] = useState('')
  const [buscaItem, setBuscaItem] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [venda, setVenda] = useState<VendaInfo | null>(null)
  const [parciais, setParciais] = useState<ParcialHistorico[]>([])
  // SPEC-072: quantidade digitada na coluna "À Separar", por projeto_item_id
  // — zerada a cada "Separar" bem-sucedido.
  const [quantidades, setQuantidades] = useState<Record<string, string>>({})
  // SPEC-231 D1: itens escolhidos ao clicar em "Separar" — com valor, a tela
  // "Nova Separação" fica aberta (a data de entrega agora é pedida nela).
  // SPEC-231 D1: nome de quem está logado (vira o "Solicitante" da Nova Separação)
  const [meuNome, setMeuNome] = useState('')
  useEffect(() => {
    if (!user?.id) return
    supabase
      .from('usuarios')
      .select('nome')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data }) => setMeuNome((data as any)?.nome ?? ''))
  }, [user?.id])
  const [itensParaSeparar, setItensParaSeparar] = useState<
    | {
        projetoItemId: string
        produtoId: string | null
        descricao: string | null
        quantidade: number
      }[]
    | null
  >(null)
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
  // SPEC-235 B: ajuste Reserva <-> Entrega Futura dentro desta venda (só Matheus/admin, decidido no banco)
  const [podeAjustar, setPodeAjustar] = useState(false)
  const [ajusteItem, setAjusteItem] = useState<ItemVenda | null>(null)
  const [ajusteAcao, setAjusteAcao] = useState<AjusteReservaAcao>('reserva_para_entrega_futura')
  const [ajusteQuantidade, setAjusteQuantidade] = useState('')
  const [ajusteMotivo, setAjusteMotivo] = useState('')
  const [ajustando, setAjustando] = useState(false)
  // SPEC-243 fase 2: tratar a herança da Connect (só Matheus/admin, decidido no banco)
  const [podeTratar, setPodeTratar] = useState(false)
  const [tratItem, setTratItem] = useState<ItemVenda | null>(null)
  const [tratAcao, setTratAcao] = useState<AcaoHeranca>('entregue_baixa_estoque')
  const [tratSetor, setTratSetor] = useState<'reserva' | 'entrega_futura'>('reserva')
  const [tratQuantidade, setTratQuantidade] = useState('')
  const [tratObs, setTratObs] = useState('')
  const [tratando, setTratando] = useState(false)
  // SPEC-243: ligar a venda da Connect (sem projeto) a um projeto
  const [ligarAberto, setLigarAberto] = useState(false)
  const [ligarTermo, setLigarTermo] = useState('')
  const [ligarResultados, setLigarResultados] = useState<ProjetoBusca[]>([])
  const [ligarBuscando, setLigarBuscando] = useState(false)
  const [ligarProjeto, setLigarProjeto] = useState<ProjetoBusca | null>(null)
  const [ligarObs, setLigarObs] = useState('')
  const [ligarAviso, setLigarAviso] = useState<{ clienteVenda: string | null; clienteProjeto: string | null } | null>(null)
  const [ligando, setLigando] = useState(false)
  const [tratamentos, setTratamentos] = useState<TratamentoHeranca[]>([])
  const [logAberto, setLogAberto] = useState(false)
  const [logTrocas, setLogTrocas] = useState<LogTroca[]>([])
  const [logBusca, setLogBusca] = useState('')
  // SPEC-251: transferências em que ESTA venda cedeu ou recebeu a peça
  const [trocasVenda, setTrocasVenda] = useState<LogTroca[]>([])
  const [carregandoLog, setCarregandoLog] = useState(false)
  // SPEC-182 (S1): ver o que foi em cada parcial (e reimprimir).
  const [verParcial, setVerParcial] = useState<ParcialHistorico | null>(null)
  // SPEC-231 D2: edição dos dados de entrega da parcial aberta em "Ver itens"
  const [editandoEntrega, setEditandoEntrega] = useState(false)
  const [salvandoEntrega, setSalvandoEntrega] = useState(false)
  const [formEntrega, setFormEntrega] = useState({
    dataEntrega: '',
    endereco: '',
    responsavelRecebimento: '',
    telefone: '',
    observacoes: '',
  })
  const [verItens, setVerItens] = useState<ItemParcial[]>([])
  const [carregandoVer, setCarregandoVer] = useState(false)

  // SPEC-072: antes disso o campo "Venda" era texto livre sem nenhuma forma
  // de descobrir quais números existem — carrega as vendas com saldo
  // operacional (aprovadas e com projeto_itens) pra virar um seletor de
  // busca em vez de um campo de texto cego.
  useEffect(() => {
    Promise.all([listarVendasDisponiveis('sistema'), listarVendasDisponiveis('connect')])
      .then(([sistema, connect]) => {
        setVendasDisponiveis(sistema)
        setVendasConnect(connect)
      })
      .catch((err) =>
        toast.error('Erro ao carregar lista de vendas', { description: err?.message }),
      )
      .finally(() => setCarregandoVendas(false))
  }, [])

  useEffect(() => {
    podeTrocarReserva()
      .then(setPodeTrocar)
      .catch(() => setPodeTrocar(false))
    podeAjustarReservaVenda()
      .then(setPodeAjustar)
      .catch(() => setPodeAjustar(false))
    podeTratarHerancaConnect()
      .then(setPodeTratar)
      .catch(() => setPodeTratar(false))
  }, [])

  // SPEC-244 (operação em paralelo com a Connect): venda herdada da Connect. Os itens "sem data de entrega" na Connect (ou que já receberam da NF) são
  // liberados para as equipes pedirem a separação pelo mesmo fluxo da venda do sistema (item.liberado, decidido no banco); os demais seguem só para
  // consulta. Trocar/Ajustar continuam só nas vendas do sistema; o tratamento da herança (botão Tratar) é do Matheus e da administração.
  const ehConnect = venda?.origem === 'connect'
  const temItemLiberado = !!venda?.itens.some((i) => i.liberado && i.q_reserva > 0)
  const somenteConsulta = ehConnect && !temItemLiberado
  // SPEC-251: Transferir (antes "Trocar") vale também nas vendas da Connect; Ajustar continua só nas vendas do sistema
  const temAcoes = podeTrocar || (podeAjustar && !ehConnect)
  // SPEC-243 fase 2: na venda da Connect a coluna de ações existe para quem pode transferir ou tratar
  const colunaAcoes = temAcoes || (ehConnect && podeTratar)

  const vendasFiltradas = useMemo(() => {
    const termo = filtro.trim().toLowerCase()
    const base = aba === 'connect' ? vendasConnect : vendasDisponiveis
    if (!termo) return base
    return base.filter(
      (v) =>
        v.orcamentoNumero.toLowerCase().includes(termo) ||
        (v.vendaNumero || '').toLowerCase().includes(termo) ||
        (v.clienteNome || '').toLowerCase().includes(termo) ||
        (v.projetoCodigo || '').toLowerCase().includes(termo) ||
        (v.empresaNome || '').toLowerCase().includes(termo) ||
        (v.equipeNome || '').toLowerCase().includes(termo) ||
        (v.vendedorNome || '').toLowerCase().includes(termo),
    )
  }, [vendasDisponiveis, vendasConnect, aba, filtro])

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
  // SPEC-207: a mesma peça aparece em vários L; a busca deixa só as linhas
  // dela e soma as quantidades de todos os L no rodapé.
  const termoItem = normalizar(buscaItem.trim())
  const itensVisiveis = useMemo(() => {
    if (!venda) return []
    // SPEC-209 G2: em ordem de L, para a linha separadora marcar onde cada L acaba.
    const itens = ordenarPorL(venda.itens, (i) => i.classificacao)
    if (!termoItem) return itens
    return itens.filter((i) =>
      [i.codigo, i.referencia, i.descricao, i.classificacao].some((c) =>
        normalizar(c == null ? '' : String(c)).includes(termoItem),
      ),
    )
  }, [venda, termoItem])
  const totaisVisiveis = useMemo(() => {
    const soma = (f: (i: ItemVenda) => number) =>
      itensVisiveis.reduce((t, i) => t + (Number(f(i)) || 0), 0)
    return {
      q_devolvida: soma((i) => i.q_devolvida),
      q_venda: soma((i) => i.q_venda),
      q_entrega_futura: soma((i) => i.q_entrega_futura),
      q_transferida_saida: soma((i) => i.q_transferida_saida),
      q_reserva: soma((i) => i.q_reserva),
      a_separar: itensVisiveis.reduce(
        (t, i) => t + (Number(quantidades[i.projeto_item_id]) || 0),
        0,
      ),
      q_ag_separar: soma((i) => i.q_ag_separar),
      q_separado: soma((i) => i.q_separado),
      q_entregue: soma((i) => i.q_entregue),
    }
  }, [itensVisiveis, quantidades])
  const lsVisiveis = useMemo(
    () => new Set(itensVisiveis.map((i) => i.classificacao || '-')).size,
    [itensVisiveis],
  )
  // Quantidade digitada numa linha escondida pela busca continua valendo no
  // "Separar" — avisa para ninguém separar sem ver.
  const ocultosComQuantidade = useMemo(() => {
    if (!venda || !termoItem) return 0
    const visiveis = new Set(itensVisiveis.map((i) => i.projeto_item_id))
    return venda.itens.filter(
      (i) => !visiveis.has(i.projeto_item_id) && (Number(quantidades[i.projeto_item_id]) || 0) > 0,
    ).length
  }, [venda, termoItem, itensVisiveis, quantidades])

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
    setBuscaItem('')
    setDataEntregaFinal('')
  }

  const handleSeparar = async () => {
    if (somenteConsulta) return // SPEC-243: venda da Connect é só consulta
    if (!venda) return

    const itens = venda.itens
      .map((item) => ({
        projetoItemId: item.projeto_item_id,
        produtoId: item.produto_id,
        descricao: item.descricao,
        quantidade: item.liberado ? Number(quantidades[item.projeto_item_id]) || 0 : 0,
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

    // SPEC-231 D1: abre a tela "Nova Separação" (mesma da Logística); grava
    // só quando ela confirmar.
    setItensParaSeparar(itens)
  }

  const handleConfirmarSeparacao = async (dados: DadosNovaSeparacao) => {
    if (!venda || !itensParaSeparar) return
    const itens = itensParaSeparar
    setSaving(true)
    try {
      await criarSeparacaoParcial({
        numeroVenda: venda.orcamentoNumero,
        clienteId: venda.clienteId,
        clienteNome: venda.clienteNome,
        projetoCodigo: venda.projetoCodigo,
        itens,
        logistica: dados,
      })
      toast.success('Separação enviada para o estoque separar (Logística → Solicitado).')
      setItensParaSeparar(null)

      // SPEC-091: gera e abre a impressão da lista assim que a separação é
      // confirmada — sem precisar de um clique extra.
      // SPEC-144: número da parcial impressa = próximo da sequência já
      // exibida em "Parciais desta venda" (parciais.length ainda não inclui
      // a que acabou de ser criada, pois o refetch só acontece depois).
      imprimirListaSeparacao({
        venda,
        numeroSeparacao: parciais.length + 1,
        dataEntregaInformada: dados.dataEntrega,
        itensSeparados: itens.map((i) => {
          const original = venda.itens.find((v) => v.projeto_item_id === i.projetoItemId)
          return {
            descricao: i.descricao,
            codigo: original?.codigo ?? null,
            referencia: original?.referencia ?? null,
            marca: original?.marca ?? null,
            classificacao: original?.classificacao ?? null,
            quantidade: i.quantidade,
          }
        }),
      })

      // SPEC-231 D1: a separação já nasce em 'material_solicitado' com a data
      // de entrega da tela — não precisa mais do finalizarSeparacaoPronta da
      // SPEC-089 quando a venda fica completa.
      const [vendaAtualizada, historico] = await Promise.all([
        buscarVendaPorNumero(venda.orcamentoNumero),
        listarParciaisPorVenda(venda.orcamentoNumero),
      ])
      setVenda(vendaAtualizada)
      setParciais(historico)
      setQuantidades({})
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
      toast.success('Enviada para o estoque separar — entrega criada na Logística.')
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
    setEditandoEntrega(false)
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

  const handleSalvarEntrega = async () => {
    if (!verParcial || !venda) return
    setSalvandoEntrega(true)
    try {
      await atualizarDadosEntregaParcial(verParcial.id, formEntrega)
      toast.success('Dados da entrega atualizados — a Logística já vê a mudança.')
      const historico = await listarParciaisPorVenda(venda.orcamentoNumero)
      setParciais(historico)
      setVerParcial(historico.find((x) => x.id === verParcial.id) ?? null)
      setEditandoEntrega(false)
    } catch (err: any) {
      toast.error('Não foi possível salvar', { description: err?.message })
    } finally {
      setSalvandoEntrega(false)
    }
  }

  const handleReimprimir = () => {
    if (!venda || !verParcial) return
    const itensSeparados = verItens
      .map((i) => {
        const original = itemDaVenda(i)
        return {
          descricao: i.descricao,
          codigo: original?.codigo ?? null,
          referencia: original?.referencia ?? null,
          marca: original?.marca ?? null,
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
      // SPEC-222 E1: L da própria venda primeiro (troca dentro do mesmo cliente)
      const mesma = (r: { orcamentoId: string | null }) =>
        r.orcamentoId && r.orcamentoId === venda?.orcamentoId ? 0 : 1
      setReservasOutras([...rows].sort((a, b) => mesma(a) - mesma(b)))
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
    // SPEC-251: todo uso fica no log (quem, de quem, por quê) — o motivo é obrigatório
    if (!trocaMotivo.trim()) {
      toast.error('Informe o motivo da transferência.')
      return
    }
    setTrocando(true)
    try {
      await trocarReserva({
        origemProjetoItemId: trocaOrigemEscolhida.projetoItemId,
        destinoProjetoItemId: trocaVendaAtual.projeto_item_id,
        quantidade,
        motivo: trocaMotivo.trim(),
      })
      toast.success(
        `${quantidade} unidade(s) transferida(s) de ${trocaOrigemEscolhida.projetoCodigo || semPrefixo(trocaOrigemEscolhida.orcamentoNumero) || 'outro projeto'} para esta venda.`,
      )
      const vendaAtualizada = await buscarVendaPorNumero(venda.orcamentoNumero)
      setVenda(vendaAtualizada)
      handleFecharTroca()
    } catch (err: any) {
      toast.error('Erro ao transferir a peça', { description: err?.message })
    } finally {
      setTrocando(false)
    }
  }

  // SPEC-252 C: "Separar tudo" — nunca passa da Reserva e, na venda da Connect, só entra o que está liberado (SPEC-244)
  const handleSepararTudo = () => {
    if (!venda) return
    const novas: Record<string, string> = {}
    for (const i of venda.itens) {
      if (i.liberado && i.q_reserva > 0) novas[i.projeto_item_id] = String(i.q_reserva)
    }
    setQuantidades(novas)
    const bloqueados = venda.itens.filter((i) => !i.liberado && i.q_reserva > 0).length
    toast.info(
      `${Object.keys(novas).length} item(ns) preenchido(s) com a Reserva. Confira e clique em Separar.` +
        (bloqueados > 0 ? ` ${bloqueados} item(ns) com data de entrega na Connect ficaram de fora.` : ''),
    )
  }

  const handleAbrirAjuste = (item: ItemVenda) => {
    setAjusteItem(item)
    setAjusteAcao(
      item.q_reserva > 0 ? 'reserva_para_entrega_futura' : 'entrega_futura_para_reserva',
    )
    setAjusteQuantidade('')
    setAjusteMotivo('')
  }

  const ajusteMax = ajusteItem
    ? ajusteAcao === 'reserva_para_entrega_futura'
      ? ajusteItem.q_reserva
      : ajusteItem.q_entrega_futura
    : 0

  const handleConfirmarAjuste = async () => {
    if (!ajusteItem || !venda) return
    const quantidade = Number(ajusteQuantidade)
    if (!quantidade || quantidade <= 0 || quantidade > ajusteMax) {
      toast.error(`Informe uma quantidade entre 1 e ${ajusteMax}.`)
      return
    }
    if (!ajusteMotivo.trim()) {
      toast.error('Informe o motivo.')
      return
    }
    setAjustando(true)
    try {
      await ajustarReservaVenda({
        projetoItemId: ajusteItem.projeto_item_id,
        acao: ajusteAcao,
        quantidade,
        motivo: ajusteMotivo.trim(),
      })
      toast.success(
        ajusteAcao === 'reserva_para_entrega_futura'
          ? `${quantidade} unidade(s) passada(s) de Reserva para Entrega Futura.`
          : `${quantidade} unidade(s) passada(s) de Entrega Futura para Reserva.`,
      )
      setVenda(await buscarVendaPorNumero(venda.orcamentoNumero))
      setAjusteItem(null)
    } catch (err: any) {
      toast.error('Erro ao ajustar', { description: err?.message })
    } finally {
      setAjustando(false)
    }
  }

  // SPEC-243: ligar a venda da Connect a um projeto
  const handleAbrirLigar = () => {
    setLigarTermo('')
    setLigarResultados([])
    setLigarProjeto(null)
    setLigarObs('')
    setLigarAviso(null)
    setLigarAberto(true)
  }

  useEffect(() => {
    if (!ligarAberto) return
    const termo = ligarTermo.trim()
    if (termo.length < 2) {
      setLigarResultados([])
      return
    }
    setLigarBuscando(true)
    const t = setTimeout(() => {
      buscarProjetosParaLigar(termo)
        .then(setLigarResultados)
        .catch(() => setLigarResultados([]))
        .finally(() => setLigarBuscando(false))
    }, 300)
    return () => clearTimeout(t)
  }, [ligarTermo, ligarAberto])

  const handleConfirmarLigar = async (confirmarClienteDiferente: boolean) => {
    if (!venda?.orcamentoId || !ligarProjeto) return
    if (!ligarObs.trim()) {
      toast.error('A observação é obrigatória: ela registra por que esta venda é deste projeto.')
      return
    }
    setLigando(true)
    try {
      const r = await ligarProjetoConnect({
        orcamentoId: venda.orcamentoId,
        projetoId: ligarProjeto.id,
        observacao: ligarObs.trim(),
        confirmarClienteDiferente,
      })
      if (!r.ligado && r.clienteDiferente) {
        setLigarAviso({ clienteVenda: r.clienteVenda, clienteProjeto: r.clienteProjeto })
        return
      }
      toast.success(`Venda ligada ao projeto ${r.projeto ?? ligarProjeto.codigo}.`)
      setVenda(await buscarVendaPorNumero(venda.orcamentoNumero))
      setLigarAberto(false)
    } catch (err: any) {
      toast.error('Erro ao ligar o projeto', { description: err?.message })
    } finally {
      setLigando(false)
    }
  }

  // SPEC-243 fase 2: tratar a herança da Connect
  const handleAbrirTratar = (item: ItemVenda) => {
    setTratItem(item)
    setTratSetor(item.q_reserva > 0 ? 'reserva' : 'entrega_futura')
    setTratAcao(item.q_reserva > 0 ? 'entregue_baixa_estoque' : 'nao_sera_entregue')
    setTratQuantidade('')
    setTratObs('')
  }

  const tratSaldo = tratItem
    ? tratSetor === 'reserva'
      ? tratItem.q_reserva
      : tratItem.q_entrega_futura
    : 0
  const tratSemQuantidade = tratAcao === 'mantida_confirmada'

  const handleConfirmarTratar = async () => {
    if (!tratItem || !venda) return
    const quantidade = tratSemQuantidade ? null : Number(tratQuantidade)
    if (!tratSemQuantidade && (!quantidade || quantidade <= 0 || quantidade > tratSaldo)) {
      toast.error(`Informe uma quantidade entre 1 e ${tratSaldo}.`)
      return
    }
    if (!tratObs.trim()) {
      toast.error('A observação é obrigatória: ela registra por que a peça foi baixada.')
      return
    }
    setTratando(true)
    try {
      await tratarHerancaConnect({
        projetoItemId: tratItem.projeto_item_id,
        acao: tratAcao,
        setor: tratSetor,
        quantidade,
        observacao: tratObs.trim(),
      })
      toast.success('Tratamento registrado.')
      setVenda(await buscarVendaPorNumero(venda.orcamentoNumero))
      setTratItem(null)
    } catch (err: any) {
      toast.error('Erro ao tratar a herança', { description: err?.message })
    } finally {
      setTratando(false)
    }
  }

  // log do que já foi tratado nesta venda (só vendas da Connect)
  useEffect(() => {
    if (!venda || venda.origem !== 'connect') {
      setTratamentos([])
      return
    }
    listarTratamentosHeranca(venda.itens.map((i) => i.projeto_item_id))
      .then(setTratamentos)
      .catch(() => setTratamentos([]))
  }, [venda])

  // SPEC-251: log desta venda — aparece nas DUAS vendas envolvidas (quem cedeu e quem recebeu) e em nenhuma outra
  useEffect(() => {
    if (!venda?.orcamentoId) {
      setTrocasVenda([])
      return
    }
    listarLogTrocas(venda.orcamentoId)
      .then(setTrocasVenda)
      .catch(() => setTrocasVenda([]))
  }, [venda])

  // SPEC-098: "Log de Trocas" — histórico completo de trocas já aprovadas,
  // não só desta venda, pra ficar fácil de auditar quem fez o quê.
  const handleAbrirLog = async () => {
    setLogAberto(true)
    setLogBusca('')
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
          <h1 className="font-bold text-lg hidden sm:block">Venda Parcial</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleAbrirLog}>
            <ScrollText className="w-4 h-4 mr-2" />
            Log de Transferências
          </Button>
          <span className="text-sm text-muted-foreground hidden sm:inline">{user?.email}</span>
          <Button variant="ghost" size="icon" asChild title="Voltar para a Central Lucenera">
            <a href="https://central-lucenera.pages.dev/dashboard">
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
            {/* SPEC-243: duas visões — vendas feitas neste sistema × vendas herdadas da Connect (histórico, só consulta). */}
            <Tabs
              value={aba}
              onValueChange={(v) => setAba(v as 'sistema' | 'connect')}
              className="mb-4"
            >
              <TabsList>
                <TabsTrigger value="sistema">
                  Vendas do sistema Lucenera ({vendasDisponiveis.length})
                </TabsTrigger>
                <TabsTrigger value="connect">
                  Vendas parciais Connect ({vendasConnect.length})
                </TabsTrigger>
              </TabsList>
            </Tabs>
            {aba === 'connect' && (
              <p className="text-xs text-muted-foreground mb-3">
                Histórico herdado da Connect: reserva e entrega futura por cliente. Somente consulta
                — o tratamento (entregar, voltar ao estoque) é feito só pelo Matheus e pela
                administração. Linhas em amarelo são vendas até junho/2025: confira se a peça ainda
                precisa ficar reservada.
              </p>
            )}
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
                {(aba === 'connect' ? vendasConnect : vendasDisponiveis).length === 0
                  ? aba === 'connect'
                    ? 'Nenhuma venda da Connect encontrada para o seu acesso.'
                    : 'Nenhuma venda aprovada com saldo encontrada.'
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
                      {aba === 'connect' ? (
                        <>
                          <TableHead>Equipe — Vendedor</TableHead>
                          <TableHead className="text-right">Reserva</TableHead>
                          <TableHead className="text-right">E. Futura</TableHead>
                        </>
                      ) : (
                        <>
                          <TableHead className="text-center">Data da Venda</TableHead>
                          <TableHead className="text-center">Previsão de Entrega</TableHead>
                        </>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vendasFiltradas.map((v) => (
                      <TableRow
                        key={v.orcamentoNumero}
                        onClick={() => !loading && handleLocalizar(v.orcamentoNumero)}
                        className={`cursor-pointer hover:bg-primary/5 ${loading ? 'pointer-events-none opacity-50' : ''} ${v.vendaAntiga ? 'bg-amber-50 hover:bg-amber-100' : ''} ${v.finalizada ? 'bg-muted/40 text-muted-foreground opacity-60 hover:opacity-100' : ''}`}
                      >
                        {/* SPEC-138 (Prompt 4): referências de orçamento/venda em
                            cor escura + semibold + leve letter-spacing, pra
                            leitura rápida em tela de gestão. */}
                        <TableCell className="font-semibold text-[#333333] tracking-wide text-sm">
                          {semPrefixo(v.vendaNumero) || '—'}
                          {v.finalizada && (
                            <span className="ml-1.5 rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-emerald-800">
                              Finalizado
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm whitespace-nowrap">
                          {v.clienteNome || 'Cliente não identificado'}
                          {v.projetoCodigo && (
                            <span className="text-muted-foreground"> — {v.projetoCodigo}</span>
                          )}
                          {v.origem === 'connect' && !v.projetoCodigo && (
                            <span className="ml-1.5 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-amber-800">
                              sem projeto
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm">{v.empresaNome || '-'}</TableCell>
                        {aba === 'connect' ? (
                          <>
                            <TableCell className="text-sm whitespace-nowrap">
                              {v.equipeNome || '-'}
                              {v.vendedorNome && (
                                <span className="text-muted-foreground"> — {v.vendedorNome}</span>
                              )}
                              {v.vendaAntiga && (
                                <Badge
                                  variant="outline"
                                  className="ml-2 border-amber-500 text-amber-700"
                                >
                                  Até jun/2025
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-sm text-right font-semibold text-emerald-700">
                              {v.qReserva}
                            </TableCell>
                            <TableCell className="text-sm text-right">{v.qEntregaFutura}</TableCell>
                          </>
                        ) : (
                          <>
                            <TableCell className="text-sm text-center">
                              {fmtDataCurta(v.dataVenda)}
                            </TableCell>
                            <TableCell className="text-sm text-center">
                              {fmtDia(v.previsaoEntrega)}
                            </TableCell>
                          </>
                        )}
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
                {ehConnect && !venda.projetoCodigo && venda.orcamentoId && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-2 h-6 px-2 text-xs"
                    title="Escolher o projeto desta venda da Connect"
                    onClick={() => handleAbrirLigar()}
                  >
                    Ligar a um projeto
                  </Button>
                )}
              </div>
              {ehConnect && (
                <>
                  <div>
                    <span className="text-muted-foreground">Equipe: </span>
                    <span className="font-medium">{venda.equipeNome || '-'}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Vendedor: </span>
                    <span className="font-medium">{venda.vendedorNome || '-'}</span>
                  </div>
                  {venda.vendasVinculadasConnect.length > 0 && (
                    <div>
                      <span className="text-muted-foreground">Vendas vinculadas Connect: </span>
                      <span className="font-medium">
                        {venda.vendasVinculadasConnect.join(', ')}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
            {ehConnect && (
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="border-sky-500 text-sky-700">
                  {somenteConsulta ? 'Connect — somente consulta' : 'Connect — herança em paralelo'}
                </Badge>
                {venda.vendaAntiga && (
                  <Badge variant="outline" className="border-amber-500 text-amber-700">
                    Venda até jun/2025 — conferir
                  </Badge>
                )}
              </div>
            )}
          </div>
        )}

        {venda && ehConnect && (
          <div className="bg-sky-50 border border-sky-200 rounded-xl p-3 text-sm text-sky-900">
            Esta venda veio da Connect: <b>Reserva</b> e <b>Entrega Futura</b> são o que a Connect
            tinha por cliente e por L. A quantidade <b>entregue</b> não existe na Connect (Q. Venda
            = Reserva + Entrega Futura).{' '}
            {temItemLiberado ? (
              <>
                Os itens <b>sem data de entrega</b> na Connect (e o que já chegou pela nota fiscal)
                estão liberados para separar aqui, igual às vendas do sistema; separar tira da
                Reserva e o Estoque Geral baixa quando a entrega é finalizada. Os itens com data de
                entrega definida na Connect seguem só para consulta. Transferir peça de outra venda vale
                aqui (lance também na Connect); Ajustar não vale; o tratamento da herança é do
                Matheus e da administração.
              </>
            ) : (
              <>
                Nenhum item desta venda está liberado para separar aqui (todos têm data de entrega
                definida na Connect ou ainda estão em Entrega Futura). O tratamento da herança é
                feito pelo Matheus e pela administração.
              </>
            )}
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        )}

        {venda && ehConnect && tratamentos.length > 0 && (
          <div className="bg-card border rounded-xl p-4">
            <h2 className="font-semibold text-sm mb-2">
              Tratamentos desta venda ({tratamentos.length})
            </h2>
            <div className="divide-y text-sm">
              {tratamentos.map((t) => {
                const item = venda.itens.find((i) => i.projeto_item_id === t.projetoItemId)
                return (
                  <div key={t.id} className="py-2 flex flex-wrap gap-x-4 gap-y-1">
                    <span className="text-muted-foreground whitespace-nowrap">
                      {new Date(t.criadoEm).toLocaleString('pt-BR')}
                    </span>
                    <span className="font-medium">{t.usuarioNome || '-'}</span>
                    <span>
                      {ROTULO_ACAO_HERANCA[t.acao] ?? t.acao}
                      {t.quantidade != null ? ` · ${t.quantidade} un.` : ''}
                      {item ? ` · ${item.codigo ?? '-'} (L ${item.classificacao || '-'})` : ''}
                    </span>
                    <span className="text-muted-foreground">Obs.: {t.observacao}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {venda && trocasVenda.length > 0 && (
          <div className="bg-card border rounded-xl p-4">
            <h2 className="font-semibold text-sm mb-2">
              Transferências desta venda ({trocasVenda.length})
            </h2>
            <div className="divide-y text-sm">
              {trocasVenda.map((t) => {
                const cedeu = t.origemOrcamentoId === venda.orcamentoId
                const outraVenda = cedeu ? t.destinoVendaNumero : t.origemVendaNumero
                const outroCliente = cedeu ? t.destinoClienteNome : t.origemClienteNome
                const outraEquipe = cedeu ? t.destinoEquipe : t.origemEquipe
                const detalhe = [outroCliente, outraEquipe ? `equipe ${outraEquipe}` : null]
                  .filter(Boolean)
                  .join(', ')
                return (
                  <div key={t.id} className="py-2 flex flex-wrap gap-x-4 gap-y-1">
                    <span className="text-muted-foreground whitespace-nowrap">
                      {fmtDataHora(t.solicitadoEm)}
                    </span>
                    <span className="font-medium">{t.solicitanteNome || '-'}</span>
                    <span>
                      <b className={cedeu ? 'text-amber-700' : 'text-emerald-700'}>
                        {cedeu ? 'Cedeu' : 'Recebeu'}
                      </b>{' '}
                      {t.quantidade} un. · {t.produtoCodigo ?? '-'} {t.produtoDescricao || ''}{' '}
                      {cedeu ? 'para' : 'de'} venda {outraVenda || '-'}
                      {detalhe ? ` (${detalhe})` : ''}
                    </span>
                    <span className="text-muted-foreground">Motivo: {t.motivo || '-'}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {venda && (
          <>
            <div className="bg-card border rounded-xl overflow-hidden">
              <div className="p-3 border-b flex flex-wrap items-center gap-3">
                <div className="relative w-full sm:w-96">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={buscaItem}
                    onChange={(e) => setBuscaItem(e.target.value)}
                    placeholder="Buscar item por código, referência, descrição ou L..."
                    className="pl-9 pr-9 h-9"
                  />
                  {buscaItem && (
                    <button
                      type="button"
                      onClick={() => setBuscaItem('')}
                      title="Limpar busca"
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {termoItem
                    ? `${itensVisiveis.length} de ${venda.itens.length} linha(s)` +
                      (itensVisiveis.length > 0 ? ` em ${lsVisiveis} L` : '')
                    : `${venda.itens.length} linha(s)`}
                </span>
                {ocultosComQuantidade > 0 && (
                  <span className="text-xs text-amber-700">
                    Atenção: {ocultosComQuantidade} linha(s) fora da busca têm quantidade em "À
                    Separar" e também serão separadas.
                  </span>
                )}
              </div>
              {/* SPEC-209 G1/G4: cabeçalho fixo (a rolagem é desta div, não do invólucro da tabela).
                  Cada L fica "fechado" em preto (linha grossa entre L, laterais e fim da tabela em
                  preto); a divisão entre peças do mesmo L e entre colunas fica em cinza, para o L
                  se destacar mais que a peça. */}
              <div className="overflow-auto max-h-[70vh]">
                <Table
                  containerClassName="overflow-visible"
                  className="border-collapse [&_td]:border [&_td]:border-gray-400 [&_td:first-child]:border-l-2 [&_td:first-child]:border-l-black [&_td:last-child]:border-r-2 [&_td:last-child]:border-r-black [&_tbody>tr:last-child>td]:border-b-2 [&_tbody>tr:last-child>td]:border-b-black [&_tfoot_td]:border-black [&_th]:border [&_th]:border-black [&_th]:sticky [&_th]:top-0 [&_th]:z-20 [&_th]:bg-slate-50 [&_th]:shadow-[inset_1px_0_0_#000,inset_0_1px_0_#000,inset_0_-1px_0_#000]"
                >
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
                      {colunaAcoes && (
                        <TableHead className="sticky right-0 !z-30 bg-card shadow-[-4px_0_4px_-4px_rgba(0,0,0,0.15)]" />
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {termoItem && itensVisiveis.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={colunaAcoes ? 14 : 13}
                          className="text-center text-sm text-muted-foreground py-6"
                        >
                          Nenhum item desta venda encontrado com "{buscaItem.trim()}".
                        </TableCell>
                      </TableRow>
                    )}
                    {itensVisiveis.map((item, idx) => (
                      <TableRow
                        key={item.projeto_item_id}
                        className={cn(
                          'group hover:bg-sky-100 focus-within:bg-sky-200',
                          idx > 0 &&
                            (item.classificacao || '-') !==
                              (itensVisiveis[idx - 1].classificacao || '-') &&
                            '[&>td]:border-t-[3px] [&>td]:!border-t-black',
                        )}
                      >
                        <TableCell className="font-mono font-semibold text-[#333333] tracking-wide text-sm whitespace-nowrap px-3">
                          {item.codigo ?? '-'}
                        </TableCell>
                        <TableCell className="text-sm break-words px-3">
                          {item.referencia || '-'}
                        </TableCell>
                        <TableCell className="text-sm break-words min-w-[220px]">
                          {item.descricao || '-'}
                          {item.connect && (
                            <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs">
                              {item.connect.dataEntrega && (
                                <span className="text-muted-foreground">
                                  Entrega: {fmtDia(item.connect.dataEntrega)}
                                </span>
                              )}
                              {item.connect.avisoData && (
                                <span className="text-amber-700">
                                  Sem data de entrega (verificar na Connect)
                                </span>
                              )}
                              {item.connect.observacao && (
                                <span className="text-muted-foreground">
                                  Obs.: {item.connect.observacao}
                                </span>
                              )}
                              {item.connect.tratada && (
                                <span className="text-emerald-700">Tratada</span>
                              )}
                            </div>
                          )}
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
                          {!item.liberado ? (
                            <span
                              className="text-xs text-muted-foreground"
                              title={ehConnect ? 'Tem data de entrega definida na Connect: segue na Connect' : undefined}
                            >
                              —
                            </span>
                          ) : item.q_reserva <= 0 && item.q_ag_separar > 0 ? (
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
                        {colunaAcoes && (
                          <TableCell className="sticky right-0 bg-card group-hover:bg-sky-100 group-focus-within:bg-sky-200 shadow-[-4px_0_4px_-4px_rgba(0,0,0,0.15)] whitespace-nowrap">
                            {ehConnect &&
                              podeTratar &&
                              (item.q_reserva > 0 || item.q_entrega_futura > 0) && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  title="Tratar: dar como entregue, tirar da reserva ou manter (só Matheus e administração)"
                                  onClick={() => handleAbrirTratar(item)}
                                >
                                  Tratar
                                </Button>
                              )}
                            {/* SPEC-149: o botão parte de quem PRECISA da
                                peça (saldo pendente em Entrega Futura), não
                                mais de quem já tem a reserva. */}
                            {podeTrocar && item.q_entrega_futura > 0 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                title="Transferir: pegar a peça reservada de outra venda (de qualquer equipe) para esta venda"
                                onClick={() => handleAbrirTroca(item)}
                              >
                                <ArrowLeftRight className="w-4 h-4 mr-1" />
                                Transferir
                              </Button>
                            )}
                            {!ehConnect &&
                              podeAjustar &&
                              (item.q_reserva > 0 || item.q_entrega_futura > 0) && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  title="Ajustar: passar entre Reserva e Entrega Futura dentro desta venda"
                                  onClick={() => handleAbrirAjuste(item)}
                                >
                                  <ArrowUpDown className="w-4 h-4 mr-1" />
                                  Ajustar
                                </Button>
                              )}
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                  {termoItem && itensVisiveis.length > 1 && (
                    <TableFooter>
                      <TableRow>
                        <TableCell colSpan={4} className="px-3 text-sm font-semibold">
                          Total em {lsVisiveis} L ({itensVisiveis.length} linhas)
                        </TableCell>
                        <TableCell className="text-right text-sm px-2">
                          {totaisVisiveis.q_devolvida}
                        </TableCell>
                        <TableCell className="text-right text-sm font-semibold px-2">
                          {totaisVisiveis.q_venda}
                        </TableCell>
                        <TableCell className="text-right text-sm px-2">
                          {totaisVisiveis.q_entrega_futura}
                        </TableCell>
                        <TableCell className="text-right text-sm px-2">
                          {totaisVisiveis.q_transferida_saida}
                        </TableCell>
                        <TableCell className="text-right text-sm font-semibold text-emerald-700 px-2">
                          {totaisVisiveis.q_reserva}
                        </TableCell>
                        <TableCell className="text-right text-sm bg-primary/5 px-2">
                          {totaisVisiveis.a_separar}
                        </TableCell>
                        <TableCell className="text-right text-sm px-2">
                          {totaisVisiveis.q_ag_separar}
                        </TableCell>
                        <TableCell className="text-right text-sm px-2">
                          {totaisVisiveis.q_separado}
                        </TableCell>
                        <TableCell className="text-right text-sm px-2">
                          {totaisVisiveis.q_entregue}
                        </TableCell>
                        {colunaAcoes && <TableCell className="sticky right-0 bg-muted/50" />}
                      </TableRow>
                    </TableFooter>
                  )}
                </Table>
              </div>
              {!somenteConsulta && (
                <div className="p-4 border-t flex flex-wrap items-end justify-end gap-3">
                  {/* SPEC-252 C: preenche a quantidade de todos os itens liberados com o que está em Reserva (não envia: confira e clique em Separar) */}
                  <Button
                    variant="outline"
                    onClick={handleSepararTudo}
                    disabled={saving || !venda.itens.some((i) => i.liberado && i.q_reserva > 0)}
                    title="Preenche todos os itens com a quantidade em Reserva. Confira e clique em Separar."
                  >
                    Separar tudo
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setQuantidades({})}
                    disabled={saving || Object.keys(quantidades).length === 0}
                  >
                    Limpar
                  </Button>
                  <Button onClick={handleSeparar} disabled={saving}>
                    {saving ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Scissors className="w-4 h-4 mr-2" />
                    )}
                    Separar
                  </Button>
                </div>
              )}
            </div>

            {precisaFinalizarManualmente && !somenteConsulta && (
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
                      <TableHead>Entrega</TableHead>
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
                          <Badge
                            variant={p.status === 'Cancelado' ? 'destructive' : 'outline'}
                            className={cn(
                              p.status === 'finalizado' && 'border-green-500 text-green-700',
                            )}
                          >
                            {statusParcial(p.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {p.entrega
                            ? `Entregue ${p.entrega.dataReal ? fmtData(p.entrega.dataReal) : ''}${p.entrega.recebidoPor ? ` · recebeu ${p.entrega.recebidoPor}` : ''}`
                            : p.dataEntrega
                              ? `Prevista ${fmtDia(p.dataEntrega)}`
                              : '-'}
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
      {venda && (
        <NovaSeparacaoModal
          open={!!itensParaSeparar}
          onClose={() => setItensParaSeparar(null)}
          onConfirm={handleConfirmarSeparacao}
          saving={saving}
          prefill={{
            codigoObra: venda.projetoCodigo ?? '',
            // mesmo número que sai na impressão (SPEC-176)
            numeroParcial: `${semPrefixo(venda.vendaNumero) || venda.orcamentoNumero}-P${parciais.length + 1}`,
            equipe: venda.equipeNome,
            // só o número, sem "VENDA-" e sem o orçamento (ex.: 0003)
            numeroVenda: semPrefixo(venda.vendaNumero) || semPrefixo(venda.orcamentoNumero) || '',
            solicitante: meuNome || user?.email || '',
            cliente: venda.clienteNome ?? '',
            telefone: venda.clienteTelefone ?? '',
            endereco: [
              [venda.clienteEndereco, venda.clienteNumero].filter(Boolean).join(', '),
              venda.clienteBairro,
              [venda.clienteCidade, venda.clienteEstado].filter(Boolean).join(' - '),
            ]
              .filter(Boolean)
              .join(', '),
          }}
          itens={(itensParaSeparar ?? []).map((i) => ({
            descricao: i.descricao,
            codigo: venda.itens.find((v) => v.projeto_item_id === i.projetoItemId)?.codigo ?? null,
            quantidade: i.quantidade,
          }))}
        />
      )}

      <Dialog open={!!verParcial} onOpenChange={(open) => !open && setVerParcial(null)}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex flex-wrap items-center gap-2">
              Parcial {venda ? semPrefixo(venda.vendaNumero) || venda.orcamentoNumero : ''}-P
              {verParcial ? (numerosParciais.get(verParcial.id) ?? '?') : ''}
              {verParcial && (
                <Badge variant={verParcial.status === 'Cancelado' ? 'destructive' : 'outline'}>
                  {statusParcial(verParcial.status)}
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
          {/* SPEC-231 D2/D3: entrega desta parcial — o que a Logística vai usar e, depois, quem recebeu */}
          {verParcial && (
            <div className="rounded-lg border bg-muted/30 p-3 text-sm space-y-2">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                  Entrega · {statusParcial(verParcial.status)}
                </p>
                {STATUS_PARCIAL_EDITAVEL.includes(verParcial.status) && !editandoEntrega && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7"
                    onClick={() => {
                      setFormEntrega({
                        dataEntrega: verParcial.dataEntrega ?? '',
                        endereco: verParcial.endereco ?? '',
                        responsavelRecebimento: verParcial.responsavelRecebimento ?? '',
                        telefone: verParcial.telefone ?? '',
                        observacoes: verParcial.observacoes ?? '',
                      })
                      setEditandoEntrega(true)
                    }}
                  >
                    <Pencil className="w-3.5 h-3.5 mr-1" /> Editar
                  </Button>
                )}
              </div>
              {editandoEntrega ? (
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  <label className="space-y-1">
                    <span className="text-xs text-muted-foreground">Data de entrega</span>
                    <Input
                      type="date"
                      className="h-8"
                      value={formEntrega.dataEntrega}
                      onChange={(e) =>
                        setFormEntrega({ ...formEntrega, dataEntrega: e.target.value })
                      }
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-xs text-muted-foreground">Responsável na obra</span>
                    <Input
                      className="h-8"
                      value={formEntrega.responsavelRecebimento}
                      onChange={(e) =>
                        setFormEntrega({ ...formEntrega, responsavelRecebimento: e.target.value })
                      }
                    />
                  </label>
                  <label className="space-y-1 md:col-span-2">
                    <span className="text-xs text-muted-foreground">Endereço de entrega</span>
                    <Textarea
                      rows={2}
                      value={formEntrega.endereco}
                      onChange={(e) => setFormEntrega({ ...formEntrega, endereco: e.target.value })}
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-xs text-muted-foreground">Telefone</span>
                    <Input
                      className="h-8"
                      value={formEntrega.telefone}
                      onChange={(e) => setFormEntrega({ ...formEntrega, telefone: e.target.value })}
                    />
                  </label>
                  <label className="space-y-1 md:col-span-2">
                    <span className="text-xs text-muted-foreground">Observações da entrega</span>
                    <Textarea
                      rows={2}
                      placeholder="Ex.: falar com o eletricista na chegada"
                      value={formEntrega.observacoes}
                      onChange={(e) =>
                        setFormEntrega({ ...formEntrega, observacoes: e.target.value })
                      }
                    />
                  </label>
                  <div className="flex justify-end gap-2 md:col-span-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={salvandoEntrega}
                      onClick={() => setEditandoEntrega(false)}
                    >
                      Cancelar
                    </Button>
                    <Button size="sm" disabled={salvandoEntrega} onClick={handleSalvarEntrega}>
                      {salvandoEntrega && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}
                      Salvar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-x-6 gap-y-1 md:grid-cols-2">
                  <p>
                    <span className="text-muted-foreground">Previsão:</span>{' '}
                    {verParcial.dataEntrega ? fmtDia(verParcial.dataEntrega) : 'A combinar'}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Responsável na obra:</span>{' '}
                    {verParcial.responsavelRecebimento || '-'}
                  </p>
                  <p className="md:col-span-2">
                    <span className="text-muted-foreground">Endereço:</span>{' '}
                    {verParcial.endereco || '-'}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Telefone:</span>{' '}
                    {verParcial.telefone || '-'}
                  </p>
                  {verParcial.observacoes && (
                    <p className="md:col-span-2">
                      <span className="text-muted-foreground">Observações:</span>{' '}
                      {verParcial.observacoes}
                    </p>
                  )}
                  {verParcial.entrega && (
                    <div className="md:col-span-2 mt-1 rounded-md border border-green-300 bg-green-50 p-2 text-green-900">
                      <p className="font-semibold">
                        Entregue
                        {verParcial.entrega.dataReal
                          ? ` em ${fmtDataHora(verParcial.entrega.dataReal)}`
                          : ''}
                      </p>
                      <p>
                        Recebido por: <b>{verParcial.entrega.recebidoPor || '-'}</b>
                        {verParcial.entrega.entreguePor
                          ? ` · entregue por ${verParcial.entrega.entreguePor}`
                          : ''}
                      </p>
                      {verParcial.entrega.observacoes && <p>{verParcial.entrega.observacoes}</p>}
                    </div>
                  )}
                </div>
              )}
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
            <DialogTitle>Transferir peça de outra venda</DialogTitle>
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
              <p className="text-xs rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-amber-900">
                Aparecem as vendas de <b>todas as equipes</b>. Priorize os clientes da sua equipe e
                combine com a outra equipe quando precisar. A transferência fica registrada no log
                das duas vendas. Faça a mesma transferência também na Connect.
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
                    Nenhum outro L (desta venda ou de outro projeto) tem essa peça reservada no
                    momento.
                  </p>
                ) : (
                  <div className="border rounded-lg overflow-hidden max-h-64 overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Projeto</TableHead>
                          <TableHead>Venda</TableHead>
                          <TableHead>L</TableHead>
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
                              {!!r.orcamentoId && r.orcamentoId === venda?.orcamentoId && (
                                <span className="ml-1.5 rounded bg-sky-100 px-1.5 py-0.5 text-[10px] font-semibold text-sky-800">
                                  esta venda
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="text-sm whitespace-nowrap">
                              {r.vendaNumero || '-'}
                              {r.origem === 'connect' && (
                                <span className="ml-1.5 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800">
                                  Connect
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="text-sm font-mono">{r.lFixo || '-'}</TableCell>
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
                        Motivo *
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
              disabled={trocando || !trocaOrigemEscolhida || !trocaQuantidade || !trocaMotivo.trim()}
            >
              {trocando ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Confirmar transferência
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* SPEC-235 B: Reserva <-> Entrega Futura dentro desta venda (só Matheus/admin) */}
      <Dialog
        open={!!ajusteItem}
        onOpenChange={(open) => !open && !ajustando && setAjusteItem(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Ajustar Reserva / Entrega Futura</DialogTitle>
          </DialogHeader>
          {ajusteItem && (
            <div className="space-y-4 text-sm">
              <div>
                <div className="font-semibold">
                  {ajusteItem.codigo ?? '-'} — {ajusteItem.descricao || '-'}
                </div>
                <div className="text-muted-foreground">
                  L {ajusteItem.classificacao || '-'} · Reserva {ajusteItem.q_reserva} · Entrega
                  Futura {ajusteItem.q_entrega_futura}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={ajusteAcao === 'reserva_para_entrega_futura' ? 'default' : 'outline'}
                  disabled={ajusteItem.q_reserva <= 0}
                  onClick={() => setAjusteAcao('reserva_para_entrega_futura')}
                >
                  Reserva → Entrega Futura
                </Button>
                <Button
                  type="button"
                  variant={ajusteAcao === 'entrega_futura_para_reserva' ? 'default' : 'outline'}
                  disabled={ajusteItem.q_entrega_futura <= 0}
                  onClick={() => setAjusteAcao('entrega_futura_para_reserva')}
                >
                  Entrega Futura → Reserva
                </Button>
              </div>
              <div className="space-y-1">
                <label className="font-medium">Quantidade (máx. {ajusteMax})</label>
                <Input
                  type="number"
                  min={1}
                  max={ajusteMax}
                  step="1"
                  value={ajusteQuantidade}
                  onChange={(e) => setAjusteQuantidade(e.target.value)}
                  className="w-32"
                />
              </div>
              <div className="space-y-1">
                <label className="font-medium">Motivo</label>
                <Textarea
                  value={ajusteMotivo}
                  onChange={(e) => setAjusteMotivo(e.target.value)}
                  placeholder="Ex.: cliente pediu para segurar esta peça"
                  rows={2}
                />
              </div>
              {ajusteAcao === 'entrega_futura_para_reserva' && (
                <p className="text-xs text-muted-foreground">
                  Só reserva se houver peça livre no Estoque Geral (sem reserva de ninguém).
                </p>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setAjusteItem(null)} disabled={ajustando}>
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmarAjuste}
              disabled={ajustando || !ajusteQuantidade || !ajusteMotivo.trim()}
            >
              {ajustando ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* SPEC-243: ligar a venda da Connect a um projeto (qualquer pessoa com acesso à Venda Parcial, dentro da própria equipe). Não mexe em estoque, saldos, financeiro nem no valor do projeto. */}
      <Dialog open={ligarAberto} onOpenChange={(open) => !open && !ligando && setLigarAberto(false)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Ligar a um projeto</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            <p className="text-muted-foreground">
              Venda {semPrefixo(venda?.vendaNumero ?? null) || '—'} · {venda?.clienteNome || 'cliente não identificado'}. A venda e as peças passam a
              pertencer ao projeto escolhido. Não muda estoque, saldos, financeiro nem o valor do projeto.
            </p>
            <div className="space-y-1">
              <label className="font-medium">Projeto (código ou nome)</label>
              <Input
                value={ligarTermo}
                onChange={(e) => {
                  setLigarTermo(e.target.value)
                  setLigarProjeto(null)
                  setLigarAviso(null)
                }}
                placeholder="Ex.: 26.277 ou TWO ARQUITETURA"
              />
            </div>
            <div className="max-h-48 overflow-y-auto rounded-lg border divide-y">
              {ligarBuscando && <div className="p-3 text-muted-foreground">Buscando…</div>}
              {!ligarBuscando && ligarTermo.trim().length >= 2 && ligarResultados.length === 0 && (
                <div className="p-3 text-muted-foreground">Nenhum projeto encontrado.</div>
              )}
              {ligarResultados.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setLigarProjeto(p)
                    setLigarAviso(null)
                  }}
                  className={cn('w-full text-left p-2.5 hover:bg-muted/50', ligarProjeto?.id === p.id && 'bg-primary/5')}
                >
                  <div className="font-medium">
                    {p.codigo} — {p.nome}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {p.clienteNome ? `Cliente: ${p.clienteNome}` : 'Projeto sem cliente'}
                    {p.status ? ` · ${p.status}` : ''}
                  </div>
                </button>
              ))}
            </div>
            {ligarAviso && (
              <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-amber-900">
                O cliente da venda ({ligarAviso.clienteVenda || '-'}) é diferente do cliente do projeto ({ligarAviso.clienteProjeto || '-'}).
                Confirme só se a venda é mesmo deste projeto.
              </div>
            )}
            <div className="space-y-1">
              <label className="font-medium">Observação (obrigatória)</label>
              <Textarea
                value={ligarObs}
                onChange={(e) => setLigarObs(e.target.value)}
                placeholder="Ex.: confirmado com a projetista que a venda 5921 é do projeto 26.277"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLigarAberto(false)} disabled={ligando}>
              Cancelar
            </Button>
            <Button
              onClick={() => handleConfirmarLigar(!!ligarAviso)}
              disabled={ligando || !ligarProjeto || !ligarObs.trim()}
            >
              {ligando ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              {ligarAviso ? 'Confirmar mesmo assim' : 'Ligar ao projeto'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* SPEC-243 fase 2: tratar a herança da Connect (só Matheus/admin). Mesma conta da SPEC-232: o reservado sempre é liberado; o Estoque Geral só baixa se a peça realmente saiu. */}
      <Dialog open={!!tratItem} onOpenChange={(open) => !open && !tratando && setTratItem(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Tratar herança da Connect</DialogTitle>
          </DialogHeader>
          {tratItem && (
            <div className="space-y-4 text-sm">
              <div>
                <div className="font-semibold">
                  {tratItem.codigo ?? '-'} — {tratItem.descricao || '-'}
                </div>
                <div className="text-muted-foreground">
                  L {tratItem.classificacao || '-'} · Reserva {tratItem.q_reserva} · Entrega Futura{' '}
                  {tratItem.q_entrega_futura}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={tratSetor === 'reserva' ? 'default' : 'outline'}
                  disabled={tratItem.q_reserva <= 0}
                  onClick={() => {
                    setTratSetor('reserva')
                    setTratAcao('entregue_baixa_estoque')
                  }}
                >
                  Reserva ({tratItem.q_reserva})
                </Button>
                <Button
                  type="button"
                  variant={tratSetor === 'entrega_futura' ? 'default' : 'outline'}
                  disabled={tratItem.q_entrega_futura <= 0}
                  onClick={() => {
                    setTratSetor('entrega_futura')
                    setTratAcao('nao_sera_entregue')
                  }}
                >
                  Entrega Futura ({tratItem.q_entrega_futura})
                </Button>
              </div>

              <div className="space-y-2">
                {(
                  [
                    [
                      'entregue_baixa_estoque',
                      'Já foi entregue — a peça saiu e o Estoque Geral ainda a conta',
                      'Estoque Geral −{q} · Reservado −{q} · vai para Entregue',
                    ],
                    [
                      'entregue_estoque_ja_ajustado',
                      'Já foi entregue — o Estoque Geral já está certo (não mexe no estoque)',
                      'Reservado −{q} · Estoque Geral não muda · vai para Entregue',
                    ],
                    [
                      'nao_sera_entregue',
                      'Não será mais entregue — a peça fica disponível no estoque',
                      'Reservado −{q} · Estoque Geral não muda · a peça volta a ficar disponível',
                    ],
                    [
                      'mantida_confirmada',
                      'Manter — venda real / entrega segurada (só registrar)',
                      'Nada muda; fica registrado com a observação',
                    ],
                  ] as [AcaoHeranca, string, string][]
                )
                  .filter(
                    ([a]) =>
                      tratSetor === 'reserva' ||
                      a === 'nao_sera_entregue' ||
                      a === 'mantida_confirmada',
                  )
                  .map(([a, titulo, efeito]) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setTratAcao(a)}
                      className={cn(
                        'w-full text-left rounded-lg border p-3',
                        tratAcao === a ? 'border-primary bg-primary/5' : 'hover:bg-muted/50',
                      )}
                    >
                      <div className="font-medium">{titulo}</div>
                      <div className="text-xs text-muted-foreground">
                        {efeito.replaceAll(
                          '{q}',
                          tratSemQuantidade || !tratQuantidade ? 'q' : tratQuantidade,
                        )}
                      </div>
                    </button>
                  ))}
              </div>

              {!tratSemQuantidade && (
                <div className="space-y-1">
                  <label className="font-medium">Quantidade (máx. {tratSaldo})</label>
                  <Input
                    type="number"
                    min={1}
                    max={tratSaldo}
                    step="1"
                    value={tratQuantidade}
                    onChange={(e) => setTratQuantidade(e.target.value)}
                    className="w-32"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="font-medium">Observação (obrigatória)</label>
                <Textarea
                  value={tratObs}
                  onChange={(e) => setTratObs(e.target.value)}
                  placeholder="Ex.: eletricista levou em maio e a lista nunca foi tirada; confirmado com a projetista"
                  rows={3}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Não gera crédito nem financeiro e não é devolução: só baixa a herança. Fica
                registrado quem fez, quando e por quê.
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setTratItem(null)} disabled={tratando}>
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmarTratar}
              disabled={tratando || !tratObs.trim() || (!tratSemQuantidade && !tratQuantidade)}
            >
              {tratando ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* SPEC-098: log de trocas já aprovadas — fácil de consultar sem
          precisar abrir o banco. */}
      <Dialog open={logAberto} onOpenChange={setLogAberto}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Log de Transferências</DialogTitle>
          </DialogHeader>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={logBusca}
              onChange={(e) => setLogBusca(e.target.value)}
              placeholder="Buscar por cliente, venda, peça, equipe, pessoa ou motivo..."
              className="pl-9 h-9"
            />
          </div>
          {carregandoLog ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : logTrocas.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-10">
              Nenhuma transferência registrada ainda.
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
                  {logTrocas
                    .filter((t) => {
                      const termo = logBusca.trim().toLowerCase()
                      if (!termo) return true
                      return [
                        t.produtoCodigo,
                        t.produtoDescricao,
                        t.origemProjetoCodigo,
                        t.origemClienteNome,
                        t.origemVendaNumero,
                        t.origemEquipe,
                        t.destinoProjetoCodigo,
                        t.destinoClienteNome,
                        t.destinoVendaNumero,
                        t.destinoEquipe,
                        t.solicitanteNome,
                        t.motivo,
                      ].some((v) => String(v ?? '').toLowerCase().includes(termo))
                    })
                    .map((t) => (
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
                        Venda {t.origemVendaNumero || t.origemProjetoCodigo || '-'}
                        {t.origemConnect && (
                          <span className="ml-1 rounded bg-amber-100 px-1 py-0.5 text-[10px] font-semibold text-amber-800">
                            Connect
                          </span>
                        )}
                        <br />
                        <span className="text-xs text-muted-foreground">
                          {t.origemClienteNome || '-'}
                          {t.origemEquipe ? ` · ${t.origemEquipe}` : ''}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm">
                        Venda {t.destinoVendaNumero || t.destinoProjetoCodigo || '-'}
                        {t.destinoConnect && (
                          <span className="ml-1 rounded bg-amber-100 px-1 py-0.5 text-[10px] font-semibold text-amber-800">
                            Connect
                          </span>
                        )}
                        <br />
                        <span className="text-xs text-muted-foreground">
                          {t.destinoClienteNome || '-'}
                          {t.destinoEquipe ? ` · ${t.destinoEquipe}` : ''}
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
