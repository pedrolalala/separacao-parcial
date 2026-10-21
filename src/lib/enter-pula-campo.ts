// SPEC-216 (pedido do usuário 21/10/2026, vale para todos os sistemas): o Enter NUNCA salva nem confirma nada.
// Enter pula para o próximo campo (como o Tab); Shift+Enter volta. Salvar/confirmar/fechar operação só com clique.
// Mesmo arquivo em todos os sistemas (repositórios separados) — ao mudar aqui, copiar para os outros.
//
// Ctrl/Cmd/Alt+Enter também não salva. O Enter continua com o papel de sempre só onde não salva nada:
// - caixa de texto de várias linhas (só quebra a linha; nem chat envia com Enter);
// - lista de sugestões/seleção aberta (escolhe o item destacado);
// - campo de busca fora de formulário de cadastro (busca);
// - tela de login (entra no sistema);
// - campo marcado pela tela com data-enter="permitir".

const SELETOR_FOCAVEL =
  'input, select, textarea, button, a[href], [tabindex], [contenteditable="true"], [role="combobox"]'

const TIPOS_SEM_TEXTO = new Set(['hidden', 'button', 'submit', 'reset', 'image', 'file'])
const TIPOS_TEXTO = new Set(['text', 'search', 'email', 'tel', 'url', 'password', 'number', ''])
const PAPEIS_CAMPO = new Set(['combobox', 'checkbox', 'switch', 'radio', 'spinbutton', 'textbox'])

function visivel(el: HTMLElement) {
  if (!(el.offsetWidth || el.offsetHeight || el.getClientRects().length)) return false
  return getComputedStyle(el).visibility !== 'hidden'
}

function habilitado(el: HTMLElement) {
  if ((el as HTMLInputElement).disabled || el.closest('[inert], fieldset:disabled')) return false
  if (el.getAttribute('aria-disabled') === 'true') return false
  return el.tabIndex >= 0
}

/** É um campo de preencher (e não um botão de ação ou link)? */
function ehCampo(el: HTMLElement) {
  if (el instanceof HTMLInputElement) return !TIPOS_SEM_TEXTO.has(el.type) && !el.readOnly
  if (el instanceof HTMLSelectElement) return true
  if (el instanceof HTMLTextAreaElement) return !el.readOnly
  if (el.isContentEditable) return true
  return PAPEIS_CAMPO.has(el.getAttribute('role') ?? '')
}

/** Janela aberta > formulário > página. */
function raizDe(el: HTMLElement): ParentNode {
  return (
    el.closest('[role="dialog"], [role="alertdialog"]') ??
    el.closest('form') ??
    document.body
  )
}

function ehLogin(el: HTMLElement) {
  const form = el.closest('form')
  if (!form) return false
  const senhas = form.querySelectorAll('input[type="password"]')
  if (senhas.length !== 1) return false // trocar senha (2 ou 3 campos de senha) salva: não entra aqui
  const temUsuario = !!form.querySelector(
    'input[type="email"], input[autocomplete="username"], input[autocomplete="email"], input[name*="email" i], input[name*="usuario" i], input[name*="user" i], input[id*="email" i]',
  )
  // Cadastro de usuário (e-mail + senha + "Criar"/"Salvar") salva: só é login se o botão for "Entrar".
  const botaoEntrar = Array.from(
    form.querySelectorAll('button[type="submit"], button:not([type]), input[type="submit"]'),
  ).some((b) => /entrar|acessar|login|sign in/i.test(`${b.textContent ?? ''} ${(b as HTMLInputElement).value ?? ''}`))
  return temUsuario && botaoEntrar
}

const PALAVRAS_BUSCA = /busca|buscar|pesquis|procur|filtr|search/i

function ehBusca(el: HTMLElement) {
  if (!(el instanceof HTMLInputElement)) return false
  const form = el.closest('form')
  const botaoBusca = !!form &&
    Array.from(form.querySelectorAll('button[type="submit"], button:not([type]), input[type="submit"]')).some((b) =>
      PALAVRAS_BUSCA.test(`${b.textContent ?? ''} ${(b as HTMLInputElement).value ?? ''} ${b.getAttribute('aria-label') ?? ''}`),
    )
  const pareceBusca =
    botaoBusca ||
    el.type === 'search' ||
    el.getAttribute('role') === 'searchbox' ||
    !!el.closest('[role="search"]') ||
    PALAVRAS_BUSCA.test(
      `${el.placeholder ?? ''} ${el.getAttribute('aria-label') ?? ''} ${el.name ?? ''}`,
    )
  if (!pareceBusca) return false
  // Busca dentro de um formulário de cadastro (que tem outros campos) não pode enviar o formulário.
  if (!form) return true
  const outros = Array.from(form.querySelectorAll<HTMLElement>(SELETOR_FOCAVEL)).filter(
    (x) => x !== el && ehCampo(x) && visivel(x),
  )
  return outros.length === 0
}

function deixarEnter(el: HTMLElement) {
  if (el.closest('[data-enter="permitir"]')) return true
  // lista de sugestões / seleção / menu aberto: o Enter escolhe o item
  if (el.getAttribute('aria-expanded') === 'true') return true
  if (el.closest('[cmdk-root], [role="listbox"], [role="menu"], [role="option"], [role="menuitem"], [role="tree"]'))
    return true
  if (ehLogin(el)) return true
  if (ehBusca(el)) return true
  return false
}

function irPara(atual: HTMLElement, voltar: boolean) {
  const todos = Array.from(raizDe(atual).querySelectorAll<HTMLElement>(SELETOR_FOCAVEL)).filter(
    (el) => el === atual || (habilitado(el) && visivel(el)),
  )
  const i = todos.indexOf(atual)
  if (i < 0) return
  const passo = voltar ? -1 : 1
  for (let j = i + passo; j >= 0 && j < todos.length; j += passo) {
    const el = todos[j]
    if (!ehCampo(el)) continue
    el.focus()
    if (el instanceof HTMLInputElement && TIPOS_TEXTO.has(el.type)) {
      try {
        el.select()
      } catch {
        // number/email não aceitam select() em alguns navegadores
      }
    }
    return
  }
  // último campo: fica onde está (não salva)
}

function aoTeclar(e: KeyboardEvent) {
  if (e.key !== 'Enter' || e.isComposing) return
  const alvo = e.target
  if (!(alvo instanceof HTMLElement) || alvo === document.body) return
  if (alvo.closest('[data-enter="permitir"]')) return
  // Ctrl/Cmd/Alt+Enter também não salva (atalhos de "salvar" das telas): não faz nada.
  if (e.ctrlKey || e.altKey || e.metaKey) {
    e.preventDefault()
    e.stopPropagation()
    e.stopImmediatePropagation()
    return
  }
  // Caixa de texto de várias linhas: o Enter só quebra a linha (a tela não recebe o Enter, então não envia).
  if (alvo instanceof HTMLTextAreaElement || alvo.isContentEditable) {
    e.stopPropagation()
    e.stopImmediatePropagation()
    return
  }
  if (deixarEnter(alvo)) return
  // Bloqueia o envio do formulário, o "clique" do Enter no botão e os atalhos de Enter das telas.
  e.preventDefault()
  e.stopPropagation()
  e.stopImmediatePropagation()
  irPara(alvo, e.shiftKey)
}

let instalado = false

export function instalarEnterPulaCampo() {
  if (instalado || typeof window === 'undefined') return
  instalado = true
  // Fase de captura na janela: roda antes de qualquer tela (React escuta no elemento raiz).
  window.addEventListener('keydown', aoTeclar, true)
}
