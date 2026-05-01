import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Loader2 } from 'lucide-react'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { AuthProvider } from '@/hooks/use-auth'
import { Layout } from '@/components/Layout'
import { ROUTES } from '@/constants'
import NotFound from '@/pages/NotFound'

const Auth = lazy(() => import('@/pages/Auth'))
const Home = lazy(() => import('@/pages/Home'))
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const Economia = lazy(() => import('@/pages/Economia'))
const Contas = lazy(() => import('@/pages/Contas'))
const Reserva = lazy(() => import('@/pages/Reserva'))
const Configuracoes = lazy(() => import('@/pages/Configuracoes'))
const Onboarding = lazy(() => import('@/pages/Onboarding'))

const LoadingFallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-background">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
)

const App = () => (
  <ErrorBoundary>
    <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Public/Auth Route */}
              <Route path={ROUTES.AUTH} element={<Auth />} />

              {/* Protected Routes */}
              <Route element={<Layout />}>
                <Route path={ROUTES.HOME} element={<Home />} />
                <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
                <Route path={ROUTES.ECONOMIA} element={<Economia />} />
                <Route path={ROUTES.CONTAS} element={<Contas />} />
                <Route path={ROUTES.RESERVA} element={<Reserva />} />
                <Route path={ROUTES.CONFIGURACOES} element={<Configuracoes />} />
                <Route path={ROUTES.ONBOARDING} element={<Onboarding />} />
              </Route>

              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </TooltipProvider>
    </BrowserRouter>
  </ErrorBoundary>
)

export default App
