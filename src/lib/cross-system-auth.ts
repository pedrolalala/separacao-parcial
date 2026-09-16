import { supabase } from '@/lib/supabase/client'

type RedirectOptions = {
  newTab?: boolean
}

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
  options: RedirectOptions = {},
) {
  const placeholder = options.newTab
    ? window.open('about:blank', '_blank', 'noopener,noreferrer')
    : null

  try {
    const destination = new URL(destinationBaseUrl, window.location.href)
    const redirectPath = safeRedirectPath(redirectTo)
    const { data, error } = await supabase.functions.invoke('generate-cross-system-code', {
      body: {
        sistema_origem: 'separacao-parcial',
        sistema_destino: sistemaDestino || destination.hostname,
        redirect_to: redirectPath,
      },
    })

    if (error) throw error
    if (!data?.code) throw new Error('Código SSO não retornado.')

    const nextUrl = destinationWithCode(destination.toString(), data.code)
    if (placeholder) {
      placeholder.location.href = nextUrl
    } else {
      window.location.href = nextUrl
    }
  } catch (error) {
    placeholder?.close()
    throw error
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
