import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'

import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { ROUTES } from '@/constants'

const baseSchema = z.object({
  email: z.string().min(1, 'Informe seu e-mail').email('E-mail inválido'),
  password: z
    .string()
    .min(1, 'Informe sua senha')
    .min(6, 'A senha precisa ter pelo menos 6 caracteres'),
})

const loginSchema = baseSchema

const signupSchema = baseSchema
  .extend({
    confirmPassword: z.string().min(1, 'Confirme sua senha'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não conferem',
    path: ['confirmPassword'],
  })

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(isLogin ? loginSchema : signupSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
    mode: 'onChange',
  })

  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock error trigger to showcase the ERROR state
    if (data.email === 'error@test.com') {
      setIsLoading(false)
      toast({
        variant: 'destructive',
        title: 'Não foi possível entrar. Verifique seus dados e tente novamente.',
      })
      return
    }

    setIsLoading(false)
    if (isLogin) {
      login()
    } else {
      navigate(ROUTES.ONBOARDING)
      login()
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    form.reset()
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8 md:p-8">
      <div className="w-full max-w-[420px] rounded-none border-0 bg-transparent p-0 shadow-none md:rounded-xl md:border md:bg-card md:p-10 md:shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="font-headline text-[2rem] font-bold text-primary mb-2">A Sagrada Grana</h1>
          <p className="text-sm text-muted-foreground">Sua consciência financeira em um lugar só</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="seu@email.com"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={isLogin ? '••••••••' : 'Mínimo 6 caracteres'}
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!isLogin && (
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar senha</FormLabel>
                    <FormControl>
                      <Input type="password" disabled={isLoading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full rounded-full"
                disabled={!form.formState.isValid || isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLogin ? 'Entrar' : 'Criar conta'}
              </Button>
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={toggleMode}
                className="text-sm text-primary hover:underline"
                disabled={isLoading}
              >
                {isLogin ? 'Não tem conta? Criar conta' : 'Já tem conta? Entrar'}
              </button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
