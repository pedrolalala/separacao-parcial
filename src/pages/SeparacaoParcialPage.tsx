import { useState, useEffect } from 'react'
import { Loader2, PackageSearch, Scissors, LogOut, History, Receipt } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SearchableSelect } from '@/components/ui/searchable-select'
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

const fmtData = (iso: string) =>
  new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })

const fmtDataCurta = (iso: string | null) =>
  iso ? new Date(`${iso}T00:00:00`).toLocaleDateString('pt-BR') : '-'

const fmtMoeda = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)

export default function SeparacaoParcialPage() {
  const { user, signOut } = useAuth()
  const [vendasDisponiveis, setVendasDisponiveis] = useState<VendaDisponivel[]>([])
  const [carregandoVendas, setCarregandoVendas] = useState(true)
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
  // operacional (aprovadas e com projeto_itens) pra virar um seletor de
  // busca de verdade.
  useEffect(() => {
    listarVendasDisponiveis()
      .then(setVendasDisponiveis)
      .catch((err) => toast.error('Erro ao carregar lista de vendas', { description: err?.message }))
      .finally(() => setCarregandoVendas(false))
  }, [])

  const handleLocalizar = async (numero?: string) => {
    const alvo = (numero ?? numeroVenda).trim()
    if (!alvo) {
      toast.error('Selecione a venda.')
      return
    }
    setLoading(true)
    setVenda(null)
    setParciais([])
    setBoletos([])
    setQuantidades({})
    try {
      const [vendaInfo, historico] = await Promise.all([
        buscarVendaPorNumero(alvo),
        listarParciaisPorVenda(alvo),
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
        <div className="flex items-center gap-2">
          <PackageSearch className="w-5 h-5 text-primary" />
          <h1 className="font-bold text-lg">Separação Parcial</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground hidden sm:inline">{user?.email}</span>
          <Button variant="ghost" size="icon" onClick={() => signOut()} title="Sair">
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </header>

      <main className="flex-1 p-4 sm:p-6 flex flex-col gap-4 max-w-[1400px] w-full mx-auto">
        <div className="bg-card border rounded-xl p-4 flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[280px]">
            <label className="text-xs font-semibold uppercase text-muted-foreground">Venda</label>
            <div className="mt-1">
              <SearchableSelect
                options={vendasDisponiveis.map((v) => ({
                  value: v.orcamentoNumero,
                  label: `${v.orcamentoNumero} — ${v.clienteNome || 'Cliente não identificado'}`,
                  searchTerms: [v.orcamentoNumero, v.clienteNome || '', v.projetoCodigo || ''],
                }))}
                value={numeroVenda}
                onChange={(v) => {
                  setNumeroVenda(v)
                  if (v) handleLocalizar(v)
                }}
                placeholder={
                  carregandoVendas ? 'Carregando vendas...' : 'Selecione a venda/orçamento...'
                }
                searchPlaceholder="Buscar por número ou cliente..."
                emptyText={
                  carregandoVendas
                    ? 'Carregando...'
                    : 'Nenhuma venda aprovada com saldo encontrada.'
                }
                disabled={carregandoVendas}
              />
            </div>
          </div>
          {loading && <Loader2 className="w-5 h-5 animate-spin text-primary shrink-0 mb-2" />}
          {venda && (
            <div className="flex-1 min-w-[240px] flex flex-wrap gap-x-6 gap-y-1 text-sm">
              <div>
                <span className="text-muted-foreground">Cliente: </span>
                <span className="font-medium">{venda.clienteNome || '-'}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Projeto: </span>
                <span className="font-medium">{venda.projetoCodigo || '-'}</span>
              </div>
            </div>
          )}
        </div>

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
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Parcela</TableHead>
                        <TableHead>Vencimento</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {boletos.map((b) => (
                        <TableRow key={b.id}>
                          <TableCell className="text-sm">
                            {b.numParcela}/{b.totalParcelas}
                          </TableCell>
                          <TableCell className="text-sm">{fmtDataCurta(b.vencimento)}</TableCell>
                          <TableCell className="text-right text-sm font-medium">
                            {fmtMoeda(b.valor)}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{b.status}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </div>
          </>
        )}

        {!venda && !loading && (
          <div className="flex-1 flex items-center justify-center text-center text-muted-foreground py-20">
            <div>
              <PackageSearch className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p>Selecione a venda acima para começar.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
