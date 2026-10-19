import { supabase } from './supabase/client'

// SPEC-206 fase 2: avisa a Central (Administração › Movimentação) de cada tela aberta por quem está logado.
// Escuta a navegação do navegador (pushState/replaceState/voltar), então serve para qualquer roteador.
// O banco descobre o sistema pelo endereço de origem e ignora a mesma tela repetida em menos de 1 minuto.
// Só registra o caminho (sem ?parâmetros, que podem ter token). Qualquer falha é ignorada: nunca atrapalha a tela.

const INTERVALO_MESMA_TELA_MS = 60_000

let ultimaRota = ''
let ultimoEnvio = 0
let timer: ReturnType<typeof setTimeout> | undefined

async function registrar() {
  try {
    const rota = window.location.pathname || '/'
    const agora = Date.now()
    if (rota === ultimaRota && agora - ultimoEnvio < INTERVALO_MESMA_TELA_MS) return
    const { data } = await supabase.auth.getSession()
    if (!data.session) return
    ultimaRota = rota
    ultimoEnvio = agora
    await (supabase as any).rpc('auditoria_registrar_tela', {
      p_rota: rota,
      p_titulo: document.title || null,
    })
  } catch {
    // registro de uso é secundário
  }
}

function agendar() {
  if (timer) clearTimeout(timer)
  // Espera a tela montar (e o título mudar) antes de avisar.
  timer = setTimeout(registrar, 800)
}

export function iniciarRegistroDeTela() {
  if (typeof window === 'undefined') return
  const w = window as any
  if (w.__registroDeTela) return
  w.__registroDeTela = true

  for (const metodo of ['pushState', 'replaceState'] as const) {
    const original = window.history[metodo]
    window.history[metodo] = function (this: History, ...args: any[]) {
      const r = (original as any).apply(this, args)
      agendar()
      return r
    } as any
  }
  window.addEventListener('popstate', agendar)
  supabase.auth.onAuthStateChange((evento) => {
    if (evento === 'SIGNED_IN') agendar()
  })
  agendar()
}
