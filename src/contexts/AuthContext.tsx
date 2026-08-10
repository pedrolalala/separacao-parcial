import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'
import { consumeCodeFromUrl } from '@/lib/cross-system-auth'

interface AuthContextType {
  user: User | null
  session: Session | null
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<{ error: any }>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    let initialized = false

    // Acesso vindo da Central chega com ?sso_code na URL. onAuthStateChange
    // dispara um evento inicial com a sessão que já existia ANTES da troca
    // desse código terminar (normalmente nula, numa aba nova) — se esse
    // evento resolvesse "loading" pra false direto, o app achava que
    // ninguém tinha logado antes da troca terminar, "bugando" o clique
    // vindo da Central. Por isso a resolução real só acontece depois do
    // consumeCodeFromUrl + getSession abaixo.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted || !initialized) return
      setSession(nextSession)
      setUser(nextSession?.user ?? null)
    })

    consumeCodeFromUrl('separacao-parcial')
      .catch(() => {})
      .finally(() => {
        supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
          if (!mounted) return
          initialized = true
          setSession(initialSession)
          setUser(initialSession?.user ?? null)
          setLoading(false)
        })
      })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error }
  }
  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  return (
    <AuthContext.Provider value={{ user, session, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
