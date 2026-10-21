/* Main entry point for the application - renders the root React component */
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './main.css'
import { iniciarRegistroDeTela } from './lib/registro-tela'
import { instalarEnterPulaCampo } from './lib/enter-pula-campo'

// SPEC-206: registra as telas abertas (Central › Administração › Movimentação).
iniciarRegistroDeTela()
// SPEC-216: Enter pula para o próximo campo; salvar/confirmar só com clique
instalarEnterPulaCampo()

// @skip-protected: Do not remove. Required for React rendering.
createRoot(document.getElementById('root')!).render(<App />)
