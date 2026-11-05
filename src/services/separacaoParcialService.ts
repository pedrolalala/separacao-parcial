import { supabase } from '@/lib/supabase/client'
import type { DadosNovaSeparacao } from '@/components/NovaSeparacaoModal'

// SPEC-072: cada linha representa um projeto_item_id (item de uma venda já
// aprovada) com o saldo por setor operacional — mesma granularidade de
// vw_estoque_saldos_projeto_item, só que enriquecida com referência e
// classificação (l_fixo), que a view não expõe.
export interface ItemVenda {
  projeto_item_id: string
  produto_id: string | null
  codigo: number | null
  referencia: string | null
  /** SPEC-231 (27/10): marca da peça, sai no Pedido em Separação */
  marca: string | null
  descricao: string | null
  classificacao: string | null
  q_devolvida: number
  q_venda: number
  q_entrega_futura: number
  q_transferida_saida: number
  q_reserva: number
  q_ag_separar: number
  q_separado: number
  q_entregue: number
  /** SPEC-243: só nas vendas da Connect — o que as planilhas Reserva/Entrega Futura trouxeram para este item. */
  connect?: ItemConnect
  /** SPEC-244 (operação em paralelo): venda do sistema = sempre true; venda da Connect = true só para o que está "sem data de entrega" na
   *  Connect (ou já recebeu da NF). Os demais itens da Connect seguem só para consulta aqui. */
  liberado: boolean
}

/** SPEC-243: dados do espelho da Connect por item (L + peça) de uma venda Connect. Sem valor em dinheiro. */
export interface ItemConnect {
  /** menor data de entrega informada pela Connect (null = a Connect não informou) */
  dataEntrega: string | null
  /** há Reserva sem data de entrega: provável erro da exportação da Connect */
  avisoData: boolean
  observacao: string | null
  /** alguém já tratou ("matou") esta linha na fase 2 */
  tratada: boolean
}

export type OrigemVenda = 'sistema' | 'connect'

export interface VendaInfo {
  orcamentoId: string | null
  /** SPEC-243: 'connect' = histórico herdado da Connect (somente consulta); 'sistema' = venda feita aqui. */
  origem: OrigemVenda
  /** SPEC-243: números das vendas da Connect ligadas a esta venda ("Vendas vinculadas Connect"). */
  vendasVinculadasConnect: number[]
  /** SPEC-243: venda Connect até junho/2025 (venda ≤ 2477): pede conferência se ainda tem reserva. */
  vendaAntiga: boolean
  orcamentoNumero: string
  // SPEC-136: numero da venda propriamente dito (VENDA-0001), distinto do
  // numero do orcamento de origem (ORC-0001) — null para orcamentos
  // aprovados antes desta SPEC (nao foi feito backfill).
  vendaNumero: string | null
  clienteId: string | null
  clienteNome: string | null
  projetoCodigo: string | null
  itens: ItemVenda[]
  // SPEC-144: campos usados só na impressão do "Pedido em Separação"
  // (layout baseado no documento do Connect) — todos opcionais, cliente ou
  // orçamento podem ter cadastro incompleto sem impedir a impressão.
  empresaNome: string | null
  dataEmissaoOrcamento: string | null
  vendedorNome: string | null
  /** SPEC-231 D1: equipe do orçamento (equipes_projetos.equipes, ex.: "Marina"). */
  equipeNome: string | null
  clienteCpfCnpj: string | null
  clienteTelefone: string | null
  clienteEndereco: string | null
  clienteNumero: string | null
  clienteBairro: string | null
  clienteCidade: string | null
  clienteEstado: string | null
}

export interface ParcialHistorico {
  id: string
  criadoEm: string
  responsavelNome: string | null
  status: string
  itens: number
  // SPEC-231 D2/D3: dados da entrega (editáveis antes de sair) e o que a Logística registrou ao entregar.
  dataEntrega: string | null
  endereco: string | null
  responsavelRecebimento: string | null
  telefone: string | null
  observacoes: string | null
  entrega: {
    recebidoPor: string | null
    entreguePor: string | null
    dataReal: string | null
    observacoes: string | null
  } | null
}

export interface VendaDisponivel {
  orcamentoId: string
  orcamentoNumero: string
  vendaNumero: string | null
  clienteNome: string | null
  projetoCodigo: string | null
  // SPEC-176: só exibição na listagem (sem valor em dinheiro — SPEC-072).
  empresaNome: string | null
  dataVenda: string | null
  previsaoEntrega: string | null
  // SPEC-243: origem da venda (aba "Sistema Lucenera" × "Connect") e dados para a lista da Connect
  origem: OrigemVenda
  equipeNome: string | null
  vendedorNome: string | null
  vendasVinculadasConnect: number[]
  vendaAntiga: boolean
  qReserva: number
  qEntregaFutura: number
}

// PostgREST devolve no máximo 1.000 linhas por pedido: pagina em blocos para nunca cortar a lista em silêncio.
async function lerTudo<T>(
  montar: (de: number, ate: number) => PromiseLike<{ data: T[] | null; error: any }>,
): Promise<T[]> {
  const tamanho = 1000
  const todas: T[] = []
  for (let de = 0; ; de += tamanho) {
    const { data, error } = await montar(de, de + tamanho - 1)
    if (error) throw error
    todas.push(...(data || []))
    if (!data || data.length < tamanho) break
  }
  return todas
}

// SPEC-072: a busca original exigia o usuário já saber o número exato da
// venda, sem nenhuma forma de descobrir quais existem — lista as vendas que
// de fato têm saldo operacional (aprovadas e com projeto_itens), pra virar
// um seletor de busca em vez de um campo de texto cego.
export async function listarVendasDisponiveis(
  origem: OrigemVenda = 'sistema',
): Promise<VendaDisponivel[]> {
  // SPEC-243: uma linha por venda, já com a origem (view vw_venda_parcial_lista, security_invoker: vale o RLS por equipe).
  // Antes isto lia vw_estoque_saldos_projeto_item inteira (uma linha por item) e agrupava aqui; com as vendas da Connect
  // passaria de 1.000 linhas e misturaria as duas origens.
  const rows = await lerTudo<any>((de, ate) =>
    supabase
      .from('vw_venda_parcial_lista')
      .select(
        'orcamento_id, orcamento_numero, venda_numero, origem, cliente_nome, cliente_razao_social, projeto_codigo, empresa_nome, data_venda, previsao_entrega, equipe_nome, vendedor_nome, vendas_vinculadas_connect, venda_antiga, q_reserva, q_entrega_futura',
      )
      .eq('origem', origem)
      .order('orcamento_numero', { ascending: true })
      .range(de, ate),
  )

  return rows.map((r: any) => {
    const nome = r.cliente_nome as string | null
    const razao = (r.cliente_razao_social as string | null)?.trim()
    const clienteNome = nome ? (razao && razao !== nome ? `${razao} - ${nome}` : nome) : null
    return {
      orcamentoId: r.orcamento_id,
      orcamentoNumero: r.orcamento_numero,
      vendaNumero: r.venda_numero,
      clienteNome,
      projetoCodigo: r.projeto_codigo,
      empresaNome: r.empresa_nome ?? null,
      dataVenda: r.data_venda ?? null,
      previsaoEntrega: r.previsao_entrega ?? null,
      origem: r.origem === 'connect' ? 'connect' : 'sistema',
      equipeNome: r.equipe_nome ?? null,
      vendedorNome: r.vendedor_nome ?? null,
      vendasVinculadasConnect: Array.isArray(r.vendas_vinculadas_connect)
        ? r.vendas_vinculadas_connect
        : [],
      vendaAntiga: !!r.venda_antiga,
      qReserva: Number(r.q_reserva) || 0,
      qEntregaFutura: Number(r.q_entrega_futura) || 0,
    } as VendaDisponivel
  })
}

export interface BoletoResumo {
  id: string
  nossoNumero: string
  numParcela: number
  totalParcelas: number
  status: string
  finalizado: boolean
}

// SPEC-072: usuário pediu para conectar a tela com os boletos gerados na
// aprovação do orçamento, mas depois foi explícito: nada de valor aparece
// aqui, só o número do boleto e quantas parcelas ainda faltam finalizar —
// "Separação Parcial" não é uma tela financeira. Por isso a query nem busca
// mais "valor"/"vencimento" (não precisa existir no payload pra não vazar
// por engano depois).
export async function buscarBoletosPorOrcamento(orcamentoId: string): Promise<BoletoResumo[]> {
  const { data, error } = await supabase
    .from('boletos')
    .select('id, nosso_numero, num_parcela, total_parcelas, status')
    .eq('orcamento_id', orcamentoId)
    .order('num_parcela', { ascending: true })

  if (error) throw error

  return (data || []).map((b: any) => ({
    id: b.id,
    nossoNumero: b.nosso_numero,
    numParcela: b.num_parcela,
    totalParcelas: b.total_parcelas,
    status: b.status,
    finalizado: b.status === 'Pago',
  }))
}

// SPEC-072: busca cruza só a venda informada — diferente da busca de venda de
// origem da SPEC-071 (devolução), que cruza todos os projetos do cliente.
// SPEC-136: aceita tanto o número do orçamento de origem (ORC-XXXX, único
// identificador que existia até aqui) quanto o número da venda propriamente
// dito (VENDA-XXXX, novo) — orçamentos aprovados antes desta SPEC não têm
// venda_numero (sem backfill), por isso o fallback continua necessário.
export async function buscarVendaPorNumero(numeroVenda: string): Promise<VendaInfo | null> {
  const numero = numeroVenda.trim()
  if (!numero) return null

  const camposSelecionados =
    'orcamento_id, projeto_item_id, produto_id, cliente_id, produto, produto_codigo, projeto_codigo, orcamento_numero, venda_numero, q_venda, q_reserva, q_entrega_futura, q_ag_separar, q_separado, q_entregue, q_devolvida, q_transferida_saida, status_operacional'

  // Duas buscas .eq() separadas (em vez de .or() com o valor digitado
  // interpolado na string do filtro) para não expor injeção no filtro
  // PostgREST via vírgula/parênteses no que o usuário digitar.
  const [porOrcamento, porVenda] = await Promise.all([
    supabase
      .from('vw_estoque_saldos_projeto_item')
      .select(camposSelecionados)
      .eq('orcamento_numero', numero)
      .eq('status_operacional', 'ativo'),
    supabase
      .from('vw_estoque_saldos_projeto_item')
      .select(camposSelecionados)
      .eq('venda_numero', numero)
      .eq('status_operacional', 'ativo'),
  ])

  if (porOrcamento.error) throw porOrcamento.error
  if (porVenda.error) throw porVenda.error

  const saldoRows = (porOrcamento.data?.length ? porOrcamento.data : porVenda.data) as any[]
  if (!saldoRows || saldoRows.length === 0) return null

  const projetoItemIds = saldoRows.map((r: any) => r.projeto_item_id)
  const produtoIds = saldoRows.map((r: any) => r.produto_id).filter(Boolean)

  // referencia mora em produtos, não em projeto_itens (só l_fixo/classificação
  // mora lá) — vw_estoque_saldos_projeto_item não expõe nenhum dos dois.
  const [
    { data: piRows, error: piError },
    { data: produtoRows, error: produtoError },
    { data: clienteRow, error: clienteError },
    { data: orcamentoRow, error: orcamentoError },
  ] = await Promise.all([
    supabase.from('projeto_itens').select('id, l_fixo').in('id', projetoItemIds),
    produtoIds.length > 0
      ? supabase.from('produtos').select('id, referencia, marca:marcas(nome)').in('id', produtoIds)
      : Promise.resolve({ data: [], error: null }),
    saldoRows[0].cliente_id
      ? supabase
          .from('contatos')
          .select(
            'id, nome, razao_social, cpf_cnpj, telefone, celular, endereco, numero, bairro, cidade, estado',
          )
          .eq('id', saldoRows[0].cliente_id)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    // SPEC-144: dados de impressão (empresa/vendedor/data do orçamento) —
    // buscados à parte pois vw_estoque_saldos_projeto_item não os expõe.
    saldoRows[0].orcamento_id
      ? supabase
          .from('orcamentos')
          .select(
            'data_emissao, origem, vendas_vinculadas_connect, empresa:empresas(nome), vendedor:funcionarios(nome), equipe:equipes_projetos(equipes)',
          )
          .eq('id', saldoRows[0].orcamento_id)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
  ])

  if (piError) throw piError
  if (produtoError) throw produtoError
  if (clienteError) throw clienteError
  if (orcamentoError) throw orcamentoError

  const origem: OrigemVenda = (orcamentoRow as any)?.origem === 'connect' ? 'connect' : 'sistema'
  let vendaAntiga = false
  const connectPorItem = new Map<string, ItemConnect>()
  if (origem === 'connect' && saldoRows[0].orcamento_id) {
    // SPEC-243: o que as planilhas da Connect trouxeram por item (data de entrega, aviso de data ausente, observação).
    const espelho = await lerTudo<any>((de, ate) =>
      supabase
        .from('vw_connect_reserva_ambiente')
        .select(
          'projeto_item_id, tipo, data_entrega, aviso_data, observacao, tratada, venda_antiga',
        )
        .eq('orcamento_id', saldoRows[0].orcamento_id)
        .order('projeto_item_id', { ascending: true })
        .range(de, ate),
    )
    for (const e of espelho) {
      if (e.venda_antiga) vendaAntiga = true
      if (!e.projeto_item_id) continue
      const atual = connectPorItem.get(e.projeto_item_id) || {
        dataEntrega: null,
        avisoData: false,
        observacao: null,
        tratada: false,
      }
      if (e.data_entrega && (!atual.dataEntrega || e.data_entrega < atual.dataEntrega))
        atual.dataEntrega = e.data_entrega
      if (e.aviso_data) atual.avisoData = true
      if (e.observacao && !atual.observacao) atual.observacao = e.observacao
      if (e.tratada) atual.tratada = true
      connectPorItem.set(e.projeto_item_id, atual)
    }
  }

  // SPEC-244: quais itens da Connect já podem ser separados aqui (a regra mora no banco: connect_itens_liberados).
  const liberadosConnect = new Set<string>()
  if (origem === 'connect') {
    const ids = saldoRows.map((r: any) => r.projeto_item_id as string)
    for (let i = 0; i < ids.length; i += 200) {
      const { data, error } = await (supabase as any).rpc('connect_itens_liberados', {
        p_projeto_item_ids: ids.slice(i, i + 200),
      })
      if (error) break // função ainda não existe / sem permissão: nada liberado (só consulta)
      ;((data || []) as any[]).forEach((x) => liberadosConnect.add(typeof x === 'string' ? x : (x?.connect_itens_liberados ?? '')))
    }
  }

  const piMap = new Map((piRows || []).map((p: any) => [p.id, p]))
  const produtoMap = new Map((produtoRows || []).map((p: any) => [p.id, p]))

  const itens: ItemVenda[] = saldoRows.map((r: any) => {
    const detalhe = piMap.get(r.projeto_item_id)
    const produto = r.produto_id ? produtoMap.get(r.produto_id) : null
    return {
      projeto_item_id: r.projeto_item_id,
      produto_id: r.produto_id,
      codigo: r.produto_codigo,
      referencia: produto?.referencia ?? null,
      marca: (Array.isArray(produto?.marca) ? produto.marca[0] : produto?.marca)?.nome ?? null,
      descricao: r.produto,
      classificacao: detalhe?.l_fixo ?? null,
      q_devolvida: Number(r.q_devolvida) || 0,
      q_venda: Number(r.q_venda) || 0,
      q_entrega_futura: Number(r.q_entrega_futura) || 0,
      q_transferida_saida: Number(r.q_transferida_saida) || 0,
      q_reserva: Number(r.q_reserva) || 0,
      q_ag_separar: Number(r.q_ag_separar) || 0,
      q_separado: Number(r.q_separado) || 0,
      q_entregue: Number(r.q_entregue) || 0,
      connect: connectPorItem.get(r.projeto_item_id),
      liberado: origem !== 'connect' || liberadosConnect.has(r.projeto_item_id),
    }
  })

  const clienteNome = clienteRow
    ? (clienteRow as any).razao_social?.trim() &&
      (clienteRow as any).razao_social !== (clienteRow as any).nome
      ? `${(clienteRow as any).razao_social} - ${(clienteRow as any).nome}`
      : (clienteRow as any).nome
    : null

  return {
    orcamentoId: saldoRows[0].orcamento_id,
    origem,
    vendasVinculadasConnect: Array.isArray((orcamentoRow as any)?.vendas_vinculadas_connect)
      ? (orcamentoRow as any).vendas_vinculadas_connect
      : [],
    vendaAntiga,
    orcamentoNumero: saldoRows[0].orcamento_numero,
    vendaNumero: saldoRows[0].venda_numero,
    clienteId: saldoRows[0].cliente_id,
    clienteNome,
    projetoCodigo: saldoRows[0].projeto_codigo,
    itens,
    empresaNome: (orcamentoRow as any)?.empresa?.nome ?? null,
    dataEmissaoOrcamento: (orcamentoRow as any)?.data_emissao ?? null,
    vendedorNome: (orcamentoRow as any)?.vendedor?.nome ?? null,
    equipeNome: (orcamentoRow as any)?.equipe?.equipes ?? null,
    clienteCpfCnpj: (clienteRow as any)?.cpf_cnpj ?? null,
    clienteTelefone: (clienteRow as any)?.telefone || (clienteRow as any)?.celular || null,
    clienteEndereco: (clienteRow as any)?.endereco ?? null,
    clienteNumero: (clienteRow as any)?.numero ?? null,
    clienteBairro: (clienteRow as any)?.bairro ?? null,
    clienteCidade: (clienteRow as any)?.cidade ?? null,
    clienteEstado: (clienteRow as any)?.estado ?? null,
  }
}

// SPEC-072 (Opção A, aprovada): separação só sai da Reserva — a RPC
// registrar_separacao_setor já valida e rejeita quantidade acima do saldo
// em q_reserva. Não escolhe setor (diferente do que foi pedido inicialmente
// pelo usuário) porque a gravação da reunião com o Vinicius é explícita:
// "se o produto não está em reserva, ele não pode ser solicitado uma
// entrega, uma separação".
export async function criarSeparacaoParcial(params: {
  numeroVenda: string
  clienteId: string | null
  clienteNome: string | null
  projetoCodigo: string | null
  itens: {
    projetoItemId: string
    produtoId: string | null
    descricao: string | null
    quantidade: number
  }[]
  observacoes?: string
  /** SPEC-231 D1: dados da tela "Nova Separação" (mesma da Logística). */
  logistica?: DadosNovaSeparacao
}): Promise<{ separacaoId: string }> {
  const itensValidos = params.itens.filter((i) => i.quantidade > 0)
  if (itensValidos.length === 0) {
    throw new Error('Informe a quantidade a separar em pelo menos um item.')
  }

  const { data: userData } = await supabase.auth.getUser()

  const l = params.logistica
  // SPEC-231 D1: com os dados da tela "Nova Separação" a separação já vai para
  // a fila do estoque na Logística ("Solicitado"), igual à criada por lá.
  const dadosLogistica = l
    ? {
        status: 'material_solicitado',
        tipo_pedido: l.tipoPedido,
        codigo_obra: l.codigoObra || params.projetoCodigo,
        cliente: l.cliente || params.clienteNome,
        // SPEC-231 D1/D4: o número da entrega na Logística é o da parcial (ex.: 0002-P2)
        numero_entrega: l.numeroParcial,
        data_entrega: l.dataEntrega,
        data_entrega_original: l.dataEntrega,
        solicitante: l.solicitante || null,
        gestora_equipe: l.gestora,
        delivery_type: l.horario,
        responsavel_recebimento: l.responsavel || null,
        telefone: l.telefone || null,
        endereco: l.endereco || null,
        endereco_entrega: l.endereco || null,
        nivel_complexidade: l.complexidade,
        tipo_entrega: l.formaEntrega,
        observacoes_internas: l.observacoes || null,
        inclui_garantia: l.incluiGarantia,
        garantia_detalhes: l.garantiaDetalhes || null,
        garantia_peca: l.garantiaPeca || null,
        inclui_devolucao: l.incluiDevolucao,
        devolucao_detalhes: l.devolucaoDetalhes || null,
        material_tipo: l.anexos.length > 0 ? 'arquivos' : null,
      }
    : { status: 'Pendente' }

  const { data: separacao, error: separacaoError } = await supabase
    .from('separacoes')
    .insert({
      numero_venda: params.numeroVenda,
      cliente_id: params.clienteId,
      cliente: params.clienteNome,
      codigo_obra: params.projetoCodigo,
      responsavel_id: userData?.user?.id || null,
      observacoes: params.observacoes || null,
      ...dadosLogistica,
    } as any)
    .select('id')
    .single()

  if (separacaoError) throw separacaoError
  const separacaoId = separacao.id as string

  const { error: itensError } = await supabase.from('separacao_itens').insert(
    itensValidos.map((i) => ({
      separacao_id: separacaoId,
      projeto_item_id: i.projetoItemId,
      produto_id: i.produtoId,
      descricao: i.descricao || 'Item sem descrição',
      quantidade: i.quantidade,
    })),
  )
  if (itensError) {
    // separacoes não tem RPC própria para isso (INSERT nela é liberado para
    // qualquer authenticated, sem transação com separacao_itens) — sem esta
    // limpeza, uma falha aqui (ex.: usuário sem papel autorizado) deixa uma
    // linha órfã em "separacoes" com zero itens.
    await supabase.from('separacoes').delete().eq('id', separacaoId)
    throw itensError
  }

  const falhas: string[] = []
  for (const item of itensValidos) {
    const { error: rpcError } = await (supabase as any).rpc('registrar_separacao_setor', {
      p_projeto_item_id: item.projetoItemId,
      p_quantidade: item.quantidade,
      p_separacao_id: separacaoId,
    })
    if (rpcError) falhas.push(`${item.descricao || item.projetoItemId}: ${rpcError.message}`)
  }

  if (falhas.length > 0) {
    throw new Error(
      `Separação ${separacaoId} criada, mas ${falhas.length} item(ns) não puderam mover o saldo de estoque: ${falhas.join('; ')}`,
    )
  }

  if (l && l.anexos.length > 0) await enviarAnexosSeparacao(separacaoId, l.codigoObra, l.anexos)

  return { separacaoId }
}

// SPEC-231 D1: mesmo bucket/tabela da Logística (materiais-separacao +
// separacao_arquivos), para os anexos aparecerem no cartão de lá.
async function enviarAnexosSeparacao(
  separacaoId: string,
  codigoObra: string,
  anexos: DadosNovaSeparacao['anexos'],
): Promise<void> {
  const linhas = []
  for (let i = 0; i < anexos.length; i++) {
    const a = anexos[i]
    const ext = a.file.name.split('.').pop()?.toLowerCase() || 'bin'
    const caminho = `${codigoObra || 'sem-obra'}/${Date.now()}_${i}.${ext}`
    const { error } = await supabase.storage.from('materiais-separacao').upload(caminho, a.file)
    if (error)
      throw new Error(
        `Separação criada, mas não foi possível enviar ${a.file.name}: ${error.message}`,
      )
    linhas.push({
      separacao_id: separacaoId,
      nome_arquivo: a.file.name,
      tipo_arquivo: a.file.type === 'application/pdf' ? 'pdf' : 'imagem',
      url_arquivo: caminho,
      tamanho_bytes: a.file.size,
      ordem: i,
      categoria: a.categoria,
    })
  }
  const { error } = await (supabase as any).from('separacao_arquivos').insert(linhas)
  if (error)
    throw new Error(`Separação criada, mas os anexos não foram registrados: ${error.message}`)
}

// SPEC-089: quando a última separação de uma venda deixa tudo sem saldo em
// reserva (nada mais a separar), envia a separação para o estoque
// ('material_solicitado' desde a SPEC-231 A1; antes era 'Pronto') com a
// data de entrega informada — a RPC cria a linha em `entregas`, sem o
// Matheus ter que reentrar isso na Logística. A RPC reconfere no
// servidor que a venda está mesmo completa antes de mudar o status.
export async function finalizarSeparacaoPronta(
  separacaoId: string,
  dataEntrega: string,
): Promise<void> {
  const { error } = await (supabase as any).rpc('finalizar_separacao_parcial_pronta', {
    p_separacao_id: separacaoId,
    p_data_entrega: dataEntrega,
  })
  if (error) throw error
}

// SPEC-090: estorno de uma separação já registrada — observação
// obrigatória (validada também no servidor), devolve o saldo pra reserva
// e avisa o logístico anotando nas observações da entrega vinculada, se
// existir (sem sistema de notificação novo — decisão do usuário).
// SPEC-099: continua existindo como "reverter tudo" — a RPC agora orquestra
// estornar_item_separacao internamente, item por item.
export async function estornarSeparacaoParcial(
  separacaoId: string,
  observacao: string,
): Promise<void> {
  const { error } = await (supabase as any).rpc('estornar_separacao_parcial', {
    p_separacao_id: separacaoId,
    p_observacao: observacao,
  })
  if (error) throw error
}

// SPEC-099: estorno granular — usuário reportou que reverter uma separação
// com 2 peças (ex.: 1009 e 11461) devolvia as duas juntas mesmo querendo
// desfazer só uma. Lista os itens de uma separação com quanto já foi
// estornado, pra escolher peça + quantidade específica.
export interface ItemParcial {
  id: string
  // SPEC-182 (S1): liga o item da parcial ao item da venda (código, ref., L).
  projetoItemId: string | null
  descricao: string
  quantidade: number
  quantidadeEstornada: number
}

export async function listarItensDaParcial(separacaoId: string): Promise<ItemParcial[]> {
  const { data, error } = await supabase
    .from('separacao_itens')
    .select('id, projeto_item_id, descricao, quantidade, quantidade_estornada')
    .eq('separacao_id', separacaoId)

  if (error) throw error

  return (data || []).map((r: any) => ({
    id: r.id,
    projetoItemId: r.projeto_item_id ?? null,
    descricao: r.descricao,
    quantidade: Number(r.quantidade) || 0,
    quantidadeEstornada: Number(r.quantidade_estornada) || 0,
  }))
}

export async function estornarItemSeparacao(
  separacaoItemId: string,
  quantidade: number,
  observacao: string,
): Promise<void> {
  const { error } = await (supabase as any).rpc('estornar_item_separacao', {
    p_separacao_item_id: separacaoItemId,
    p_quantidade: quantidade,
    p_observacao: observacao,
  })
  if (error) throw error
}

export async function listarParciaisPorVenda(numeroVenda: string): Promise<ParcialHistorico[]> {
  const numero = numeroVenda.trim()
  if (!numero) return []

  // SPEC-090 adicionou alterado_por (também FK pra usuarios) em `separacoes`
  // — com 2 FKs pra usuarios, o embed implícito "usuarios(nome)" fica
  // ambíguo pro PostgREST; precisa apontar explicitamente pra
  // responsavel_id.
  const { data, error } = await supabase
    .from('separacoes')
    .select(
      'id, created_at, status, data_entrega, endereco, endereco_entrega, responsavel_recebimento, telefone, observacoes_internas, responsavel:usuarios!responsavel_id(nome), itens:separacao_itens(id), entrega:entregas_finalizadas(recebido_por, entregue_por, data_entrega_real, observacoes)',
    )
    .eq('numero_venda', numero)
    .order('created_at', { ascending: false })

  if (error) throw error

  return (data || []).map((row: any) => ({
    id: row.id,
    criadoEm: row.created_at,
    responsavelNome: row.responsavel?.nome ?? null,
    status: row.status,
    itens: row.itens?.length || 0,
    dataEntrega: row.data_entrega ?? null,
    endereco: row.endereco_entrega || row.endereco || null,
    responsavelRecebimento: row.responsavel_recebimento ?? null,
    telefone: row.telefone ?? null,
    observacoes: row.observacoes_internas ?? null,
    entrega: (() => {
      const e = Array.isArray(row.entrega) ? row.entrega[0] : row.entrega
      return e
        ? {
            recebidoPor: e.recebido_por ?? null,
            entreguePor: e.entregue_por ?? null,
            dataReal: e.data_entrega_real ?? null,
            observacoes: e.observacoes ?? null,
          }
        : null
    })(),
  }))
}

// SPEC-231 D2: as meninas corrigem endereço/observações de uma parcial já enviada, enquanto não saiu
// para entrega (sem abrir solicitação nova). Mesmos campos que a Logística lê no cartão.
export const STATUS_PARCIAL_EDITAVEL = [
  'Pendente',
  'material_solicitado',
  'Em separação',
  'separado',
  'Pronto',
  'recusado',
]

export async function atualizarDadosEntregaParcial(
  separacaoId: string,
  dados: {
    dataEntrega: string | null
    endereco: string
    responsavelRecebimento: string
    telefone: string
    observacoes: string
  },
): Promise<void> {
  const { data, error } = await supabase
    .from('separacoes')
    .update({
      data_entrega: dados.dataEntrega || null,
      endereco: dados.endereco || null,
      endereco_entrega: dados.endereco || null,
      responsavel_recebimento: dados.responsavelRecebimento || null,
      telefone: dados.telefone || null,
      observacoes_internas: dados.observacoes || null,
    } as any)
    .eq('id', separacaoId)
    .in('status', STATUS_PARCIAL_EDITAVEL as any)
    .select('id')
  if (error) throw error
  if (!data || data.length === 0) {
    throw new Error('Esta parcial já saiu para entrega ou foi estornada — não dá mais para editar.')
  }
}

// SPEC-098: troca de peça em Reserva entre dois projetos (mesmo produto),
// liberada para Projetista/gerente/admin — orquestra o mecanismo já
// existente da SPEC-011 (transferencias_estoque). A regra de quem pode é
// decidida inteiramente no banco (pode_trocar_reserva/
// trocar_reserva_projetista); o frontend só reflete o resultado, não
// duplica a lógica.
export async function podeTrocarReserva(): Promise<boolean> {
  const { data, error } = await (supabase as any).rpc('pode_trocar_reserva')
  if (error) throw error
  return !!data
}

// SPEC-235 B: ajuste Reserva <-> Entrega Futura dentro da MESMA venda — só o Matheus e admin
// (pode_ajustar_reserva_venda). A troca entre vendas diferentes continua em podeTrocarReserva.
export type AjusteReservaAcao = 'reserva_para_entrega_futura' | 'entrega_futura_para_reserva'

export async function podeAjustarReservaVenda(): Promise<boolean> {
  const { data, error } = await (supabase as any).rpc('pode_ajustar_reserva_venda')
  if (error) throw error
  return !!data
}

export async function ajustarReservaVenda(params: {
  projetoItemId: string
  acao: AjusteReservaAcao
  quantidade: number
  motivo: string
}): Promise<void> {
  const { error } = await (supabase as any).rpc('ajustar_reserva_venda', {
    p_projeto_item_id: params.projetoItemId,
    p_acao: params.acao,
    p_quantidade: params.quantidade,
    p_motivo: params.motivo,
  })
  if (error) throw error
}

// SPEC-243 fase 2: "matar" a herança da Connect (só Matheus e administração; a regra de quem pode está no banco).
export type AcaoHeranca =
  | 'entregue_baixa_estoque'
  | 'entregue_estoque_ja_ajustado'
  | 'nao_sera_entregue'
  | 'mantida_confirmada'

export async function podeTratarHerancaConnect(): Promise<boolean> {
  const { data, error } = await (supabase as any).rpc('pode_tratar_heranca_connect')
  if (error) throw error
  return !!data
}

export async function tratarHerancaConnect(params: {
  projetoItemId: string
  acao: AcaoHeranca
  setor: 'reserva' | 'entrega_futura'
  quantidade: number | null
  observacao: string
}): Promise<void> {
  const { error } = await (supabase as any).rpc('tratar_heranca_connect', {
    p_projeto_item_id: params.projetoItemId,
    p_acao: params.acao,
    p_setor: params.setor,
    p_quantidade: params.quantidade,
    p_observacao: params.observacao,
  })
  if (error) throw error
}

// SPEC-243: ligar a um projeto a venda da Connect que entrou sem projeto (qualquer pessoa com acesso à Venda Parcial, só vendas da própria equipe; a regra está no banco).
export interface ProjetoBusca {
  id: string
  codigo: string
  nome: string
  status: string | null
  clienteNome: string | null
}

export async function buscarProjetosParaLigar(texto: string): Promise<ProjetoBusca[]> {
  const t = texto.trim().replace(/[%,()*]/g, ' ').trim()
  if (t.length < 2) return []
  const { data, error } = await (supabase as any)
    .from('projetos')
    .select('id, codigo, nome, status, cliente_id')
    .or(`codigo.ilike.%${t}%,nome.ilike.%${t}%`)
    .order('codigo')
    .limit(20)
  if (error) throw error
  const linhas = (data || []) as any[]
  const clienteIds = [...new Set(linhas.map((l) => l.cliente_id).filter(Boolean))] as string[]
  const nomes = new Map<string, string>()
  if (clienteIds.length > 0) {
    const { data: cs } = await supabase.from('contatos').select('id, nome').in('id', clienteIds)
    ;(cs || []).forEach((c: any) => nomes.set(c.id, c.nome))
  }
  return linhas.map((l) => ({
    id: l.id,
    codigo: l.codigo,
    nome: l.nome,
    status: l.status ?? null,
    clienteNome: l.cliente_id ? (nomes.get(l.cliente_id) ?? null) : null,
  }))
}

export interface ResultadoLigarProjeto {
  ligado: boolean
  clienteDiferente: boolean
  clienteVenda: string | null
  clienteProjeto: string | null
  projeto: string | null
}

export async function ligarProjetoConnect(params: {
  orcamentoId: string
  projetoId: string
  observacao: string
  confirmarClienteDiferente: boolean
}): Promise<ResultadoLigarProjeto> {
  const { data, error } = await (supabase as any).rpc('ligar_projeto_connect', {
    p_orcamento_id: params.orcamentoId,
    p_projeto_id: params.projetoId,
    p_observacao: params.observacao,
    p_confirmar_cliente_diferente: params.confirmarClienteDiferente,
  })
  if (error) throw error
  return {
    ligado: !!data?.ligado,
    clienteDiferente: !!data?.cliente_diferente,
    clienteVenda: data?.cliente_venda ?? null,
    clienteProjeto: data?.cliente_projeto ?? null,
    projeto: data?.projeto ?? null,
  }
}

export interface TratamentoHeranca {
  id: string
  projetoItemId: string | null
  acao: string
  setor: string | null
  quantidade: number | null
  observacao: string
  criadoEm: string
  usuarioNome: string | null
}

// Log do que já foi tratado nesta venda (quem, quando, por quê). Lê em blocos para não estourar o tamanho da URL.
export async function listarTratamentosHeranca(
  projetoItemIds: string[],
): Promise<TratamentoHeranca[]> {
  const linhas: any[] = []
  for (let i = 0; i < projetoItemIds.length; i += 50) {
    const { data, error } = await (supabase as any)
      .from('connect_reserva_tratamento')
      .select('id, projeto_item_id, acao, setor, quantidade, observacao, criado_em, usuario_id')
      .in('projeto_item_id', projetoItemIds.slice(i, i + 50))
      .order('criado_em', { ascending: false })
    if (error) throw error
    linhas.push(...(data || []))
  }
  if (linhas.length === 0) return []
  const usuarioIds = [...new Set(linhas.map((l) => l.usuario_id).filter(Boolean))] as string[]
  const { data: usuarios } = await supabase.from('usuarios').select('id, nome').in('id', usuarioIds)
  const nomes = new Map((usuarios || []).map((u: any) => [u.id, u.nome]))
  return linhas
    .sort((a, b) => String(b.criado_em).localeCompare(String(a.criado_em)))
    .map((l) => ({
      id: l.id,
      projetoItemId: l.projeto_item_id,
      acao: l.acao,
      setor: l.setor,
      quantidade: l.quantidade == null ? null : Number(l.quantidade),
      observacao: l.observacao,
      criadoEm: l.criado_em,
      usuarioNome: nomes.get(l.usuario_id) ?? null,
    }))
}

// SPEC-098: mesma informação do card de peça do Cadastro Lucenera (SPEC-049)
// — "Reservado por Cliente/Projeto" — lendo a mesma view já em produção
// (vw_cadastro_produto_reserva_detalhe), filtrada por produto e excluindo o
// próprio item de origem. Serve tanto de painel informativo quanto de lista
// de destino no modal de troca.
export interface ReservaOutroProjeto {
  projetoItemId: string
  // SPEC-222 E1: a troca também vale entre L da MESMA venda (tira do L que não sai agora para o que precisa
  // ser entregue) — por isso a lista mostra o L e marca os da própria venda.
  orcamentoId: string | null
  lFixo: string | null
  projetoCodigo: string | null
  orcamentoNumero: string | null
  clienteNome: string | null
  equipeNome: string | null
  qVenda: number
  qReserva: number
  qEntregaFutura: number
}

export async function getReservasOutrosProjetos(
  produtoId: string,
  excluirProjetoItemId: string,
): Promise<ReservaOutroProjeto[]> {
  const { data, error } = await (supabase.from as any)('vw_cadastro_produto_reserva_detalhe')
    .select('*')
    .eq('produto_id', produtoId)
    .neq('projeto_item_id', excluirProjetoItemId)
    .gt('q_reserva', 0)

  if (error) throw error

  const ids = (data || []).map((r: any) => r.projeto_item_id)
  const lPorItem = new Map<string, string | null>()
  if (ids.length > 0) {
    const { data: ls } = await (supabase.from as any)('projeto_itens')
      .select('id, l_fixo')
      .in('id', ids)
    for (const l of ls || []) lPorItem.set(l.id, l.l_fixo ?? null)
  }

  return (data || []).map((r: any) => ({
    projetoItemId: r.projeto_item_id,
    orcamentoId: r.orcamento_id ?? null,
    lFixo: lPorItem.get(r.projeto_item_id) ?? null,
    projetoCodigo: r.projeto_codigo,
    orcamentoNumero: r.orcamento_numero,
    clienteNome: r.cliente_nome,
    equipeNome: r.equipe_nome,
    qVenda: Number(r.q_venda) || 0,
    qReserva: Number(r.q_reserva) || 0,
    qEntregaFutura: Number(r.q_entrega_futura) || 0,
  }))
}

export async function trocarReserva(params: {
  origemProjetoItemId: string
  destinoProjetoItemId: string
  quantidade: number
  motivo?: string
}): Promise<void> {
  const { error } = await (supabase as any).rpc('trocar_reserva_projetista', {
    p_origem_projeto_item_id: params.origemProjetoItemId,
    p_destino_projeto_item_id: params.destinoProjetoItemId,
    p_quantidade: params.quantidade,
    p_motivo: params.motivo || null,
  })
  if (error) throw error
}

export interface LogTroca {
  id: string
  quantidade: number
  motivo: string | null
  solicitadoEm: string
  solicitanteNome: string | null
  aprovadorNome: string | null
  produtoCodigo: number | string | null
  produtoDescricao: string | null
  origemProjetoCodigo: string | null
  origemClienteNome: string | null
  destinoProjetoCodigo: string | null
  destinoClienteNome: string | null
}

// SPEC-098: "Log de Trocas" — transferencias_estoque já tem tudo (quem
// solicitou/aprovou, quantidade, motivo, data); só falta um jeito fácil de
// ver isso na tela, sem precisar abrir o banco. solicitado_por/aprovado_por
// apontam pra auth.users (não pra public.usuarios diretamente), por isso a
// busca de nome é uma query separada, mesmo padrão já usado neste arquivo
// para nomes de cliente.

export async function listarLogTrocas(): Promise<LogTroca[]> {
  const { data: transf, error } = await supabase
    .from('transferencias_estoque')
    .select(
      'id, origem_projeto_item_id, destino_projeto_item_id, quantidade, motivo, solicitado_em, solicitado_por, aprovado_por',
    )
    .eq('status', 'aprovada')
    .order('solicitado_em', { ascending: false })

  if (error) throw error
  if (!transf || transf.length === 0) return []

  const projetoItemIds = [
    ...new Set(transf.flatMap((t: any) => [t.origem_projeto_item_id, t.destino_projeto_item_id])),
  ]
  const usuarioIds = [
    ...new Set(transf.flatMap((t: any) => [t.solicitado_por, t.aprovado_por]).filter(Boolean)),
  ] as string[]

  const [{ data: itensRows, error: itensError }, { data: usuarioRows, error: usuarioError }] =
    await Promise.all([
      supabase
        .from('vw_estoque_saldos_projeto_item')
        .select('projeto_item_id, produto, produto_codigo, projeto_codigo, cliente_id')
        .in('projeto_item_id', projetoItemIds),
      usuarioIds.length > 0
        ? supabase.from('usuarios').select('id, nome').in('id', usuarioIds)
        : Promise.resolve({ data: [] as any[], error: null }),
    ])
  if (itensError) throw itensError
  if (usuarioError) throw usuarioError

  const clienteIds = [
    ...new Set((itensRows || []).map((r: any) => r.cliente_id).filter(Boolean)),
  ] as string[]
  const { data: clienteRows, error: clienteError } =
    clienteIds.length > 0
      ? await supabase.from('contatos').select('id, nome').in('id', clienteIds)
      : { data: [] as any[], error: null }
  if (clienteError) throw clienteError

  const clienteMap = new Map((clienteRows || []).map((c: any) => [c.id, c.nome]))
  const itemMap = new Map((itensRows || []).map((r: any) => [r.projeto_item_id, r]))
  const usuarioMap = new Map((usuarioRows || []).map((u: any) => [u.id, u.nome]))

  return transf.map((t: any) => {
    const origem = itemMap.get(t.origem_projeto_item_id)
    const destino = itemMap.get(t.destino_projeto_item_id)
    return {
      id: t.id,
      quantidade: Number(t.quantidade) || 0,
      motivo: t.motivo,
      solicitadoEm: t.solicitado_em,
      solicitanteNome: t.solicitado_por ? (usuarioMap.get(t.solicitado_por) ?? null) : null,
      aprovadorNome: t.aprovado_por ? (usuarioMap.get(t.aprovado_por) ?? null) : null,
      produtoCodigo: origem?.produto_codigo ?? destino?.produto_codigo ?? null,
      produtoDescricao: origem?.produto ?? destino?.produto ?? null,
      origemProjetoCodigo: origem?.projeto_codigo ?? null,
      origemClienteNome: origem?.cliente_id ? (clienteMap.get(origem.cliente_id) ?? null) : null,
      destinoProjetoCodigo: destino?.projeto_codigo ?? null,
      destinoClienteNome: destino?.cliente_id ? (clienteMap.get(destino.cliente_id) ?? null) : null,
    }
  })
}
