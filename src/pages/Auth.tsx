import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'

export default function AuthPage() {
  const { login } = useAuth()

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="w-full max-w-sm rounded-xl border bg-card p-8 text-center shadow-sm">
        <h1 className="mb-2 text-3xl font-bold font-headline">Entrar</h1>
        <p className="mb-8 text-sm text-muted-foreground">Acesse seu diário financeiro.</p>
        <Button onClick={login} className="w-full">
          Simular Login
        </Button>
      </div>
    </div>
  )
}
