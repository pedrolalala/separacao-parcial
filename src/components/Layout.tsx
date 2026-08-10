import { Outlet } from 'react-router-dom'

export default function Layout() {
  const currentYear = new Date().getFullYear()

  return (
    <div className="min-h-screen w-full bg-[#FAFAF9] dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col justify-between selection:bg-indigo-500/10 selection:text-indigo-600 transition-colors duration-300">
      <main className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12">
        <Outlet />
      </main>
      <footer className="py-6 text-center text-xs text-stone-400 dark:text-stone-600 tracking-widest font-light transition-opacity duration-300 hover:opacity-100 opacity-60">
        <span>{currentYear} • Separação Parcial</span>
      </footer>
    </div>
  )
}
