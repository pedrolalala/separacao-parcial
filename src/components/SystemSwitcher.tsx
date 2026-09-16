import { useState } from 'react'
import * as Icons from 'lucide-react'
import { redirectWithCode } from '@/lib/cross-system-auth'
import { useSistemasPermitidos } from '@/hooks/useSistemasPermitidos'
import { cn } from '@/lib/utils'

const HUB_URL = 'https://central-lucenera-dashboard-1c9ba.goskip.app'

function getIcon(iconName: string) {
  const Icon = (Icons as any)[iconName]
  return Icon || Icons.Box
}

interface SystemSwitcherProps {
  currentSlug: string
  showHubLink?: boolean
}

// SPEC-120: menu lateral retrátil (canto direito) pra trocar de sistema sem
// voltar pela Central e sem novo login (SSO via redirectWithCode). Lista só
// os sistemas que o usuário logado tem permissão de ver — ver
// useSistemasPermitidos.ts. Componente autocontido: resolve o próprio
// usuário internamente, então não depende do formato de useAuth de cada
// sistema (que varia bastante entre os ~10 repositórios hoje).
export function SystemSwitcher({ currentSlug, showHubLink = true }: SystemSwitcherProps) {
  const [expanded, setExpanded] = useState(false)
  const { sistemas, userId } = useSistemasPermitidos(currentSlug)

  if (!userId) return null
  if (sistemas.length === 0 && !showHubLink) return null

  const openSystem = async (link: string, slug: string) => {
    try {
      await redirectWithCode(link, '/', slug)
    } catch {
      window.location.href = link
    }
  }

  return (
    <div
      className={cn(
        'fixed right-0 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-1 rounded-l-xl border border-r-0 border-border bg-card shadow-lg py-3 transition-[width] duration-200',
        expanded ? 'px-3 w-60' : 'px-2 w-12',
      )}
    >
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center justify-center rounded-lg px-2 py-1.5 mb-1 self-end text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        title={expanded ? 'Recolher menu' : 'Trocar de sistema'}
      >
        {expanded ? (
          <Icons.ChevronRight className="w-4 h-4" />
        ) : (
          <Icons.LayoutGrid className="w-4 h-4" />
        )}
      </button>

      {showHubLink && (
        <button
          type="button"
          onClick={() => openSystem(HUB_URL, 'hub')}
          className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          title="Central Lucenera"
        >
          <Icons.Home className="w-5 h-5 shrink-0" />
          {expanded && <span className="truncate">Central Lucenera</span>}
        </button>
      )}

      {sistemas.map((s) => {
        const Icon = getIcon(s.icon_name)
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => openSystem(s.link, s.slug)}
            className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            title={s.name}
          >
            <Icon className="w-5 h-5 shrink-0" />
            {expanded && <span className="truncate">{s.name}</span>}
          </button>
        )
      })}
    </div>
  )
}
