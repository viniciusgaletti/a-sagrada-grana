import { Component, ReactNode } from 'react'
import { Button } from '@/components/ui/button'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
          <div className="w-full max-w-md rounded-xl border bg-card p-8 text-center shadow-elevation">
            <h2 className="mb-4 text-2xl font-bold font-headline">Algo deu errado</h2>
            <p className="mb-6 text-muted-foreground">
              Um erro inesperado ocorreu. Recarregue a página para continuar.
            </p>
            <Button onClick={() => window.location.reload()} className="w-full">
              Recarregar
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
