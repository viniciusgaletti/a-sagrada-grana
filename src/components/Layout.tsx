import { Outlet, Link, useLocation } from 'react-router-dom'
import { ROUTES } from '@/constants'
import { useAuth } from '@/hooks/use-auth'
import { cn } from '@/lib/utils'
import { Home, BarChart2, TrendingUp, List, Menu, PiggyBank, Settings, LogOut } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet'

const desktopLinks = [
  { to: ROUTES.HOME, label: 'Diário', icon: Home },
  { to: ROUTES.DASHBOARD, label: 'Dashboard', icon: BarChart2 },
  { to: ROUTES.ECONOMIA, label: 'Economia', icon: TrendingUp },
  { to: ROUTES.CONTAS, label: 'Plano de Contas', icon: List },
  { to: ROUTES.RESERVA, label: 'Reserva de Emergência', icon: PiggyBank },
  { to: ROUTES.CONFIGURACOES, label: 'Configurações', icon: Settings },
]

const mobileMainLinks = [
  { to: ROUTES.HOME, label: 'Diário', icon: Home },
  { to: ROUTES.DASHBOARD, label: 'Dashboard', icon: BarChart2 },
  { to: ROUTES.ECONOMIA, label: 'Economia', icon: TrendingUp },
  { to: ROUTES.CONTAS, label: 'Contas', icon: List },
]

const mobileSheetLinks = [
  { to: ROUTES.RESERVA, label: 'Reserva de Emergência', icon: PiggyBank },
  { to: ROUTES.CONFIGURACOES, label: 'Configurações', icon: Settings },
]

export function Layout() {
  const { user, logout } = useAuth()
  const location = useLocation()

  const getPageTitle = (pathname: string) => {
    switch (pathname) {
      case ROUTES.HOME:
        return 'Diário Financeiro'
      case ROUTES.DASHBOARD:
        return 'Dashboard'
      case ROUTES.ECONOMIA:
        return 'Economia Anual'
      case ROUTES.CONTAS:
        return 'Plano de Contas'
      case ROUTES.RESERVA:
        return 'Reserva de Emergência'
      case ROUTES.CONFIGURACOES:
        return 'Configurações'
      case ROUTES.ONBOARDING:
        return 'Onboarding'
      default:
        return 'A Sagrada Grana'
    }
  }

  const currentTitle = getPageTitle(location.pathname)
  const initials = user?.initials || 'US'

  const AvatarButton = () => (
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-medium text-white">
      {initials}
    </div>
  )

  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row">
      {/* Mobile Top Header */}
      <header className="fixed top-0 z-50 flex h-[56px] w-full items-center justify-between border-b bg-white px-4 md:hidden">
        <span className="font-headline text-[1.1rem] font-semibold text-primary">
          A Sagrada Grana
        </span>
        <AvatarButton />
      </header>

      {/* Desktop Sidebar */}
      <aside className="fixed hidden h-full w-[240px] flex-col border-r bg-white z-40 md:flex">
        <div className="p-6">
          <span className="font-headline text-[1.4rem] font-semibold text-primary">
            A Sagrada Grana
          </span>
        </div>

        <nav className="flex-1 space-y-1 px-4">
          {desktopLinks.map((link) => {
            const isActive = location.pathname === link.to
            const Icon = link.icon
            return (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm transition-colors',
                  isActive
                    ? 'bg-accent text-primary font-medium'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                <Icon className="h-5 w-5" />
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="border-t p-4">
          <div className="mb-4 flex flex-col gap-1 px-2">
            <span className="text-xs text-muted-foreground truncate" title={user?.email}>
              {user?.email}
            </span>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <LogOut className="h-5 w-5" />
            Sair
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 z-50 flex h-[64px] w-full items-center justify-around border-t bg-white md:hidden">
        {mobileMainLinks.map((link) => {
          const isActive = location.pathname === link.to
          const Icon = link.icon
          return (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                'flex flex-col items-center gap-1 p-2',
                isActive ? 'text-primary' : 'text-muted-foreground',
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{link.label}</span>
            </Link>
          )
        })}

        <Sheet>
          <SheetTrigger className="flex flex-col items-center gap-1 p-2 text-muted-foreground">
            <Menu className="h-5 w-5" />
            <span className="text-[10px] font-medium">Mais</span>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-xl h-[40vh]">
            <SheetHeader className="mb-4 text-left">
              <SheetTitle className="font-headline">Mais opções</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-2">
              {mobileSheetLinks.map((link) => {
                const Icon = link.icon
                const isActive = location.pathname === link.to
                return (
                  <SheetClose asChild key={link.to}>
                    <Link
                      to={link.to}
                      className={cn(
                        'flex items-center gap-3 rounded-lg p-3 text-sm transition-colors',
                        isActive
                          ? 'bg-accent text-primary font-medium'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      {link.label}
                    </Link>
                  </SheetClose>
                )
              })}
              <SheetClose asChild>
                <button
                  onClick={logout}
                  className="mt-4 flex w-full items-center gap-3 rounded-lg p-3 text-sm text-destructive hover:bg-muted transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  Sair
                </button>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 pb-[80px] pt-[56px] md:ml-[240px] md:pb-0 md:pt-0">
        {/* Desktop Header */}
        <header className="hidden h-[64px] items-center justify-between border-b bg-white px-8 md:flex">
          <h1 className="font-headline text-[1.5rem] font-semibold">{currentTitle}</h1>
          <AvatarButton />
        </header>

        <main className="mx-auto max-w-[860px] p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
