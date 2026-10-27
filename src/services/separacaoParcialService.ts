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
}

export interface VendaInfo {
  orcamentoId: string | null
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
}

// SPEC-072: a busca original exigia o usuário já saber o número exato da
// venda, sem nenhuma forma de descobrir quais existem — lista as vendas que
// de fato têm saldo operacional (aprovadas e com projeto_itens), pra virar
// um seletor de busca em vez de um campo de texto cego.
export async function listarVendasDisponiveis(): Promise<VendaDisponivel[]> {
  const { data, error } = await supabase
    .from('vw_estoque_saldos_projeto_item')
    .select('orcamento_id, orcamento_numero, venda_numero, cliente_id, projeto_codigo')
    .eq('status_operacional', 'ativo')

  if (error) throw error
  if (!data || data.length === 0) return []

  const porVenda = new Map<
    string,
    {
      orcamento_id: string
      venda_numero: string | null
      cliente_id: string | null
      projeto_codigo: string | null
    }
  >()
  data.forEach((r: any) => {
    if (!porVenda.has(r.orcamento_numero)) {
      porVenda.set(r.orcamento_numero, {
        orcamento_id: r.orcamento_id,
        venda_numero: r.venda_numero,
        cliente_id: r.cliente_id,
        projeto_codigo: r.projeto_codigo,
      })
    }
  })

  const clienteIds = [
    ...new Set([...porVenda.values()].map((v) => v.cliente_id).filter(Boolean)),
  ] as string[]
  const { data: clientes, error: clienteError } =
    clienteIds.length > 0
      ? await supabase.from('contatos').select('id, nome, razao_social').in('id', clienteIds)
      : { data: [] as any[], error: null }
  if (clienteError) throw clienteError

  const clienteMap = new Map((clientes || []).map((c: any) => [c.id, c]))

  // SPEC-176: empresa da venda, data da venda (aprovação do cliente; se
  // vazia, emissão do orçamento) e previsão de entrega.
  const orcamentoIds = [...new Set([...porVenda.values()].map((v) => v.orcamento_id))]
  const { data: orcamentos, error: orcamentoError } = await supabase
    .from('orcamentos')
    .select('id, aprovado_cliente_em, data_emissao, previsao_entrega, empresa:empresas(nome)')
    .in('id', orcamentoIds)
  if (orcamentoError) throw orcamentoError

  const orcamentoMap = new Map((orcamentos || []).map((o: any) => [o.id, o]))

  return Array.from(porVenda.entries())
    .map(([numero, v]) => {
      const cliente = v.cliente_id ? clienteMap.get(v.cliente_id) : null
      const orcamento: any = orcamentoMap.get(v.orcamento_id)
      const clienteNome = cliente
        ? cliente.razao_social?.trim() && cliente.razao_social !== cliente.nome
          ? `${cliente.razao_social} - ${cliente.nome}`
          : cliente.nome
        : null
      return {
        orcamentoId: v.orcamento_id,
        orcamentoNumero: numero,
        vendaNumero: v.venda_numero,
        clienteNome,
        projetoCodigo: v.projeto_codigo,
        empresaNome: orcamento?.empresa?.nome ?? null,
        dataVenda: orcamento?.aprovado_cliente_em || orcamento?.data_emissao || null,
        previsaoEntrega: orcamento?.previsao_entrega ?? null,
      }
    })
    .sort((a, b) => a.orcamentoNumero.localeCompare(b.orcamentoNumero))
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
      ? supabase.from('produtos').select('id, referencia').in('id', produtoIds)
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
          .select('data_emissao, empresa:empresas(nome), vendedor:funcionarios(nome), equipe:equipes_projetos(equipes)')
          .eq('id', saldoRows[0].orcamento_id)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
  ])

  if (piError) throw piError
  if (produtoError) throw produtoError
  if (clienteError) throw clienteError
  if (orcamentoError) throw orcamentoError

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
    if (error) throw new Error(`Separação criada, mas não foi possível enviar ${a.file.name}: ${error.message}`)
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
  if (error) throw new Error(`Separação criada, mas os anexos não foram registrados: ${error.message}`)
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
export const STATUS_PARCIAL_EDITAVEL = ['Pendente', 'material_solicitado', 'Em separação', 'separado', 'Pronto', 'recusado']

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
    const { data: ls } = await (supabase.from as any)('projeto_itens').select('id, l_fixo').in('id', ids)
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
