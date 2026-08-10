import { supabase } from '@/lib/supabase/client'

function safeRedirectPath(value: string): string {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return '/'
  return value
}

function destinationWithCode(destinationBaseUrl: string, code: string): string {
  const url = new URL(destinationBaseUrl, window.location.href)
  url.pathname = '/'
  url.search = ''
  url.hash = ''
  url.searchParams.set('sso_code', code)
  return url.toString()
}

export async function redirectWithCode(
  destinationBaseUrl: string,
  redirectTo = '/',
  sistemaDestino?: string,
) {
  // Abre a aba de forma SÍNCRONA (ainda dentro do gesto de clique do usuário) —
  // se esperássemos o await abaixo para chamar window.open, o navegador não
  // reconheceria mais como resultado direto do clique e bloquearia o popup.
  // IMPORTANTE: sem 'noopener' aqui — com 'noopener' o navegador sempre
  // retorna null (nunca dá a referência da aba), então não teríamos como
  // navegar ela depois. O preço é a nova aba ficar com window.opener setado,
  // aceitável aqui porque o destino é sempre um sistema interno confiável.
  const newTab = window.open('', '_blank')

  try {
    const destination = new URL(destinationBaseUrl, window.location.href)
    const redirectPath = safeRedirectPath(redirectTo)
    const { data, error } = await supabase.functions.invoke('generate-cross-system-code', {
      body: {
        sistema_origem: 'hub',
        sistema_destino: sistemaDestino || destination.hostname,
        redirect_to: redirectPath,
      },
    })

    if (error) throw error
    if (!data?.code) throw new Error('Código SSO não retornado.')

    const nextUrl = destinationWithCode(destination.toString(), data.code)

    if (newTab) {
      newTab.location.href = nextUrl
    } else {
      // Popup foi bloqueado mesmo assim — tenta abrir de novo como último recurso.
      window.open(nextUrl, '_blank', 'noopener,noreferrer')
    }
  } catch (err) {
    newTab?.close()
    throw err
  }
}

export async function consumeCodeFromUrl(sistemaDestino?: string): Promise<boolean> {
  const params = new URLSearchParams(window.location.search)
  const code = params.get('sso_code')
  if (!code) return false

  const { data, error } = await supabase.functions.invoke('exchange-cross-system-code', {
    body: { code, sistema_destino: sistemaDestino },
  })

  if (error || !data) return false

  if (data.access_token && data.refresh_token) {
    await supabase.auth.setSession({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
    })
  } else if (data.token_hash) {
    const { error: otpError } = await supabase.auth.verifyOtp({
      token_hash: data.token_hash,
      type: 'magiclink',
    })
    if (otpError) return false
  } else {
    return false
  }

  const redirectTo = safeRedirectPath(data.redirect_to || '/')
  const next = new URL(redirectTo, window.location.origin)
  window.history.replaceState({}, '', `${next.pathname}${next.search}${next.hash}`)
  return true
}
