import { useState, useMemo, useEffect } from 'react'
import {
  Loader2,
  Scissors,
  LogOut,
  History,
  Receipt,
  ArrowLeft,
  Search,
  Building2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
  listarParciaisPorVenda,
  listarVendasDisponiveis,
  buscarBoletosPorOrcamento,
  type VendaInfo,
  type ParcialHistorico,
  type VendaDisponivel,
  type BoletoResumo,
} from '@/services/separacaoParcialService'

const LOGO_URL =
  'https://vcvcwzmbiftcawncibke.supabase.co/storage/v1/object/public/Logo/lucenera-vertical.png'

const fmtData = (iso: string) =>
  new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })

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
  const [boletos, setBoletos] = useState<BoletoResumo[]>([])
  // SPEC-072: quantidade digitada na coluna "À Separar", por projeto_item_id
  // — zerada a cada "Separar" bem-sucedido.
  const [quantidades, setQuantidades] = useState<Record<string, string>>({})

  // SPEC-072: antes disso o campo "Venda" era texto livre sem nenhuma forma
  // de descobrir quais números existem — carrega as vendas com saldo
  // operacional (aprovadas e com projeto_itens) pra virar uma lista visível
  // (usuário reportou que o seletor escondido atrás de um clique atrapalhava).
  useEffect(() => {
    listarVendasDisponiveis()
      .then(setVendasDisponiveis)
      .catch((err) => toast.error('Erro ao carregar lista de vendas', { description: err?.message }))
      .finally(() => setCarregandoVendas(false))
  }, [])

  const vendasFiltradas = useMemo(() => {
    const termo = filtro.trim().toLowerCase()
    if (!termo) return vendasDisponiveis
    return vendasDisponiveis.filter(
      (v) =>
        v.orcamentoNumero.toLowerCase().includes(termo) ||
        (v.clienteNome || '').toLowerCase().includes(termo) ||
        (v.projetoCodigo || '').toLowerCase().includes(termo),
    )
  }, [vendasDisponiveis, filtro])

  const handleLocalizar = async (numero: string) => {
    setNumeroVenda(numero)
    setLoading(true)
    setVenda(null)
    setParciais([])
    setBoletos([])
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
      if (vendaInfo.orcamentoId) {
        buscarBoletosPorOrcamento(vendaInfo.orcamentoId)
          .then(setBoletos)
          .catch((err) => toast.error('Erro ao buscar boletos', { description: err?.message }))
      }
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
    setBoletos([])
    setQuantidades({})
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
      await criarSeparacaoParcial({
        numeroVenda: venda.orcamentoNumero,
        clienteId: venda.clienteId,
        clienteNome: venda.clienteNome,
        projetoCodigo: venda.projetoCodigo,
        itens,
      })
      toast.success('Separação parcial registrada com sucesso.')
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

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      <header className="sticky top-0 z-10 bg-card border-b px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img src={LOGO_URL} alt="Lucenera" className="h-8 w-auto object-contain" />
          <div className="h-6 w-px bg-border hidden sm:block" />
          <h1 className="font-bold text-lg hidden sm:block">Separação Parcial</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground hidden sm:inline">{user?.email}</span>
          <Button variant="ghost" size="icon" asChild title="Voltar para a Central Lucenera">
            <a href="https://central-lucenera.goskip.app/">
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
                      <TableHead>Venda</TableHead>
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
                        <TableCell className="font-semibold text-primary text-sm">
                          {v.orcamentoNumero}
                        </TableCell>
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
                <span className="text-muted-foreground">Venda: </span>
                <span className="font-medium">{venda.orcamentoNumero}</span>
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
                      <TableHead>Referência</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Classificação</TableHead>
                      <TableHead className="text-right">Q. Dev.</TableHead>
                      <TableHead className="text-right">Q. Venda</TableHead>
                      <TableHead className="text-right">E. Futura</TableHead>
                      <TableHead className="text-right">Transferido</TableHead>
                      <TableHead className="text-right">Reserva</TableHead>
                      <TableHead className="text-right bg-primary/5">À Separar</TableHead>
                      <TableHead className="text-right">Ag. Separar</TableHead>
                      <TableHead className="text-right">Separado</TableHead>
                      <TableHead className="text-right">Entregue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {venda.itens.map((item) => (
                      <TableRow key={item.projeto_item_id}>
                        <TableCell className="font-mono text-primary text-sm">
                          {item.codigo ?? '-'}
                        </TableCell>
                        <TableCell className="text-sm">{item.referencia || '-'}</TableCell>
                        <TableCell
                          className="text-sm max-w-[240px] truncate"
                          title={item.descricao || ''}
                        >
                          {item.descricao || '-'}
                        </TableCell>
                        <TableCell className="text-sm">{item.classificacao || '-'}</TableCell>
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
                        </TableCell>
                        <TableCell className="text-right text-sm">{item.q_ag_separar}</TableCell>
                        <TableCell className="text-right text-sm">{item.q_separado}</TableCell>
                        <TableCell className="text-right text-sm">{item.q_entregue}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="p-4 border-t flex justify-end">
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-card border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <History className="w-4 h-4 text-muted-foreground" />
                  <h2 className="font-semibold text-sm">Parciais desta venda</h2>
                </div>
                {parciais.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">
                    Nenhuma separação parcial registrada ainda para esta venda.
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Parcial</TableHead>
                        <TableHead>Funcionário</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Itens</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {parciais.map((p) => (
                        <TableRow key={p.id}>
                          <TableCell className="font-mono text-xs">
                            {p.id.split('-')[0].toUpperCase()}
                          </TableCell>
                          <TableCell className="text-sm">{p.responsavelNome || '-'}</TableCell>
                          <TableCell className="text-sm">{fmtData(p.criadoEm)}</TableCell>
                          <TableCell className="text-sm">{p.itens}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{p.status}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>

              <div className="bg-card border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Receipt className="w-4 h-4 text-muted-foreground" />
                  <h2 className="font-semibold text-sm">Boletos desta venda</h2>
                </div>
                {boletos.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">
                    Nenhum boleto encontrado para esta venda.
                  </p>
                ) : (
                  <>
                    {/* SPEC-072: Separação Parcial não é tela financeira —
                        usuário pediu explicitamente pra tirar valor e
                        vencimento, só número do boleto e quantas parcelas
                        ainda faltam finalizar. */}
                    <p className="text-sm text-muted-foreground mb-3">
                      {boletos.filter((b) => !b.finalizado).length} de {boletos.length} parcela(s)
                      pendente(s)
                    </p>
                    <ul className="space-y-1.5">
                      {boletos.map((b) => (
                        <li
                          key={b.id}
                          className="flex items-center justify-between text-sm py-1.5 px-2 rounded-md bg-muted/40"
                        >
                          <span className="font-mono">{b.nossoNumero}</span>
                          <Badge variant={b.finalizado ? 'outline' : 'secondary'}>
                            {b.finalizado ? 'Finalizado' : `Parcela ${b.numParcela}/${b.totalParcelas}`}
                          </Badge>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
