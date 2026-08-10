// AVOID UPDATING THIS FILE DIRECTLY. It is automatically generated.
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      auditoria_permissoes: {
        Row: {
          antes: Json | null
          autor_id: string | null
          criado_em: string | null
          depois: Json | null
          entidade: string
          entidade_id: string | null
          id: string
        }
        Insert: {
          antes?: Json | null
          autor_id?: string | null
          criado_em?: string | null
          depois?: Json | null
          entidade: string
          entidade_id?: string | null
          id?: string
        }
        Update: {
          antes?: Json | null
          autor_id?: string | null
          criado_em?: string | null
          depois?: Json | null
          entidade?: string
          entidade_id?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "auditoria_permissoes_autor_id_fkey"
            columns: ["autor_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "auditoria_permissoes_autor_id_fkey"
            columns: ["autor_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_por_responsavel"
            referencedColumns: ["usuario_id"]
          },
        ]
      }
      boletos: {
        Row: {
          comprovante_url: string | null
          data_pagamento: string | null
          emissao: string | null
          empresa_id: string | null
          fatura: string | null
          id: string
          nome_pagador: string | null
          nosso_numero: string
          num_parcela: number | null
          numero_documento: string | null
          orcamento_id: string | null
          parcela_id: string | null
          perfil: string | null
          status: string
          tipo: string | null
          tipo_operacao: string | null
          total_parcelas: number | null
          valor: number | null
          valor_pago: number | null
          vencimento: string | null
          venda: string | null
        }
        Insert: {
          comprovante_url?: string | null
          data_pagamento?: string | null
          emissao?: string | null
          empresa_id?: string | null
          fatura?: string | null
          id?: string
          nome_pagador?: string | null
          nosso_numero: string
          num_parcela?: number | null
          numero_documento?: string | null
          orcamento_id?: string | null
          parcela_id?: string | null
          perfil?: string | null
          status?: string
          tipo?: string | null
          tipo_operacao?: string | null
          total_parcelas?: number | null
          valor?: number | null
          valor_pago?: number | null
          vencimento?: string | null
          venda?: string | null
        }
        Update: {
          comprovante_url?: string | null
          data_pagamento?: string | null
          emissao?: string | null
          empresa_id?: string | null
          fatura?: string | null
          id?: string
          nome_pagador?: string | null
          nosso_numero?: string
          num_parcela?: number | null
          numero_documento?: string | null
          orcamento_id?: string | null
          parcela_id?: string | null
          perfil?: string | null
          status?: string
          tipo?: string | null
          tipo_operacao?: string | null
          total_parcelas?: number | null
          valor?: number | null
          valor_pago?: number | null
          vencimento?: string | null
          venda?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "boletos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "boletos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_fornecedores_remessas"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "boletos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_fornecedores_resumo"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "boletos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_remessas_completa"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "boletos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_remessas_resumo_status"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "boletos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "boletos_orcamento_id_fkey"
            columns: ["orcamento_id"]
            isOneToOne: false
            referencedRelation: "orcamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "boletos_orcamento_id_fkey"
            columns: ["orcamento_id"]
            isOneToOne: false
            referencedRelation: "vw_orcamentos_aprovacao_financeira_auditoria"
            referencedColumns: ["orcamento_id"]
          },
          {
            foreignKeyName: "boletos_orcamento_id_fkey"
            columns: ["orcamento_id"]
            isOneToOne: false
            referencedRelation: "vw_orcamentos_prazo_entrega"
            referencedColumns: ["orcamento_id"]
          },
          {
            foreignKeyName: "boletos_parcela_id_fkey"
            columns: ["parcela_id"]
            isOneToOne: false
            referencedRelation: "projeto_parcelas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "boletos_parcela_id_fkey"
            columns: ["parcela_id"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["parcela_crm_id"]
          },
        ]
      }
      categorias_financeiras: {
        Row: {
          ativo: boolean
          created_at: string
          grupo: string
          icone: string | null
          id: string
          nome: string
          tipo: Database["public"]["Enums"]["transacao_tipo"]
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          grupo: string
          icone?: string | null
          id?: string
          nome: string
          tipo: Database["public"]["Enums"]["transacao_tipo"]
        }
        Update: {
          ativo?: boolean
          created_at?: string
          grupo?: string
          icone?: string | null
          id?: string
          nome?: string
          tipo?: Database["public"]["Enums"]["transacao_tipo"]
        }
        Relationships: []
      }
      categorias_produto: {
        Row: {
          ativo: boolean
          codigo_connect: number
          created_at: string
          id: string
          nome: string
        }
        Insert: {
          ativo?: boolean
          codigo_connect: number
          created_at?: string
          id?: string
          nome: string
        }
        Update: {
          ativo?: boolean
          codigo_connect?: number
          created_at?: string
          id?: string
          nome?: string
        }
        Relationships: []
      }
      contas_bancarias: {
        Row: {
          agencia: string | null
          banco: string | null
          codigo_connect: number | null
          conta: string | null
          created_at: string
          empresa_id: string | null
          id: string
          nome: string
          nome_connect: string | null
          saldo: number
          status: string
          tipo: Database["public"]["Enums"]["conta_tipo"]
          updated_at: string
        }
        Insert: {
          agencia?: string | null
          banco?: string | null
          codigo_connect?: number | null
          conta?: string | null
          created_at?: string
          empresa_id?: string | null
          id?: string
          nome: string
          nome_connect?: string | null
          saldo?: number
          status?: string
          tipo: Database["public"]["Enums"]["conta_tipo"]
          updated_at?: string
        }
        Update: {
          agencia?: string | null
          banco?: string | null
          codigo_connect?: number | null
          conta?: string | null
          created_at?: string
          empresa_id?: string | null
          id?: string
          nome?: string
          nome_connect?: string | null
          saldo?: number
          status?: string
          tipo?: Database["public"]["Enums"]["conta_tipo"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contas_bancarias_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contas_bancarias_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_fornecedores_remessas"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "contas_bancarias_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_fornecedores_resumo"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "contas_bancarias_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_remessas_completa"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "contas_bancarias_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_remessas_resumo_status"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "contas_bancarias_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["empresa_id"]
          },
        ]
      }
      contato_origens: {
        Row: {
          codigo_legado: number
          contato_id: string
          id: string
          origem: string
        }
        Insert: {
          codigo_legado: number
          contato_id: string
          id?: string
          origem: string
        }
        Update: {
          codigo_legado?: number
          contato_id?: string
          id?: string
          origem?: string
        }
        Relationships: [
          {
            foreignKeyName: "contato_origens_contato_id_fkey"
            columns: ["contato_id"]
            isOneToOne: false
            referencedRelation: "contatos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contato_origens_contato_id_fkey"
            columns: ["contato_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra"
            referencedColumns: ["fornecedor_id"]
          },
          {
            foreignKeyName: "contato_origens_contato_id_fkey"
            columns: ["contato_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra_item_orcamento"
            referencedColumns: ["fornecedor_id"]
          },
          {
            foreignKeyName: "contato_origens_contato_id_fkey"
            columns: ["contato_id"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["contato_id"]
          },
        ]
      }
      contato_tipos: {
        Row: {
          contato_id: string
          tipo: string
        }
        Insert: {
          contato_id: string
          tipo: string
        }
        Update: {
          contato_id?: string
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "contato_tipos_contato_id_fkey"
            columns: ["contato_id"]
            isOneToOne: false
            referencedRelation: "contatos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contato_tipos_contato_id_fkey"
            columns: ["contato_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra"
            referencedColumns: ["fornecedor_id"]
          },
          {
            foreignKeyName: "contato_tipos_contato_id_fkey"
            columns: ["contato_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra_item_orcamento"
            referencedColumns: ["fornecedor_id"]
          },
          {
            foreignKeyName: "contato_tipos_contato_id_fkey"
            columns: ["contato_id"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["contato_id"]
          },
        ]
      }
      contatos: {
        Row: {
          ativo: boolean | null
          bairro: string | null
          bairro_cobranca: string | null
          bairro_comercial: string | null
          bairro_entrega: string | null
          canonical_id: string | null
          celular: string | null
          cep: string | null
          cep_cobranca: string | null
          cep_comercial: string | null
          cep_entrega: string | null
          cidade: string | null
          cidade_cobranca: string | null
          cidade_comercial: string | null
          cidade_entrega: string | null
          cnpj: string | null
          codigo_legado: number | null
          complemento: string | null
          complemento_cobranca: string | null
          complemento_entrega: string | null
          cpf: string | null
          cpf_cnpj: string | null
          created_at: string | null
          created_by: string | null
          data_nascimento: string | null
          email: string | null
          email_alternativo: string | null
          email_financeiro: string | null
          empresa_id: string | null
          endereco: string | null
          endereco_cobranca: string | null
          endereco_comercial: string | null
          endereco_entrega: string | null
          especialidade: string | null
          estado: string | null
          estado_cobranca: string | null
          estado_comercial: string | null
          estado_entrega: string | null
          id: string
          inscricao_estadual: string | null
          inscricao_municipal: string | null
          limite_credito: number | null
          marca_id: string | null
          nao_residente: boolean
          nome: string
          nome_empresa: string | null
          numero: string | null
          numero_cobranca: string | null
          numero_entrega: string | null
          observacoes: string | null
          perfil: string | null
          razao_social: string | null
          regime_apuracao: string | null
          rg: string | null
          status_comercial: string | null
          telefone: string | null
          tipo: Database["public"]["Enums"]["contato_tipo"]
          tipo_cliente: string | null
          tipo_pessoa: string | null
          updated_at: string | null
          vendedor_id: string | null
          vendedor_padrao_id: string | null
        }
        Insert: {
          ativo?: boolean | null
          bairro?: string | null
          bairro_cobranca?: string | null
          bairro_comercial?: string | null
          bairro_entrega?: string | null
          canonical_id?: string | null
          celular?: string | null
          cep?: string | null
          cep_cobranca?: string | null
          cep_comercial?: string | null
          cep_entrega?: string | null
          cidade?: string | null
          cidade_cobranca?: string | null
          cidade_comercial?: string | null
          cidade_entrega?: string | null
          cnpj?: string | null
          codigo_legado?: number | null
          complemento?: string | null
          complemento_cobranca?: string | null
          complemento_entrega?: string | null
          cpf?: string | null
          cpf_cnpj?: string | null
          created_at?: string | null
          created_by?: string | null
          data_nascimento?: string | null
          email?: string | null
          email_alternativo?: string | null
          email_financeiro?: string | null
          empresa_id?: string | null
          endereco?: string | null
          endereco_cobranca?: string | null
          endereco_comercial?: string | null
          endereco_entrega?: string | null
          especialidade?: string | null
          estado?: string | null
          estado_cobranca?: string | null
          estado_comercial?: string | null
          estado_entrega?: string | null
          id?: string
          inscricao_estadual?: string | null
          inscricao_municipal?: string | null
          limite_credito?: number | null
          marca_id?: string | null
          nao_residente?: boolean
          nome: string
          nome_empresa?: string | null
          numero?: string | null
          numero_cobranca?: string | null
          numero_entrega?: string | null
          observacoes?: string | null
          perfil?: string | null
          razao_social?: string | null
          regime_apuracao?: string | null
          rg?: string | null
          status_comercial?: string | null
          telefone?: string | null
          tipo: Database["public"]["Enums"]["contato_tipo"]
          tipo_cliente?: string | null
          tipo_pessoa?: string | null
          updated_at?: string | null
          vendedor_id?: string | null
          vendedor_padrao_id?: string | null
        }
        Update: {
          ativo?: boolean | null
          bairro?: string | null
          bairro_cobranca?: string | null
          bairro_comercial?: string | null
          bairro_entrega?: string | null
          canonical_id?: string | null
          celular?: string | null
          cep?: string | null
          cep_cobranca?: string | null
          cep_comercial?: string | null
          cep_entrega?: string | null
          cidade?: string | null
          cidade_cobranca?: string | null
          cidade_comercial?: string | null
          cidade_entrega?: string | null
          cnpj?: string | null
          codigo_legado?: number | null
          complemento?: string | null
          complemento_cobranca?: string | null
          complemento_entrega?: string | null
          cpf?: string | null
          cpf_cnpj?: string | null
          created_at?: string | null
          created_by?: string | null
          data_nascimento?: string | null
          email?: string | null
          email_alternativo?: string | null
          email_financeiro?: string | null
          empresa_id?: string | null
          endereco?: string | null
          endereco_cobranca?: string | null
          endereco_comercial?: string | null
          endereco_entrega?: string | null
          especialidade?: string | null
          estado?: string | null
          estado_cobranca?: string | null
          estado_comercial?: string | null
          estado_entrega?: string | null
          id?: string
          inscricao_estadual?: string | null
          inscricao_municipal?: string | null
          limite_credito?: number | null
          marca_id?: string | null
          nao_residente?: boolean
          nome?: string
          nome_empresa?: string | null
          numero?: string | null
          numero_cobranca?: string | null
          numero_entrega?: string | null
          observacoes?: string | null
          perfil?: string | null
          razao_social?: string | null
          regime_apuracao?: string | null
          rg?: string | null
          status_comercial?: string | null
          telefone?: string | null
          tipo?: Database["public"]["Enums"]["contato_tipo"]
          tipo_cliente?: string | null
          tipo_pessoa?: string | null
          updated_at?: string | null
          vendedor_id?: string | null
          vendedor_padrao_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contatos_canonical_id_fkey"
            columns: ["canonical_id"]
            isOneToOne: false
            referencedRelation: "contatos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contatos_canonical_id_fkey"
            columns: ["canonical_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra"
            referencedColumns: ["fornecedor_id"]
          },
          {
            foreignKeyName: "contatos_canonical_id_fkey"
            columns: ["canonical_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra_item_orcamento"
            referencedColumns: ["fornecedor_id"]
          },
          {
            foreignKeyName: "contatos_canonical_id_fkey"
            columns: ["canonical_id"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["contato_id"]
          },
          {
            foreignKeyName: "contatos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "contatos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contatos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra"
            referencedColumns: ["fornecedor_id"]
          },
          {
            foreignKeyName: "contatos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra_item_orcamento"
            referencedColumns: ["fornecedor_id"]
          },
          {
            foreignKeyName: "contatos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["contato_id"]
          },
          {
            foreignKeyName: "contatos_marca_id_fkey"
            columns: ["marca_id"]
            isOneToOne: false
            referencedRelation: "marcas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contatos_marca_id_fkey"
            columns: ["marca_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra"
            referencedColumns: ["marca_id"]
          },
          {
            foreignKeyName: "contatos_marca_id_fkey"
            columns: ["marca_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra_item_orcamento"
            referencedColumns: ["marca_id"]
          },
          {
            foreignKeyName: "contatos_vendedor_id_fkey"
            columns: ["vendedor_id"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contatos_vendedor_id_fkey"
            columns: ["vendedor_id"]
            isOneToOne: false
            referencedRelation: "vw_historico_faltas"
            referencedColumns: ["funcionario_id"]
          },
          {
            foreignKeyName: "contatos_vendedor_id_fkey"
            columns: ["vendedor_id"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["funcionario_id"]
          },
          {
            foreignKeyName: "contatos_vendedor_padrao_id_fkey"
            columns: ["vendedor_padrao_id"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contatos_vendedor_padrao_id_fkey"
            columns: ["vendedor_padrao_id"]
            isOneToOne: false
            referencedRelation: "vw_historico_faltas"
            referencedColumns: ["funcionario_id"]
          },
          {
            foreignKeyName: "contatos_vendedor_padrao_id_fkey"
            columns: ["vendedor_padrao_id"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["funcionario_id"]
          },
        ]
      }
      contatos_revisao: {
        Row: {
          criado_em: string
          decisao: string
          id: string
          id_a: string
          id_b: string
          revisado_em: string | null
          score: number
        }
        Insert: {
          criado_em?: string
          decisao?: string
          id?: string
          id_a: string
          id_b: string
          revisado_em?: string | null
          score: number
        }
        Update: {
          criado_em?: string
          decisao?: string
          id?: string
          id_a?: string
          id_b?: string
          revisado_em?: string | null
          score?: number
        }
        Relationships: [
          {
            foreignKeyName: "contatos_revisao_id_a_fkey"
            columns: ["id_a"]
            isOneToOne: false
            referencedRelation: "contatos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contatos_revisao_id_a_fkey"
            columns: ["id_a"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra"
            referencedColumns: ["fornecedor_id"]
          },
          {
            foreignKeyName: "contatos_revisao_id_a_fkey"
            columns: ["id_a"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra_item_orcamento"
            referencedColumns: ["fornecedor_id"]
          },
          {
            foreignKeyName: "contatos_revisao_id_a_fkey"
            columns: ["id_a"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["contato_id"]
          },
          {
            foreignKeyName: "contatos_revisao_id_b_fkey"
            columns: ["id_b"]
            isOneToOne: false
            referencedRelation: "contatos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contatos_revisao_id_b_fkey"
            columns: ["id_b"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra"
            referencedColumns: ["fornecedor_id"]
          },
          {
            foreignKeyName: "contatos_revisao_id_b_fkey"
            columns: ["id_b"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra_item_orcamento"
            referencedColumns: ["fornecedor_id"]
          },
          {
            foreignKeyName: "contatos_revisao_id_b_fkey"
            columns: ["id_b"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["contato_id"]
          },
        ]
      }
      controle_falta: {
        Row: {
          created_at: string
          data: string
          funcionario_id: string
          hora_entrada: string | null
          hora_saida: string | null
          id: string
          justificativa: string | null
          status: string | null
          total_horas: number | null
        }
        Insert: {
          created_at?: string
          data: string
          funcionario_id: string
          hora_entrada?: string | null
          hora_saida?: string | null
          id?: string
          justificativa?: string | null
          status?: string | null
          total_horas?: number | null
        }
        Update: {
          created_at?: string
          data?: string
          funcionario_id?: string
          hora_entrada?: string | null
          hora_saida?: string | null
          id?: string
          justificativa?: string | null
          status?: string | null
          total_horas?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "controle_ponto_funcionario_id_fkey"
            columns: ["funcionario_id"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "controle_ponto_funcionario_id_fkey"
            columns: ["funcionario_id"]
            isOneToOne: false
            referencedRelation: "vw_historico_faltas"
            referencedColumns: ["funcionario_id"]
          },
          {
            foreignKeyName: "controle_ponto_funcionario_id_fkey"
            columns: ["funcionario_id"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["funcionario_id"]
          },
        ]
      }
      cotacao_itens: {
        Row: {
          cotacao_id: string
          criado_em: string
          custo_unitario: number | null
          descricao_fornecedor: string | null
          id: string
          ncm: string | null
          observacao: string | null
          prazo_entrega_dias: number | null
          produto_id: string
          quantidade: number
          solicitacao_id: string | null
        }
        Insert: {
          cotacao_id: string
          criado_em?: string
          custo_unitario?: number | null
          descricao_fornecedor?: string | null
          id?: string
          ncm?: string | null
          observacao?: string | null
          prazo_entrega_dias?: number | null
          produto_id: string
          quantidade: number
          solicitacao_id?: string | null
        }
        Update: {
          cotacao_id?: string
          criado_em?: string
          custo_unitario?: number | null
          descricao_fornecedor?: string | null
          id?: string
          ncm?: string | null
          observacao?: string | null
          prazo_entrega_dias?: number | null
          produto_id?: string
          quantidade?: number
          solicitacao_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cotacao_itens_cotacao_id_fkey"
            columns: ["cotacao_id"]
            isOneToOne: false
            referencedRelation: "cotacoes_compra"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cotacao_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cotacao_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "v_estoque_produtos"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "cotacao_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_estoque_liquido"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "cotacao_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_estoque_produtos"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "cotacao_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "cotacao_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_produtos_estoque_detalhado"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cotacao_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_vendas_loja"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "cotacao_itens_solicitacao_id_fkey"
            columns: ["solicitacao_id"]
            isOneToOne: false
            referencedRelation: "solicitacoes_compra"
            referencedColumns: ["id"]
          },
        ]
      }
      cotacoes_compra: {
        Row: {
          atualizado_em: string
          condicoes_pagamento: string | null
          criado_em: string
          criado_por: string | null
          fornecedor_id: string
          id: string
          numero: string
          observacao: string | null
          status: string
          validade: string | null
        }
        Insert: {
          atualizado_em?: string
          condicoes_pagamento?: string | null
          criado_em?: string
          criado_por?: string | null
          fornecedor_id: string
          id?: string
          numero: string
          observacao?: string | null
          status?: string
          validade?: string | null
        }
        Update: {
          atualizado_em?: string
          condicoes_pagamento?: string | null
          criado_em?: string
          criado_por?: string | null
          fornecedor_id?: string
          id?: string
          numero?: string
          observacao?: string | null
          status?: string
          validade?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cotacoes_compra_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "contatos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cotacoes_compra_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra"
            referencedColumns: ["fornecedor_id"]
          },
          {
            foreignKeyName: "cotacoes_compra_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra_item_orcamento"
            referencedColumns: ["fornecedor_id"]
          },
          {
            foreignKeyName: "cotacoes_compra_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["contato_id"]
          },
        ]
      }
      cross_system_session_codes: {
        Row: {
          code: string
          contexto: Json | null
          criado_em: string
          expira_em: string
          sistema_destino: string | null
          sistema_origem: string
          usado_em: string | null
          usuario_id: string
        }
        Insert: {
          code?: string
          contexto?: Json | null
          criado_em?: string
          expira_em?: string
          sistema_destino?: string | null
          sistema_origem: string
          usado_em?: string | null
          usuario_id: string
        }
        Update: {
          code?: string
          contexto?: Json | null
          criado_em?: string
          expira_em?: string
          sistema_destino?: string | null
          sistema_origem?: string
          usado_em?: string | null
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cross_system_session_codes_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cross_system_session_codes_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_por_responsavel"
            referencedColumns: ["usuario_id"]
          },
        ]
      }
      custos_recorrentes: {
        Row: {
          ativo: boolean
          categoria_id: string | null
          conta_id: string | null
          created_at: string
          created_by: string | null
          data_fim: string | null
          data_inicio: string
          descricao: string
          dia_vencimento: number | null
          frequencia: Database["public"]["Enums"]["frequencia_tipo"]
          id: string
          updated_at: string
          valor: number
        }
        Insert: {
          ativo?: boolean
          categoria_id?: string | null
          conta_id?: string | null
          created_at?: string
          created_by?: string | null
          data_fim?: string | null
          data_inicio: string
          descricao: string
          dia_vencimento?: number | null
          frequencia?: Database["public"]["Enums"]["frequencia_tipo"]
          id?: string
          updated_at?: string
          valor: number
        }
        Update: {
          ativo?: boolean
          categoria_id?: string | null
          conta_id?: string | null
          created_at?: string
          created_by?: string | null
          data_fim?: string | null
          data_inicio?: string
          descricao?: string
          dia_vencimento?: number | null
          frequencia?: Database["public"]["Enums"]["frequencia_tipo"]
          id?: string
          updated_at?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "custos_recorrentes_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias_financeiras"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "custos_recorrentes_conta_id_fkey"
            columns: ["conta_id"]
            isOneToOne: false
            referencedRelation: "contas_bancarias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "custos_recorrentes_conta_id_fkey"
            columns: ["conta_id"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["conta_bancaria_id"]
          },
          {
            foreignKeyName: "custos_recorrentes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "custos_recorrentes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "vw_projetos_por_responsavel"
            referencedColumns: ["usuario_id"]
          },
        ]
      }
      custos_recorrentes_lancamentos: {
        Row: {
          competencia: string
          created_at: string
          custo_id: string
          data_pagamento: string | null
          data_vencimento: string
          desconto: number
          id: string
          juros: number
          multa: number
          status: Database["public"]["Enums"]["lancamento_status"]
          transacao_id: string | null
          valor_original: number
          valor_pago: number | null
        }
        Insert: {
          competencia: string
          created_at?: string
          custo_id: string
          data_pagamento?: string | null
          data_vencimento: string
          desconto?: number
          id?: string
          juros?: number
          multa?: number
          status?: Database["public"]["Enums"]["lancamento_status"]
          transacao_id?: string | null
          valor_original: number
          valor_pago?: number | null
        }
        Update: {
          competencia?: string
          created_at?: string
          custo_id?: string
          data_pagamento?: string | null
          data_vencimento?: string
          desconto?: number
          id?: string
          juros?: number
          multa?: number
          status?: Database["public"]["Enums"]["lancamento_status"]
          transacao_id?: string | null
          valor_original?: number
          valor_pago?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "custos_recorrentes_lancamentos_custo_id_fkey"
            columns: ["custo_id"]
            isOneToOne: false
            referencedRelation: "custos_recorrentes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "custos_recorrentes_lancamentos_transacao_id_fkey"
            columns: ["transacao_id"]
            isOneToOne: false
            referencedRelation: "transacoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "custos_recorrentes_lancamentos_transacao_id_fkey"
            columns: ["transacao_id"]
            isOneToOne: false
            referencedRelation: "v_financeiro_realizado"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "custos_recorrentes_lancamentos_transacao_id_fkey"
            columns: ["transacao_id"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["id"]
          },
        ]
      }
      departamentos: {
        Row: {
          ativo: boolean
          created_at: string
          descricao: string | null
          id: string
          nome: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          descricao?: string | null
          id?: string
          nome: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          descricao?: string | null
          id?: string
          nome?: string
        }
        Relationships: []
      }
      devolucoes_estoque: {
        Row: {
          aprovado_em: string | null
          aprovado_por: string | null
          cancelado_em: string | null
          criado_em: string
          gera_credito_financeiro: boolean | null
          id: string
          motivo: string | null
          projeto_item_id: string
          qtd_de_entrega_futura: number
          qtd_de_entregue: number
          qtd_de_reserva: number
          quantidade: number
          solicitado_por: string | null
          status: string
        }
        Insert: {
          aprovado_em?: string | null
          aprovado_por?: string | null
          cancelado_em?: string | null
          criado_em?: string
          gera_credito_financeiro?: boolean | null
          id?: string
          motivo?: string | null
          projeto_item_id: string
          qtd_de_entrega_futura?: number
          qtd_de_entregue?: number
          qtd_de_reserva?: number
          quantidade: number
          solicitado_por?: string | null
          status?: string
        }
        Update: {
          aprovado_em?: string | null
          aprovado_por?: string | null
          cancelado_em?: string | null
          criado_em?: string
          gera_credito_financeiro?: boolean | null
          id?: string
          motivo?: string | null
          projeto_item_id?: string
          qtd_de_entrega_futura?: number
          qtd_de_entregue?: number
          qtd_de_reserva?: number
          quantidade?: number
          solicitado_por?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "devolucoes_estoque_projeto_item_id_fkey"
            columns: ["projeto_item_id"]
            isOneToOne: false
            referencedRelation: "projeto_itens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "devolucoes_estoque_projeto_item_id_fkey"
            columns: ["projeto_item_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra_detalhe"
            referencedColumns: ["projeto_item_id"]
          },
          {
            foreignKeyName: "devolucoes_estoque_projeto_item_id_fkey"
            columns: ["projeto_item_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra_item_orcamento"
            referencedColumns: ["projeto_item_id"]
          },
        ]
      }
      empresa_ubiqua: {
        Row: {
          cidade: string
          cnpj: string
          created_at: string
          estado: string
          id: string
          nome_fantasia: string
          razao_social: string | null
        }
        Insert: {
          cidade: string
          cnpj: string
          created_at?: string
          estado: string
          id?: string
          nome_fantasia: string
          razao_social?: string | null
        }
        Update: {
          cidade?: string
          cnpj?: string
          created_at?: string
          estado?: string
          id?: string
          nome_fantasia?: string
          razao_social?: string | null
        }
        Relationships: []
      }
      empresas: {
        Row: {
          ativo: boolean
          bairro: string | null
          cep: string | null
          cidade: string
          cnpj: string | null
          codigo: number
          complemento: string | null
          cor_hex: string | null
          created_at: string
          estado: string
          id: string
          inscricao_estadual: string | null
          logradouro: string | null
          nome: string
          numero: string | null
          razao_social: string | null
          regime_tributario: string | null
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          bairro?: string | null
          cep?: string | null
          cidade?: string
          cnpj?: string | null
          codigo: number
          complemento?: string | null
          cor_hex?: string | null
          created_at?: string
          estado?: string
          id?: string
          inscricao_estadual?: string | null
          logradouro?: string | null
          nome: string
          numero?: string | null
          razao_social?: string | null
          regime_tributario?: string | null
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          bairro?: string | null
          cep?: string | null
          cidade?: string
          cnpj?: string | null
          codigo?: number
          complemento?: string | null
          cor_hex?: string | null
          created_at?: string
          estado?: string
          id?: string
          inscricao_estadual?: string | null
          logradouro?: string | null
          nome?: string
          numero?: string | null
          razao_social?: string | null
          regime_tributario?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      entregas: {
        Row: {
          avaliacao: number | null
          comprovante_url: string | null
          contato_destino: string | null
          created_at: string
          data_entrega: string | null
          data_prevista: string | null
          delivery_type: string
          endereco_entrega: string | null
          entregador_id: string | null
          id: string
          observacoes: string | null
          projeto_id: string | null
          scheduled_time: string | null
          separacao_id: string | null
          status: Database["public"]["Enums"]["entrega_status"]
          updated_at: string
        }
        Insert: {
          avaliacao?: number | null
          comprovante_url?: string | null
          contato_destino?: string | null
          created_at?: string
          data_entrega?: string | null
          data_prevista?: string | null
          delivery_type?: string
          endereco_entrega?: string | null
          entregador_id?: string | null
          id?: string
          observacoes?: string | null
          projeto_id?: string | null
          scheduled_time?: string | null
          separacao_id?: string | null
          status?: Database["public"]["Enums"]["entrega_status"]
          updated_at?: string
        }
        Update: {
          avaliacao?: number | null
          comprovante_url?: string | null
          contato_destino?: string | null
          created_at?: string
          data_entrega?: string | null
          data_prevista?: string | null
          delivery_type?: string
          endereco_entrega?: string | null
          entregador_id?: string | null
          id?: string
          observacoes?: string | null
          projeto_id?: string | null
          scheduled_time?: string | null
          separacao_id?: string | null
          status?: Database["public"]["Enums"]["entrega_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "entregas_entregador_id_fkey"
            columns: ["entregador_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entregas_entregador_id_fkey"
            columns: ["entregador_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_por_responsavel"
            referencedColumns: ["usuario_id"]
          },
          {
            foreignKeyName: "entregas_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "projetos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entregas_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_financeiro_projetos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entregas_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_pipeline"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entregas_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_resumo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entregas_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_sem_empresa"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entregas_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_sem_responsavel"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entregas_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_separacoes_agenda"
            referencedColumns: ["projeto_id"]
          },
          {
            foreignKeyName: "entregas_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["projeto_id"]
          },
          {
            foreignKeyName: "entregas_separacao_id_fkey"
            columns: ["separacao_id"]
            isOneToOne: false
            referencedRelation: "separacoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entregas_separacao_id_fkey"
            columns: ["separacao_id"]
            isOneToOne: false
            referencedRelation: "vw_separacoes_agenda"
            referencedColumns: ["separacao_id"]
          },
          {
            foreignKeyName: "entregas_separacao_id_fkey"
            columns: ["separacao_id"]
            isOneToOne: false
            referencedRelation: "vw_vendas_loja"
            referencedColumns: ["separacao_id"]
          },
        ]
      }
      entregas_finalizadas: {
        Row: {
          cliente: string | null
          codigo_obra: string | null
          created_at: string | null
          data_entrega_real: string | null
          data_solicitacao: string | null
          endereco: string | null
          fotos_urls: string | null
          gestora_equipe: string | null
          id: string
          material_conteudo: string | null
          material_tipo: string | null
          numero_entrega: string | null
          numero_pedido: string | null
          observacoes: string | null
          observacoes_internas: string | null
          recebido_por: string | null
          separacao_id: string | null
          telefone: string | null
          vendedor: string | null
        }
        Insert: {
          cliente?: string | null
          codigo_obra?: string | null
          created_at?: string | null
          data_entrega_real?: string | null
          data_solicitacao?: string | null
          endereco?: string | null
          fotos_urls?: string | null
          gestora_equipe?: string | null
          id?: string
          material_conteudo?: string | null
          material_tipo?: string | null
          numero_entrega?: string | null
          numero_pedido?: string | null
          observacoes?: string | null
          observacoes_internas?: string | null
          recebido_por?: string | null
          separacao_id?: string | null
          telefone?: string | null
          vendedor?: string | null
        }
        Update: {
          cliente?: string | null
          codigo_obra?: string | null
          created_at?: string | null
          data_entrega_real?: string | null
          data_solicitacao?: string | null
          endereco?: string | null
          fotos_urls?: string | null
          gestora_equipe?: string | null
          id?: string
          material_conteudo?: string | null
          material_tipo?: string | null
          numero_entrega?: string | null
          numero_pedido?: string | null
          observacoes?: string | null
          observacoes_internas?: string | null
          recebido_por?: string | null
          separacao_id?: string | null
          telefone?: string | null
          vendedor?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "entregas_finalizadas_separacao_id_fkey"
            columns: ["separacao_id"]
            isOneToOne: false
            referencedRelation: "separacoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entregas_finalizadas_separacao_id_fkey"
            columns: ["separacao_id"]
            isOneToOne: false
            referencedRelation: "vw_separacoes_agenda"
            referencedColumns: ["separacao_id"]
          },
          {
            foreignKeyName: "entregas_finalizadas_separacao_id_fkey"
            columns: ["separacao_id"]
            isOneToOne: false
            referencedRelation: "vw_vendas_loja"
            referencedColumns: ["separacao_id"]
          },
        ]
      }
      equipes_projetos: {
        Row: {
          created_at: string
          equipes: string | null
          id: string
        }
        Insert: {
          created_at?: string
          equipes?: string | null
          id?: string
        }
        Update: {
          created_at?: string
          equipes?: string | null
          id?: string
        }
        Relationships: []
      }
      estoque_itens: {
        Row: {
          atualizado_em: string
          atualizado_por: string | null
          id: string
          local: Database["public"]["Enums"]["estoque_local"]
          produto_id: string
          quantidade: number
          quantidade_disponivel: number | null
          quantidade_reservada: number
        }
        Insert: {
          atualizado_em?: string
          atualizado_por?: string | null
          id?: string
          local?: Database["public"]["Enums"]["estoque_local"]
          produto_id: string
          quantidade?: number
          quantidade_disponivel?: number | null
          quantidade_reservada?: number
        }
        Update: {
          atualizado_em?: string
          atualizado_por?: string | null
          id?: string
          local?: Database["public"]["Enums"]["estoque_local"]
          produto_id?: string
          quantidade?: number
          quantidade_disponivel?: number | null
          quantidade_reservada?: number
        }
        Relationships: [
          {
            foreignKeyName: "estoque_itens_atualizado_por_fkey"
            columns: ["atualizado_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estoque_itens_atualizado_por_fkey"
            columns: ["atualizado_por"]
            isOneToOne: false
            referencedRelation: "vw_projetos_por_responsavel"
            referencedColumns: ["usuario_id"]
          },
          {
            foreignKeyName: "estoque_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estoque_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "v_estoque_produtos"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "estoque_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_estoque_liquido"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "estoque_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_estoque_produtos"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "estoque_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "estoque_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_produtos_estoque_detalhado"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estoque_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_vendas_loja"
            referencedColumns: ["produto_id"]
          },
        ]
      }
      estoque_movimentos_projeto_item: {
        Row: {
          criado_em: string
          criado_por: string | null
          id: string
          observacao: string | null
          origem: string | null
          projeto_item_destino_id: string | null
          projeto_item_id: string
          quantidade: number
          referencia_id: string | null
          tipo: string
        }
        Insert: {
          criado_em?: string
          criado_por?: string | null
          id?: string
          observacao?: string | null
          origem?: string | null
          projeto_item_destino_id?: string | null
          projeto_item_id: string
          quantidade: number
          referencia_id?: string | null
          tipo: string
        }
        Update: {
          criado_em?: string
          criado_por?: string | null
          id?: string
          observacao?: string | null
          origem?: string | null
          projeto_item_destino_id?: string | null
          projeto_item_id?: string
          quantidade?: number
          referencia_id?: string | null
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "estoque_movimentos_projeto_item_projeto_item_destino_id_fkey"
            columns: ["projeto_item_destino_id"]
            isOneToOne: false
            referencedRelation: "projeto_itens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estoque_movimentos_projeto_item_projeto_item_destino_id_fkey"
            columns: ["projeto_item_destino_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra_detalhe"
            referencedColumns: ["projeto_item_id"]
          },
          {
            foreignKeyName: "estoque_movimentos_projeto_item_projeto_item_destino_id_fkey"
            columns: ["projeto_item_destino_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra_item_orcamento"
            referencedColumns: ["projeto_item_id"]
          },
          {
            foreignKeyName: "estoque_movimentos_projeto_item_projeto_item_id_fkey"
            columns: ["projeto_item_id"]
            isOneToOne: false
            referencedRelation: "projeto_itens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estoque_movimentos_projeto_item_projeto_item_id_fkey"
            columns: ["projeto_item_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra_detalhe"
            referencedColumns: ["projeto_item_id"]
          },
          {
            foreignKeyName: "estoque_movimentos_projeto_item_projeto_item_id_fkey"
            columns: ["projeto_item_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra_item_orcamento"
            referencedColumns: ["projeto_item_id"]
          },
        ]
      }
      estoque_saldos_projeto_item: {
        Row: {
          atualizado_em: string
          criado_em: string
          projeto_item_id: string
          q_ag_separar: number
          q_devolvida: number
          q_entrega_futura: number
          q_entregue: number
          q_reserva: number
          q_separado: number
          q_transferida_saida: number
          status_operacional: string
        }
        Insert: {
          atualizado_em?: string
          criado_em?: string
          projeto_item_id: string
          q_ag_separar?: number
          q_devolvida?: number
          q_entrega_futura?: number
          q_entregue?: number
          q_reserva?: number
          q_separado?: number
          q_transferida_saida?: number
          status_operacional?: string
        }
        Update: {
          atualizado_em?: string
          criado_em?: string
          projeto_item_id?: string
          q_ag_separar?: number
          q_devolvida?: number
          q_entrega_futura?: number
          q_entregue?: number
          q_reserva?: number
          q_separado?: number
          q_transferida_saida?: number
          status_operacional?: string
        }
        Relationships: [
          {
            foreignKeyName: "estoque_saldos_projeto_item_projeto_item_id_fkey"
            columns: ["projeto_item_id"]
            isOneToOne: true
            referencedRelation: "projeto_itens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estoque_saldos_projeto_item_projeto_item_id_fkey"
            columns: ["projeto_item_id"]
            isOneToOne: true
            referencedRelation: "vw_necessidade_compra_detalhe"
            referencedColumns: ["projeto_item_id"]
          },
          {
            foreignKeyName: "estoque_saldos_projeto_item_projeto_item_id_fkey"
            columns: ["projeto_item_id"]
            isOneToOne: true
            referencedRelation: "vw_necessidade_compra_item_orcamento"
            referencedColumns: ["projeto_item_id"]
          },
        ]
      }
      feriados: {
        Row: {
          ativo: boolean
          created_at: string
          criado_por: string | null
          data: string
          descricao: string
          id: string
          observacao: string | null
          tipo: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          criado_por?: string | null
          data: string
          descricao: string
          id?: string
          observacao?: string | null
          tipo: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          criado_por?: string | null
          data?: string
          descricao?: string
          id?: string
          observacao?: string | null
          tipo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "feriados_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feriados_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "vw_projetos_por_responsavel"
            referencedColumns: ["usuario_id"]
          },
        ]
      }
      ferias: {
        Row: {
          aprovado_por: string | null
          created_at: string
          data_fim: string
          data_inicio: string
          dias: number
          funcionario_id: string
          id: string
          observacoes: string | null
          periodo_aquisitivo_id: string | null
          status: string
        }
        Insert: {
          aprovado_por?: string | null
          created_at?: string
          data_fim: string
          data_inicio: string
          dias?: number
          funcionario_id: string
          id?: string
          observacoes?: string | null
          periodo_aquisitivo_id?: string | null
          status?: string
        }
        Update: {
          aprovado_por?: string | null
          created_at?: string
          data_fim?: string
          data_inicio?: string
          dias?: number
          funcionario_id?: string
          id?: string
          observacoes?: string | null
          periodo_aquisitivo_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "ferias_aprovado_por_fkey"
            columns: ["aprovado_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ferias_aprovado_por_fkey"
            columns: ["aprovado_por"]
            isOneToOne: false
            referencedRelation: "vw_projetos_por_responsavel"
            referencedColumns: ["usuario_id"]
          },
          {
            foreignKeyName: "ferias_funcionario_id_fkey"
            columns: ["funcionario_id"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ferias_funcionario_id_fkey"
            columns: ["funcionario_id"]
            isOneToOne: false
            referencedRelation: "vw_historico_faltas"
            referencedColumns: ["funcionario_id"]
          },
          {
            foreignKeyName: "ferias_funcionario_id_fkey"
            columns: ["funcionario_id"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["funcionario_id"]
          },
          {
            foreignKeyName: "ferias_periodo_aquisitivo_id_fkey"
            columns: ["periodo_aquisitivo_id"]
            isOneToOne: false
            referencedRelation: "periodos_aquisitivos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ferias_periodo_aquisitivo_id_fkey"
            columns: ["periodo_aquisitivo_id"]
            isOneToOne: false
            referencedRelation: "vw_historico_faltas"
            referencedColumns: ["periodo_id"]
          },
        ]
      }
      folha_pagamento: {
        Row: {
          adicionais: number
          ano: number
          comissao: number
          data_geracao: string
          descontos: number
          dias_abonados: number | null
          dias_falta: number | null
          dias_trabalhados: number | null
          empresa_id: string | null
          funcionario_id: string
          id: string
          mes: number
          salario_base: number
          salario_liquido: number
          valor_vr_vt: number | null
        }
        Insert: {
          adicionais?: number
          ano: number
          comissao?: number
          data_geracao?: string
          descontos?: number
          dias_abonados?: number | null
          dias_falta?: number | null
          dias_trabalhados?: number | null
          empresa_id?: string | null
          funcionario_id: string
          id?: string
          mes: number
          salario_base: number
          salario_liquido: number
          valor_vr_vt?: number | null
        }
        Update: {
          adicionais?: number
          ano?: number
          comissao?: number
          data_geracao?: string
          descontos?: number
          dias_abonados?: number | null
          dias_falta?: number | null
          dias_trabalhados?: number | null
          empresa_id?: string | null
          funcionario_id?: string
          id?: string
          mes?: number
          salario_base?: number
          salario_liquido?: number
          valor_vr_vt?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "folha_pagamento_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "folha_pagamento_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_fornecedores_remessas"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "folha_pagamento_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_fornecedores_resumo"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "folha_pagamento_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_remessas_completa"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "folha_pagamento_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_remessas_resumo_status"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "folha_pagamento_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "folha_pagamento_funcionario_id_fkey"
            columns: ["funcionario_id"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "folha_pagamento_funcionario_id_fkey"
            columns: ["funcionario_id"]
            isOneToOne: false
            referencedRelation: "vw_historico_faltas"
            referencedColumns: ["funcionario_id"]
          },
          {
            foreignKeyName: "folha_pagamento_funcionario_id_fkey"
            columns: ["funcionario_id"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["funcionario_id"]
          },
        ]
      }
      fornecedores: {
        Row: {
          agencia: string | null
          banco: string | null
          categoria: string | null
          cep: string | null
          chave_pix: string | null
          cidade: string | null
          cnpj_cpf: string | null
          conta: string | null
          created_at: string | null
          email: string | null
          empresa_id: string | null
          endereco: string | null
          estado: string | null
          id: string
          nome: string
          observacoes: string | null
          status: string | null
          telefone: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          agencia?: string | null
          banco?: string | null
          categoria?: string | null
          cep?: string | null
          chave_pix?: string | null
          cidade?: string | null
          cnpj_cpf?: string | null
          conta?: string | null
          created_at?: string | null
          email?: string | null
          empresa_id?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          nome: string
          observacoes?: string | null
          status?: string | null
          telefone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          agencia?: string | null
          banco?: string | null
          categoria?: string | null
          cep?: string | null
          chave_pix?: string | null
          cidade?: string | null
          cnpj_cpf?: string | null
          conta?: string | null
          created_at?: string | null
          email?: string | null
          empresa_id?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          nome?: string
          observacoes?: string | null
          status?: string | null
          telefone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fornecedores_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fornecedores_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_fornecedores_remessas"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "fornecedores_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_fornecedores_resumo"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "fornecedores_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_remessas_completa"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "fornecedores_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_remessas_resumo_status"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "fornecedores_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["empresa_id"]
          },
        ]
      }
      funcionarios: {
        Row: {
          cargo: string | null
          codigo_legado: number | null
          created_at: string
          data_admissao: string | null
          data_demissao: string | null
          data_elegibilidade_ferias: string | null
          departamento_id: string | null
          email: string | null
          empresa: string | null
          empresa_id: string | null
          id: string
          nm_connect: string | null
          nome: string
          perfil: string | null
          status: string
          tipo_contratacao: string | null
          updated_at: string
          usuario_id: string | null
        }
        Insert: {
          cargo?: string | null
          codigo_legado?: number | null
          created_at?: string
          data_admissao?: string | null
          data_demissao?: string | null
          data_elegibilidade_ferias?: string | null
          departamento_id?: string | null
          email?: string | null
          empresa?: string | null
          empresa_id?: string | null
          id?: string
          nm_connect?: string | null
          nome: string
          perfil?: string | null
          status?: string
          tipo_contratacao?: string | null
          updated_at?: string
          usuario_id?: string | null
        }
        Update: {
          cargo?: string | null
          codigo_legado?: number | null
          created_at?: string
          data_admissao?: string | null
          data_demissao?: string | null
          data_elegibilidade_ferias?: string | null
          departamento_id?: string | null
          email?: string | null
          empresa?: string | null
          empresa_id?: string | null
          id?: string
          nm_connect?: string | null
          nome?: string
          perfil?: string | null
          status?: string
          tipo_contratacao?: string | null
          updated_at?: string
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "funcionarios_departamento_id_fkey"
            columns: ["departamento_id"]
            isOneToOne: false
            referencedRelation: "departamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "funcionarios_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "funcionarios_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_fornecedores_remessas"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "funcionarios_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_fornecedores_resumo"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "funcionarios_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_remessas_completa"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "funcionarios_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_remessas_resumo_status"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "funcionarios_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "funcionarios_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "funcionarios_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_por_responsavel"
            referencedColumns: ["usuario_id"]
          },
        ]
      }
      funcionarios_beneficios_empresas: {
        Row: {
          empresa: string
          empresa_id: string | null
          funcionario_id: string
          id: string
          valor_vt_dia: number | null
        }
        Insert: {
          empresa: string
          empresa_id?: string | null
          funcionario_id: string
          id?: string
          valor_vt_dia?: number | null
        }
        Update: {
          empresa?: string
          empresa_id?: string | null
          funcionario_id?: string
          id?: string
          valor_vt_dia?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "funcionarios_beneficios_empresas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "funcionarios_beneficios_empresas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_fornecedores_remessas"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "funcionarios_beneficios_empresas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_fornecedores_resumo"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "funcionarios_beneficios_empresas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_remessas_completa"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "funcionarios_beneficios_empresas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_remessas_resumo_status"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "funcionarios_beneficios_empresas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "funcionarios_beneficios_empresas_funcionario_id_fkey"
            columns: ["funcionario_id"]
            isOneToOne: false
            referencedRelation: "funcionarios_novo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "funcionarios_beneficios_empresas_funcionario_id_fkey"
            columns: ["funcionario_id"]
            isOneToOne: false
            referencedRelation: "vw_comissao_mensal"
            referencedColumns: ["funcionario_id"]
          },
          {
            foreignKeyName: "funcionarios_beneficios_empresas_funcionario_id_fkey"
            columns: ["funcionario_id"]
            isOneToOne: false
            referencedRelation: "vw_funcionarios_completo"
            referencedColumns: ["id"]
          },
        ]
      }
      funcionarios_detalhes: {
        Row: {
          cpf: string | null
          data_nascimento: string | null
          email: string | null
          endereco: string | null
          funcionario_id: string
          id: string
          rg: string | null
          telefone: string | null
        }
        Insert: {
          cpf?: string | null
          data_nascimento?: string | null
          email?: string | null
          endereco?: string | null
          funcionario_id: string
          id?: string
          rg?: string | null
          telefone?: string | null
        }
        Update: {
          cpf?: string | null
          data_nascimento?: string | null
          email?: string | null
          endereco?: string | null
          funcionario_id?: string
          id?: string
          rg?: string | null
          telefone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "funcionarios_detalhes_funcionario_id_fkey"
            columns: ["funcionario_id"]
            isOneToOne: true
            referencedRelation: "funcionarios_novo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "funcionarios_detalhes_funcionario_id_fkey"
            columns: ["funcionario_id"]
            isOneToOne: true
            referencedRelation: "vw_comissao_mensal"
            referencedColumns: ["funcionario_id"]
          },
          {
            foreignKeyName: "funcionarios_detalhes_funcionario_id_fkey"
            columns: ["funcionario_id"]
            isOneToOne: true
            referencedRelation: "vw_funcionarios_completo"
            referencedColumns: ["id"]
          },
        ]
      }
      funcionarios_financeiro: {
        Row: {
          comissao_percentual: number | null
          equipes_id: string | null
          funcionario_id: string
          id: string
          salario_base: number
          salario_liquido: number | null
          salario_por_fora: number
        }
        Insert: {
          comissao_percentual?: number | null
          equipes_id?: string | null
          funcionario_id: string
          id?: string
          salario_base?: number
          salario_liquido?: number | null
          salario_por_fora?: number
        }
        Update: {
          comissao_percentual?: number | null
          equipes_id?: string | null
          funcionario_id?: string
          id?: string
          salario_base?: number
          salario_liquido?: number | null
          salario_por_fora?: number
        }
        Relationships: [
          {
            foreignKeyName: "funcionarios_financeiro_equipes_id_fkey"
            columns: ["equipes_id"]
            isOneToOne: false
            referencedRelation: "equipes_projetos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "funcionarios_financeiro_equipes_id_fkey"
            columns: ["equipes_id"]
            isOneToOne: false
            referencedRelation: "vw_comissao_mensal"
            referencedColumns: ["equipe_id"]
          },
          {
            foreignKeyName: "funcionarios_financeiro_funcionario_id_fkey"
            columns: ["funcionario_id"]
            isOneToOne: true
            referencedRelation: "funcionarios_novo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "funcionarios_financeiro_funcionario_id_fkey"
            columns: ["funcionario_id"]
            isOneToOne: true
            referencedRelation: "vw_comissao_mensal"
            referencedColumns: ["funcionario_id"]
          },
          {
            foreignKeyName: "funcionarios_financeiro_funcionario_id_fkey"
            columns: ["funcionario_id"]
            isOneToOne: true
            referencedRelation: "vw_funcionarios_completo"
            referencedColumns: ["id"]
          },
        ]
      }
      funcionarios_novo: {
        Row: {
          ativo: boolean | null
          cargo: string | null
          created_at: string | null
          data_admissao: string | null
          id: string
          nome: string
          perfil: string | null
        }
        Insert: {
          ativo?: boolean | null
          cargo?: string | null
          created_at?: string | null
          data_admissao?: string | null
          id?: string
          nome: string
          perfil?: string | null
        }
        Update: {
          ativo?: boolean | null
          cargo?: string | null
          created_at?: string | null
          data_admissao?: string | null
          id?: string
          nome?: string
          perfil?: string | null
        }
        Relationships: []
      }
      historico_status_orcamentos: {
        Row: {
          created_at: string | null
          id: string
          observacao: string | null
          orcamento_id: string
          status_anterior: string | null
          status_novo: string
          usuario: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          observacao?: string | null
          orcamento_id: string
          status_anterior?: string | null
          status_novo: string
          usuario?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          observacao?: string | null
          orcamento_id?: string
          status_anterior?: string | null
          status_novo?: string
          usuario?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "historico_status_orcamentos_orcamento_id_fkey"
            columns: ["orcamento_id"]
            isOneToOne: false
            referencedRelation: "orcamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "historico_status_orcamentos_orcamento_id_fkey"
            columns: ["orcamento_id"]
            isOneToOne: false
            referencedRelation: "vw_orcamentos_aprovacao_financeira_auditoria"
            referencedColumns: ["orcamento_id"]
          },
          {
            foreignKeyName: "historico_status_orcamentos_orcamento_id_fkey"
            columns: ["orcamento_id"]
            isOneToOne: false
            referencedRelation: "vw_orcamentos_prazo_entrega"
            referencedColumns: ["orcamento_id"]
          },
        ]
      }
      informacoes_cliente_ubiqua: {
        Row: {
          cadastrado_por_usuario_id: string | null
          cpf_cnpj: string
          created_at: string | null
          email: string | null
          id: string
          nome: string
          telefone: string | null
        }
        Insert: {
          cadastrado_por_usuario_id?: string | null
          cpf_cnpj: string
          created_at?: string | null
          email?: string | null
          id?: string
          nome: string
          telefone?: string | null
        }
        Update: {
          cadastrado_por_usuario_id?: string | null
          cpf_cnpj?: string
          created_at?: string | null
          email?: string | null
          id?: string
          nome?: string
          telefone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "informacoes_cliente_ubiqua_cadastrado_por_usuario_id_fkey"
            columns: ["cadastrado_por_usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios_ubiqua"
            referencedColumns: ["id"]
          },
        ]
      }
      itens_orcamento_ubiqua: {
        Row: {
          created_at: string | null
          desconto_item: number | null
          descricao_snapshot: string | null
          id: string
          marca_snapshot: string | null
          observacao_item: string | null
          orcamento_id: string
          ordem: number | null
          produto_id: number
          quantidade: number
          referencia_snapshot: string | null
          sem_estoque_no_pedido: boolean
          valor_total: number | null
          valor_unitario: number
        }
        Insert: {
          created_at?: string | null
          desconto_item?: number | null
          descricao_snapshot?: string | null
          id?: string
          marca_snapshot?: string | null
          observacao_item?: string | null
          orcamento_id: string
          ordem?: number | null
          produto_id: number
          quantidade: number
          referencia_snapshot?: string | null
          sem_estoque_no_pedido?: boolean
          valor_total?: number | null
          valor_unitario: number
        }
        Update: {
          created_at?: string | null
          desconto_item?: number | null
          descricao_snapshot?: string | null
          id?: string
          marca_snapshot?: string | null
          observacao_item?: string | null
          orcamento_id?: string
          ordem?: number | null
          produto_id?: number
          quantidade?: number
          referencia_snapshot?: string | null
          sem_estoque_no_pedido?: boolean
          valor_total?: number | null
          valor_unitario?: number
        }
        Relationships: [
          {
            foreignKeyName: "itens_orcamento_ubiqua_orcamento_id_fkey"
            columns: ["orcamento_id"]
            isOneToOne: false
            referencedRelation: "orcamentos_revenda_ubiqua"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "itens_orcamento_ubiqua_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "revenda_ubiqua"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "itens_orcamento_ubiqua_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_importacao_ubiqua"
            referencedColumns: ["produto_id"]
          },
        ]
      }
      logs_auditoria: {
        Row: {
          created_at: string | null
          dados_anteriores: Json | null
          dados_novos: Json | null
          id: string
          ip: string | null
          observacao: string | null
          operacao: string
          registro_id: string | null
          tabela: string
          usuario_id: string | null
        }
        Insert: {
          created_at?: string | null
          dados_anteriores?: Json | null
          dados_novos?: Json | null
          id?: string
          ip?: string | null
          observacao?: string | null
          operacao: string
          registro_id?: string | null
          tabela: string
          usuario_id?: string | null
        }
        Update: {
          created_at?: string | null
          dados_anteriores?: Json | null
          dados_novos?: Json | null
          id?: string
          ip?: string | null
          observacao?: string | null
          operacao?: string
          registro_id?: string | null
          tabela?: string
          usuario_id?: string | null
        }
        Relationships: []
      }
      logs_operacoes: {
        Row: {
          acao: string
          created_at: string | null
          dados_anteriores: Json | null
          dados_novos: Json | null
          id: string
          projeto_id: string | null
          usuario_id: string | null
        }
        Insert: {
          acao: string
          created_at?: string | null
          dados_anteriores?: Json | null
          dados_novos?: Json | null
          id?: string
          projeto_id?: string | null
          usuario_id?: string | null
        }
        Update: {
          acao?: string
          created_at?: string | null
          dados_anteriores?: Json | null
          dados_novos?: Json | null
          id?: string
          projeto_id?: string | null
          usuario_id?: string | null
        }
        Relationships: []
      }
      marcas: {
        Row: {
          ativo: boolean
          codigo_legado: number | null
          created_at: string
          fornecedor_id: string | null
          id: string
          nome: string
          prazo_entrega_dias: number | null
        }
        Insert: {
          ativo?: boolean
          codigo_legado?: number | null
          created_at?: string
          fornecedor_id?: string | null
          id?: string
          nome: string
          prazo_entrega_dias?: number | null
        }
        Update: {
          ativo?: boolean
          codigo_legado?: number | null
          created_at?: string
          fornecedor_id?: string | null
          id?: string
          nome?: string
          prazo_entrega_dias?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "marcas_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "contatos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marcas_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra"
            referencedColumns: ["fornecedor_id"]
          },
          {
            foreignKeyName: "marcas_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra_item_orcamento"
            referencedColumns: ["fornecedor_id"]
          },
          {
            foreignKeyName: "marcas_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["contato_id"]
          },
        ]
      }
      memory_organization_conflicts: {
        Row: {
          created_at: string
          description: string | null
          id: string
          owner_id: string
          resolution: string | null
          resolved_at: string | null
          rule_a_id: string
          rule_b_id: string
          status: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          owner_id: string
          resolution?: string | null
          resolved_at?: string | null
          rule_a_id: string
          rule_b_id: string
          status?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          owner_id?: string
          resolution?: string | null
          resolved_at?: string | null
          rule_a_id?: string
          rule_b_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "memory_organization_conflicts_rule_a_id_fkey"
            columns: ["rule_a_id"]
            isOneToOne: false
            referencedRelation: "memory_organization_rules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "memory_organization_conflicts_rule_b_id_fkey"
            columns: ["rule_b_id"]
            isOneToOne: false
            referencedRelation: "memory_organization_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      memory_organization_feedback: {
        Row: {
          accepted_after: Json
          changed_fields: string[]
          context_id: string | null
          context_type: string
          created_at: string
          diff: Json
          domain: string | null
          explanation: string | null
          id: string
          metadata: Json
          owner_id: string
          pattern_signature: string | null
          proposal_before: Json
          source_id: string | null
          source_type: string | null
        }
        Insert: {
          accepted_after: Json
          changed_fields?: string[]
          context_id?: string | null
          context_type: string
          created_at?: string
          diff?: Json
          domain?: string | null
          explanation?: string | null
          id?: string
          metadata?: Json
          owner_id: string
          pattern_signature?: string | null
          proposal_before: Json
          source_id?: string | null
          source_type?: string | null
        }
        Update: {
          accepted_after?: Json
          changed_fields?: string[]
          context_id?: string | null
          context_type?: string
          created_at?: string
          diff?: Json
          domain?: string | null
          explanation?: string | null
          id?: string
          metadata?: Json
          owner_id?: string
          pattern_signature?: string | null
          proposal_before?: Json
          source_id?: string | null
          source_type?: string | null
        }
        Relationships: []
      }
      memory_organization_rule_evidence: {
        Row: {
          created_at: string
          feedback_id: string
          id: string
          owner_id: string
          rule_id: string
        }
        Insert: {
          created_at?: string
          feedback_id: string
          id?: string
          owner_id: string
          rule_id: string
        }
        Update: {
          created_at?: string
          feedback_id?: string
          id?: string
          owner_id?: string
          rule_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "memory_organization_rule_evidence_feedback_id_fkey"
            columns: ["feedback_id"]
            isOneToOne: false
            referencedRelation: "memory_organization_feedback"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "memory_organization_rule_evidence_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "memory_organization_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      memory_organization_rule_versions: {
        Row: {
          change_reason: string | null
          changed_at: string
          changed_by: string | null
          id: string
          owner_id: string
          rule_id: string
          snapshot: Json
          version_number: number
        }
        Insert: {
          change_reason?: string | null
          changed_at?: string
          changed_by?: string | null
          id?: string
          owner_id: string
          rule_id: string
          snapshot: Json
          version_number: number
        }
        Update: {
          change_reason?: string | null
          changed_at?: string
          changed_by?: string | null
          id?: string
          owner_id?: string
          rule_id?: string
          snapshot?: Json
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "memory_organization_rule_versions_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "memory_organization_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      memory_organization_rules: {
        Row: {
          activated_at: string | null
          confidence: number | null
          created_at: string
          deleted_at: string | null
          description: string
          domain: string | null
          examples_negative: Json
          examples_positive: Json
          id: string
          metadata: Json
          origin: Database["public"]["Enums"]["memory_rule_origin"]
          owner_id: string
          priority: number
          rationale: string | null
          rule_type: Database["public"]["Enums"]["memory_rule_type"]
          scope: Database["public"]["Enums"]["memory_rule_scope"]
          status: Database["public"]["Enums"]["memory_rule_status"]
          supersedes_rule_id: string | null
          title: string
          updated_at: string
          version: number
        }
        Insert: {
          activated_at?: string | null
          confidence?: number | null
          created_at?: string
          deleted_at?: string | null
          description: string
          domain?: string | null
          examples_negative?: Json
          examples_positive?: Json
          id?: string
          metadata?: Json
          origin?: Database["public"]["Enums"]["memory_rule_origin"]
          owner_id: string
          priority?: number
          rationale?: string | null
          rule_type: Database["public"]["Enums"]["memory_rule_type"]
          scope?: Database["public"]["Enums"]["memory_rule_scope"]
          status?: Database["public"]["Enums"]["memory_rule_status"]
          supersedes_rule_id?: string | null
          title: string
          updated_at?: string
          version?: number
        }
        Update: {
          activated_at?: string | null
          confidence?: number | null
          created_at?: string
          deleted_at?: string | null
          description?: string
          domain?: string | null
          examples_negative?: Json
          examples_positive?: Json
          id?: string
          metadata?: Json
          origin?: Database["public"]["Enums"]["memory_rule_origin"]
          owner_id?: string
          priority?: number
          rationale?: string | null
          rule_type?: Database["public"]["Enums"]["memory_rule_type"]
          scope?: Database["public"]["Enums"]["memory_rule_scope"]
          status?: Database["public"]["Enums"]["memory_rule_status"]
          supersedes_rule_id?: string | null
          title?: string
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "memory_organization_rules_supersedes_rule_id_fkey"
            columns: ["supersedes_rule_id"]
            isOneToOne: false
            referencedRelation: "memory_organization_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      memory_organization_settings: {
        Row: {
          minimum_confidence: number
          minimum_diverse_contexts: number
          minimum_evidence: number
          owner_id: string
          updated_at: string
        }
        Insert: {
          minimum_confidence?: number
          minimum_diverse_contexts?: number
          minimum_evidence?: number
          owner_id: string
          updated_at?: string
        }
        Update: {
          minimum_confidence?: number
          minimum_diverse_contexts?: number
          minimum_evidence?: number
          owner_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      modulo_acoes: {
        Row: {
          chave: string
          id: string
          modulo_id: string
        }
        Insert: {
          chave: string
          id?: string
          modulo_id: string
        }
        Update: {
          chave?: string
          id?: string
          modulo_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "modulo_acoes_modulo_id_fkey"
            columns: ["modulo_id"]
            isOneToOne: false
            referencedRelation: "modulos"
            referencedColumns: ["id"]
          },
        ]
      }
      modulos: {
        Row: {
          chave: string
          descricao: string | null
          id: string
          nome: string
          ordem: number | null
          system_id: string
        }
        Insert: {
          chave: string
          descricao?: string | null
          id?: string
          nome: string
          ordem?: number | null
          system_id: string
        }
        Update: {
          chave?: string
          descricao?: string | null
          id?: string
          nome?: string
          ordem?: number | null
          system_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "modulos_system_id_fkey"
            columns: ["system_id"]
            isOneToOne: false
            referencedRelation: "systems"
            referencedColumns: ["id"]
          },
        ]
      }
      negociacoes: {
        Row: {
          cod_duplicata: number
          cod_pessoa: number | null
          cod_venda: number | null
          contato_id: string | null
          created_at: string
          dev_troca: boolean
          empresa_id: string
          funcionario_id: string | null
          id: string
          observacao: string | null
          plano_contas_id: string | null
          projeto_id: string | null
          tipo: Database["public"]["Enums"]["transacao_tipo"]
          total_parc: number
        }
        Insert: {
          cod_duplicata: number
          cod_pessoa?: number | null
          cod_venda?: number | null
          contato_id?: string | null
          created_at?: string
          dev_troca?: boolean
          empresa_id: string
          funcionario_id?: string | null
          id?: string
          observacao?: string | null
          plano_contas_id?: string | null
          projeto_id?: string | null
          tipo: Database["public"]["Enums"]["transacao_tipo"]
          total_parc?: number
        }
        Update: {
          cod_duplicata?: number
          cod_pessoa?: number | null
          cod_venda?: number | null
          contato_id?: string | null
          created_at?: string
          dev_troca?: boolean
          empresa_id?: string
          funcionario_id?: string | null
          id?: string
          observacao?: string | null
          plano_contas_id?: string | null
          projeto_id?: string | null
          tipo?: Database["public"]["Enums"]["transacao_tipo"]
          total_parc?: number
        }
        Relationships: [
          {
            foreignKeyName: "negociacoes_contato_id_fkey"
            columns: ["contato_id"]
            isOneToOne: false
            referencedRelation: "contatos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "negociacoes_contato_id_fkey"
            columns: ["contato_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra"
            referencedColumns: ["fornecedor_id"]
          },
          {
            foreignKeyName: "negociacoes_contato_id_fkey"
            columns: ["contato_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra_item_orcamento"
            referencedColumns: ["fornecedor_id"]
          },
          {
            foreignKeyName: "negociacoes_contato_id_fkey"
            columns: ["contato_id"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["contato_id"]
          },
          {
            foreignKeyName: "negociacoes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "negociacoes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_fornecedores_remessas"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "negociacoes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_fornecedores_resumo"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "negociacoes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_remessas_completa"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "negociacoes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_remessas_resumo_status"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "negociacoes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "negociacoes_funcionario_id_fkey"
            columns: ["funcionario_id"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "negociacoes_funcionario_id_fkey"
            columns: ["funcionario_id"]
            isOneToOne: false
            referencedRelation: "vw_historico_faltas"
            referencedColumns: ["funcionario_id"]
          },
          {
            foreignKeyName: "negociacoes_funcionario_id_fkey"
            columns: ["funcionario_id"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["funcionario_id"]
          },
          {
            foreignKeyName: "negociacoes_plano_contas_id_fkey"
            columns: ["plano_contas_id"]
            isOneToOne: false
            referencedRelation: "plano_de_contas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "negociacoes_plano_contas_id_fkey"
            columns: ["plano_contas_id"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["plano_contas_id"]
          },
          {
            foreignKeyName: "negociacoes_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "projetos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "negociacoes_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_financeiro_projetos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "negociacoes_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_pipeline"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "negociacoes_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_resumo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "negociacoes_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_sem_empresa"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "negociacoes_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_sem_responsavel"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "negociacoes_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_separacoes_agenda"
            referencedColumns: ["projeto_id"]
          },
          {
            foreignKeyName: "negociacoes_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["projeto_id"]
          },
        ]
      }
      notas_fiscais: {
        Row: {
          arquiteto: string | null
          arquivo_url: string | null
          boleto_id: string | null
          created_at: string | null
          data_emissao: string | null
          fornecedor: string | null
          id: string
          numero_nf: string
          orcamento_id: string | null
          perfil: string | null
          serie: string | null
          tipo_operacao: string | null
          updated_at: string | null
          valor: number | null
        }
        Insert: {
          arquiteto?: string | null
          arquivo_url?: string | null
          boleto_id?: string | null
          created_at?: string | null
          data_emissao?: string | null
          fornecedor?: string | null
          id?: string
          numero_nf: string
          orcamento_id?: string | null
          perfil?: string | null
          serie?: string | null
          tipo_operacao?: string | null
          updated_at?: string | null
          valor?: number | null
        }
        Update: {
          arquiteto?: string | null
          arquivo_url?: string | null
          boleto_id?: string | null
          created_at?: string | null
          data_emissao?: string | null
          fornecedor?: string | null
          id?: string
          numero_nf?: string
          orcamento_id?: string | null
          perfil?: string | null
          serie?: string | null
          tipo_operacao?: string | null
          updated_at?: string | null
          valor?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "notas_fiscais_boleto_id_fkey"
            columns: ["boleto_id"]
            isOneToOne: false
            referencedRelation: "boletos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notas_fiscais_orcamento_id_fkey"
            columns: ["orcamento_id"]
            isOneToOne: false
            referencedRelation: "orcamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notas_fiscais_orcamento_id_fkey"
            columns: ["orcamento_id"]
            isOneToOne: false
            referencedRelation: "vw_orcamentos_aprovacao_financeira_auditoria"
            referencedColumns: ["orcamento_id"]
          },
          {
            foreignKeyName: "notas_fiscais_orcamento_id_fkey"
            columns: ["orcamento_id"]
            isOneToOne: false
            referencedRelation: "vw_orcamentos_prazo_entrega"
            referencedColumns: ["orcamento_id"]
          },
        ]
      }
      notas_fiscais_compra: {
        Row: {
          arquivo_url: string | null
          atualizado_em: string
          criado_em: string
          criado_por: string | null
          data_emissao: string | null
          id: string
          numero_nf: string
          observacao: string | null
          pedido_compra_id: string
          valor: number | null
        }
        Insert: {
          arquivo_url?: string | null
          atualizado_em?: string
          criado_em?: string
          criado_por?: string | null
          data_emissao?: string | null
          id?: string
          numero_nf: string
          observacao?: string | null
          pedido_compra_id: string
          valor?: number | null
        }
        Update: {
          arquivo_url?: string | null
          atualizado_em?: string
          criado_em?: string
          criado_por?: string | null
          data_emissao?: string | null
          id?: string
          numero_nf?: string
          observacao?: string | null
          pedido_compra_id?: string
          valor?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "notas_fiscais_compra_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notas_fiscais_compra_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "vw_projetos_por_responsavel"
            referencedColumns: ["usuario_id"]
          },
          {
            foreignKeyName: "notas_fiscais_compra_pedido_compra_id_fkey"
            columns: ["pedido_compra_id"]
            isOneToOne: false
            referencedRelation: "pedidos_compra"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notas_fiscais_compra_pedido_compra_id_fkey"
            columns: ["pedido_compra_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra_pedido_detalhe"
            referencedColumns: ["pedido_id"]
          },
        ]
      }
      orcamento_itens: {
        Row: {
          created_at: string | null
          custom_id: string | null
          desconto: number | null
          descricao: string | null
          id: string
          item_pai_id: string | null
          orcamento_id: string
          ordem: number | null
          peca_nova: boolean | null
          preco_unitario: number | null
          produto_id: string | null
          projeto_item_origem_id: string | null
          quantidade: number | null
          sub_ordem: number | null
        }
        Insert: {
          created_at?: string | null
          custom_id?: string | null
          desconto?: number | null
          descricao?: string | null
          id?: string
          item_pai_id?: string | null
          orcamento_id: string
          ordem?: number | null
          peca_nova?: boolean | null
          preco_unitario?: number | null
          produto_id?: string | null
          projeto_item_origem_id?: string | null
          quantidade?: number | null
          sub_ordem?: number | null
        }
        Update: {
          created_at?: string | null
          custom_id?: string | null
          desconto?: number | null
          descricao?: string | null
          id?: string
          item_pai_id?: string | null
          orcamento_id?: string
          ordem?: number | null
          peca_nova?: boolean | null
          preco_unitario?: number | null
          produto_id?: string | null
          projeto_item_origem_id?: string | null
          quantidade?: number | null
          sub_ordem?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "orcamento_itens_item_pai_id_fkey"
            columns: ["item_pai_id"]
            isOneToOne: false
            referencedRelation: "orcamento_itens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orcamento_itens_orcamento_id_fkey"
            columns: ["orcamento_id"]
            isOneToOne: false
            referencedRelation: "orcamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orcamento_itens_orcamento_id_fkey"
            columns: ["orcamento_id"]
            isOneToOne: false
            referencedRelation: "vw_orcamentos_aprovacao_financeira_auditoria"
            referencedColumns: ["orcamento_id"]
          },
          {
            foreignKeyName: "orcamento_itens_orcamento_id_fkey"
            columns: ["orcamento_id"]
            isOneToOne: false
            referencedRelation: "vw_orcamentos_prazo_entrega"
            referencedColumns: ["orcamento_id"]
          },
          {
            foreignKeyName: "orcamento_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orcamento_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "v_estoque_produtos"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "orcamento_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_estoque_liquido"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "orcamento_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_estoque_produtos"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "orcamento_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "orcamento_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_produtos_estoque_detalhado"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orcamento_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_vendas_loja"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "orcamento_itens_projeto_item_origem_id_fkey"
            columns: ["projeto_item_origem_id"]
            isOneToOne: false
            referencedRelation: "projeto_itens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orcamento_itens_projeto_item_origem_id_fkey"
            columns: ["projeto_item_origem_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra_detalhe"
            referencedColumns: ["projeto_item_id"]
          },
          {
            foreignKeyName: "orcamento_itens_projeto_item_origem_id_fkey"
            columns: ["projeto_item_origem_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra_item_orcamento"
            referencedColumns: ["projeto_item_id"]
          },
        ]
      }
      orcamentos: {
        Row: {
          aprovado_cliente_em: string | null
          aprovado_cliente_origem: string | null
          arquiteto_id: string | null
          cliente_id: string | null
          condicoes_pagamento: string | null
          created_at: string | null
          data_base_vencimento: string | null
          data_emissao: string | null
          data_inicio_pagamento: string | null
          desconto_global: number | null
          desconto_tipo: string
          empresa_id: string
          enviado_cliente_em: string | null
          enviado_cliente_por: string | null
          forma_pagamento: Database["public"]["Enums"]["pagamento_forma"] | null
          frete_tipo: string | null
          frete_valor: number | null
          id: string
          informacoes_cliente_id: string | null
          motivo_recusa_cliente: string | null
          natureza_operacao: string
          numero: string | null
          observacoes: string | null
          origem_connect_cod_orcamento: number | null
          origem_connect_importado_em: string | null
          perfil: string | null
          prazo_entrega_dias: number | null
          prazo_inicio_cobranca_dias: number | null
          prazo_pagamento_dias: number[] | null
          projeto_id: string | null
          recusado_cliente_em: string | null
          requer_revisao_financeira: boolean | null
          status: string | null
          token_aprovacao_cliente: string | null
          validade: string | null
          valor_sinal: number
          valor_total: number | null
          vendedor_id: string | null
        }
        Insert: {
          aprovado_cliente_em?: string | null
          aprovado_cliente_origem?: string | null
          arquiteto_id?: string | null
          cliente_id?: string | null
          condicoes_pagamento?: string | null
          created_at?: string | null
          data_base_vencimento?: string | null
          data_emissao?: string | null
          data_inicio_pagamento?: string | null
          desconto_global?: number | null
          desconto_tipo?: string
          empresa_id: string
          enviado_cliente_em?: string | null
          enviado_cliente_por?: string | null
          forma_pagamento?:
            | Database["public"]["Enums"]["pagamento_forma"]
            | null
          frete_tipo?: string | null
          frete_valor?: number | null
          id?: string
          informacoes_cliente_id?: string | null
          motivo_recusa_cliente?: string | null
          natureza_operacao?: string
          numero?: string | null
          observacoes?: string | null
          origem_connect_cod_orcamento?: number | null
          origem_connect_importado_em?: string | null
          perfil?: string | null
          prazo_entrega_dias?: number | null
          prazo_inicio_cobranca_dias?: number | null
          prazo_pagamento_dias?: number[] | null
          projeto_id?: string | null
          recusado_cliente_em?: string | null
          requer_revisao_financeira?: boolean | null
          status?: string | null
          token_aprovacao_cliente?: string | null
          validade?: string | null
          valor_sinal?: number
          valor_total?: number | null
          vendedor_id?: string | null
        }
        Update: {
          aprovado_cliente_em?: string | null
          aprovado_cliente_origem?: string | null
          arquiteto_id?: string | null
          cliente_id?: string | null
          condicoes_pagamento?: string | null
          created_at?: string | null
          data_base_vencimento?: string | null
          data_emissao?: string | null
          data_inicio_pagamento?: string | null
          desconto_global?: number | null
          desconto_tipo?: string
          empresa_id?: string
          enviado_cliente_em?: string | null
          enviado_cliente_por?: string | null
          forma_pagamento?:
            | Database["public"]["Enums"]["pagamento_forma"]
            | null
          frete_tipo?: string | null
          frete_valor?: number | null
          id?: string
          informacoes_cliente_id?: string | null
          motivo_recusa_cliente?: string | null
          natureza_operacao?: string
          numero?: string | null
          observacoes?: string | null
          origem_connect_cod_orcamento?: number | null
          origem_connect_importado_em?: string | null
          perfil?: string | null
          prazo_entrega_dias?: number | null
          prazo_inicio_cobranca_dias?: number | null
          prazo_pagamento_dias?: number[] | null
          projeto_id?: string | null
          recusado_cliente_em?: string | null
          requer_revisao_financeira?: boolean | null
          status?: string | null
          token_aprovacao_cliente?: string | null
          validade?: string | null
          valor_sinal?: number
          valor_total?: number | null
          vendedor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orcamentos_arquiteto_id_fkey"
            columns: ["arquiteto_id"]
            isOneToOne: false
            referencedRelation: "contatos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orcamentos_arquiteto_id_fkey"
            columns: ["arquiteto_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra"
            referencedColumns: ["fornecedor_id"]
          },
          {
            foreignKeyName: "orcamentos_arquiteto_id_fkey"
            columns: ["arquiteto_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra_item_orcamento"
            referencedColumns: ["fornecedor_id"]
          },
          {
            foreignKeyName: "orcamentos_arquiteto_id_fkey"
            columns: ["arquiteto_id"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["contato_id"]
          },
          {
            foreignKeyName: "orcamentos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "contatos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orcamentos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra"
            referencedColumns: ["fornecedor_id"]
          },
          {
            foreignKeyName: "orcamentos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra_item_orcamento"
            referencedColumns: ["fornecedor_id"]
          },
          {
            foreignKeyName: "orcamentos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["contato_id"]
          },
          {
            foreignKeyName: "orcamentos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orcamentos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_fornecedores_remessas"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "orcamentos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_fornecedores_resumo"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "orcamentos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_remessas_completa"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "orcamentos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_remessas_resumo_status"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "orcamentos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "orcamentos_informacoes_cliente_id_fkey"
            columns: ["informacoes_cliente_id"]
            isOneToOne: false
            referencedRelation: "informacoes_cliente_ubiqua"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orcamentos_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "projetos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orcamentos_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_financeiro_projetos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orcamentos_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_pipeline"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orcamentos_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_resumo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orcamentos_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_sem_empresa"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orcamentos_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_sem_responsavel"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orcamentos_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_separacoes_agenda"
            referencedColumns: ["projeto_id"]
          },
          {
            foreignKeyName: "orcamentos_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["projeto_id"]
          },
          {
            foreignKeyName: "orcamentos_vendedor_id_fkey"
            columns: ["vendedor_id"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orcamentos_vendedor_id_fkey"
            columns: ["vendedor_id"]
            isOneToOne: false
            referencedRelation: "vw_historico_faltas"
            referencedColumns: ["funcionario_id"]
          },
          {
            foreignKeyName: "orcamentos_vendedor_id_fkey"
            columns: ["vendedor_id"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["funcionario_id"]
          },
        ]
      }
      orcamentos_revenda_ubiqua: {
        Row: {
          aprovado_em: string | null
          aprovado_por: string | null
          cancelado_em: string | null
          cliente_id: string
          condicoes_pagamento: string | null
          created_at: string | null
          created_by: string | null
          data_validade: string
          desconto_percentual: number | null
          enviado_em: string | null
          id: string
          motivo_cancelamento: string | null
          motivo_rejeicao: string | null
          numero_orcamento: string
          observacoes: string | null
          prazo_entrega: string | null
          rejeitado_em: string | null
          status: string
          updated_at: string | null
          updated_by: string | null
          valor_desconto: number
          valor_subtotal: number
          valor_total: number
          versao: number | null
        }
        Insert: {
          aprovado_em?: string | null
          aprovado_por?: string | null
          cancelado_em?: string | null
          cliente_id: string
          condicoes_pagamento?: string | null
          created_at?: string | null
          created_by?: string | null
          data_validade?: string
          desconto_percentual?: number | null
          enviado_em?: string | null
          id?: string
          motivo_cancelamento?: string | null
          motivo_rejeicao?: string | null
          numero_orcamento: string
          observacoes?: string | null
          prazo_entrega?: string | null
          rejeitado_em?: string | null
          status?: string
          updated_at?: string | null
          updated_by?: string | null
          valor_desconto?: number
          valor_subtotal?: number
          valor_total?: number
          versao?: number | null
        }
        Update: {
          aprovado_em?: string | null
          aprovado_por?: string | null
          cancelado_em?: string | null
          cliente_id?: string
          condicoes_pagamento?: string | null
          created_at?: string | null
          created_by?: string | null
          data_validade?: string
          desconto_percentual?: number | null
          enviado_em?: string | null
          id?: string
          motivo_cancelamento?: string | null
          motivo_rejeicao?: string | null
          numero_orcamento?: string
          observacoes?: string | null
          prazo_entrega?: string | null
          rejeitado_em?: string | null
          status?: string
          updated_at?: string | null
          updated_by?: string | null
          valor_desconto?: number
          valor_subtotal?: number
          valor_total?: number
          versao?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "orcamentos_revenda_ubiqua_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "informacoes_cliente_ubiqua"
            referencedColumns: ["id"]
          },
        ]
      }
      papeis: {
        Row: {
          criado_em: string | null
          descricao: string | null
          id: string
          nome: string
        }
        Insert: {
          criado_em?: string | null
          descricao?: string | null
          id?: string
          nome: string
        }
        Update: {
          criado_em?: string | null
          descricao?: string | null
          id?: string
          nome?: string
        }
        Relationships: []
      }
      papel_permissoes: {
        Row: {
          acao: string | null
          id: string
          modulo_id: string | null
          papel_id: string
          system_id: string
        }
        Insert: {
          acao?: string | null
          id?: string
          modulo_id?: string | null
          papel_id: string
          system_id: string
        }
        Update: {
          acao?: string | null
          id?: string
          modulo_id?: string | null
          papel_id?: string
          system_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "papel_permissoes_modulo_id_fkey"
            columns: ["modulo_id"]
            isOneToOne: false
            referencedRelation: "modulos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "papel_permissoes_papel_id_fkey"
            columns: ["papel_id"]
            isOneToOne: false
            referencedRelation: "papeis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "papel_permissoes_system_id_fkey"
            columns: ["system_id"]
            isOneToOne: false
            referencedRelation: "systems"
            referencedColumns: ["id"]
          },
        ]
      }
      pedido_compra: {
        Row: {
          cod_fornecedor: number
          codigo_pedido: number
          created_at: string | null
          data_emissao: string
          data_vencimento: string | null
          id: string
          nome_fornecedor: string
          numero_parcela: number | null
          status: string | null
          updated_at: string | null
          valor_duplicata: number | null
          valor_nota: number
        }
        Insert: {
          cod_fornecedor: number
          codigo_pedido: number
          created_at?: string | null
          data_emissao: string
          data_vencimento?: string | null
          id?: string
          nome_fornecedor: string
          numero_parcela?: number | null
          status?: string | null
          updated_at?: string | null
          valor_duplicata?: number | null
          valor_nota?: number
        }
        Update: {
          cod_fornecedor?: number
          codigo_pedido?: number
          created_at?: string | null
          data_emissao?: string
          data_vencimento?: string | null
          id?: string
          nome_fornecedor?: string
          numero_parcela?: number | null
          status?: string | null
          updated_at?: string | null
          valor_duplicata?: number | null
          valor_nota?: number
        }
        Relationships: []
      }
      pedido_compra_item_origem: {
        Row: {
          criado_em: string
          criado_por: string | null
          id: string
          observacao: string | null
          pedido_compra_item_id: string
          projeto_item_id: string
          quantidade_atendida: number | null
        }
        Insert: {
          criado_em?: string
          criado_por?: string | null
          id?: string
          observacao?: string | null
          pedido_compra_item_id: string
          projeto_item_id: string
          quantidade_atendida?: number | null
        }
        Update: {
          criado_em?: string
          criado_por?: string | null
          id?: string
          observacao?: string | null
          pedido_compra_item_id?: string
          projeto_item_id?: string
          quantidade_atendida?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pedido_compra_item_origem_pedido_compra_item_id_fkey"
            columns: ["pedido_compra_item_id"]
            isOneToOne: false
            referencedRelation: "pedido_compra_itens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedido_compra_item_origem_projeto_item_id_fkey"
            columns: ["projeto_item_id"]
            isOneToOne: false
            referencedRelation: "projeto_itens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedido_compra_item_origem_projeto_item_id_fkey"
            columns: ["projeto_item_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra_detalhe"
            referencedColumns: ["projeto_item_id"]
          },
          {
            foreignKeyName: "pedido_compra_item_origem_projeto_item_id_fkey"
            columns: ["projeto_item_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra_item_orcamento"
            referencedColumns: ["projeto_item_id"]
          },
        ]
      }
      pedido_compra_itens: {
        Row: {
          criado_em: string
          custo_liquido: number | null
          custo_unitario: number
          id: string
          observacao: string | null
          pedido_id: string
          produto_id: string
          qtd_recebida: number
          quantidade: number
          solicitacao_id: string | null
          valor_icms: number | null
          valor_ipi: number | null
          valor_st: number | null
        }
        Insert: {
          criado_em?: string
          custo_liquido?: number | null
          custo_unitario: number
          id?: string
          observacao?: string | null
          pedido_id: string
          produto_id: string
          qtd_recebida?: number
          quantidade: number
          solicitacao_id?: string | null
          valor_icms?: number | null
          valor_ipi?: number | null
          valor_st?: number | null
        }
        Update: {
          criado_em?: string
          custo_liquido?: number | null
          custo_unitario?: number
          id?: string
          observacao?: string | null
          pedido_id?: string
          produto_id?: string
          qtd_recebida?: number
          quantidade?: number
          solicitacao_id?: string | null
          valor_icms?: number | null
          valor_ipi?: number | null
          valor_st?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pedido_compra_itens_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos_compra"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedido_compra_itens_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra_pedido_detalhe"
            referencedColumns: ["pedido_id"]
          },
          {
            foreignKeyName: "pedido_compra_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedido_compra_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "v_estoque_produtos"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "pedido_compra_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_estoque_liquido"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "pedido_compra_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_estoque_produtos"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "pedido_compra_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "pedido_compra_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_produtos_estoque_detalhado"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedido_compra_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_vendas_loja"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "pedido_compra_itens_solicitacao_id_fkey"
            columns: ["solicitacao_id"]
            isOneToOne: false
            referencedRelation: "solicitacoes_compra"
            referencedColumns: ["id"]
          },
        ]
      }
      pedido_compra_parcelas: {
        Row: {
          atualizado_em: string
          criado_em: string
          data_vencimento: string
          forma_pagamento: Database["public"]["Enums"]["pagamento_forma"] | null
          id: string
          numero_parcela: number
          observacao: string | null
          pedido_id: string
          status: string
          valor: number
        }
        Insert: {
          atualizado_em?: string
          criado_em?: string
          data_vencimento: string
          forma_pagamento?:
            | Database["public"]["Enums"]["pagamento_forma"]
            | null
          id?: string
          numero_parcela: number
          observacao?: string | null
          pedido_id: string
          status?: string
          valor: number
        }
        Update: {
          atualizado_em?: string
          criado_em?: string
          data_vencimento?: string
          forma_pagamento?:
            | Database["public"]["Enums"]["pagamento_forma"]
            | null
          id?: string
          numero_parcela?: number
          observacao?: string | null
          pedido_id?: string
          status?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "pedido_compra_parcelas_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos_compra"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedido_compra_parcelas_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra_pedido_detalhe"
            referencedColumns: ["pedido_id"]
          },
        ]
      }
      pedidos_compra: {
        Row: {
          aprovado_em: string | null
          aprovado_por: string | null
          atualizado_em: string
          cancelado_em: string | null
          cancelado_por: string | null
          condicoes_pagamento: string | null
          cotacao_id: string | null
          criado_em: string
          criado_por: string | null
          data_emissao: string
          data_prevista_entrega: string | null
          empresa_id: string | null
          fornecedor_id: string
          id: string
          motivo_cancelamento: string | null
          numero: string
          observacao: string | null
          perfil: string | null
          prazo_pagamento_dias: number[] | null
          status: string
          valor_total: number | null
        }
        Insert: {
          aprovado_em?: string | null
          aprovado_por?: string | null
          atualizado_em?: string
          cancelado_em?: string | null
          cancelado_por?: string | null
          condicoes_pagamento?: string | null
          cotacao_id?: string | null
          criado_em?: string
          criado_por?: string | null
          data_emissao?: string
          data_prevista_entrega?: string | null
          empresa_id?: string | null
          fornecedor_id: string
          id?: string
          motivo_cancelamento?: string | null
          numero: string
          observacao?: string | null
          perfil?: string | null
          prazo_pagamento_dias?: number[] | null
          status?: string
          valor_total?: number | null
        }
        Update: {
          aprovado_em?: string | null
          aprovado_por?: string | null
          atualizado_em?: string
          cancelado_em?: string | null
          cancelado_por?: string | null
          condicoes_pagamento?: string | null
          cotacao_id?: string | null
          criado_em?: string
          criado_por?: string | null
          data_emissao?: string
          data_prevista_entrega?: string | null
          empresa_id?: string | null
          fornecedor_id?: string
          id?: string
          motivo_cancelamento?: string | null
          numero?: string
          observacao?: string | null
          perfil?: string | null
          prazo_pagamento_dias?: number[] | null
          status?: string
          valor_total?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pedidos_compra_cotacao_id_fkey"
            columns: ["cotacao_id"]
            isOneToOne: false
            referencedRelation: "cotacoes_compra"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedidos_compra_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedidos_compra_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_fornecedores_remessas"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "pedidos_compra_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_fornecedores_resumo"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "pedidos_compra_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_remessas_completa"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "pedidos_compra_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_remessas_resumo_status"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "pedidos_compra_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "pedidos_compra_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "contatos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedidos_compra_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra"
            referencedColumns: ["fornecedor_id"]
          },
          {
            foreignKeyName: "pedidos_compra_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra_item_orcamento"
            referencedColumns: ["fornecedor_id"]
          },
          {
            foreignKeyName: "pedidos_compra_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["contato_id"]
          },
        ]
      }
      periodos_aquisitivos: {
        Row: {
          created_at: string | null
          data_fim: string
          data_inicio: string
          data_limite_gozo: string
          funcionario_id: string
          id: string
          status: string | null
        }
        Insert: {
          created_at?: string | null
          data_fim: string
          data_inicio: string
          data_limite_gozo: string
          funcionario_id: string
          id?: string
          status?: string | null
        }
        Update: {
          created_at?: string | null
          data_fim?: string
          data_inicio?: string
          data_limite_gozo?: string
          funcionario_id?: string
          id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "periodos_aquisitivos_funcionario_id_fkey"
            columns: ["funcionario_id"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "periodos_aquisitivos_funcionario_id_fkey"
            columns: ["funcionario_id"]
            isOneToOne: false
            referencedRelation: "vw_historico_faltas"
            referencedColumns: ["funcionario_id"]
          },
          {
            foreignKeyName: "periodos_aquisitivos_funcionario_id_fkey"
            columns: ["funcionario_id"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["funcionario_id"]
          },
        ]
      }
      plano_de_contas: {
        Row: {
          ativo: boolean
          codigo_connect: number
          created_at: string
          id: string
          nivel: number
          nome: string
          parent_id: string | null
          tipo: string | null
        }
        Insert: {
          ativo?: boolean
          codigo_connect: number
          created_at?: string
          id?: string
          nivel: number
          nome: string
          parent_id?: string | null
          tipo?: string | null
        }
        Update: {
          ativo?: boolean
          codigo_connect?: number
          created_at?: string
          id?: string
          nivel?: number
          nome?: string
          parent_id?: string | null
          tipo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "plano_de_contas_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "plano_de_contas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plano_de_contas_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["plano_contas_id"]
          },
        ]
      }
      produto_fornecedores: {
        Row: {
          ativo: boolean
          atualizado_em: string
          codigo_fornecedor: string | null
          criado_em: string
          custo_unitario: number | null
          fornecedor_id: string
          id: string
          observacao: string | null
          prazo_entrega_dias: number | null
          produto_id: string
          qtd_minima: number | null
          unidade: string | null
        }
        Insert: {
          ativo?: boolean
          atualizado_em?: string
          codigo_fornecedor?: string | null
          criado_em?: string
          custo_unitario?: number | null
          fornecedor_id: string
          id?: string
          observacao?: string | null
          prazo_entrega_dias?: number | null
          produto_id: string
          qtd_minima?: number | null
          unidade?: string | null
        }
        Update: {
          ativo?: boolean
          atualizado_em?: string
          codigo_fornecedor?: string | null
          criado_em?: string
          custo_unitario?: number | null
          fornecedor_id?: string
          id?: string
          observacao?: string | null
          prazo_entrega_dias?: number | null
          produto_id?: string
          qtd_minima?: number | null
          unidade?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "produto_fornecedores_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "contatos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produto_fornecedores_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra"
            referencedColumns: ["fornecedor_id"]
          },
          {
            foreignKeyName: "produto_fornecedores_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra_item_orcamento"
            referencedColumns: ["fornecedor_id"]
          },
          {
            foreignKeyName: "produto_fornecedores_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["contato_id"]
          },
          {
            foreignKeyName: "produto_fornecedores_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produto_fornecedores_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "v_estoque_produtos"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "produto_fornecedores_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_estoque_liquido"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "produto_fornecedores_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_estoque_produtos"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "produto_fornecedores_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "produto_fornecedores_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_produtos_estoque_detalhado"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produto_fornecedores_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_vendas_loja"
            referencedColumns: ["produto_id"]
          },
        ]
      }
      produtos: {
        Row: {
          ativo: boolean
          categoria: string | null
          categoria_id: string | null
          cest: string | null
          codigo_legado: number | null
          codigo_produto: number
          created_at: string
          cst: string | null
          custo_total: number | null
          descricao_tecnica: string | null
          estoque_disponivel: number | null
          estoque_minimo: number
          estoque_showroom: number | null
          estoque_total: number | null
          fornecedor_principal_id: string | null
          icms_entrada: number | null
          id: string
          ipi_entrada: number | null
          marca_id: string | null
          margem_lucro: number | null
          mascara_produto: string | null
          multiplo_compra: number
          ncm: string | null
          nome: string
          percentual_desconto_compra: number | null
          percentual_lucro: number | null
          porc_bdi: number | null
          porc_desconto: number | null
          porc_despesas: number | null
          porc_frete: number | null
          porc_st: number | null
          prazo_entrega_dias: number | null
          preco_custo: number | null
          preco_venda: number | null
          referencia: string | null
          sku: string | null
          status_comercial: string | null
          tipo_fiscal: string | null
          unidade: string | null
          updated_at: string
          valor_venda: number | null
          vl_custo_indireto: number | null
        }
        Insert: {
          ativo?: boolean
          categoria?: string | null
          categoria_id?: string | null
          cest?: string | null
          codigo_legado?: number | null
          codigo_produto?: number
          created_at?: string
          cst?: string | null
          custo_total?: number | null
          descricao_tecnica?: string | null
          estoque_disponivel?: number | null
          estoque_minimo?: number
          estoque_showroom?: number | null
          estoque_total?: number | null
          fornecedor_principal_id?: string | null
          icms_entrada?: number | null
          id?: string
          ipi_entrada?: number | null
          marca_id?: string | null
          margem_lucro?: number | null
          mascara_produto?: string | null
          multiplo_compra?: number
          ncm?: string | null
          nome: string
          percentual_desconto_compra?: number | null
          percentual_lucro?: number | null
          porc_bdi?: number | null
          porc_desconto?: number | null
          porc_despesas?: number | null
          porc_frete?: number | null
          porc_st?: number | null
          prazo_entrega_dias?: number | null
          preco_custo?: number | null
          preco_venda?: number | null
          referencia?: string | null
          sku?: string | null
          status_comercial?: string | null
          tipo_fiscal?: string | null
          unidade?: string | null
          updated_at?: string
          valor_venda?: number | null
          vl_custo_indireto?: number | null
        }
        Update: {
          ativo?: boolean
          categoria?: string | null
          categoria_id?: string | null
          cest?: string | null
          codigo_legado?: number | null
          codigo_produto?: number
          created_at?: string
          cst?: string | null
          custo_total?: number | null
          descricao_tecnica?: string | null
          estoque_disponivel?: number | null
          estoque_minimo?: number
          estoque_showroom?: number | null
          estoque_total?: number | null
          fornecedor_principal_id?: string | null
          icms_entrada?: number | null
          id?: string
          ipi_entrada?: number | null
          marca_id?: string | null
          margem_lucro?: number | null
          mascara_produto?: string | null
          multiplo_compra?: number
          ncm?: string | null
          nome?: string
          percentual_desconto_compra?: number | null
          percentual_lucro?: number | null
          porc_bdi?: number | null
          porc_desconto?: number | null
          porc_despesas?: number | null
          porc_frete?: number | null
          porc_st?: number | null
          prazo_entrega_dias?: number | null
          preco_custo?: number | null
          preco_venda?: number | null
          referencia?: string | null
          sku?: string | null
          status_comercial?: string | null
          tipo_fiscal?: string | null
          unidade?: string | null
          updated_at?: string
          valor_venda?: number | null
          vl_custo_indireto?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "produtos_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias_produto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produtos_fornecedor_principal_id_fkey"
            columns: ["fornecedor_principal_id"]
            isOneToOne: false
            referencedRelation: "contatos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produtos_fornecedor_principal_id_fkey"
            columns: ["fornecedor_principal_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra"
            referencedColumns: ["fornecedor_id"]
          },
          {
            foreignKeyName: "produtos_fornecedor_principal_id_fkey"
            columns: ["fornecedor_principal_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra_item_orcamento"
            referencedColumns: ["fornecedor_id"]
          },
          {
            foreignKeyName: "produtos_fornecedor_principal_id_fkey"
            columns: ["fornecedor_principal_id"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["contato_id"]
          },
          {
            foreignKeyName: "produtos_marca_id_fkey"
            columns: ["marca_id"]
            isOneToOne: false
            referencedRelation: "marcas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produtos_marca_id_fkey"
            columns: ["marca_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra"
            referencedColumns: ["marca_id"]
          },
          {
            foreignKeyName: "produtos_marca_id_fkey"
            columns: ["marca_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra_item_orcamento"
            referencedColumns: ["marca_id"]
          },
        ]
      }
      projeto_itens: {
        Row: {
          created_at: string
          desconto: number
          descricao: string
          id: string
          l_fixo: string | null
          orcamento_id: string | null
          orcamento_item_id: string | null
          preco_unitario: number
          produto_id: string | null
          projeto_id: string
          quantidade: number
          subtotal: number | null
          updated_at: string
          validado: boolean
        }
        Insert: {
          created_at?: string
          desconto?: number
          descricao: string
          id?: string
          l_fixo?: string | null
          orcamento_id?: string | null
          orcamento_item_id?: string | null
          preco_unitario: number
          produto_id?: string | null
          projeto_id: string
          quantidade: number
          subtotal?: number | null
          updated_at?: string
          validado?: boolean
        }
        Update: {
          created_at?: string
          desconto?: number
          descricao?: string
          id?: string
          l_fixo?: string | null
          orcamento_id?: string | null
          orcamento_item_id?: string | null
          preco_unitario?: number
          produto_id?: string | null
          projeto_id?: string
          quantidade?: number
          subtotal?: number | null
          updated_at?: string
          validado?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "projeto_itens_orcamento_id_fkey"
            columns: ["orcamento_id"]
            isOneToOne: false
            referencedRelation: "orcamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_itens_orcamento_id_fkey"
            columns: ["orcamento_id"]
            isOneToOne: false
            referencedRelation: "vw_orcamentos_aprovacao_financeira_auditoria"
            referencedColumns: ["orcamento_id"]
          },
          {
            foreignKeyName: "projeto_itens_orcamento_id_fkey"
            columns: ["orcamento_id"]
            isOneToOne: false
            referencedRelation: "vw_orcamentos_prazo_entrega"
            referencedColumns: ["orcamento_id"]
          },
          {
            foreignKeyName: "projeto_itens_orcamento_item_id_fkey"
            columns: ["orcamento_item_id"]
            isOneToOne: false
            referencedRelation: "orcamento_itens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "v_estoque_produtos"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "projeto_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_estoque_liquido"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "projeto_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_estoque_produtos"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "projeto_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "projeto_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_produtos_estoque_detalhado"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_vendas_loja"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "projeto_itens_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "projetos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_itens_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_financeiro_projetos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_itens_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_pipeline"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_itens_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_resumo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_itens_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_sem_empresa"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_itens_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_sem_responsavel"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_itens_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_separacoes_agenda"
            referencedColumns: ["projeto_id"]
          },
          {
            foreignKeyName: "projeto_itens_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["projeto_id"]
          },
        ]
      }
      projeto_parcelas: {
        Row: {
          comprovante_url: string | null
          created_at: string | null
          data_fechamento: string | null
          data_pagamento: string | null
          data_vencimento: string | null
          desconto: number
          descricao: string | null
          forma_pagamento: Database["public"]["Enums"]["pagamento_forma"] | null
          id: string
          juros: number
          multa: number
          numero_parcela: number
          observacoes: string | null
          orcamento_id: string | null
          projeto_id: string
          status: Database["public"]["Enums"]["parcela_status"]
          transacao_id: string | null
          valor: number
          valor_pago: number | null
        }
        Insert: {
          comprovante_url?: string | null
          created_at?: string | null
          data_fechamento?: string | null
          data_pagamento?: string | null
          data_vencimento?: string | null
          desconto?: number
          descricao?: string | null
          forma_pagamento?:
            | Database["public"]["Enums"]["pagamento_forma"]
            | null
          id?: string
          juros?: number
          multa?: number
          numero_parcela: number
          observacoes?: string | null
          orcamento_id?: string | null
          projeto_id: string
          status?: Database["public"]["Enums"]["parcela_status"]
          transacao_id?: string | null
          valor: number
          valor_pago?: number | null
        }
        Update: {
          comprovante_url?: string | null
          created_at?: string | null
          data_fechamento?: string | null
          data_pagamento?: string | null
          data_vencimento?: string | null
          desconto?: number
          descricao?: string | null
          forma_pagamento?:
            | Database["public"]["Enums"]["pagamento_forma"]
            | null
          id?: string
          juros?: number
          multa?: number
          numero_parcela?: number
          observacoes?: string | null
          orcamento_id?: string | null
          projeto_id?: string
          status?: Database["public"]["Enums"]["parcela_status"]
          transacao_id?: string | null
          valor?: number
          valor_pago?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "projeto_parcelas_orcamento_id_fkey"
            columns: ["orcamento_id"]
            isOneToOne: false
            referencedRelation: "orcamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_parcelas_orcamento_id_fkey"
            columns: ["orcamento_id"]
            isOneToOne: false
            referencedRelation: "vw_orcamentos_aprovacao_financeira_auditoria"
            referencedColumns: ["orcamento_id"]
          },
          {
            foreignKeyName: "projeto_parcelas_orcamento_id_fkey"
            columns: ["orcamento_id"]
            isOneToOne: false
            referencedRelation: "vw_orcamentos_prazo_entrega"
            referencedColumns: ["orcamento_id"]
          },
          {
            foreignKeyName: "projeto_parcelas_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "projetos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_parcelas_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_financeiro_projetos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_parcelas_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_pipeline"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_parcelas_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_resumo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_parcelas_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_sem_empresa"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_parcelas_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_sem_responsavel"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_parcelas_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_separacoes_agenda"
            referencedColumns: ["projeto_id"]
          },
          {
            foreignKeyName: "projeto_parcelas_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["projeto_id"]
          },
          {
            foreignKeyName: "projeto_parcelas_transacao_id_fkey"
            columns: ["transacao_id"]
            isOneToOne: false
            referencedRelation: "transacoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_parcelas_transacao_id_fkey"
            columns: ["transacao_id"]
            isOneToOne: false
            referencedRelation: "v_financeiro_realizado"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_parcelas_transacao_id_fkey"
            columns: ["transacao_id"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["id"]
          },
        ]
      }
      projeto_parcelas_backup_migration: {
        Row: {
          comprovante_url: string | null
          created_at: string | null
          data_fechamento: string | null
          data_pagamento: string | null
          data_vencimento: string | null
          desconto: number | null
          descricao: string | null
          forma_pagamento: Database["public"]["Enums"]["pagamento_forma"] | null
          id: string | null
          juros: number | null
          multa: number | null
          numero_parcela: number | null
          observacoes: string | null
          projeto_id: string | null
          status: Database["public"]["Enums"]["parcela_status"] | null
          transacao_id: string | null
          valor: number | null
          valor_pago: number | null
        }
        Insert: {
          comprovante_url?: string | null
          created_at?: string | null
          data_fechamento?: string | null
          data_pagamento?: string | null
          data_vencimento?: string | null
          desconto?: number | null
          descricao?: string | null
          forma_pagamento?:
            | Database["public"]["Enums"]["pagamento_forma"]
            | null
          id?: string | null
          juros?: number | null
          multa?: number | null
          numero_parcela?: number | null
          observacoes?: string | null
          projeto_id?: string | null
          status?: Database["public"]["Enums"]["parcela_status"] | null
          transacao_id?: string | null
          valor?: number | null
          valor_pago?: number | null
        }
        Update: {
          comprovante_url?: string | null
          created_at?: string | null
          data_fechamento?: string | null
          data_pagamento?: string | null
          data_vencimento?: string | null
          desconto?: number | null
          descricao?: string | null
          forma_pagamento?:
            | Database["public"]["Enums"]["pagamento_forma"]
            | null
          id?: string | null
          juros?: number | null
          multa?: number | null
          numero_parcela?: number | null
          observacoes?: string | null
          projeto_id?: string | null
          status?: Database["public"]["Enums"]["parcela_status"] | null
          transacao_id?: string | null
          valor?: number | null
          valor_pago?: number | null
        }
        Relationships: []
      }
      projeto_produtos: {
        Row: {
          created_at: string | null
          id: string
          produto_id: string | null
          projeto_id: string | null
          quantidade: number
          valor_total: number | null
          valor_unitario: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          produto_id?: string | null
          projeto_id?: string | null
          quantidade?: number
          valor_total?: number | null
          valor_unitario?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          produto_id?: string | null
          projeto_id?: string | null
          quantidade?: number
          valor_total?: number | null
          valor_unitario?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "projeto_produtos_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_produtos_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "v_estoque_produtos"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "projeto_produtos_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_estoque_liquido"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "projeto_produtos_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_estoque_produtos"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "projeto_produtos_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "projeto_produtos_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_produtos_estoque_detalhado"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_produtos_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_vendas_loja"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "projeto_produtos_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "projetos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_produtos_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_financeiro_projetos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_produtos_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_pipeline"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_produtos_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_resumo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_produtos_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_sem_empresa"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_produtos_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_sem_responsavel"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_produtos_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_separacoes_agenda"
            referencedColumns: ["projeto_id"]
          },
          {
            foreignKeyName: "projeto_produtos_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["projeto_id"]
          },
        ]
      }
      projeto_sinal: {
        Row: {
          comprovante_url: string | null
          created_at: string
          data_pagamento: string | null
          forma_pagamento: Database["public"]["Enums"]["pagamento_forma"] | null
          id: string
          observacoes: string | null
          projeto_id: string
          status: Database["public"]["Enums"]["sinal_status"]
          transacao_id: string | null
          updated_at: string
          valor: number
        }
        Insert: {
          comprovante_url?: string | null
          created_at?: string
          data_pagamento?: string | null
          forma_pagamento?:
            | Database["public"]["Enums"]["pagamento_forma"]
            | null
          id?: string
          observacoes?: string | null
          projeto_id: string
          status?: Database["public"]["Enums"]["sinal_status"]
          transacao_id?: string | null
          updated_at?: string
          valor: number
        }
        Update: {
          comprovante_url?: string | null
          created_at?: string
          data_pagamento?: string | null
          forma_pagamento?:
            | Database["public"]["Enums"]["pagamento_forma"]
            | null
          id?: string
          observacoes?: string | null
          projeto_id?: string
          status?: Database["public"]["Enums"]["sinal_status"]
          transacao_id?: string | null
          updated_at?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "projeto_sinal_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: true
            referencedRelation: "projetos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_sinal_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: true
            referencedRelation: "vw_financeiro_projetos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_sinal_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: true
            referencedRelation: "vw_projetos_pipeline"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_sinal_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: true
            referencedRelation: "vw_projetos_resumo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_sinal_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: true
            referencedRelation: "vw_projetos_sem_empresa"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_sinal_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: true
            referencedRelation: "vw_projetos_sem_responsavel"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_sinal_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: true
            referencedRelation: "vw_separacoes_agenda"
            referencedColumns: ["projeto_id"]
          },
          {
            foreignKeyName: "projeto_sinal_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: true
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["projeto_id"]
          },
          {
            foreignKeyName: "projeto_sinal_transacao_id_fkey"
            columns: ["transacao_id"]
            isOneToOne: false
            referencedRelation: "transacoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_sinal_transacao_id_fkey"
            columns: ["transacao_id"]
            isOneToOne: false
            referencedRelation: "v_financeiro_realizado"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_sinal_transacao_id_fkey"
            columns: ["transacao_id"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["id"]
          },
        ]
      }
      projetos: {
        Row: {
          area_do_projeto: Json | null
          arquiteto_id: string | null
          arquivado: boolean | null
          cidade: string | null
          cliente_id: string | null
          codigo: string
          codigo_legado: number | null
          created_at: string | null
          created_by: string | null
          data_entrada: string | null
          empresa_id: string | null
          equipe_id: string | null
          equipe_responsavel_obra_id: string | null
          estado: string | null
          historico: Json
          id: string
          link_sharepoint: string | null
          nivel_estrategico: Database["public"]["Enums"]["projeto_nivel"] | null
          nome: string
          "Nome Arquiteto": string | null
          perfil: string | null
          responsavel_id: string | null
          responsavel_nome: string | null
          responsavel_obra_id: string | null
          status: Database["public"]["Enums"]["projeto_status"] | null
          updated_at: string
          valor_total: number
        }
        Insert: {
          area_do_projeto?: Json | null
          arquiteto_id?: string | null
          arquivado?: boolean | null
          cidade?: string | null
          cliente_id?: string | null
          codigo: string
          codigo_legado?: number | null
          created_at?: string | null
          created_by?: string | null
          data_entrada?: string | null
          empresa_id?: string | null
          equipe_id?: string | null
          equipe_responsavel_obra_id?: string | null
          estado?: string | null
          historico?: Json
          id?: string
          link_sharepoint?: string | null
          nivel_estrategico?:
            | Database["public"]["Enums"]["projeto_nivel"]
            | null
          nome: string
          "Nome Arquiteto"?: string | null
          perfil?: string | null
          responsavel_id?: string | null
          responsavel_nome?: string | null
          responsavel_obra_id?: string | null
          status?: Database["public"]["Enums"]["projeto_status"] | null
          updated_at?: string
          valor_total?: number
        }
        Update: {
          area_do_projeto?: Json | null
          arquiteto_id?: string | null
          arquivado?: boolean | null
          cidade?: string | null
          cliente_id?: string | null
          codigo?: string
          codigo_legado?: number | null
          created_at?: string | null
          created_by?: string | null
          data_entrada?: string | null
          empresa_id?: string | null
          equipe_id?: string | null
          equipe_responsavel_obra_id?: string | null
          estado?: string | null
          historico?: Json
          id?: string
          link_sharepoint?: string | null
          nivel_estrategico?:
            | Database["public"]["Enums"]["projeto_nivel"]
            | null
          nome?: string
          "Nome Arquiteto"?: string | null
          perfil?: string | null
          responsavel_id?: string | null
          responsavel_nome?: string | null
          responsavel_obra_id?: string | null
          status?: Database["public"]["Enums"]["projeto_status"] | null
          updated_at?: string
          valor_total?: number
        }
        Relationships: [
          {
            foreignKeyName: "projetos_arquiteto_id_fkey"
            columns: ["arquiteto_id"]
            isOneToOne: false
            referencedRelation: "contatos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projetos_arquiteto_id_fkey"
            columns: ["arquiteto_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra"
            referencedColumns: ["fornecedor_id"]
          },
          {
            foreignKeyName: "projetos_arquiteto_id_fkey"
            columns: ["arquiteto_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra_item_orcamento"
            referencedColumns: ["fornecedor_id"]
          },
          {
            foreignKeyName: "projetos_arquiteto_id_fkey"
            columns: ["arquiteto_id"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["contato_id"]
          },
          {
            foreignKeyName: "projetos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "contatos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projetos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra"
            referencedColumns: ["fornecedor_id"]
          },
          {
            foreignKeyName: "projetos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra_item_orcamento"
            referencedColumns: ["fornecedor_id"]
          },
          {
            foreignKeyName: "projetos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["contato_id"]
          },
          {
            foreignKeyName: "projetos_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projetos_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "vw_projetos_por_responsavel"
            referencedColumns: ["usuario_id"]
          },
          {
            foreignKeyName: "projetos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projetos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_fornecedores_remessas"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "projetos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_fornecedores_resumo"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "projetos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_remessas_completa"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "projetos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_remessas_resumo_status"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "projetos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "projetos_equipe_id_fkey"
            columns: ["equipe_id"]
            isOneToOne: false
            referencedRelation: "equipes_projetos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projetos_equipe_id_fkey"
            columns: ["equipe_id"]
            isOneToOne: false
            referencedRelation: "vw_comissao_mensal"
            referencedColumns: ["equipe_id"]
          },
          {
            foreignKeyName: "projetos_equipe_responsavel_obra_id_fkey"
            columns: ["equipe_responsavel_obra_id"]
            isOneToOne: false
            referencedRelation: "equipes_projetos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projetos_equipe_responsavel_obra_id_fkey"
            columns: ["equipe_responsavel_obra_id"]
            isOneToOne: false
            referencedRelation: "vw_comissao_mensal"
            referencedColumns: ["equipe_id"]
          },
          {
            foreignKeyName: "projetos_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projetos_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_por_responsavel"
            referencedColumns: ["usuario_id"]
          },
          {
            foreignKeyName: "projetos_responsavel_obra_id_fkey"
            columns: ["responsavel_obra_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projetos_responsavel_obra_id_fkey"
            columns: ["responsavel_obra_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_por_responsavel"
            referencedColumns: ["usuario_id"]
          },
        ]
      }
      projetos_fechados: {
        Row: {
          cod: string | null
          created_at: string | null
          data_fechamento: string | null
          id: string
          valor_fechado: number | null
        }
        Insert: {
          cod?: string | null
          created_at?: string | null
          data_fechamento?: string | null
          id?: string
          valor_fechado?: number | null
        }
        Update: {
          cod?: string | null
          created_at?: string | null
          data_fechamento?: string | null
          id?: string
          valor_fechado?: number | null
        }
        Relationships: []
      }
      quote_history: {
        Row: {
          acao: string
          created_at: string
          created_by: string | null
          id: string
          quote_id: string
        }
        Insert: {
          acao: string
          created_at?: string
          created_by?: string | null
          id?: string
          quote_id: string
        }
        Update: {
          acao?: string
          created_at?: string
          created_by?: string | null
          id?: string
          quote_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quote_history_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          created_at: string
          data_aprovacao: string | null
          empresa: string | null
          id: string
          items: Json
          observacoes: string | null
          status: string
          valor_total: number
        }
        Insert: {
          created_at?: string
          data_aprovacao?: string | null
          empresa?: string | null
          id?: string
          items?: Json
          observacoes?: string | null
          status?: string
          valor_total?: number
        }
        Update: {
          created_at?: string
          data_aprovacao?: string | null
          empresa?: string | null
          id?: string
          items?: Json
          observacoes?: string | null
          status?: string
          valor_total?: number
        }
        Relationships: []
      }
      recebimento_itens: {
        Row: {
          criado_em: string
          divergencia: string | null
          id: string
          pedido_item_id: string
          produto_id: string
          quantidade_recebida: number
          recebimento_id: string
        }
        Insert: {
          criado_em?: string
          divergencia?: string | null
          id?: string
          pedido_item_id: string
          produto_id: string
          quantidade_recebida: number
          recebimento_id: string
        }
        Update: {
          criado_em?: string
          divergencia?: string | null
          id?: string
          pedido_item_id?: string
          produto_id?: string
          quantidade_recebida?: number
          recebimento_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recebimento_itens_pedido_item_id_fkey"
            columns: ["pedido_item_id"]
            isOneToOne: false
            referencedRelation: "pedido_compra_itens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recebimento_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recebimento_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "v_estoque_produtos"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "recebimento_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_estoque_liquido"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "recebimento_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_estoque_produtos"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "recebimento_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "recebimento_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_produtos_estoque_detalhado"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recebimento_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_vendas_loja"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "recebimento_itens_recebimento_id_fkey"
            columns: ["recebimento_id"]
            isOneToOne: false
            referencedRelation: "recebimentos_compra"
            referencedColumns: ["id"]
          },
        ]
      }
      recebimentos_compra: {
        Row: {
          criado_em: string
          data_recebimento: string
          id: string
          numero_nota: string | null
          observacao: string | null
          pedido_id: string
          recebido_por: string | null
        }
        Insert: {
          criado_em?: string
          data_recebimento?: string
          id?: string
          numero_nota?: string | null
          observacao?: string | null
          pedido_id: string
          recebido_por?: string | null
        }
        Update: {
          criado_em?: string
          data_recebimento?: string
          id?: string
          numero_nota?: string | null
          observacao?: string | null
          pedido_id?: string
          recebido_por?: string | null
        }
        Relationships: []
      }
      remessas: {
        Row: {
          arquivo_remessa: string | null
          arquivo_retorno: string | null
          codigo_barras: string | null
          created_at: string | null
          data_pagamento: string | null
          descricao: string
          empresa_id: string | null
          fornecedor_id: string | null
          id: string
          linha_digitavel: string | null
          nosso_numero: string | null
          observacoes: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
          valor: number
          valor_pago: number | null
          vencimento: string | null
        }
        Insert: {
          arquivo_remessa?: string | null
          arquivo_retorno?: string | null
          codigo_barras?: string | null
          created_at?: string | null
          data_pagamento?: string | null
          descricao: string
          empresa_id?: string | null
          fornecedor_id?: string | null
          id?: string
          linha_digitavel?: string | null
          nosso_numero?: string | null
          observacoes?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          valor?: number
          valor_pago?: number | null
          vencimento?: string | null
        }
        Update: {
          arquivo_remessa?: string | null
          arquivo_retorno?: string | null
          codigo_barras?: string | null
          created_at?: string | null
          data_pagamento?: string | null
          descricao?: string
          empresa_id?: string | null
          fornecedor_id?: string | null
          id?: string
          linha_digitavel?: string | null
          nosso_numero?: string | null
          observacoes?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          valor?: number
          valor_pago?: number | null
          vencimento?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "remessas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "remessas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_fornecedores_remessas"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "remessas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_fornecedores_resumo"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "remessas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_remessas_completa"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "remessas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_remessas_resumo_status"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "remessas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "remessas_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "fornecedores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "remessas_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "vw_fornecedores_remessas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "remessas_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "vw_fornecedores_resumo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "remessas_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "vw_remessas_completa"
            referencedColumns: ["fornecedor_id"]
          },
        ]
      }
      retorno_bancario_arquivos: {
        Row: {
          conta: string | null
          forcado: boolean
          hash_conteudo: string
          id: string
          nome_arquivo: string
          processado_em: string
          processado_por: string | null
          total_aplicados: number
          total_divergentes: number
          total_nao_encontrados: number
          total_registros: number
        }
        Insert: {
          conta?: string | null
          forcado?: boolean
          hash_conteudo: string
          id?: string
          nome_arquivo: string
          processado_em?: string
          processado_por?: string | null
          total_aplicados?: number
          total_divergentes?: number
          total_nao_encontrados?: number
          total_registros?: number
        }
        Update: {
          conta?: string | null
          forcado?: boolean
          hash_conteudo?: string
          id?: string
          nome_arquivo?: string
          processado_em?: string
          processado_por?: string | null
          total_aplicados?: number
          total_divergentes?: number
          total_nao_encontrados?: number
          total_registros?: number
        }
        Relationships: [
          {
            foreignKeyName: "retorno_bancario_arquivos_processado_por_fkey"
            columns: ["processado_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "retorno_bancario_arquivos_processado_por_fkey"
            columns: ["processado_por"]
            isOneToOne: false
            referencedRelation: "vw_projetos_por_responsavel"
            referencedColumns: ["usuario_id"]
          },
        ]
      }
      retorno_bancario_registros: {
        Row: {
          arquivo_id: string
          boleto_id: string | null
          data_pagamento: string | null
          id: string
          motivo_divergencia: string | null
          nosso_numero: string
          ocorrencia_codigo: string | null
          parcela_id: string | null
          status_aplicacao: string
          transacao_id: string | null
          valor_esperado: number | null
          valor_recebido: number | null
        }
        Insert: {
          arquivo_id: string
          boleto_id?: string | null
          data_pagamento?: string | null
          id?: string
          motivo_divergencia?: string | null
          nosso_numero: string
          ocorrencia_codigo?: string | null
          parcela_id?: string | null
          status_aplicacao: string
          transacao_id?: string | null
          valor_esperado?: number | null
          valor_recebido?: number | null
        }
        Update: {
          arquivo_id?: string
          boleto_id?: string | null
          data_pagamento?: string | null
          id?: string
          motivo_divergencia?: string | null
          nosso_numero?: string
          ocorrencia_codigo?: string | null
          parcela_id?: string | null
          status_aplicacao?: string
          transacao_id?: string | null
          valor_esperado?: number | null
          valor_recebido?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "retorno_bancario_registros_arquivo_id_fkey"
            columns: ["arquivo_id"]
            isOneToOne: false
            referencedRelation: "retorno_bancario_arquivos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "retorno_bancario_registros_boleto_id_fkey"
            columns: ["boleto_id"]
            isOneToOne: false
            referencedRelation: "boletos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "retorno_bancario_registros_parcela_id_fkey"
            columns: ["parcela_id"]
            isOneToOne: false
            referencedRelation: "projeto_parcelas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "retorno_bancario_registros_parcela_id_fkey"
            columns: ["parcela_id"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["parcela_crm_id"]
          },
          {
            foreignKeyName: "retorno_bancario_registros_transacao_id_fkey"
            columns: ["transacao_id"]
            isOneToOne: false
            referencedRelation: "transacoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "retorno_bancario_registros_transacao_id_fkey"
            columns: ["transacao_id"]
            isOneToOne: false
            referencedRelation: "v_financeiro_realizado"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "retorno_bancario_registros_transacao_id_fkey"
            columns: ["transacao_id"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["id"]
          },
        ]
      }
      retornos_processados: {
        Row: {
          data_upload: string
          empresa_id: string | null
          id: string
          nome_arquivo: string
          processado: boolean | null
          quantidade_confirmacoes: number | null
          quantidade_liquidacoes: number | null
        }
        Insert: {
          data_upload?: string
          empresa_id?: string | null
          id?: string
          nome_arquivo: string
          processado?: boolean | null
          quantidade_confirmacoes?: number | null
          quantidade_liquidacoes?: number | null
        }
        Update: {
          data_upload?: string
          empresa_id?: string | null
          id?: string
          nome_arquivo?: string
          processado?: boolean | null
          quantidade_confirmacoes?: number | null
          quantidade_liquidacoes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "retornos_processados_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "retornos_processados_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_fornecedores_remessas"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "retornos_processados_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_fornecedores_resumo"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "retornos_processados_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_remessas_completa"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "retornos_processados_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_remessas_resumo_status"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "retornos_processados_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["empresa_id"]
          },
        ]
      }
      revenda_ubiqua: {
        Row: {
          cod_fornecedor: number | null
          cod_marca: number | null
          cod_produto: number | null
          cor: string | null
          created_at: string | null
          desc_marca: string | null
          desc_produto: string | null
          descricao: string | null
          disponivel: number | null
          empresa_id: string | null
          estoque: number | null
          fonte_planilha1: boolean | null
          fonte_planilha2: boolean | null
          fonte_planilha3: boolean | null
          id: number
          imagem_catalogo_url: string | null
          itens_vendidos: number | null
          nm_fornecedor: string | null
          ordem: number | null
          referencia: string
          slug: string | null
          updated_at: string | null
          valor_revenda: number | null
          vl_custo_indireto: number | null
          vl_custo_produto: number | null
          vl_custo_total_tabela: number | null
          vl_venda_produto: number | null
        }
        Insert: {
          cod_fornecedor?: number | null
          cod_marca?: number | null
          cod_produto?: number | null
          cor?: string | null
          created_at?: string | null
          desc_marca?: string | null
          desc_produto?: string | null
          descricao?: string | null
          disponivel?: number | null
          empresa_id?: string | null
          estoque?: number | null
          fonte_planilha1?: boolean | null
          fonte_planilha2?: boolean | null
          fonte_planilha3?: boolean | null
          id?: number
          imagem_catalogo_url?: string | null
          itens_vendidos?: number | null
          nm_fornecedor?: string | null
          ordem?: number | null
          referencia: string
          slug?: string | null
          updated_at?: string | null
          valor_revenda?: number | null
          vl_custo_indireto?: number | null
          vl_custo_produto?: number | null
          vl_custo_total_tabela?: number | null
          vl_venda_produto?: number | null
        }
        Update: {
          cod_fornecedor?: number | null
          cod_marca?: number | null
          cod_produto?: number | null
          cor?: string | null
          created_at?: string | null
          desc_marca?: string | null
          desc_produto?: string | null
          descricao?: string | null
          disponivel?: number | null
          empresa_id?: string | null
          estoque?: number | null
          fonte_planilha1?: boolean | null
          fonte_planilha2?: boolean | null
          fonte_planilha3?: boolean | null
          id?: number
          imagem_catalogo_url?: string | null
          itens_vendidos?: number | null
          nm_fornecedor?: string | null
          ordem?: number | null
          referencia?: string
          slug?: string | null
          updated_at?: string | null
          valor_revenda?: number | null
          vl_custo_indireto?: number | null
          vl_custo_produto?: number | null
          vl_custo_total_tabela?: number | null
          vl_venda_produto?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_empresa"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_empresa"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_fornecedores_remessas"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "fk_empresa"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_fornecedores_resumo"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "fk_empresa"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_remessas_completa"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "fk_empresa"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_remessas_resumo_status"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "fk_empresa"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["empresa_id"]
          },
        ]
      }
      separacao_arquivos: {
        Row: {
          created_at: string | null
          id: string
          nome_arquivo: string | null
          ordem: number | null
          separacao_id: string | null
          tamanho_bytes: number | null
          tipo_arquivo: string | null
          url_arquivo: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          nome_arquivo?: string | null
          ordem?: number | null
          separacao_id?: string | null
          tamanho_bytes?: number | null
          tipo_arquivo?: string | null
          url_arquivo?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          nome_arquivo?: string | null
          ordem?: number | null
          separacao_id?: string | null
          tamanho_bytes?: number | null
          tipo_arquivo?: string | null
          url_arquivo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "separacao_arquivos_separacao_id_fkey"
            columns: ["separacao_id"]
            isOneToOne: false
            referencedRelation: "separacoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "separacao_arquivos_separacao_id_fkey"
            columns: ["separacao_id"]
            isOneToOne: false
            referencedRelation: "vw_separacoes_agenda"
            referencedColumns: ["separacao_id"]
          },
          {
            foreignKeyName: "separacao_arquivos_separacao_id_fkey"
            columns: ["separacao_id"]
            isOneToOne: false
            referencedRelation: "vw_vendas_loja"
            referencedColumns: ["separacao_id"]
          },
        ]
      }
      separacao_itens: {
        Row: {
          created_at: string
          descricao: string
          id: string
          observacoes: string | null
          produto_id: string | null
          projeto_item_id: string | null
          quantidade: number
          separacao_id: string
          separado: boolean
          unidade: string | null
        }
        Insert: {
          created_at?: string
          descricao: string
          id?: string
          observacoes?: string | null
          produto_id?: string | null
          projeto_item_id?: string | null
          quantidade?: number
          separacao_id: string
          separado?: boolean
          unidade?: string | null
        }
        Update: {
          created_at?: string
          descricao?: string
          id?: string
          observacoes?: string | null
          produto_id?: string | null
          projeto_item_id?: string | null
          quantidade?: number
          separacao_id?: string
          separado?: boolean
          unidade?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "separacao_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "separacao_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "v_estoque_produtos"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "separacao_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_estoque_liquido"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "separacao_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_estoque_produtos"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "separacao_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "separacao_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_produtos_estoque_detalhado"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "separacao_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_vendas_loja"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "separacao_itens_projeto_item_id_fkey"
            columns: ["projeto_item_id"]
            isOneToOne: false
            referencedRelation: "projeto_itens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "separacao_itens_projeto_item_id_fkey"
            columns: ["projeto_item_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra_detalhe"
            referencedColumns: ["projeto_item_id"]
          },
          {
            foreignKeyName: "separacao_itens_projeto_item_id_fkey"
            columns: ["projeto_item_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra_item_orcamento"
            referencedColumns: ["projeto_item_id"]
          },
          {
            foreignKeyName: "separacao_itens_separacao_id_fkey"
            columns: ["separacao_id"]
            isOneToOne: false
            referencedRelation: "separacoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "separacao_itens_separacao_id_fkey"
            columns: ["separacao_id"]
            isOneToOne: false
            referencedRelation: "vw_separacoes_agenda"
            referencedColumns: ["separacao_id"]
          },
          {
            foreignKeyName: "separacao_itens_separacao_id_fkey"
            columns: ["separacao_id"]
            isOneToOne: false
            referencedRelation: "vw_vendas_loja"
            referencedColumns: ["separacao_id"]
          },
        ]
      }
      separacoes: {
        Row: {
          cliente: string | null
          cliente_id: string | null
          codigo_obra: string | null
          codigo_rastreamento: string | null
          created_at: string
          data_entrega: string | null
          data_entrega_original: string | null
          data_inicio_separacao: string | null
          delivery_type: string | null
          endereco: string | null
          endereco_entrega: string | null
          garantia_detalhes: string | null
          garantia_motivo: string | null
          garantia_peca: string | null
          gestora_equipe: string | null
          id: string
          inclui_garantia: boolean | null
          material_conteudo: Json | null
          material_tipo: string | null
          nivel_complexidade: string | null
          numero_entrega: string | null
          numero_venda: string | null
          observacoes: string | null
          observacoes_internas: string | null
          order_in_route: boolean | null
          projeto_id: string | null
          reagendamentos: number
          responsavel_id: string | null
          responsavel_recebimento: string | null
          scheduled_time: string | null
          separacoes_parciais: Json | null
          solicitante: string | null
          status: Database["public"]["Enums"]["separacao_status"]
          telefone: string | null
          tipo_entrega: string | null
          tipo_pedido: string | null
          transportadora_nome: string | null
          updated_at: string
        }
        Insert: {
          cliente?: string | null
          cliente_id?: string | null
          codigo_obra?: string | null
          codigo_rastreamento?: string | null
          created_at?: string
          data_entrega?: string | null
          data_entrega_original?: string | null
          data_inicio_separacao?: string | null
          delivery_type?: string | null
          endereco?: string | null
          endereco_entrega?: string | null
          garantia_detalhes?: string | null
          garantia_motivo?: string | null
          garantia_peca?: string | null
          gestora_equipe?: string | null
          id?: string
          inclui_garantia?: boolean | null
          material_conteudo?: Json | null
          material_tipo?: string | null
          nivel_complexidade?: string | null
          numero_entrega?: string | null
          numero_venda?: string | null
          observacoes?: string | null
          observacoes_internas?: string | null
          order_in_route?: boolean | null
          projeto_id?: string | null
          reagendamentos?: number
          responsavel_id?: string | null
          responsavel_recebimento?: string | null
          scheduled_time?: string | null
          separacoes_parciais?: Json | null
          solicitante?: string | null
          status?: Database["public"]["Enums"]["separacao_status"]
          telefone?: string | null
          tipo_entrega?: string | null
          tipo_pedido?: string | null
          transportadora_nome?: string | null
          updated_at?: string
        }
        Update: {
          cliente?: string | null
          cliente_id?: string | null
          codigo_obra?: string | null
          codigo_rastreamento?: string | null
          created_at?: string
          data_entrega?: string | null
          data_entrega_original?: string | null
          data_inicio_separacao?: string | null
          delivery_type?: string | null
          endereco?: string | null
          endereco_entrega?: string | null
          garantia_detalhes?: string | null
          garantia_motivo?: string | null
          garantia_peca?: string | null
          gestora_equipe?: string | null
          id?: string
          inclui_garantia?: boolean | null
          material_conteudo?: Json | null
          material_tipo?: string | null
          nivel_complexidade?: string | null
          numero_entrega?: string | null
          numero_venda?: string | null
          observacoes?: string | null
          observacoes_internas?: string | null
          order_in_route?: boolean | null
          projeto_id?: string | null
          reagendamentos?: number
          responsavel_id?: string | null
          responsavel_recebimento?: string | null
          scheduled_time?: string | null
          separacoes_parciais?: Json | null
          solicitante?: string | null
          status?: Database["public"]["Enums"]["separacao_status"]
          telefone?: string | null
          tipo_entrega?: string | null
          tipo_pedido?: string | null
          transportadora_nome?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "separacoes_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "contatos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "separacoes_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra"
            referencedColumns: ["fornecedor_id"]
          },
          {
            foreignKeyName: "separacoes_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra_item_orcamento"
            referencedColumns: ["fornecedor_id"]
          },
          {
            foreignKeyName: "separacoes_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["contato_id"]
          },
          {
            foreignKeyName: "separacoes_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "projetos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "separacoes_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_financeiro_projetos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "separacoes_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_pipeline"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "separacoes_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_resumo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "separacoes_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_sem_empresa"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "separacoes_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_sem_responsavel"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "separacoes_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_separacoes_agenda"
            referencedColumns: ["projeto_id"]
          },
          {
            foreignKeyName: "separacoes_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["projeto_id"]
          },
          {
            foreignKeyName: "separacoes_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "separacoes_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_por_responsavel"
            referencedColumns: ["usuario_id"]
          },
        ]
      }
      separacoes_arquivos: {
        Row: {
          cliente: string | null
          codigo_obra: string | null
          codigo_rastreamento: string | null
          created_at: string | null
          data_entrega: string | null
          data_inicio_separacao: string | null
          delivery_type: string | null
          endereco: string | null
          garantia_detalhes: string | null
          garantia_motivo: string | null
          garantia_peca: string | null
          gestora_equipe: string | null
          id: string
          inclui_garantia: boolean | null
          material_conteudo: string | null
          material_tipo: string | null
          nivel_complexidade: string | null
          numero_entrega: string | null
          numero_venda: string | null
          observacoes_internas: string | null
          order_in_route: string | null
          responsavel_recebimento: string | null
          scheduled_time: string | null
          separacoes_parciais: string | null
          solicitante: string | null
          status: string | null
          telefone: string | null
          tipo_entrega: string | null
          tipo_pedido: string | null
          transportadora_nome: string | null
          updated_at: string | null
        }
        Insert: {
          cliente?: string | null
          codigo_obra?: string | null
          codigo_rastreamento?: string | null
          created_at?: string | null
          data_entrega?: string | null
          data_inicio_separacao?: string | null
          delivery_type?: string | null
          endereco?: string | null
          garantia_detalhes?: string | null
          garantia_motivo?: string | null
          garantia_peca?: string | null
          gestora_equipe?: string | null
          id?: string
          inclui_garantia?: boolean | null
          material_conteudo?: string | null
          material_tipo?: string | null
          nivel_complexidade?: string | null
          numero_entrega?: string | null
          numero_venda?: string | null
          observacoes_internas?: string | null
          order_in_route?: string | null
          responsavel_recebimento?: string | null
          scheduled_time?: string | null
          separacoes_parciais?: string | null
          solicitante?: string | null
          status?: string | null
          telefone?: string | null
          tipo_entrega?: string | null
          tipo_pedido?: string | null
          transportadora_nome?: string | null
          updated_at?: string | null
        }
        Update: {
          cliente?: string | null
          codigo_obra?: string | null
          codigo_rastreamento?: string | null
          created_at?: string | null
          data_entrega?: string | null
          data_inicio_separacao?: string | null
          delivery_type?: string | null
          endereco?: string | null
          garantia_detalhes?: string | null
          garantia_motivo?: string | null
          garantia_peca?: string | null
          gestora_equipe?: string | null
          id?: string
          inclui_garantia?: boolean | null
          material_conteudo?: string | null
          material_tipo?: string | null
          nivel_complexidade?: string | null
          numero_entrega?: string | null
          numero_venda?: string | null
          observacoes_internas?: string | null
          order_in_route?: string | null
          responsavel_recebimento?: string | null
          scheduled_time?: string | null
          separacoes_parciais?: string | null
          solicitante?: string | null
          status?: string | null
          telefone?: string | null
          tipo_entrega?: string | null
          tipo_pedido?: string | null
          transportadora_nome?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      solicitacoes_aprovacao_compra: {
        Row: {
          atualizado_em: string
          cliente_id: string | null
          condicao_pagamento: string | null
          criado_em: string
          criado_por: string | null
          custo_unitario: number | null
          data_prevista_entrega: string | null
          empresa_id: string | null
          fornecedor_id: string | null
          id: string
          marca_id: string | null
          motivo_rejeicao: string | null
          observacao: string | null
          pedido_compra_id: string | null
          perfil: string | null
          produto_id: string
          quantidade: number
          status: string
        }
        Insert: {
          atualizado_em?: string
          cliente_id?: string | null
          condicao_pagamento?: string | null
          criado_em?: string
          criado_por?: string | null
          custo_unitario?: number | null
          data_prevista_entrega?: string | null
          empresa_id?: string | null
          fornecedor_id?: string | null
          id?: string
          marca_id?: string | null
          motivo_rejeicao?: string | null
          observacao?: string | null
          pedido_compra_id?: string | null
          perfil?: string | null
          produto_id: string
          quantidade: number
          status?: string
        }
        Update: {
          atualizado_em?: string
          cliente_id?: string | null
          condicao_pagamento?: string | null
          criado_em?: string
          criado_por?: string | null
          custo_unitario?: number | null
          data_prevista_entrega?: string | null
          empresa_id?: string | null
          fornecedor_id?: string | null
          id?: string
          marca_id?: string | null
          motivo_rejeicao?: string | null
          observacao?: string | null
          pedido_compra_id?: string | null
          perfil?: string | null
          produto_id?: string
          quantidade?: number
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "solicitacoes_aprovacao_compra_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "contatos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitacoes_aprovacao_compra_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra"
            referencedColumns: ["fornecedor_id"]
          },
          {
            foreignKeyName: "solicitacoes_aprovacao_compra_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra_item_orcamento"
            referencedColumns: ["fornecedor_id"]
          },
          {
            foreignKeyName: "solicitacoes_aprovacao_compra_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["contato_id"]
          },
          {
            foreignKeyName: "solicitacoes_aprovacao_compra_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitacoes_aprovacao_compra_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "vw_projetos_por_responsavel"
            referencedColumns: ["usuario_id"]
          },
          {
            foreignKeyName: "solicitacoes_aprovacao_compra_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitacoes_aprovacao_compra_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_fornecedores_remessas"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "solicitacoes_aprovacao_compra_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_fornecedores_resumo"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "solicitacoes_aprovacao_compra_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_remessas_completa"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "solicitacoes_aprovacao_compra_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_remessas_resumo_status"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "solicitacoes_aprovacao_compra_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "solicitacoes_aprovacao_compra_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "contatos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitacoes_aprovacao_compra_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra"
            referencedColumns: ["fornecedor_id"]
          },
          {
            foreignKeyName: "solicitacoes_aprovacao_compra_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra_item_orcamento"
            referencedColumns: ["fornecedor_id"]
          },
          {
            foreignKeyName: "solicitacoes_aprovacao_compra_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["contato_id"]
          },
          {
            foreignKeyName: "solicitacoes_aprovacao_compra_marca_id_fkey"
            columns: ["marca_id"]
            isOneToOne: false
            referencedRelation: "marcas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitacoes_aprovacao_compra_marca_id_fkey"
            columns: ["marca_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra"
            referencedColumns: ["marca_id"]
          },
          {
            foreignKeyName: "solicitacoes_aprovacao_compra_marca_id_fkey"
            columns: ["marca_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra_item_orcamento"
            referencedColumns: ["marca_id"]
          },
          {
            foreignKeyName: "solicitacoes_aprovacao_compra_pedido_compra_id_fkey"
            columns: ["pedido_compra_id"]
            isOneToOne: false
            referencedRelation: "pedidos_compra"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitacoes_aprovacao_compra_pedido_compra_id_fkey"
            columns: ["pedido_compra_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra_pedido_detalhe"
            referencedColumns: ["pedido_id"]
          },
          {
            foreignKeyName: "solicitacoes_aprovacao_compra_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitacoes_aprovacao_compra_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "v_estoque_produtos"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "solicitacoes_aprovacao_compra_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_estoque_liquido"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "solicitacoes_aprovacao_compra_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_estoque_produtos"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "solicitacoes_aprovacao_compra_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "solicitacoes_aprovacao_compra_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_produtos_estoque_detalhado"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitacoes_aprovacao_compra_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_vendas_loja"
            referencedColumns: ["produto_id"]
          },
        ]
      }
      solicitacoes_compra: {
        Row: {
          atualizado_em: string
          created_at: string | null
          criado_em: string
          id: string
          observacao: string | null
          prioridade: string
          produto_id: string
          projeto_id: string | null
          quantidade: number | null
          quantidade_pedida: number | null
          solicitado_por: string | null
          status: string
        }
        Insert: {
          atualizado_em?: string
          created_at?: string | null
          criado_em?: string
          id?: string
          observacao?: string | null
          prioridade?: string
          produto_id: string
          projeto_id?: string | null
          quantidade?: number | null
          quantidade_pedida?: number | null
          solicitado_por?: string | null
          status?: string
        }
        Update: {
          atualizado_em?: string
          created_at?: string | null
          criado_em?: string
          id?: string
          observacao?: string | null
          prioridade?: string
          produto_id?: string
          projeto_id?: string | null
          quantidade?: number | null
          quantidade_pedida?: number | null
          solicitado_por?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "solicitacoes_compra_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitacoes_compra_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "v_estoque_produtos"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "solicitacoes_compra_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_estoque_liquido"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "solicitacoes_compra_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_estoque_produtos"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "solicitacoes_compra_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "solicitacoes_compra_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_produtos_estoque_detalhado"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitacoes_compra_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_vendas_loja"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "solicitacoes_compra_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "projetos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitacoes_compra_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_financeiro_projetos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitacoes_compra_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_pipeline"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitacoes_compra_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_resumo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitacoes_compra_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_sem_empresa"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitacoes_compra_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_sem_responsavel"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitacoes_compra_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_separacoes_agenda"
            referencedColumns: ["projeto_id"]
          },
          {
            foreignKeyName: "solicitacoes_compra_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["projeto_id"]
          },
        ]
      }
      staging_conta_pagar: {
        Row: {
          bairro: string | null
          celular: string | null
          cep: string | null
          cidade: string | null
          cod_duplicata: number | null
          cod_empresa: number | null
          cod_pessoa: number | null
          cod_venda: number | null
          complemento: string | null
          cpf_cnpj: string | null
          data_baixa: string | null
          desc_apropriacao: string | null
          dt_emissao: string | null
          dt_pagamento: string | null
          dt_ultimo_pgto: string | null
          dt_vencimento: string | null
          email: string | null
          email_financeiro: string | null
          estado: string | null
          fantasia: string | null
          importado_em: string | null
          lancamento: number | null
          layout_boleto: number | null
          linha_excel: number | null
          logradouro: string | null
          nm_empresa: string | null
          nm_funcionario: string | null
          nm_pessoa: string | null
          nosso_numero: number | null
          num_nota: string | null
          num_parc: number | null
          numero: string | null
          observacao: string | null
          pago: number | null
          processado: boolean | null
          razaosocial: string | null
          rgie: string | null
          telefone: string | null
          tipo_operacao: string | null
          tipo_pagamento: string | null
          total_parc: number | null
          vl_desconto: number | null
          vl_duplicata: number | null
          vl_frete: number | null
          vl_ipi: number | null
          vl_juros: number | null
          vl_pago: number | null
          vl_parcela: number | null
          vl_st: number | null
        }
        Insert: {
          bairro?: string | null
          celular?: string | null
          cep?: string | null
          cidade?: string | null
          cod_duplicata?: number | null
          cod_empresa?: number | null
          cod_pessoa?: number | null
          cod_venda?: number | null
          complemento?: string | null
          cpf_cnpj?: string | null
          data_baixa?: string | null
          desc_apropriacao?: string | null
          dt_emissao?: string | null
          dt_pagamento?: string | null
          dt_ultimo_pgto?: string | null
          dt_vencimento?: string | null
          email?: string | null
          email_financeiro?: string | null
          estado?: string | null
          fantasia?: string | null
          importado_em?: string | null
          lancamento?: number | null
          layout_boleto?: number | null
          linha_excel?: number | null
          logradouro?: string | null
          nm_empresa?: string | null
          nm_funcionario?: string | null
          nm_pessoa?: string | null
          nosso_numero?: number | null
          num_nota?: string | null
          num_parc?: number | null
          numero?: string | null
          observacao?: string | null
          pago?: number | null
          processado?: boolean | null
          razaosocial?: string | null
          rgie?: string | null
          telefone?: string | null
          tipo_operacao?: string | null
          tipo_pagamento?: string | null
          total_parc?: number | null
          vl_desconto?: number | null
          vl_duplicata?: number | null
          vl_frete?: number | null
          vl_ipi?: number | null
          vl_juros?: number | null
          vl_pago?: number | null
          vl_parcela?: number | null
          vl_st?: number | null
        }
        Update: {
          bairro?: string | null
          celular?: string | null
          cep?: string | null
          cidade?: string | null
          cod_duplicata?: number | null
          cod_empresa?: number | null
          cod_pessoa?: number | null
          cod_venda?: number | null
          complemento?: string | null
          cpf_cnpj?: string | null
          data_baixa?: string | null
          desc_apropriacao?: string | null
          dt_emissao?: string | null
          dt_pagamento?: string | null
          dt_ultimo_pgto?: string | null
          dt_vencimento?: string | null
          email?: string | null
          email_financeiro?: string | null
          estado?: string | null
          fantasia?: string | null
          importado_em?: string | null
          lancamento?: number | null
          layout_boleto?: number | null
          linha_excel?: number | null
          logradouro?: string | null
          nm_empresa?: string | null
          nm_funcionario?: string | null
          nm_pessoa?: string | null
          nosso_numero?: number | null
          num_nota?: string | null
          num_parc?: number | null
          numero?: string | null
          observacao?: string | null
          pago?: number | null
          processado?: boolean | null
          razaosocial?: string | null
          rgie?: string | null
          telefone?: string | null
          tipo_operacao?: string | null
          tipo_pagamento?: string | null
          total_parc?: number | null
          vl_desconto?: number | null
          vl_duplicata?: number | null
          vl_frete?: number | null
          vl_ipi?: number | null
          vl_juros?: number | null
          vl_pago?: number | null
          vl_parcela?: number | null
          vl_st?: number | null
        }
        Relationships: []
      }
      staging_conta_receber: {
        Row: {
          bairro: string | null
          celular: string | null
          cep: string | null
          cidade: string | null
          cod_duplicata: number | null
          cod_empresa: number | null
          cod_pessoa: number | null
          cod_venda: number | null
          complemento: string | null
          cpf_cnpj: string | null
          data_baixa: string | null
          desc_apropriacao: string | null
          dt_emissao: string | null
          dt_pagamento: string | null
          dt_ultimo_pgto: string | null
          dt_vencimento: string | null
          email: string | null
          email_financeiro: string | null
          estado: string | null
          fantasia: string | null
          importado_em: string | null
          lancamento: number | null
          layout_boleto: number | null
          linha_excel: number | null
          logradouro: string | null
          nm_empresa: string | null
          nm_funcionario: string | null
          nm_pessoa: string | null
          nosso_numero: number | null
          num_nota: string | null
          num_parc: number | null
          numero: string | null
          observacao: string | null
          pago: number | null
          processado: boolean | null
          razaosocial: string | null
          rgie: string | null
          telefone: string | null
          tipo_operacao: string | null
          tipo_pagamento: string | null
          total_parc: number | null
          vl_desconto: number | null
          vl_duplicata: number | null
          vl_frete: number | null
          vl_ipi: number | null
          vl_juros: number | null
          vl_pago: number | null
          vl_parcela: number | null
          vl_st: number | null
        }
        Insert: {
          bairro?: string | null
          celular?: string | null
          cep?: string | null
          cidade?: string | null
          cod_duplicata?: number | null
          cod_empresa?: number | null
          cod_pessoa?: number | null
          cod_venda?: number | null
          complemento?: string | null
          cpf_cnpj?: string | null
          data_baixa?: string | null
          desc_apropriacao?: string | null
          dt_emissao?: string | null
          dt_pagamento?: string | null
          dt_ultimo_pgto?: string | null
          dt_vencimento?: string | null
          email?: string | null
          email_financeiro?: string | null
          estado?: string | null
          fantasia?: string | null
          importado_em?: string | null
          lancamento?: number | null
          layout_boleto?: number | null
          linha_excel?: number | null
          logradouro?: string | null
          nm_empresa?: string | null
          nm_funcionario?: string | null
          nm_pessoa?: string | null
          nosso_numero?: number | null
          num_nota?: string | null
          num_parc?: number | null
          numero?: string | null
          observacao?: string | null
          pago?: number | null
          processado?: boolean | null
          razaosocial?: string | null
          rgie?: string | null
          telefone?: string | null
          tipo_operacao?: string | null
          tipo_pagamento?: string | null
          total_parc?: number | null
          vl_desconto?: number | null
          vl_duplicata?: number | null
          vl_frete?: number | null
          vl_ipi?: number | null
          vl_juros?: number | null
          vl_pago?: number | null
          vl_parcela?: number | null
          vl_st?: number | null
        }
        Update: {
          bairro?: string | null
          celular?: string | null
          cep?: string | null
          cidade?: string | null
          cod_duplicata?: number | null
          cod_empresa?: number | null
          cod_pessoa?: number | null
          cod_venda?: number | null
          complemento?: string | null
          cpf_cnpj?: string | null
          data_baixa?: string | null
          desc_apropriacao?: string | null
          dt_emissao?: string | null
          dt_pagamento?: string | null
          dt_ultimo_pgto?: string | null
          dt_vencimento?: string | null
          email?: string | null
          email_financeiro?: string | null
          estado?: string | null
          fantasia?: string | null
          importado_em?: string | null
          lancamento?: number | null
          layout_boleto?: number | null
          linha_excel?: number | null
          logradouro?: string | null
          nm_empresa?: string | null
          nm_funcionario?: string | null
          nm_pessoa?: string | null
          nosso_numero?: number | null
          num_nota?: string | null
          num_parc?: number | null
          numero?: string | null
          observacao?: string | null
          pago?: number | null
          processado?: boolean | null
          razaosocial?: string | null
          rgie?: string | null
          telefone?: string | null
          tipo_operacao?: string | null
          tipo_pagamento?: string | null
          total_parc?: number | null
          vl_desconto?: number | null
          vl_duplicata?: number | null
          vl_frete?: number | null
          vl_ipi?: number | null
          vl_juros?: number | null
          vl_pago?: number | null
          vl_parcela?: number | null
          vl_st?: number | null
        }
        Relationships: []
      }
      staging_import_bruto: {
        Row: {
          ARQUITETO: string | null
          "CAUSA PAGAMENTO": string | null
          CLIENTE: string | null
          COD: string | null
          DATA: string | null
          "DATA FECHAMENTO": string | null
          "FORMA PAGAMENTO": string | null
          "LINHA ORIGINAL": string | null
          "PARCELA/COLUNA3": string | null
          PROJETISTA: string | null
          "VALOR FECHADO": string | null
        }
        Insert: {
          ARQUITETO?: string | null
          "CAUSA PAGAMENTO"?: string | null
          CLIENTE?: string | null
          COD?: string | null
          DATA?: string | null
          "DATA FECHAMENTO"?: string | null
          "FORMA PAGAMENTO"?: string | null
          "LINHA ORIGINAL"?: string | null
          "PARCELA/COLUNA3"?: string | null
          PROJETISTA?: string | null
          "VALOR FECHADO"?: string | null
        }
        Update: {
          ARQUITETO?: string | null
          "CAUSA PAGAMENTO"?: string | null
          CLIENTE?: string | null
          COD?: string | null
          DATA?: string | null
          "DATA FECHAMENTO"?: string | null
          "FORMA PAGAMENTO"?: string | null
          "LINHA ORIGINAL"?: string | null
          "PARCELA/COLUNA3"?: string | null
          PROJETISTA?: string | null
          "VALOR FECHADO"?: string | null
        }
        Relationships: []
      }
      staging_pedido_compra: {
        Row: {
          cod_fornecedor: number | null
          codigo_pedido: number | null
          dt_vencimento: string | null
          emissao_pedido: string | null
          importado_em: string | null
          linha_excel: number | null
          nm_fornecedor: string | null
          num_parc: number | null
          processado: boolean | null
          vl_duplicata: number | null
          vl_nota: number | null
        }
        Insert: {
          cod_fornecedor?: number | null
          codigo_pedido?: number | null
          dt_vencimento?: string | null
          emissao_pedido?: string | null
          importado_em?: string | null
          linha_excel?: number | null
          nm_fornecedor?: string | null
          num_parc?: number | null
          processado?: boolean | null
          vl_duplicata?: number | null
          vl_nota?: number | null
        }
        Update: {
          cod_fornecedor?: number | null
          codigo_pedido?: number | null
          dt_vencimento?: string | null
          emissao_pedido?: string | null
          importado_em?: string | null
          linha_excel?: number | null
          nm_fornecedor?: string | null
          num_parc?: number | null
          processado?: boolean | null
          vl_duplicata?: number | null
          vl_nota?: number | null
        }
        Relationships: []
      }
      staging_produtos: {
        Row: {
          codcategoria: number | null
          codmarca: number | null
          codproduto: number | null
          custototal: string | null
          desccategoria: string | null
          descmarca: string | null
          descproduto: string | null
          disponivel: number | null
          estoquetotal: number | null
          importado_em: string | null
          linha_excel: number | null
          lucro: number | null
          processado: boolean | null
          referencia: string | null
          showroom: number | null
          unidade: string | null
          valorvenda: number | null
        }
        Insert: {
          codcategoria?: number | null
          codmarca?: number | null
          codproduto?: number | null
          custototal?: string | null
          desccategoria?: string | null
          descmarca?: string | null
          descproduto?: string | null
          disponivel?: number | null
          estoquetotal?: number | null
          importado_em?: string | null
          linha_excel?: number | null
          lucro?: number | null
          processado?: boolean | null
          referencia?: string | null
          showroom?: number | null
          unidade?: string | null
          valorvenda?: number | null
        }
        Update: {
          codcategoria?: number | null
          codmarca?: number | null
          codproduto?: number | null
          custototal?: string | null
          desccategoria?: string | null
          descmarca?: string | null
          descproduto?: string | null
          disponivel?: number | null
          estoquetotal?: number | null
          importado_em?: string | null
          linha_excel?: number | null
          lucro?: number | null
          processado?: boolean | null
          referencia?: string | null
          showroom?: number | null
          unidade?: string | null
          valorvenda?: number | null
        }
        Relationships: []
      }
      stg_duplicatas_vigentes: {
        Row: {
          cod_duplicata: number
          tipo: Database["public"]["Enums"]["transacao_tipo"]
        }
        Insert: {
          cod_duplicata: number
          tipo: Database["public"]["Enums"]["transacao_tipo"]
        }
        Update: {
          cod_duplicata?: number
          tipo?: Database["public"]["Enums"]["transacao_tipo"]
        }
        Relationships: []
      }
      sync_history: {
        Row: {
          created_at: string | null
          empresa_id: string | null
          executado_por: string | null
          id: number
          mensagem: string | null
          origem: string | null
          registros_atualizados: number
          registros_erro: number
          registros_inseridos: number
          status: string | null
          tipo: string | null
        }
        Insert: {
          created_at?: string | null
          empresa_id?: string | null
          executado_por?: string | null
          id?: never
          mensagem?: string | null
          origem?: string | null
          registros_atualizados?: number
          registros_erro?: number
          registros_inseridos?: number
          status?: string | null
          tipo?: string | null
        }
        Update: {
          created_at?: string | null
          empresa_id?: string | null
          executado_por?: string | null
          id?: never
          mensagem?: string | null
          origem?: string | null
          registros_atualizados?: number
          registros_erro?: number
          registros_inseridos?: number
          status?: string | null
          tipo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sync_history_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sync_history_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_fornecedores_remessas"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "sync_history_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_fornecedores_resumo"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "sync_history_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_remessas_completa"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "sync_history_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_remessas_resumo_status"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "sync_history_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "sync_history_executado_por_fkey"
            columns: ["executado_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sync_history_executado_por_fkey"
            columns: ["executado_por"]
            isOneToOne: false
            referencedRelation: "vw_projetos_por_responsavel"
            referencedColumns: ["usuario_id"]
          },
        ]
      }
      systems: {
        Row: {
          description: string
          display_order: number | null
          icon_name: string | null
          id: string
          link: string
          name: string
          slug: string
          visivel_no_hub: boolean
        }
        Insert: {
          description: string
          display_order?: number | null
          icon_name?: string | null
          id?: string
          link: string
          name: string
          slug: string
          visivel_no_hub?: boolean
        }
        Update: {
          description?: string
          display_order?: number | null
          icon_name?: string | null
          id?: string
          link?: string
          name?: string
          slug?: string
          visivel_no_hub?: boolean
        }
        Relationships: []
      }
      transacoes: {
        Row: {
          acordo: number | null
          categoria_id: string | null
          cod_itens_duplicata: number | null
          cod_venda: number | null
          comprovante_url: string | null
          conta_id: string | null
          created_at: string
          created_by: string | null
          data_transacao: string
          descricao: string
          dt_emissao: string | null
          dt_pagamento: string | null
          dt_vencimento: string | null
          empresa_id: string | null
          funcionario_id: string | null
          id: string
          negociacao_id: string | null
          num_parc: number | null
          parcela_id: string | null
          perfil: string | null
          projeto_id: string | null
          status_pago: number | null
          tipo: Database["public"]["Enums"]["transacao_tipo"]
          tipo_pagamento: string | null
          valor: number
          vl_desconto: number | null
          vl_frete: number | null
          vl_ipi: number | null
          vl_juros: number | null
          vl_pago: number | null
          vl_parcela: number | null
        }
        Insert: {
          acordo?: number | null
          categoria_id?: string | null
          cod_itens_duplicata?: number | null
          cod_venda?: number | null
          comprovante_url?: string | null
          conta_id?: string | null
          created_at?: string
          created_by?: string | null
          data_transacao: string
          descricao: string
          dt_emissao?: string | null
          dt_pagamento?: string | null
          dt_vencimento?: string | null
          empresa_id?: string | null
          funcionario_id?: string | null
          id?: string
          negociacao_id?: string | null
          num_parc?: number | null
          parcela_id?: string | null
          perfil?: string | null
          projeto_id?: string | null
          status_pago?: number | null
          tipo: Database["public"]["Enums"]["transacao_tipo"]
          tipo_pagamento?: string | null
          valor: number
          vl_desconto?: number | null
          vl_frete?: number | null
          vl_ipi?: number | null
          vl_juros?: number | null
          vl_pago?: number | null
          vl_parcela?: number | null
        }
        Update: {
          acordo?: number | null
          categoria_id?: string | null
          cod_itens_duplicata?: number | null
          cod_venda?: number | null
          comprovante_url?: string | null
          conta_id?: string | null
          created_at?: string
          created_by?: string | null
          data_transacao?: string
          descricao?: string
          dt_emissao?: string | null
          dt_pagamento?: string | null
          dt_vencimento?: string | null
          empresa_id?: string | null
          funcionario_id?: string | null
          id?: string
          negociacao_id?: string | null
          num_parc?: number | null
          parcela_id?: string | null
          perfil?: string | null
          projeto_id?: string | null
          status_pago?: number | null
          tipo?: Database["public"]["Enums"]["transacao_tipo"]
          tipo_pagamento?: string | null
          valor?: number
          vl_desconto?: number | null
          vl_frete?: number | null
          vl_ipi?: number | null
          vl_juros?: number | null
          vl_pago?: number | null
          vl_parcela?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "transacoes_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias_financeiras"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transacoes_conta_id_fkey"
            columns: ["conta_id"]
            isOneToOne: false
            referencedRelation: "contas_bancarias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transacoes_conta_id_fkey"
            columns: ["conta_id"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["conta_bancaria_id"]
          },
          {
            foreignKeyName: "transacoes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transacoes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "vw_projetos_por_responsavel"
            referencedColumns: ["usuario_id"]
          },
          {
            foreignKeyName: "transacoes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transacoes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_fornecedores_remessas"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "transacoes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_fornecedores_resumo"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "transacoes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_remessas_completa"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "transacoes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_remessas_resumo_status"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "transacoes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "transacoes_funcionario_id_fkey"
            columns: ["funcionario_id"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transacoes_funcionario_id_fkey"
            columns: ["funcionario_id"]
            isOneToOne: false
            referencedRelation: "vw_historico_faltas"
            referencedColumns: ["funcionario_id"]
          },
          {
            foreignKeyName: "transacoes_funcionario_id_fkey"
            columns: ["funcionario_id"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["funcionario_id"]
          },
          {
            foreignKeyName: "transacoes_negociacao_id_fkey"
            columns: ["negociacao_id"]
            isOneToOne: false
            referencedRelation: "negociacoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transacoes_parcela_id_fkey"
            columns: ["parcela_id"]
            isOneToOne: false
            referencedRelation: "projeto_parcelas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transacoes_parcela_id_fkey"
            columns: ["parcela_id"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["parcela_crm_id"]
          },
          {
            foreignKeyName: "transacoes_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "projetos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transacoes_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_financeiro_projetos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transacoes_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_pipeline"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transacoes_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_resumo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transacoes_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_sem_empresa"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transacoes_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_sem_responsavel"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transacoes_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_separacoes_agenda"
            referencedColumns: ["projeto_id"]
          },
          {
            foreignKeyName: "transacoes_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["projeto_id"]
          },
        ]
      }
      transferencias_estoque: {
        Row: {
          aprovado_em: string | null
          aprovado_por: string | null
          cancelado_em: string | null
          destino_projeto_item_id: string
          id: string
          motivo: string | null
          motivo_cancelamento: string | null
          origem_projeto_item_id: string
          quantidade: number
          solicitado_em: string
          solicitado_por: string | null
          status: string
        }
        Insert: {
          aprovado_em?: string | null
          aprovado_por?: string | null
          cancelado_em?: string | null
          destino_projeto_item_id: string
          id?: string
          motivo?: string | null
          motivo_cancelamento?: string | null
          origem_projeto_item_id: string
          quantidade: number
          solicitado_em?: string
          solicitado_por?: string | null
          status?: string
        }
        Update: {
          aprovado_em?: string | null
          aprovado_por?: string | null
          cancelado_em?: string | null
          destino_projeto_item_id?: string
          id?: string
          motivo?: string | null
          motivo_cancelamento?: string | null
          origem_projeto_item_id?: string
          quantidade?: number
          solicitado_em?: string
          solicitado_por?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "transferencias_estoque_destino_projeto_item_id_fkey"
            columns: ["destino_projeto_item_id"]
            isOneToOne: false
            referencedRelation: "projeto_itens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transferencias_estoque_destino_projeto_item_id_fkey"
            columns: ["destino_projeto_item_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra_detalhe"
            referencedColumns: ["projeto_item_id"]
          },
          {
            foreignKeyName: "transferencias_estoque_destino_projeto_item_id_fkey"
            columns: ["destino_projeto_item_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra_item_orcamento"
            referencedColumns: ["projeto_item_id"]
          },
          {
            foreignKeyName: "transferencias_estoque_origem_projeto_item_id_fkey"
            columns: ["origem_projeto_item_id"]
            isOneToOne: false
            referencedRelation: "projeto_itens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transferencias_estoque_origem_projeto_item_id_fkey"
            columns: ["origem_projeto_item_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra_detalhe"
            referencedColumns: ["projeto_item_id"]
          },
          {
            foreignKeyName: "transferencias_estoque_origem_projeto_item_id_fkey"
            columns: ["origem_projeto_item_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra_item_orcamento"
            referencedColumns: ["projeto_item_id"]
          },
        ]
      }
      user_roles_separacao: {
        Row: {
          created_at: string | null
          email: string
          funcao: Database["public"]["Enums"]["funcao_separacao_type"] | null
          id: string
          nome_completo: string
          role: string | null
          sistema: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          funcao?: Database["public"]["Enums"]["funcao_separacao_type"] | null
          id?: string
          nome_completo: string
          role?: string | null
          sistema?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          funcao?: Database["public"]["Enums"]["funcao_separacao_type"] | null
          id?: string
          nome_completo?: string
          role?: string | null
          sistema?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_system_access: {
        Row: {
          created_at: string
          system_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          system_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          system_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_system_access_system_id_fkey"
            columns: ["system_id"]
            isOneToOne: false
            referencedRelation: "systems"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_system_access_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_system_access_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_por_responsavel"
            referencedColumns: ["usuario_id"]
          },
        ]
      }
      usuario_papeis: {
        Row: {
          papel_id: string
          usuario_id: string
        }
        Insert: {
          papel_id: string
          usuario_id: string
        }
        Update: {
          papel_id?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "usuario_papeis_papel_id_fkey"
            columns: ["papel_id"]
            isOneToOne: false
            referencedRelation: "papeis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usuario_papeis_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usuario_papeis_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_por_responsavel"
            referencedColumns: ["usuario_id"]
          },
        ]
      }
      usuario_permissao_excecoes: {
        Row: {
          acao: string
          criado_em: string | null
          criado_por: string | null
          id: string
          justificativa: string | null
          modulo_id: string | null
          system_id: string
          tipo: string
          usuario_id: string
          valido_até: string | null
        }
        Insert: {
          acao: string
          criado_em?: string | null
          criado_por?: string | null
          id?: string
          justificativa?: string | null
          modulo_id?: string | null
          system_id: string
          tipo: string
          usuario_id: string
          valido_até?: string | null
        }
        Update: {
          acao?: string
          criado_em?: string | null
          criado_por?: string | null
          id?: string
          justificativa?: string | null
          modulo_id?: string | null
          system_id?: string
          tipo?: string
          usuario_id?: string
          valido_até?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "usuario_permissao_excecoes_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usuario_permissao_excecoes_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "vw_projetos_por_responsavel"
            referencedColumns: ["usuario_id"]
          },
          {
            foreignKeyName: "usuario_permissao_excecoes_modulo_id_fkey"
            columns: ["modulo_id"]
            isOneToOne: false
            referencedRelation: "modulos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usuario_permissao_excecoes_system_id_fkey"
            columns: ["system_id"]
            isOneToOne: false
            referencedRelation: "systems"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usuario_permissao_excecoes_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usuario_permissao_excecoes_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_por_responsavel"
            referencedColumns: ["usuario_id"]
          },
        ]
      }
      usuarios: {
        Row: {
          ativo: boolean | null
          avatar_url: string | null
          can_approve_quotes: boolean | null
          created_at: string | null
          email: string
          empresa_id: string | null
          id: string
          nome: string
          onboarding_completado: boolean
          role: Database["public"]["Enums"]["usuario_role"] | null
          telefone: string | null
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          avatar_url?: string | null
          can_approve_quotes?: boolean | null
          created_at?: string | null
          email: string
          empresa_id?: string | null
          id: string
          nome: string
          onboarding_completado?: boolean
          role?: Database["public"]["Enums"]["usuario_role"] | null
          telefone?: string | null
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          avatar_url?: string | null
          can_approve_quotes?: boolean | null
          created_at?: string | null
          email?: string
          empresa_id?: string | null
          id?: string
          nome?: string
          onboarding_completado?: boolean
          role?: Database["public"]["Enums"]["usuario_role"] | null
          telefone?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "usuarios_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usuarios_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_fornecedores_remessas"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "usuarios_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_fornecedores_resumo"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "usuarios_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_remessas_completa"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "usuarios_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_remessas_resumo_status"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "usuarios_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["empresa_id"]
          },
        ]
      }
      usuarios_ubiqua: {
        Row: {
          created_at: string
          email: string
          empresa_id: string | null
          id: string
          nivel_acesso: Database["public"]["Enums"]["nivel_acesso_tipo"]
          nome: string
          onboarding_completado: boolean
          telefone: string | null
        }
        Insert: {
          created_at?: string
          email: string
          empresa_id?: string | null
          id: string
          nivel_acesso?: Database["public"]["Enums"]["nivel_acesso_tipo"]
          nome: string
          onboarding_completado?: boolean
          telefone?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          empresa_id?: string | null
          id?: string
          nivel_acesso?: Database["public"]["Enums"]["nivel_acesso_tipo"]
          nome?: string
          onboarding_completado?: boolean
          telefone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "usuarios_ubiqua_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresa_ubiqua"
            referencedColumns: ["id"]
          },
        ]
      }
      vendas: {
        Row: {
          cod_cliente: number | null
          cod_venda: number | null
          created_at: string | null
          data_emissao: string | null
          data_pagamento: string | null
          data_vencimento: string | null
          desc_apropriacao: string | null
          descricao_produto: string | null
          grupo_cfop: string | null
          historico_legado: boolean
          id: string
          nome_cliente: string
          num_nota: string | null
          observacao: string | null
          parcelas_pagas: number | null
          produto_id: string | null
          projeto_id: string | null
          qtd_produto: number | null
          status_pagamento:
            | Database["public"]["Enums"]["status_pagamento"]
            | null
          tipo_pagamento: string | null
          total_parcelas: number | null
          updated_at: string | null
          valor_pago: number | null
          valor_pendente: number | null
          valor_total: number
          vl_unitario: number | null
        }
        Insert: {
          cod_cliente?: number | null
          cod_venda?: number | null
          created_at?: string | null
          data_emissao?: string | null
          data_pagamento?: string | null
          data_vencimento?: string | null
          desc_apropriacao?: string | null
          descricao_produto?: string | null
          grupo_cfop?: string | null
          historico_legado?: boolean
          id?: string
          nome_cliente: string
          num_nota?: string | null
          observacao?: string | null
          parcelas_pagas?: number | null
          produto_id?: string | null
          projeto_id?: string | null
          qtd_produto?: number | null
          status_pagamento?:
            | Database["public"]["Enums"]["status_pagamento"]
            | null
          tipo_pagamento?: string | null
          total_parcelas?: number | null
          updated_at?: string | null
          valor_pago?: number | null
          valor_pendente?: number | null
          valor_total?: number
          vl_unitario?: number | null
        }
        Update: {
          cod_cliente?: number | null
          cod_venda?: number | null
          created_at?: string | null
          data_emissao?: string | null
          data_pagamento?: string | null
          data_vencimento?: string | null
          desc_apropriacao?: string | null
          descricao_produto?: string | null
          grupo_cfop?: string | null
          historico_legado?: boolean
          id?: string
          nome_cliente?: string
          num_nota?: string | null
          observacao?: string | null
          parcelas_pagas?: number | null
          produto_id?: string | null
          projeto_id?: string | null
          qtd_produto?: number | null
          status_pagamento?:
            | Database["public"]["Enums"]["status_pagamento"]
            | null
          tipo_pagamento?: string | null
          total_parcelas?: number | null
          updated_at?: string | null
          valor_pago?: number | null
          valor_pendente?: number | null
          valor_total?: number
          vl_unitario?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vendas_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendas_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "v_estoque_produtos"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "vendas_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_estoque_liquido"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "vendas_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_estoque_produtos"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "vendas_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "vendas_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_produtos_estoque_detalhado"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendas_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_vendas_loja"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "vendas_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "projetos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendas_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_financeiro_projetos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendas_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_pipeline"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendas_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_resumo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendas_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_sem_empresa"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendas_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_sem_responsavel"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendas_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_separacoes_agenda"
            referencedColumns: ["projeto_id"]
          },
          {
            foreignKeyName: "vendas_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["projeto_id"]
          },
        ]
      }
      vendas_marca: {
        Row: {
          ano: number
          created_at: string
          id: string
          marca_id: string
          mes: number
          valor_custo: number
          valor_venda: number
        }
        Insert: {
          ano: number
          created_at?: string
          id?: string
          marca_id: string
          mes: number
          valor_custo?: number
          valor_venda?: number
        }
        Update: {
          ano?: number
          created_at?: string
          id?: string
          marca_id?: string
          mes?: number
          valor_custo?: number
          valor_venda?: number
        }
        Relationships: [
          {
            foreignKeyName: "vendas_marca_marca_id_fkey"
            columns: ["marca_id"]
            isOneToOne: false
            referencedRelation: "marcas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendas_marca_marca_id_fkey"
            columns: ["marca_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra"
            referencedColumns: ["marca_id"]
          },
          {
            foreignKeyName: "vendas_marca_marca_id_fkey"
            columns: ["marca_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra_item_orcamento"
            referencedColumns: ["marca_id"]
          },
        ]
      }
    }
    Views: {
      v_cash_flow_lucenera: {
        Row: {
          categoria_fluxo: string | null
          descricao: string | null
          dt_pagamento: string | null
          dt_vencimento: string | null
          status_pago: number | null
          tipo: string | null
          vl_pago: number | null
        }
        Insert: {
          categoria_fluxo?: never
          descricao?: string | null
          dt_pagamento?: string | null
          dt_vencimento?: string | null
          status_pago?: number | null
          tipo?: never
          vl_pago?: number | null
        }
        Update: {
          categoria_fluxo?: never
          descricao?: string | null
          dt_pagamento?: string | null
          dt_vencimento?: string | null
          status_pago?: number | null
          tipo?: never
          vl_pago?: number | null
        }
        Relationships: []
      }
      v_estoque_produtos: {
        Row: {
          codigo_produto: number | null
          custo_unitario: number | null
          estoque_disponivel: number | null
          estoque_showroom: number | null
          estoque_total: number | null
          marca: string | null
          marca_id: string | null
          mkp: number | null
          produto: string | null
          produto_id: string | null
          valor_custo_disponivel: number | null
          valor_custo_negativo: number | null
          valor_custo_showroom: number | null
          valor_custo_total: number | null
          valor_venda_disponivel: number | null
          valor_venda_negativo: number | null
          valor_venda_total: number | null
          venda_unitaria: number | null
        }
        Relationships: [
          {
            foreignKeyName: "produtos_marca_id_fkey"
            columns: ["marca_id"]
            isOneToOne: false
            referencedRelation: "marcas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produtos_marca_id_fkey"
            columns: ["marca_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra"
            referencedColumns: ["marca_id"]
          },
          {
            foreignKeyName: "produtos_marca_id_fkey"
            columns: ["marca_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra_item_orcamento"
            referencedColumns: ["marca_id"]
          },
        ]
      }
      v_financeiro_realizado: {
        Row: {
          cod_duplicata: number | null
          desc_grupo: string | null
          desc_sub_grupo: string | null
          descricao: string | null
          dt_emissao: string | null
          dt_pagamento: string | null
          dt_vencimento: string | null
          empresa_id: string | null
          id: string | null
          natureza: string | null
          perfil: string | null
          status_pago: number | null
          tipo: Database["public"]["Enums"]["transacao_tipo"] | null
          tipo_custo: string | null
          vl_desconto: number | null
          vl_pago: number | null
          vl_parcela: number | null
        }
        Relationships: [
          {
            foreignKeyName: "negociacoes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "negociacoes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_fornecedores_remessas"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "negociacoes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_fornecedores_resumo"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "negociacoes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_remessas_completa"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "negociacoes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_remessas_resumo_status"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "negociacoes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["empresa_id"]
          },
        ]
      }
      vw_cadastro_produto_reserva_detalhe: {
        Row: {
          cliente_id: string | null
          cliente_nome: string | null
          equipe_id: string | null
          equipe_nome: string | null
          orcamento_id: string | null
          orcamento_numero: string | null
          produto_codigo: number | null
          produto_id: string | null
          projeto_codigo: string | null
          projeto_id: string | null
          projeto_item_id: string | null
          q_entrega_futura: number | null
          q_reserva: number | null
          q_venda: number | null
          status_operacional: string | null
        }
        Relationships: [
          {
            foreignKeyName: "estoque_saldos_projeto_item_projeto_item_id_fkey"
            columns: ["projeto_item_id"]
            isOneToOne: true
            referencedRelation: "projeto_itens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estoque_saldos_projeto_item_projeto_item_id_fkey"
            columns: ["projeto_item_id"]
            isOneToOne: true
            referencedRelation: "vw_necessidade_compra_detalhe"
            referencedColumns: ["projeto_item_id"]
          },
          {
            foreignKeyName: "estoque_saldos_projeto_item_projeto_item_id_fkey"
            columns: ["projeto_item_id"]
            isOneToOne: true
            referencedRelation: "vw_necessidade_compra_item_orcamento"
            referencedColumns: ["projeto_item_id"]
          },
          {
            foreignKeyName: "projeto_itens_orcamento_id_fkey"
            columns: ["orcamento_id"]
            isOneToOne: false
            referencedRelation: "orcamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_itens_orcamento_id_fkey"
            columns: ["orcamento_id"]
            isOneToOne: false
            referencedRelation: "vw_orcamentos_aprovacao_financeira_auditoria"
            referencedColumns: ["orcamento_id"]
          },
          {
            foreignKeyName: "projeto_itens_orcamento_id_fkey"
            columns: ["orcamento_id"]
            isOneToOne: false
            referencedRelation: "vw_orcamentos_prazo_entrega"
            referencedColumns: ["orcamento_id"]
          },
          {
            foreignKeyName: "projeto_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "v_estoque_produtos"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "projeto_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_estoque_liquido"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "projeto_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_estoque_produtos"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "projeto_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "projeto_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_produtos_estoque_detalhado"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_vendas_loja"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "projeto_itens_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "projetos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_itens_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_financeiro_projetos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_itens_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_pipeline"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_itens_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_resumo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_itens_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_sem_empresa"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_itens_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_sem_responsavel"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_itens_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_separacoes_agenda"
            referencedColumns: ["projeto_id"]
          },
          {
            foreignKeyName: "projeto_itens_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["projeto_id"]
          },
          {
            foreignKeyName: "projetos_equipe_id_fkey"
            columns: ["equipe_id"]
            isOneToOne: false
            referencedRelation: "equipes_projetos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projetos_equipe_id_fkey"
            columns: ["equipe_id"]
            isOneToOne: false
            referencedRelation: "vw_comissao_mensal"
            referencedColumns: ["equipe_id"]
          },
        ]
      }
      vw_catalogo_ubiqua: {
        Row: {
          cores_disponiveis: string[] | null
          detalhes_por_cor: Json[] | null
          estoque_total: number | null
          imagem_principal: string | null
          nome_exibicao: string | null
          valor_revenda: number | null
        }
        Relationships: []
      }
      vw_catalogo_unificado: {
        Row: {
          cores_disponiveis: string[] | null
          estoque_total: number | null
          imagem_principal: string | null
          nome_exibicao: string | null
          referencia_base: string | null
          valor_minimo: number | null
        }
        Relationships: []
      }
      vw_comissao_mensal: {
        Row: {
          comissao_calculada: number | null
          comissao_percentual: number | null
          equipe: string | null
          equipe_id: string | null
          funcionario: string | null
          funcionario_id: string | null
          mes: string | null
          total_projetos: number | null
          valor_total_projetos: number | null
        }
        Relationships: []
      }
      vw_conferencia_financeira: {
        Row: {
          data_transacao: string | null
          descricao: string | null
          dt_vencimento: string | null
          nome_empresa: string | null
          nome_fornecedor: string | null
          status_pago: number | null
          valor: number | null
        }
        Relationships: []
      }
      vw_controle_ferias_clt: {
        Row: {
          direito_total_acumulado: number | null
          funcionario_id: string | null
          funcionario_nome: string | null
          saldo_disponivel: number | null
          total_gozado: number | null
        }
        Relationships: [
          {
            foreignKeyName: "periodos_aquisitivos_funcionario_id_fkey"
            columns: ["funcionario_id"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "periodos_aquisitivos_funcionario_id_fkey"
            columns: ["funcionario_id"]
            isOneToOne: false
            referencedRelation: "vw_historico_faltas"
            referencedColumns: ["funcionario_id"]
          },
          {
            foreignKeyName: "periodos_aquisitivos_funcionario_id_fkey"
            columns: ["funcionario_id"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["funcionario_id"]
          },
        ]
      }
      vw_custos_pendentes_mes: {
        Row: {
          categoria: string | null
          conta: string | null
          data_vencimento: string | null
          descricao: string | null
          status: Database["public"]["Enums"]["lancamento_status"] | null
          valor_original: number | null
        }
        Relationships: []
      }
      vw_dashboard_crm_fechamento: {
        Row: {
          mes: string | null
          projetos_comerciais: number | null
          projetos_corporativos: number | null
          projetos_paisagismo: number | null
          projetos_residenciais: number | null
          total_clientes: number | null
          total_projetos: number | null
          valor_total: number | null
        }
        Relationships: []
      }
      vw_detalhe_produto_estoque: {
        Row: {
          estoque_disponivel: number | null
          estoque_reservado: number | null
          estoque_total: number | null
          produto_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "estoque_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estoque_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "v_estoque_produtos"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "estoque_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_estoque_liquido"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "estoque_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_estoque_produtos"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "estoque_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "estoque_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_produtos_estoque_detalhado"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estoque_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_vendas_loja"
            referencedColumns: ["produto_id"]
          },
        ]
      }
      vw_entrega_futura_projeto_item: {
        Row: {
          aberto_desde: string | null
          atualizado_em: string | null
          cliente: string | null
          cliente_id: string | null
          dias_em_aberto: number | null
          orcamento_id: string | null
          orcamento_numero: string | null
          produto: string | null
          produto_codigo: number | null
          produto_id: string | null
          projeto_codigo: string | null
          projeto_id: string | null
          projeto_item_id: string | null
          q_entrega_futura: number | null
          q_reserva: number | null
          q_transferida_saida: number | null
          q_venda: number | null
        }
        Relationships: [
          {
            foreignKeyName: "estoque_saldos_projeto_item_projeto_item_id_fkey"
            columns: ["projeto_item_id"]
            isOneToOne: true
            referencedRelation: "projeto_itens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estoque_saldos_projeto_item_projeto_item_id_fkey"
            columns: ["projeto_item_id"]
            isOneToOne: true
            referencedRelation: "vw_necessidade_compra_detalhe"
            referencedColumns: ["projeto_item_id"]
          },
          {
            foreignKeyName: "estoque_saldos_projeto_item_projeto_item_id_fkey"
            columns: ["projeto_item_id"]
            isOneToOne: true
            referencedRelation: "vw_necessidade_compra_item_orcamento"
            referencedColumns: ["projeto_item_id"]
          },
          {
            foreignKeyName: "projeto_itens_orcamento_id_fkey"
            columns: ["orcamento_id"]
            isOneToOne: false
            referencedRelation: "orcamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_itens_orcamento_id_fkey"
            columns: ["orcamento_id"]
            isOneToOne: false
            referencedRelation: "vw_orcamentos_aprovacao_financeira_auditoria"
            referencedColumns: ["orcamento_id"]
          },
          {
            foreignKeyName: "projeto_itens_orcamento_id_fkey"
            columns: ["orcamento_id"]
            isOneToOne: false
            referencedRelation: "vw_orcamentos_prazo_entrega"
            referencedColumns: ["orcamento_id"]
          },
          {
            foreignKeyName: "projeto_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "v_estoque_produtos"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "projeto_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_estoque_liquido"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "projeto_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_estoque_produtos"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "projeto_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "projeto_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_produtos_estoque_detalhado"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_vendas_loja"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "projeto_itens_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "projetos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_itens_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_financeiro_projetos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_itens_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_pipeline"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_itens_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_resumo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_itens_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_sem_empresa"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_itens_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_sem_responsavel"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_itens_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_separacoes_agenda"
            referencedColumns: ["projeto_id"]
          },
          {
            foreignKeyName: "projeto_itens_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["projeto_id"]
          },
        ]
      }
      vw_estoque_liquido: {
        Row: {
          alerta_estoque: string | null
          categoria: string | null
          marca: string | null
          preco_custo: number | null
          preco_venda: number | null
          produto: string | null
          produto_id: string | null
          qtd_disponivel: number | null
          qtd_em_transito: number | null
          qtd_fisico: number | null
          qtd_reservado: number | null
          qtd_showroom: number | null
          sku: string | null
          valor_estoque_total: number | null
          valor_reservado_total: number | null
        }
        Relationships: []
      }
      vw_estoque_por_marca: {
        Row: {
          marca: string | null
          qtd_estoque: number | null
          qtd_showroom: number | null
          skus_total: number | null
          valor_disponivel_venda: number | null
        }
        Relationships: []
      }
      vw_estoque_por_produto_projeto: {
        Row: {
          atualizado_em: string | null
          cliente_id: string | null
          orcamento_id: string | null
          orcamento_numero: string | null
          produto: string | null
          produto_codigo: number | null
          produto_id: string | null
          projeto_codigo: string | null
          projeto_id: string | null
          projeto_item_id: string | null
          q_ag_separar: number | null
          q_devolvida: number | null
          q_entrega_futura: number | null
          q_entregue: number | null
          q_reserva: number | null
          q_separado: number | null
          q_transferida_saida: number | null
          q_venda: number | null
          status_operacional: string | null
        }
        Relationships: [
          {
            foreignKeyName: "estoque_saldos_projeto_item_projeto_item_id_fkey"
            columns: ["projeto_item_id"]
            isOneToOne: true
            referencedRelation: "projeto_itens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estoque_saldos_projeto_item_projeto_item_id_fkey"
            columns: ["projeto_item_id"]
            isOneToOne: true
            referencedRelation: "vw_necessidade_compra_detalhe"
            referencedColumns: ["projeto_item_id"]
          },
          {
            foreignKeyName: "estoque_saldos_projeto_item_projeto_item_id_fkey"
            columns: ["projeto_item_id"]
            isOneToOne: true
            referencedRelation: "vw_necessidade_compra_item_orcamento"
            referencedColumns: ["projeto_item_id"]
          },
          {
            foreignKeyName: "projeto_itens_orcamento_id_fkey"
            columns: ["orcamento_id"]
            isOneToOne: false
            referencedRelation: "orcamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_itens_orcamento_id_fkey"
            columns: ["orcamento_id"]
            isOneToOne: false
            referencedRelation: "vw_orcamentos_aprovacao_financeira_auditoria"
            referencedColumns: ["orcamento_id"]
          },
          {
            foreignKeyName: "projeto_itens_orcamento_id_fkey"
            columns: ["orcamento_id"]
            isOneToOne: false
            referencedRelation: "vw_orcamentos_prazo_entrega"
            referencedColumns: ["orcamento_id"]
          },
          {
            foreignKeyName: "projeto_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "v_estoque_produtos"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "projeto_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_estoque_liquido"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "projeto_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_estoque_produtos"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "projeto_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "projeto_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_produtos_estoque_detalhado"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_vendas_loja"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "projeto_itens_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "projetos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_itens_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_financeiro_projetos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_itens_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_pipeline"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_itens_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_resumo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_itens_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_sem_empresa"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_itens_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_sem_responsavel"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_itens_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_separacoes_agenda"
            referencedColumns: ["projeto_id"]
          },
          {
            foreignKeyName: "projeto_itens_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["projeto_id"]
          },
        ]
      }
      vw_estoque_produtos: {
        Row: {
          ativo: boolean | null
          categoria: string | null
          custo_total: number | null
          estoque_disponivel: number | null
          estoque_showroom: number | null
          estoque_total: number | null
          marca: string | null
          preco_custo: number | null
          preco_venda: number | null
          produto: string | null
          produto_codigo: string | null
          produto_id: string | null
          qtd_estoque_itens: number | null
          qtd_reservada: number | null
          referencia: string | null
          sku: string | null
          unidade: string | null
          updated_at: string | null
        }
        Relationships: []
      }
      vw_estoque_resumo: {
        Row: {
          produto: string | null
          produto_codigo: number | null
          produto_id: string | null
          qtd_comprometida: number | null
          qtd_disponivel: number | null
          qtd_entrega_futura: number | null
          qtd_total: number | null
        }
        Relationships: [
          {
            foreignKeyName: "estoque_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estoque_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "v_estoque_produtos"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "estoque_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_estoque_liquido"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "estoque_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_estoque_produtos"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "estoque_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "estoque_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_produtos_estoque_detalhado"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estoque_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_vendas_loja"
            referencedColumns: ["produto_id"]
          },
        ]
      }
      vw_estoque_saldos_projeto_item: {
        Row: {
          atualizado_em: string | null
          cliente_id: string | null
          orcamento_id: string | null
          orcamento_numero: string | null
          produto: string | null
          produto_codigo: number | null
          produto_id: string | null
          projeto_codigo: string | null
          projeto_id: string | null
          projeto_item_id: string | null
          q_ag_separar: number | null
          q_devolvida: number | null
          q_entrega_futura: number | null
          q_entregue: number | null
          q_reserva: number | null
          q_separado: number | null
          q_transferida_saida: number | null
          q_venda: number | null
          status_operacional: string | null
        }
        Relationships: [
          {
            foreignKeyName: "estoque_saldos_projeto_item_projeto_item_id_fkey"
            columns: ["projeto_item_id"]
            isOneToOne: true
            referencedRelation: "projeto_itens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estoque_saldos_projeto_item_projeto_item_id_fkey"
            columns: ["projeto_item_id"]
            isOneToOne: true
            referencedRelation: "vw_necessidade_compra_detalhe"
            referencedColumns: ["projeto_item_id"]
          },
          {
            foreignKeyName: "estoque_saldos_projeto_item_projeto_item_id_fkey"
            columns: ["projeto_item_id"]
            isOneToOne: true
            referencedRelation: "vw_necessidade_compra_item_orcamento"
            referencedColumns: ["projeto_item_id"]
          },
          {
            foreignKeyName: "projeto_itens_orcamento_id_fkey"
            columns: ["orcamento_id"]
            isOneToOne: false
            referencedRelation: "orcamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_itens_orcamento_id_fkey"
            columns: ["orcamento_id"]
            isOneToOne: false
            referencedRelation: "vw_orcamentos_aprovacao_financeira_auditoria"
            referencedColumns: ["orcamento_id"]
          },
          {
            foreignKeyName: "projeto_itens_orcamento_id_fkey"
            columns: ["orcamento_id"]
            isOneToOne: false
            referencedRelation: "vw_orcamentos_prazo_entrega"
            referencedColumns: ["orcamento_id"]
          },
          {
            foreignKeyName: "projeto_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "v_estoque_produtos"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "projeto_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_estoque_liquido"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "projeto_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_estoque_produtos"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "projeto_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "projeto_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_produtos_estoque_detalhado"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_vendas_loja"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "projeto_itens_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "projetos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_itens_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_financeiro_projetos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_itens_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_pipeline"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_itens_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_resumo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_itens_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_sem_empresa"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_itens_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_sem_responsavel"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_itens_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_separacoes_agenda"
            referencedColumns: ["projeto_id"]
          },
          {
            foreignKeyName: "projeto_itens_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["projeto_id"]
          },
        ]
      }
      vw_financeiro_projetos: {
        Row: {
          cliente_id: string | null
          cliente_nome: string | null
          codigo: string | null
          id: string | null
          nome: string | null
          parcelas_pagas: number | null
          parcelas_pendentes: number | null
          status: Database["public"]["Enums"]["projeto_status"] | null
          total_parcelas: number | null
          valor_pendente: number | null
          valor_recebido: number | null
          valor_total: number | null
        }
        Relationships: [
          {
            foreignKeyName: "projetos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "contatos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projetos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra"
            referencedColumns: ["fornecedor_id"]
          },
          {
            foreignKeyName: "projetos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra_item_orcamento"
            referencedColumns: ["fornecedor_id"]
          },
          {
            foreignKeyName: "projetos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["contato_id"]
          },
        ]
      }
      vw_fluxo_caixa_projetado: {
        Row: {
          a_receber: number | null
          atrasado: number | null
          mes: string | null
          qtd_atrasado: number | null
          qtd_pendente: number | null
          recebido: number | null
        }
        Relationships: []
      }
      vw_fornecedores_remessas: {
        Row: {
          cnpj_cpf: string | null
          empresa_id: string | null
          empresa_nome: string | null
          id: string | null
          nome: string | null
          status: string | null
          total_pago: number | null
          total_remessas: number | null
          total_valor_remessas: number | null
        }
        Relationships: []
      }
      vw_fornecedores_resumo: {
        Row: {
          categoria: string | null
          cnpj_cpf: string | null
          created_at: string | null
          email: string | null
          empresa_id: string | null
          empresa_nome: string | null
          id: string | null
          nome: string | null
          status: string | null
          telefone: string | null
          updated_at: string | null
        }
        Relationships: []
      }
      vw_funcionarios_completo: {
        Row: {
          ativo: boolean | null
          cargo: string | null
          comissao_percentual: number | null
          cpf: string | null
          created_at: string | null
          data_admissao: string | null
          data_nascimento: string | null
          email: string | null
          empresa: string | null
          endereco: string | null
          id: string | null
          nome: string | null
          perfil: string | null
          rg: string | null
          salario_base: number | null
          salario_liquido: number | null
          salario_por_fora: number | null
          telefone: string | null
          valor_vt_dia: number | null
        }
        Relationships: []
      }
      vw_historico_faltas: {
        Row: {
          data_falta: string | null
          data_fim: string | null
          data_inicio: string | null
          funcionario_id: string | null
          funcionario_nome: string | null
          justificativa: string | null
          periodo_id: string | null
          status: string | null
        }
        Relationships: []
      }
      vw_logs_auditoria_recentes: {
        Row: {
          created_at: string | null
          dados_anteriores: Json | null
          dados_novos: Json | null
          id: string | null
          observacao: string | null
          operacao: string | null
          registro_id: string | null
          tabela: string | null
          usuario_id: string | null
        }
        Relationships: []
      }
      vw_necessidade_compra: {
        Row: {
          fornecedor_id: string | null
          fornecedor_nome: string | null
          marca_id: string | null
          marca_nome: string | null
          necessidade_compra: number | null
          pendente: number | null
          percentual_desconto_compra: number | null
          preco_custo: number | null
          produto: string | null
          produto_codigo: number | null
          produto_id: string | null
          projetos_com_entrega_futura: number | null
          proxima_data_prevista_entrega: string | null
          qtd_comprometida: number | null
          qtd_disponivel: number | null
          qtd_em_pedidos_abertos: number | null
          qtd_fisica: number | null
          qtd_pedidos_abertos: number | null
          status_mais_critico: string | null
        }
        Relationships: []
      }
      vw_necessidade_compra_detalhe: {
        Row: {
          aberto_desde: string | null
          cliente: string | null
          cliente_id: string | null
          deficit_total: number | null
          dias_em_aberto: number | null
          orcamento_numero: string | null
          produto: string | null
          produto_codigo: number | null
          produto_id: string | null
          projeto_codigo: string | null
          projeto_item_id: string | null
          projeto_nome: string | null
          q_entrega_futura: number | null
          q_reserva: number | null
          qtd_estoque: number | null
          qtd_reservada: number | null
          qtd_vendida: number | null
        }
        Relationships: [
          {
            foreignKeyName: "estoque_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estoque_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "v_estoque_produtos"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "estoque_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_estoque_liquido"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "estoque_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_estoque_produtos"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "estoque_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "estoque_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_produtos_estoque_detalhado"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estoque_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_vendas_loja"
            referencedColumns: ["produto_id"]
          },
        ]
      }
      vw_necessidade_compra_item_orcamento: {
        Row: {
          fornecedor_id: string | null
          fornecedor_nome: string | null
          l_fixo: string | null
          marca_id: string | null
          marca_nome: string | null
          orcamento_id: string | null
          orcamento_item_id: string | null
          orcamento_numero: string | null
          pendente_item: number | null
          percentual_desconto_compra: number | null
          preco_custo: number | null
          produto: string | null
          produto_codigo: number | null
          produto_id: string | null
          projeto_item_id: string | null
          q_entrega_futura: number | null
          qtd_coberta_por_pedido_aberto: number | null
        }
        Relationships: [
          {
            foreignKeyName: "projeto_itens_orcamento_id_fkey"
            columns: ["orcamento_id"]
            isOneToOne: false
            referencedRelation: "orcamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_itens_orcamento_id_fkey"
            columns: ["orcamento_id"]
            isOneToOne: false
            referencedRelation: "vw_orcamentos_aprovacao_financeira_auditoria"
            referencedColumns: ["orcamento_id"]
          },
          {
            foreignKeyName: "projeto_itens_orcamento_id_fkey"
            columns: ["orcamento_id"]
            isOneToOne: false
            referencedRelation: "vw_orcamentos_prazo_entrega"
            referencedColumns: ["orcamento_id"]
          },
          {
            foreignKeyName: "projeto_itens_orcamento_item_id_fkey"
            columns: ["orcamento_item_id"]
            isOneToOne: false
            referencedRelation: "orcamento_itens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "v_estoque_produtos"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "projeto_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_estoque_liquido"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "projeto_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_estoque_produtos"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "projeto_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "projeto_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_produtos_estoque_detalhado"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_vendas_loja"
            referencedColumns: ["produto_id"]
          },
        ]
      }
      vw_necessidade_compra_pedido_detalhe: {
        Row: {
          data_prevista_entrega: string | null
          empresa_nome: string | null
          numero: string | null
          pedido_id: string | null
          produto_id: string | null
          qtd_pendente: number | null
          status: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pedido_compra_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedido_compra_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "v_estoque_produtos"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "pedido_compra_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_estoque_liquido"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "pedido_compra_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_estoque_produtos"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "pedido_compra_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "pedido_compra_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_produtos_estoque_detalhado"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedido_compra_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_vendas_loja"
            referencedColumns: ["produto_id"]
          },
        ]
      }
      vw_necessidade_compra_pedidos_abertos: {
        Row: {
          produto_id: string | null
          proxima_data_prevista_entrega: string | null
          qtd_em_pedidos_abertos: number | null
          qtd_pedidos_abertos: number | null
          status_mais_critico: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pedido_compra_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedido_compra_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "v_estoque_produtos"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "pedido_compra_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_estoque_liquido"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "pedido_compra_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_estoque_produtos"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "pedido_compra_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "pedido_compra_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_produtos_estoque_detalhado"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedido_compra_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_vendas_loja"
            referencedColumns: ["produto_id"]
          },
        ]
      }
      vw_necessidade_importacao_ubiqua: {
        Row: {
          cor: string | null
          descricao: string | null
          disponivel_atual: number | null
          fornecedor: string | null
          marca: string | null
          orcamentos_pendentes: number | null
          produto_id: number | null
          qtd_pendente_importacao: number | null
          referencia: string | null
        }
        Relationships: []
      }
      vw_orcamentos_aprovacao_financeira_auditoria: {
        Row: {
          aprovado_cliente_em: string | null
          boletos_por_orcamento: number | null
          classificacao_fluxo: string | null
          cliente_id: string | null
          numero: string | null
          orcamento_id: string | null
          parcelas_por_orcamento: number | null
          projeto_id: string | null
          projeto_itens_por_orcamento: number | null
          requer_revisao_financeira: boolean | null
          status: string | null
          valor_total: number | null
        }
        Relationships: [
          {
            foreignKeyName: "orcamentos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "contatos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orcamentos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra"
            referencedColumns: ["fornecedor_id"]
          },
          {
            foreignKeyName: "orcamentos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra_item_orcamento"
            referencedColumns: ["fornecedor_id"]
          },
          {
            foreignKeyName: "orcamentos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["contato_id"]
          },
          {
            foreignKeyName: "orcamentos_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "projetos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orcamentos_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_financeiro_projetos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orcamentos_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_pipeline"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orcamentos_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_resumo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orcamentos_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_sem_empresa"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orcamentos_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_sem_responsavel"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orcamentos_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_separacoes_agenda"
            referencedColumns: ["projeto_id"]
          },
          {
            foreignKeyName: "orcamentos_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["projeto_id"]
          },
        ]
      }
      vw_orcamentos_prazo_entrega: {
        Row: {
          data_base_prazo: string | null
          data_prazo_entrega: string | null
          numero: string | null
          orcamento_id: string | null
          prazo_entrega_dias: number | null
          projeto_id: string | null
          status: string | null
        }
        Insert: {
          data_base_prazo?: never
          data_prazo_entrega?: never
          numero?: string | null
          orcamento_id?: string | null
          prazo_entrega_dias?: number | null
          projeto_id?: string | null
          status?: string | null
        }
        Update: {
          data_base_prazo?: never
          data_prazo_entrega?: never
          numero?: string | null
          orcamento_id?: string | null
          prazo_entrega_dias?: number | null
          projeto_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orcamentos_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "projetos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orcamentos_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_financeiro_projetos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orcamentos_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_pipeline"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orcamentos_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_resumo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orcamentos_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_sem_empresa"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orcamentos_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_sem_responsavel"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orcamentos_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_separacoes_agenda"
            referencedColumns: ["projeto_id"]
          },
          {
            foreignKeyName: "orcamentos_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["projeto_id"]
          },
        ]
      }
      vw_pedido_compra_item_origem: {
        Row: {
          cliente: string | null
          id: string | null
          orcamento_numero: string | null
          pedido_compra_item_id: string | null
          projeto_codigo: string | null
          projeto_item_id: string | null
          projeto_nome: string | null
          quantidade_atendida: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pedido_compra_item_origem_pedido_compra_item_id_fkey"
            columns: ["pedido_compra_item_id"]
            isOneToOne: false
            referencedRelation: "pedido_compra_itens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedido_compra_item_origem_projeto_item_id_fkey"
            columns: ["projeto_item_id"]
            isOneToOne: false
            referencedRelation: "projeto_itens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedido_compra_item_origem_projeto_item_id_fkey"
            columns: ["projeto_item_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra_detalhe"
            referencedColumns: ["projeto_item_id"]
          },
          {
            foreignKeyName: "pedido_compra_item_origem_projeto_item_id_fkey"
            columns: ["projeto_item_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra_item_orcamento"
            referencedColumns: ["projeto_item_id"]
          },
        ]
      }
      vw_pendencias_re_reserva: {
        Row: {
          atualizado_em: string | null
          cliente: string | null
          cliente_id: string | null
          orcamento_id: string | null
          orcamento_numero: string | null
          produto: string | null
          produto_codigo: number | null
          produto_id: string | null
          projeto_codigo: string | null
          projeto_id: string | null
          projeto_item_id: string | null
          q_entrega_futura: number | null
          q_reserva: number | null
          qtd_comprometida: number | null
          qtd_disponivel: number | null
          qtd_fisica: number | null
          qtd_pode_re_reservar: number | null
        }
        Relationships: [
          {
            foreignKeyName: "estoque_saldos_projeto_item_projeto_item_id_fkey"
            columns: ["projeto_item_id"]
            isOneToOne: true
            referencedRelation: "projeto_itens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estoque_saldos_projeto_item_projeto_item_id_fkey"
            columns: ["projeto_item_id"]
            isOneToOne: true
            referencedRelation: "vw_necessidade_compra_detalhe"
            referencedColumns: ["projeto_item_id"]
          },
          {
            foreignKeyName: "estoque_saldos_projeto_item_projeto_item_id_fkey"
            columns: ["projeto_item_id"]
            isOneToOne: true
            referencedRelation: "vw_necessidade_compra_item_orcamento"
            referencedColumns: ["projeto_item_id"]
          },
          {
            foreignKeyName: "projeto_itens_orcamento_id_fkey"
            columns: ["orcamento_id"]
            isOneToOne: false
            referencedRelation: "orcamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_itens_orcamento_id_fkey"
            columns: ["orcamento_id"]
            isOneToOne: false
            referencedRelation: "vw_orcamentos_aprovacao_financeira_auditoria"
            referencedColumns: ["orcamento_id"]
          },
          {
            foreignKeyName: "projeto_itens_orcamento_id_fkey"
            columns: ["orcamento_id"]
            isOneToOne: false
            referencedRelation: "vw_orcamentos_prazo_entrega"
            referencedColumns: ["orcamento_id"]
          },
          {
            foreignKeyName: "projeto_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "v_estoque_produtos"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "projeto_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_estoque_liquido"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "projeto_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_estoque_produtos"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "projeto_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "projeto_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_produtos_estoque_detalhado"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_vendas_loja"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "projeto_itens_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "projetos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_itens_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_financeiro_projetos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_itens_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_pipeline"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_itens_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_resumo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_itens_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_sem_empresa"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_itens_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_sem_responsavel"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_itens_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_separacoes_agenda"
            referencedColumns: ["projeto_id"]
          },
          {
            foreignKeyName: "projeto_itens_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["projeto_id"]
          },
        ]
      }
      vw_produtos_estoque_detalhado: {
        Row: {
          codigo_produto: number | null
          disponivel: number | null
          estoque_geral: number | null
          id: string | null
          nome: string | null
          preco_venda: number | null
          reserva: number | null
          separacao: number | null
          sku: string | null
        }
        Relationships: []
      }
      vw_produtos_estoque_por_local: {
        Row: {
          cest: string | null
          codigo_produto: number | null
          cst: string | null
          mascara_produto: string | null
          nome: string | null
          porc_bdi: number | null
          preco_venda: number | null
          quantidade: number | null
          quantidade_reservada: number | null
          setor: Database["public"]["Enums"]["estoque_local"] | null
          status_comercial: string | null
          unidade: string | null
        }
        Relationships: []
      }
      vw_projetos_dashboard: {
        Row: {
          empresa_id: string | null
          total_projetos: number | null
        }
        Relationships: [
          {
            foreignKeyName: "projetos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projetos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_fornecedores_remessas"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "projetos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_fornecedores_resumo"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "projetos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_remessas_completa"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "projetos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_remessas_resumo_status"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "projetos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["empresa_id"]
          },
        ]
      }
      vw_projetos_pipeline: {
        Row: {
          cliente_id: string | null
          cliente_nome: string | null
          codigo: string | null
          data_entrada: string | null
          id: string | null
          nome: string | null
          status: Database["public"]["Enums"]["projeto_status"] | null
          tipo_projeto: string | null
          valor_total: number | null
        }
        Relationships: [
          {
            foreignKeyName: "projetos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "contatos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projetos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra"
            referencedColumns: ["fornecedor_id"]
          },
          {
            foreignKeyName: "projetos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra_item_orcamento"
            referencedColumns: ["fornecedor_id"]
          },
          {
            foreignKeyName: "projetos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["contato_id"]
          },
        ]
      }
      vw_projetos_por_responsavel: {
        Row: {
          projetos_arquivados: number | null
          projetos_ativos: number | null
          responsavel: string | null
          total_projetos: number | null
          usuario_id: string | null
        }
        Relationships: []
      }
      vw_projetos_por_status: {
        Row: {
          status: Database["public"]["Enums"]["projeto_status"] | null
          total_clientes: number | null
          total_projetos: number | null
          valor_total: number | null
        }
        Relationships: []
      }
      vw_projetos_resumo: {
        Row: {
          codigo: string | null
          id: string | null
          status: Database["public"]["Enums"]["projeto_status"] | null
          total_vendas: number | null
          valor_pago: number | null
          valor_pendente: number | null
          valor_total_vendas: number | null
        }
        Relationships: []
      }
      vw_projetos_sem_empresa: {
        Row: {
          codigo: string | null
          created_at: string | null
          data_entrada: string | null
          id: string | null
          nome: string | null
          responsavel_nome: string | null
          status: Database["public"]["Enums"]["projeto_status"] | null
        }
        Insert: {
          codigo?: string | null
          created_at?: string | null
          data_entrada?: string | null
          id?: string | null
          nome?: string | null
          responsavel_nome?: string | null
          status?: Database["public"]["Enums"]["projeto_status"] | null
        }
        Update: {
          codigo?: string | null
          created_at?: string | null
          data_entrada?: string | null
          id?: string | null
          nome?: string | null
          responsavel_nome?: string | null
          status?: Database["public"]["Enums"]["projeto_status"] | null
        }
        Relationships: []
      }
      vw_projetos_sem_responsavel: {
        Row: {
          arquiteto_id: string | null
          cliente_id: string | null
          codigo: string | null
          created_at: string | null
          data_entrada: string | null
          id: string | null
          nome: string | null
          status: Database["public"]["Enums"]["projeto_status"] | null
        }
        Insert: {
          arquiteto_id?: string | null
          cliente_id?: string | null
          codigo?: string | null
          created_at?: string | null
          data_entrada?: string | null
          id?: string | null
          nome?: string | null
          status?: Database["public"]["Enums"]["projeto_status"] | null
        }
        Update: {
          arquiteto_id?: string | null
          cliente_id?: string | null
          codigo?: string | null
          created_at?: string | null
          data_entrada?: string | null
          id?: string | null
          nome?: string | null
          status?: Database["public"]["Enums"]["projeto_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "projetos_arquiteto_id_fkey"
            columns: ["arquiteto_id"]
            isOneToOne: false
            referencedRelation: "contatos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projetos_arquiteto_id_fkey"
            columns: ["arquiteto_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra"
            referencedColumns: ["fornecedor_id"]
          },
          {
            foreignKeyName: "projetos_arquiteto_id_fkey"
            columns: ["arquiteto_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra_item_orcamento"
            referencedColumns: ["fornecedor_id"]
          },
          {
            foreignKeyName: "projetos_arquiteto_id_fkey"
            columns: ["arquiteto_id"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["contato_id"]
          },
          {
            foreignKeyName: "projetos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "contatos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projetos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra"
            referencedColumns: ["fornecedor_id"]
          },
          {
            foreignKeyName: "projetos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra_item_orcamento"
            referencedColumns: ["fornecedor_id"]
          },
          {
            foreignKeyName: "projetos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["contato_id"]
          },
        ]
      }
      vw_projetos_status_enum: {
        Row: {
          status: Database["public"]["Enums"]["projeto_status"] | null
          total: number | null
        }
        Relationships: []
      }
      vw_remessas_completa: {
        Row: {
          created_at: string | null
          data_pagamento: string | null
          descricao: string | null
          empresa_id: string | null
          empresa_nome: string | null
          fornecedor_cnpj_cpf: string | null
          fornecedor_id: string | null
          fornecedor_nome: string | null
          id: string | null
          linha_digitavel: string | null
          nosso_numero: string | null
          observacoes: string | null
          status: string | null
          updated_at: string | null
          valor: number | null
          valor_pago: number | null
          vencimento: string | null
        }
        Relationships: []
      }
      vw_remessas_resumo_status: {
        Row: {
          empresa_id: string | null
          empresa_nome: string | null
          quantidade: number | null
          status: string | null
          valor_pago_total: number | null
          valor_total: number | null
        }
        Relationships: []
      }
      vw_remessas_vencimento: {
        Row: {
          arquivo_remessa: string | null
          arquivo_retorno: string | null
          codigo_barras: string | null
          created_at: string | null
          data_pagamento: string | null
          descricao: string | null
          empresa_id: string | null
          empresa_nome: string | null
          fornecedor_id: string | null
          fornecedor_nome: string | null
          id: string | null
          linha_digitavel: string | null
          nosso_numero: string | null
          observacoes: string | null
          situacao_vencimento: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
          valor: number | null
          valor_pago: number | null
          vencimento: string | null
        }
        Relationships: [
          {
            foreignKeyName: "remessas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "remessas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_fornecedores_remessas"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "remessas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_fornecedores_resumo"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "remessas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_remessas_completa"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "remessas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_remessas_resumo_status"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "remessas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "remessas_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "fornecedores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "remessas_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "vw_fornecedores_remessas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "remessas_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "vw_fornecedores_resumo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "remessas_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "vw_remessas_completa"
            referencedColumns: ["fornecedor_id"]
          },
        ]
      }
      vw_separacoes_agenda: {
        Row: {
          cliente: string | null
          cliente_nome: string | null
          codigo_obra: string | null
          created_at: string | null
          data_entrega: string | null
          data_entrega_original: string | null
          delivery_type: string | null
          dias_ate_entrega: number | null
          endereco_entrega: string | null
          entrega_id: string | null
          entrega_status: Database["public"]["Enums"]["entrega_status"] | null
          entregador_id: string | null
          entregador_nome: string | null
          itens_separados: number | null
          observacoes: string | null
          projeto_codigo: string | null
          projeto_id: string | null
          projeto_nome: string | null
          projeto_status: Database["public"]["Enums"]["projeto_status"] | null
          reagendamentos: number | null
          scheduled_time: string | null
          separacao_id: string | null
          separacao_status:
            | Database["public"]["Enums"]["separacao_status"]
            | null
          total_itens: number | null
          updated_at: string | null
          urgencia: string | null
        }
        Relationships: [
          {
            foreignKeyName: "entregas_entregador_id_fkey"
            columns: ["entregador_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entregas_entregador_id_fkey"
            columns: ["entregador_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_por_responsavel"
            referencedColumns: ["usuario_id"]
          },
        ]
      }
      vw_staging_resumo: {
        Row: {
          pendentes: number | null
          primeira_importacao: string | null
          processados: number | null
          tabela: string | null
          total: number | null
          ultima_importacao: string | null
        }
        Relationships: []
      }
      vw_transacoes_completas: {
        Row: {
          acordo: number | null
          cod_duplicata: number | null
          cod_itens_duplicata: number | null
          cod_venda: number | null
          comprovante_url: string | null
          conta_bancaria_id: string | null
          conta_bancaria_nome: string | null
          contato_id: string | null
          contato_nome: string | null
          contato_tipo: Database["public"]["Enums"]["contato_tipo"] | null
          created_by: string | null
          data_transacao: string | null
          descricao: string | null
          dev_troca: boolean | null
          dt_emissao: string | null
          dt_pagamento: string | null
          dt_vencimento: string | null
          empresa_id: string | null
          empresa_nome: string | null
          funcionario_id: string | null
          funcionario_nome: string | null
          id: string | null
          negociacao_id: string | null
          num_parc: number | null
          parcela_crm_id: string | null
          parcela_crm_numero: number | null
          plano_apropriacao: string | null
          plano_contas_id: string | null
          plano_grupo: string | null
          plano_sub_grupo: string | null
          projeto_codigo: string | null
          projeto_id: string | null
          projeto_nome: string | null
          status_pago: number | null
          tipo: Database["public"]["Enums"]["transacao_tipo"] | null
          tipo_pagamento: string | null
          total_parc: number | null
          valor: number | null
          vl_desconto: number | null
          vl_frete: number | null
          vl_ipi: number | null
          vl_juros: number | null
          vl_pago: number | null
          vl_parcela: number | null
        }
        Relationships: [
          {
            foreignKeyName: "transacoes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transacoes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "vw_projetos_por_responsavel"
            referencedColumns: ["usuario_id"]
          },
          {
            foreignKeyName: "transacoes_negociacao_id_fkey"
            columns: ["negociacao_id"]
            isOneToOne: false
            referencedRelation: "negociacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      vw_transferencias_estoque: {
        Row: {
          aprovado_em: string | null
          aprovado_por: string | null
          cancelado_em: string | null
          destino_cliente: string | null
          destino_orcamento_numero: string | null
          destino_projeto_codigo: string | null
          destino_projeto_item_id: string | null
          motivo: string | null
          motivo_cancelamento: string | null
          origem_cliente: string | null
          origem_orcamento_numero: string | null
          origem_projeto_codigo: string | null
          origem_projeto_item_id: string | null
          produto: string | null
          produto_codigo: number | null
          produto_id: string | null
          quantidade: number | null
          solicitado_em: string | null
          solicitado_por: string | null
          status: string | null
          transferencia_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projeto_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "v_estoque_produtos"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "projeto_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_estoque_liquido"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "projeto_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_estoque_produtos"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "projeto_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "projeto_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_produtos_estoque_detalhado"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_vendas_loja"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "transferencias_estoque_destino_projeto_item_id_fkey"
            columns: ["destino_projeto_item_id"]
            isOneToOne: false
            referencedRelation: "projeto_itens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transferencias_estoque_destino_projeto_item_id_fkey"
            columns: ["destino_projeto_item_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra_detalhe"
            referencedColumns: ["projeto_item_id"]
          },
          {
            foreignKeyName: "transferencias_estoque_destino_projeto_item_id_fkey"
            columns: ["destino_projeto_item_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra_item_orcamento"
            referencedColumns: ["projeto_item_id"]
          },
          {
            foreignKeyName: "transferencias_estoque_origem_projeto_item_id_fkey"
            columns: ["origem_projeto_item_id"]
            isOneToOne: false
            referencedRelation: "projeto_itens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transferencias_estoque_origem_projeto_item_id_fkey"
            columns: ["origem_projeto_item_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra_detalhe"
            referencedColumns: ["projeto_item_id"]
          },
          {
            foreignKeyName: "transferencias_estoque_origem_projeto_item_id_fkey"
            columns: ["origem_projeto_item_id"]
            isOneToOne: false
            referencedRelation: "vw_necessidade_compra_item_orcamento"
            referencedColumns: ["projeto_item_id"]
          },
        ]
      }
      vw_vendas_loja: {
        Row: {
          categoria: string | null
          cliente: string | null
          data_venda: string | null
          marca: string | null
          margem_total: number | null
          observacoes: string | null
          preco_custo: number | null
          preco_venda: number | null
          produto: string | null
          produto_id: string | null
          quantidade: number | null
          separacao_id: string | null
          sku: string | null
        }
        Relationships: []
      }
      vw_vendas_por_projeto: {
        Row: {
          empresa_id: string | null
          total_vendas: number | null
        }
        Relationships: [
          {
            foreignKeyName: "projetos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projetos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_fornecedores_remessas"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "projetos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_fornecedores_resumo"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "projetos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_remessas_completa"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "projetos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_remessas_resumo_status"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "projetos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vw_transacoes_completas"
            referencedColumns: ["empresa_id"]
          },
        ]
      }
      vw_vendas_produtos: {
        Row: {
          categoria: string | null
          cliente: string | null
          data_venda: string | null
          marca: string | null
          margem_total: number | null
          origem: string | null
          preco_custo: number | null
          preco_venda: number | null
          produto: string | null
          produto_id: string | null
          projeto_codigo: string | null
          projeto_nome: string | null
          quantidade: number | null
          sku: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      _lucenera_parse_prazo_pagamento: {
        Args: {
          p_condicoes_pagamento: string
          p_prazo_pagamento_dias: number[]
        }
        Returns: number[]
      }
      adicionar_item_cotacao: {
        Args: {
          p_cotacao_id: string
          p_custo_unitario: number
          p_prazo_entrega_dias?: number
          p_produto_id: string
          p_quantidade: number
          p_solicitacao_id: string
        }
        Returns: string
      }
      adicionar_item_pedido: {
        Args: {
          p_custo_unitario?: number
          p_pedido_id: string
          p_produto_id?: string
          p_quantidade?: number
          p_solicitacao_id?: string
        }
        Returns: string
      }
      adm_aprovar_pelo_cliente: {
        Args: { p_observacao?: string; p_orcamento_id: string }
        Returns: Json
      }
      admin_update_user_password: {
        Args: { p_new_password: string; p_user_id: string }
        Returns: undefined
      }
      admin_update_user_role: {
        Args: { p_role: string; p_user_id: string }
        Returns: undefined
      }
      admin_update_user_status: {
        Args: { p_ativo: boolean; p_user_id: string }
        Returns: undefined
      }
      aprovar_orcamento_cliente: {
        Args: { p_orcamento_id: string }
        Returns: Json
      }
      aprovar_orcamento_cliente_manual: {
        Args: { p_orcamento_id: string }
        Returns: Json
      }
      aprovar_orcamento_cliente_publico: {
        Args: { p_orcamento_id: string; p_token: string }
        Returns: Json
      }
      aprovar_orcamento_financeiro: {
        Args: { p_orcamento_id: string }
        Returns: Json
      }
      aprovar_orcamento_financeiro_base_spec001: {
        Args: { p_orcamento_id: string }
        Returns: Json
      }
      aprovar_projeto_financeiro: {
        Args: { p_project_id: string }
        Returns: Json
      }
      aprovar_solicitacao_compra: {
        Args: {
          p_custo_unitario?: number
          p_numero?: string
          p_solicitacao_id: string
        }
        Returns: Json
      }
      aprovar_transferencia_estoque: {
        Args: { p_transferencia_id: string }
        Returns: Json
      }
      atualizar_desconto_compra_produto: {
        Args: { p_percentual_desconto: number; p_produto_id: string }
        Returns: undefined
      }
      atualizar_parcela_pedido_compra: {
        Args: {
          p_data_vencimento: string
          p_parcela_id: string
          p_valor: number
        }
        Returns: undefined
      }
      atualizar_preco_custo_produto: {
        Args: { p_preco_custo: number; p_produto_id: string }
        Returns: undefined
      }
      atualizar_status_cotacao: {
        Args: { p_id: string; p_status: string }
        Returns: undefined
      }
      atualizar_status_pedido: {
        Args: { p_id: string; p_status: string }
        Returns: undefined
      }
      atualizar_status_solicitacao: {
        Args: { p_id: string; p_status: string }
        Returns: undefined
      }
      buscar_fornecedores_fuzzy: {
        Args: { p_termo?: string }
        Returns: {
          id: string
          nome: string
        }[]
      }
      buscar_orcamento_para_aprovacao: {
        Args: { p_orcamento_id: string; p_token: string }
        Returns: Json
      }
      can_user_approve_quotes: { Args: never; Returns: boolean }
      cancelar_orcamento: {
        Args: { p_motivo?: string; p_orcamento_id: string }
        Returns: Json
      }
      cancelar_pedido_compra: {
        Args: { p_motivo?: string; p_pedido_id: string }
        Returns: Json
      }
      cancelar_transferencia_estoque: {
        Args: { p_motivo?: string; p_transferencia_id: string }
        Returns: Json
      }
      cliente_aprovar_orcamento: {
        Args: { p_orcamento_id: string; p_token: string }
        Returns: Json
      }
      cliente_recusar_orcamento: {
        Args: { p_motivo?: string; p_orcamento_id: string; p_token: string }
        Returns: Json
      }
      criar_cotacao_compra: {
        Args: {
          p_condicoes_pagamento?: string
          p_fornecedor_id: string
          p_observacao?: string
          p_validade?: string
        }
        Returns: string
      }
      criar_pedido_compra: {
        Args: {
          p_condicoes_pagamento?: string
          p_cotacao_id?: string
          p_fornecedor_id: string
          p_observacao?: string
        }
        Returns: string
      }
      criar_pedido_compra_de_necessidade: {
        Args: {
          p_condicoes_pagamento?: string
          p_custo_liquido?: number
          p_custo_unitario: number
          p_data_prevista_entrega?: string
          p_empresa_id?: string
          p_fornecedor_id: string
          p_numero?: string
          p_observacao?: string
          p_perfil?: string
          p_produto_id: string
          p_quantidade: number
          p_valor_icms?: number
          p_valor_ipi?: number
          p_valor_st?: number
        }
        Returns: Json
      }
      criar_pedido_compra_lote: {
        Args: {
          p_condicoes_pagamento?: string
          p_data_prevista_entrega?: string
          p_empresa_id?: string
          p_fornecedor_id: string
          p_itens: Json
          p_numero?: string
          p_observacao?: string
          p_perfil?: string
        }
        Returns: Json
      }
      criar_produto_orcamento: { Args: { p_payload: Json }; Returns: Json }
      criar_solicitacao_compra: {
        Args: {
          p_observacao?: string
          p_prioridade?: string
          p_produto_id: string
          p_quantidade: number
        }
        Returns: string
      }
      criar_usuario: {
        Args: {
          p_email: string
          p_nome: string
          p_password: string
          p_role?: Database["public"]["Enums"]["usuario_role"]
        }
        Returns: string
      }
      current_user_funcionario_id: { Args: never; Returns: string }
      current_user_is_funcionario: { Args: never; Returns: boolean }
      enviar_orcamento_para_cliente: {
        Args: { p_orcamento_id: string }
        Returns: Json
      }
      equipe_aprovar_orcamento: {
        Args: { p_observacao?: string; p_orcamento_id: string }
        Returns: Json
      }
      equipe_devolver_orcamento_cliente: {
        Args: { p_motivo: string; p_orcamento_id: string }
        Returns: Json
      }
      finalizar_validacao_financeira: {
        Args: { p_orcamentos: Json; p_project_data: Json; p_project_id: string }
        Returns: Json
      }
      financeiro_editar_orcamento: {
        Args: {
          p_forma_pagamento: string
          p_itens: Json
          p_orcamento_id: string
          p_reiniciar_aprovacao: boolean
          p_valor_total: number
        }
        Returns: Json
      }
      fn_add_dias_uteis: {
        Args: { data_base: string; dias: number }
        Returns: string
      }
      fn_gerar_numero_orcamento: { Args: never; Returns: string }
      gen_token_hex: { Args: never; Returns: string }
      generate_product_slug: {
        Args: { nome: string; preco: number }
        Returns: string
      }
      gerar_parcelas_pedido_compra: {
        Args: { p_pedido_id: string }
        Returns: Json
      }
      get_dashboard_crm_by_closing: {
        Args: { data_final: string; data_inicial: string }
        Returns: {
          area_do_projeto: Json | null
          arquiteto_id: string | null
          arquivado: boolean | null
          cidade: string | null
          cliente_id: string | null
          codigo: string
          codigo_legado: number | null
          created_at: string | null
          created_by: string | null
          data_entrada: string | null
          empresa_id: string | null
          equipe_id: string | null
          equipe_responsavel_obra_id: string | null
          estado: string | null
          historico: Json
          id: string
          link_sharepoint: string | null
          nivel_estrategico: Database["public"]["Enums"]["projeto_nivel"] | null
          nome: string
          "Nome Arquiteto": string | null
          perfil: string | null
          responsavel_id: string | null
          responsavel_nome: string | null
          responsavel_obra_id: string | null
          status: Database["public"]["Enums"]["projeto_status"] | null
          updated_at: string
          valor_total: number
        }[]
        SetofOptions: {
          from: "*"
          to: "projetos"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_dashboard_kpi: { Args: { p_date_now: string }; Returns: Json }
      get_dashboard_stats: { Args: never; Returns: Json }
      get_faltas_injustificadas: {
        Args: { p_fim: string; p_funcionario_id: string; p_inicio: string }
        Returns: number
      }
      get_latest_transaction_id: { Args: never; Returns: string }
      get_my_funcionario_id: { Args: never; Returns: string }
      get_next_sku: { Args: { prefix: string }; Returns: string }
      get_user_role: { Args: never; Returns: string }
      get_vendedores: {
        Args: never
        Returns: {
          email: string
          id: string
          name: string
        }[]
      }
      hub_pode_executar: {
        Args: {
          p_acao: string
          p_modulo_chave: string
          p_system_slug: string
          p_usuario_id: string
        }
        Returns: boolean
      }
      hub_sistemas_permitidos: {
        Args: { p_usuario_id: string }
        Returns: {
          description: string
          display_order: number | null
          icon_name: string | null
          id: string
          link: string
          name: string
          slug: string
          visivel_no_hub: boolean
        }[]
        SetofOptions: {
          from: "*"
          to: "systems"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      immutable_unaccent: { Args: { "": string }; Returns: string }
      is_admin: { Args: never; Returns: boolean }
      is_ubiqua_admin: { Args: never; Returns: boolean }
      limpar_staging_processados: { Args: never; Returns: number }
      link_my_funcionario_record: { Args: never; Returns: undefined }
      processar_retorno_bancario: {
        Args: {
          p_conta: string
          p_forcar?: boolean
          p_hash: string
          p_nome_arquivo: string
          p_registros: Json
        }
        Returns: Json
      }
      re_reservar_projeto_item: {
        Args: { p_projeto_item_id: string; p_quantidade: number }
        Returns: Json
      }
      recusar_orcamento_cliente_publico: {
        Args: { p_motivo?: string; p_orcamento_id: string; p_token: string }
        Returns: Json
      }
      registrar_devolucao_projeto_item: {
        Args: {
          p_motivo?: string
          p_projeto_item_id: string
          p_quantidade: number
        }
        Returns: Json
      }
      registrar_devolucao_projeto_item_setor: {
        Args: {
          p_motivo?: string
          p_projeto_item_id: string
          p_quantidade: number
          p_setor_origem: string
        }
        Returns: Json
      }
      registrar_recebimento_compra: {
        Args: {
          p_data: string
          p_itens: Json
          p_numero_nota: string
          p_pedido_id: string
        }
        Returns: Json
      }
      registrar_separacao_setor: {
        Args: {
          p_motivo?: string
          p_projeto_item_id: string
          p_quantidade: number
          p_separacao_id?: string
        }
        Returns: Json
      }
      rejeitar_solicitacao_compra: {
        Args: { p_motivo?: string; p_solicitacao_id: string }
        Returns: undefined
      }
      replace_orcamento_itens: {
        Args: { p_items: Json; p_orcamento_id: string }
        Returns: number
      }
      solicitar_transferencia_estoque: {
        Args: {
          p_destino_projeto_item_id: string
          p_motivo?: string
          p_origem_projeto_item_id: string
          p_quantidade: number
        }
        Returns: Json
      }
      stats_datacenter: { Args: never; Returns: Json }
      sugerir_fornecedores_marcas: {
        Args: never
        Returns: {
          fornecedor_id: string
          fornecedor_nome: string
          marca_id: string
          marca_nome: string
          score: number
        }[]
      }
      unaccent: { Args: { "": string }; Returns: string }
      update_revenda_ubiqua_ordem: {
        Args: { payload: Json }
        Returns: undefined
      }
      vincular_origem_pedido_compra_item: {
        Args: {
          p_observacao?: string
          p_pedido_compra_item_id: string
          p_projeto_item_id: string
          p_quantidade_atendida?: number
        }
        Returns: string
      }
      voltar_orcamento_rascunho: {
        Args: { p_motivo: string; p_orcamento_id: string }
        Returns: Json
      }
    }
    Enums: {
      conta_tipo: "Corrente" | "Poupança" | "CDB" | "Investimento" | "Caixa"
      contato_tipo:
        | "cliente"
        | "arquiteto"
        | "engenheiro"
        | "eletricista"
        | "fornecedor"
        | "outro"
      entrega_status: "Pendente" | "Em rota" | "Entregue" | "Cancelado"
      estoque_local:
        | "Estoque"
        | "Showroom"
        | "Em trânsito"
        | "Reservado"
        | "Estoque Geral"
        | "Estoque Luce Nera"
        | "Estoque Islight"
        | "Estoque Foco"
        | "Estoque Garantia"
        | "Estoque Casa Cor"
        | "Reserva"
        | "Separação"
        | "Entrega Futura"
        | "Devolução"
        | "Estoque Defeito"
        | "Amostra / Emprestado"
        | "Estoque Citel"
      frequencia_tipo: "mensal" | "trimestral" | "semestral" | "anual"
      funcao_separacao_type: "admin" | "operador" | "entregador" | "user"
      lancamento_status: "pendente" | "pago" | "cancelado"
      memory_rule_origin:
        | "user_manual"
        | "ai_learned_candidate"
        | "ai_learned_confirmed"
        | "system_default"
      memory_rule_scope: "global" | "domain"
      memory_rule_status:
        | "candidate"
        | "active"
        | "inactive"
        | "rejected"
        | "superseded"
      memory_rule_type:
        | "general_principle"
        | "extraction"
        | "relevance"
        | "classification"
        | "structuring"
        | "naming"
        | "relationship"
        | "consolidation"
        | "provenance"
        | "updating"
        | "conflict"
        | "deduplication"
        | "user_preference"
      nivel_acesso_tipo: "revendedor" | "interno" | "admin"
      pagamento_forma:
        | "pix"
        | "cartao"
        | "boleto"
        | "transferencia"
        | "cheque"
        | "dinheiro"
      parcela_status: "pendente" | "paga" | "atrasada" | "cancelada"
      projeto_nivel: "1" | "2" | "3" | "4"
      projeto_status:
        | "Estudo Inicial"
        | "Proposta Sinal"
        | "Elaboração Orçamento"
        | "Informações necessárias"
        | "Projeto executivo"
        | "Entrega materiais"
        | "Ajustes finais"
        | "Finalizado"
        | "Arquivado"
        | "Não Fechou"
        | "Venda Docusign"
        | "Obra Finalizada"
        | "Contrato de Projeto"
        | "Ajustes Finais"
        | "Emissão Projeto Executivo"
        | "Aprovação Financeira"
        | "Orçamento Aprovado"
      separacao_status:
        | "Rascunho"
        | "Pendente"
        | "Em separação"
        | "Pronto"
        | "Enviado"
        | "Cancelado"
        | "finalizado"
        | "separado"
        | "material_solicitado"
      sinal_status: "pendente" | "recebido" | "creditado" | "receita_servico"
      solicitacao_status:
        | "pendente"
        | "aprovada"
        | "rejeitada"
        | "comprada"
        | "cancelada"
      status_pagamento:
        | "Pendente"
        | "Parcialmente Pago"
        | "Pago"
        | "Atrasado"
        | "Cancelado"
      tipo_operacao: "CR" | "CP"
      tipo_projeto:
        | "Residential"
        | "Corporativo"
        | "Exposição Comercial"
        | "Paisagismo"
      transacao_tipo: "receita" | "despesa" | "transferencia"
      usuario_role: "admin" | "gerente" | "operador" | "funcionario" | "viewer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      conta_tipo: ["Corrente", "Poupança", "CDB", "Investimento", "Caixa"],
      contato_tipo: [
        "cliente",
        "arquiteto",
        "engenheiro",
        "eletricista",
        "fornecedor",
        "outro",
      ],
      entrega_status: ["Pendente", "Em rota", "Entregue", "Cancelado"],
      estoque_local: [
        "Estoque",
        "Showroom",
        "Em trânsito",
        "Reservado",
        "Estoque Geral",
        "Estoque Luce Nera",
        "Estoque Islight",
        "Estoque Foco",
        "Estoque Garantia",
        "Estoque Casa Cor",
        "Reserva",
        "Separação",
        "Entrega Futura",
        "Devolução",
        "Estoque Defeito",
        "Amostra / Emprestado",
        "Estoque Citel",
      ],
      frequencia_tipo: ["mensal", "trimestral", "semestral", "anual"],
      funcao_separacao_type: ["admin", "operador", "entregador", "user"],
      lancamento_status: ["pendente", "pago", "cancelado"],
      memory_rule_origin: [
        "user_manual",
        "ai_learned_candidate",
        "ai_learned_confirmed",
        "system_default",
      ],
      memory_rule_scope: ["global", "domain"],
      memory_rule_status: [
        "candidate",
        "active",
        "inactive",
        "rejected",
        "superseded",
      ],
      memory_rule_type: [
        "general_principle",
        "extraction",
        "relevance",
        "classification",
        "structuring",
        "naming",
        "relationship",
        "consolidation",
        "provenance",
        "updating",
        "conflict",
        "deduplication",
        "user_preference",
      ],
      nivel_acesso_tipo: ["revendedor", "interno", "admin"],
      pagamento_forma: [
        "pix",
        "cartao",
        "boleto",
        "transferencia",
        "cheque",
        "dinheiro",
      ],
      parcela_status: ["pendente", "paga", "atrasada", "cancelada"],
      projeto_nivel: ["1", "2", "3", "4"],
      projeto_status: [
        "Estudo Inicial",
        "Proposta Sinal",
        "Elaboração Orçamento",
        "Informações necessárias",
        "Projeto executivo",
        "Entrega materiais",
        "Ajustes finais",
        "Finalizado",
        "Arquivado",
        "Não Fechou",
        "Venda Docusign",
        "Obra Finalizada",
        "Contrato de Projeto",
        "Ajustes Finais",
        "Emissão Projeto Executivo",
        "Aprovação Financeira",
        "Orçamento Aprovado",
      ],
      separacao_status: [
        "Rascunho",
        "Pendente",
        "Em separação",
        "Pronto",
        "Enviado",
        "Cancelado",
        "finalizado",
        "separado",
        "material_solicitado",
      ],
      sinal_status: ["pendente", "recebido", "creditado", "receita_servico"],
      solicitacao_status: [
        "pendente",
        "aprovada",
        "rejeitada",
        "comprada",
        "cancelada",
      ],
      status_pagamento: [
        "Pendente",
        "Parcialmente Pago",
        "Pago",
        "Atrasado",
        "Cancelado",
      ],
      tipo_operacao: ["CR", "CP"],
      tipo_projeto: [
        "Residential",
        "Corporativo",
        "Exposição Comercial",
        "Paisagismo",
      ],
      transacao_tipo: ["receita", "despesa", "transferencia"],
      usuario_role: ["admin", "gerente", "operador", "funcionario", "viewer"],
    },
  },
} as const

