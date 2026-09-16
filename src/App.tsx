import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthProvider } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { SystemSwitcher } from '@/components/SystemSwitcher'
import LoginPage from './pages/LoginPage'
import SeparacaoParcialPage from './pages/SeparacaoParcialPage'
import NotFound from './pages/NotFound'

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <TooltipProvider>
        <Sonner position="bottom-center" />
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
        {/* SPEC-120: autocontido, se resolve sozinho via Supabase — não
            depende de estar dentro de ProtectedRoute pra saber se há
            usuário logado. */}
        <SystemSwitcher currentSlug="separacao-parcial" />
      </TooltipProvider>
    </AuthProvider>
  </BrowserRouter>
)

export default App
