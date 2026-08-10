import { supabase } from '@/lib/supabase/client'

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
  orcamentoNumero: string
  clienteId: string | null
  clienteNome: string | null
  projetoCodigo: string | null
  itens: ItemVenda[]
}

export interface ParcialHistorico {
  id: string
  criadoEm: string
  responsavelNome: string | null
  status: string
  itens: number
}

// SPEC-072: busca cruza só a venda informada (orcamento_numero) — diferente
// da busca de venda de origem da SPEC-071 (devolução), que cruza todos os
// projetos do cliente. Aqui o usuário já sabe o número da venda (replica a
// tela antiga do Connect, campo "Venda").
export async function buscarVendaPorNumero(numeroVenda: string): Promise<VendaInfo | null> {
  const numero = numeroVenda.trim()
  if (!numero) return null

  const { data: saldoRows, error: saldoError } = await supabase
    .from('vw_estoque_saldos_projeto_item')
    .select(
      'projeto_item_id, produto_id, cliente_id, produto, produto_codigo, projeto_codigo, orcamento_numero, q_venda, q_reserva, q_entrega_futura, q_ag_separar, q_separado, q_entregue, q_devolvida, q_transferida_saida, status_operacional',
    )
    .eq('orcamento_numero', numero)
    .eq('status_operacional', 'ativo')

  if (saldoError) throw saldoError
  if (!saldoRows || saldoRows.length === 0) return null

  const projetoItemIds = saldoRows.map((r: any) => r.projeto_item_id)
  const produtoIds = saldoRows.map((r: any) => r.produto_id).filter(Boolean)

  // referencia mora em produtos, não em projeto_itens (só l_fixo/classificação
  // mora lá) — vw_estoque_saldos_projeto_item não expõe nenhum dos dois.
  const [
    { data: piRows, error: piError },
    { data: produtoRows, error: produtoError },
    { data: clienteRow, error: clienteError },
  ] = await Promise.all([
    supabase.from('projeto_itens').select('id, l_fixo').in('id', projetoItemIds),
    produtoIds.length > 0
      ? supabase.from('produtos').select('id, referencia').in('id', produtoIds)
      : Promise.resolve({ data: [], error: null }),
    saldoRows[0].cliente_id
      ? supabase
          .from('contatos')
          .select('id, nome, razao_social')
          .eq('id', saldoRows[0].cliente_id)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
  ])

  if (piError) throw piError
  if (produtoError) throw produtoError
  if (clienteError) throw clienteError

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
    orcamentoNumero: numero,
    clienteId: saldoRows[0].cliente_id,
    clienteNome,
    projetoCodigo: saldoRows[0].projeto_codigo,
    itens,
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
}): Promise<{ separacaoId: string }> {
  const itensValidos = params.itens.filter((i) => i.quantidade > 0)
  if (itensValidos.length === 0) {
    throw new Error('Informe a quantidade a separar em pelo menos um item.')
  }

  const { data: userData } = await supabase.auth.getUser()

  const { data: separacao, error: separacaoError } = await supabase
    .from('separacoes')
    .insert({
      numero_venda: params.numeroVenda,
      cliente_id: params.clienteId,
      cliente: params.clienteNome,
      codigo_obra: params.projetoCodigo,
      responsavel_id: userData?.user?.id || null,
      status: 'Pendente',
      observacoes: params.observacoes || null,
    })
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

  return { separacaoId }
}

export async function listarParciaisPorVenda(numeroVenda: string): Promise<ParcialHistorico[]> {
  const numero = numeroVenda.trim()
  if (!numero) return []

  const { data, error } = await supabase
    .from('separacoes')
    .select('id, created_at, status, responsavel:usuarios(nome), itens:separacao_itens(id)')
    .eq('numero_venda', numero)
    .order('created_at', { ascending: false })

  if (error) throw error

  return (data || []).map((row: any) => ({
    id: row.id,
    criadoEm: row.created_at,
    responsavelNome: row.responsavel?.nome ?? null,
    status: row.status,
    itens: row.itens?.length || 0,
  }))
}
