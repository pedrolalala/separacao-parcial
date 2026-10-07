import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthProvider } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { SystemSwitcher } from '@/components/SystemSwitcher'

// SPEC-123: code-splitting por rota (mesmo padrão já em produção no RH,
// dashboard-rh-lucenera-5fe9c/src/App.tsx).
const LoginPage = lazy(() => import('./pages/LoginPage'))
const SeparacaoParcialPage = lazy(() => import('./pages/SeparacaoParcialPage'))
const NotFound = lazy(() => import('./pages/NotFound'))

const LoadingFallback = () => (
  <div className="h-screen w-screen flex items-center justify-center">
    <div className="animate-pulse text-muted-foreground">Carregando...</div>
  </div>
)

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <TooltipProvider>
        <Sonner position="bottom-center" />
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <SeparacaoParcialPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        {/* SPEC-120: autocontido, se resolve sozinho via Supabase — não
            depende de estar dentro de ProtectedRoute pra saber se há
            usuário logado. */}
        <SystemSwitcher currentSlug="separacao-parcial" />
      </TooltipProvider>
    </AuthProvider>
  </BrowserRouter>
)

export default App
