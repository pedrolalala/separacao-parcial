import { supabase } from '@/lib/supabase/client'

// SPEC-123 item 3: use-auth.tsx e useSistemasPermitidos.ts (SPEC-120) podiam
// consultar `usuarios.select('role')` para o mesmo usuário de forma
// independente, duplicando a mesma query de rede a cada carregamento de
// página. Cache em memória (por aba, por usuário) elimina a segunda chamada
// sem tocar no design autocontido de nenhum dos dois hooks —
// useSistemasPermitidos continua resolvendo o próprio usuário sozinho
// (SPEC-120 documenta que isso é proposital: evita depender do formato de
// useAuth() de cada um dos ~10 repositórios, que varia bastante).
let cached: { userId: string; promise: Promise<string | null> } | null = null

export function getUsuarioRoleCached(userId: string): Promise<string | null> {
  if (cached && cached.userId === userId) return cached.promise
  const promise = supabase
    .from('usuarios')
    .select('role')
    .eq('id', userId)
    .maybeSingle()
    .then(({ data }) => data?.role ?? null)
  cached = { userId, promise }
  return promise
}
