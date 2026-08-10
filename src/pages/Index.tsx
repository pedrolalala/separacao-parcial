import { useState } from 'react'
import { GitBranch, Check, Copy, Sparkles } from 'lucide-react'
import { toast } from 'sonner'

export default function Index() {
  const [copied, setCopied] = useState(false)
  const repoName = 'Separação Parcial'

  const handleCopy = () => {
    navigator.clipboard.writeText(repoName)
    setCopied(true)
    toast.success('Nome do repositório copiado com sucesso!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto px-4 select-none">
      {/* Accent Icon above title */}
      <div className="animate-fade-in opacity-0 [animation-delay:150ms] [animation-fill-mode:forwards] mb-8 inline-flex items-center justify-center p-3.5 rounded-full bg-indigo-500/5 dark:bg-indigo-400/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/10 transition-transform duration-300 hover:scale-110">
        <GitBranch className="w-5 h-5 stroke-[1.75]" />
      </div>

      {/* Main Repository Title */}
      <div className="animate-fade-in-up opacity-0 [animation-delay:350ms] [animation-fill-mode:forwards] group relative">
        <h1
          onClick={handleCopy}
          className="text-4xl sm:text-6xl md:text-7xl font-light tracking-tight text-stone-900 dark:text-stone-50 cursor-pointer transition-all duration-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 active:scale-[0.99]"
        >
          {repoName}
        </h1>

        {/* Subtle Hover Action Hint */}
        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[11px] uppercase tracking-widest text-stone-400 dark:text-stone-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none flex items-center gap-1 font-medium whitespace-nowrap">
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-500" /> Copiado para a área de
              transferência
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" /> Clique para copiar
            </>
          )}
        </span>
      </div>

      {/* Muted Divider Line */}
      <div className="animate-fade-in opacity-0 [animation-delay:650ms] [animation-fill-mode:forwards] mt-14 w-12 h-[2px] bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent transition-all duration-500 hover:w-24" />

      {/* Muted Label */}
      <p className="animate-fade-in opacity-0 [animation-delay:850ms] [animation-fill-mode:forwards] mt-6 text-[11px] tracking-widest uppercase text-stone-400 dark:text-stone-500 font-light flex items-center gap-1.5">
        <Sparkles className="w-3 h-3 text-indigo-500/70" /> Repositório Oficial
      </p>
    </div>
  )
}
