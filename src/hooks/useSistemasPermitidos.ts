import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export interface SistemaPermitido {
  id: string
  name: string
  link: string
  icon_name: string
  display_order: number
  slug: string
}

// SPEC-120: hook compartilhado (replicado por repositório — sem monorepo
// hoje) para o menu lateral de navegação entre sistemas. Resolve o usuário
// logado internamente (não depende do formato de useAuth de cada sistema,
// que varia muito entre os ~10 repositórios) e replica a mesma lógica já
// usada pelo Hub (Dashboard.tsx): RPC hub_sistemas_permitidos, com bypass
// para admin (vê tudo que é visivel_no_hub) e fallback legado para
// user_system_access quando a RPC não retorna nada. Ubiqua e o próprio
// sistema atual (currentSlug) são sempre excluídos do resultado.
export function useSistemasPermitidos(currentSlug: string) {
  const [userId, setUserId] = useState<string | undefined>(undefined)
  const [sistemas, setSistemas] = useState<SistemaPermitido[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    supabase.auth.getUser().then(({ data }) => {
      if (mounted) setUserId(data.user?.id)
    })
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) setUserId(session?.user?.id)
    })
    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!userId) {
      setSistemas([])
      setLoading(false)
      return
    }

    let mounted = true

    const excluirEOrdenar = (list: SistemaPermitido[]) =>
      [...list]
        .filter((s) => s.slug !== 'ubiqua' && s.slug !== currentSlug)
        .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))

    async function load() {
      setLoading(true)

      const { data: usuarioRow } = await supabase
        .from('usuarios')
        .select('role')
        .eq('id', userId)
        .maybeSingle()

      if (usuarioRow?.role === 'admin') {
        const { data } = await supabase
          .from('systems')
          .select('id, name, link, icon_name, display_order, slug')
          .eq('visivel_no_hub', true)
        if (mounted) {
          setSistemas(excluirEOrdenar((data as SistemaPermitido[]) || []))
          setLoading(false)
        }
        return
      }

      const { data, error } = await (supabase as any).rpc('hub_sistemas_permitidos', {
        p_usuario_id: userId,
      })

      if (!error && data && data.length > 0) {
        if (mounted) {
          setSistemas(excluirEOrdenar(data))
          setLoading(false)
        }
        return
      }

      const { data: legacyData } = await supabase
        .from('user_system_access')
        .select('system_id, systems(*)')
        .eq('user_id', userId)

      const legacy = (legacyData?.map((d: any) => d.systems).filter(Boolean) ||
        []) as SistemaPermitido[]
      if (mounted) {
        setSistemas(excluirEOrdenar(legacy))
        setLoading(false)
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [userId, currentSlug])

  return { sistemas, loading, userId }
}
