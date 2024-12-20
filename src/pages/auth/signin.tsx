import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ToastAction } from '@/components/ui/toast'
import { useAppDependencies } from '@/hooks/use-app-dependencies'
import { toast } from '@/hooks/use-toast'
import Utilities from '@/utils/Utilities'
import { GoogleLogin } from '@react-oauth/google'
import { Link } from 'react-router'

export default function LoginForm () {

  const { authGateway } = useAppDependencies()

  const credentials = {
    email: 'cassiocaruzo@gmail.com',
    password: '123456'
  }

  async function signin () {
    try {
      const { data } = await authGateway.signin(credentials)
      localStorage.setItem('access-token', data.token)
      window.location.assign('/')
    } catch (e: any) {
      toast({
        variant: 'destructive',
        title: e.message,
        description: Utilities.dateFormat(new Date(), 'dddd, D MMMM [de] YYYY [às] h:mm A'),
        action: (
          <ToastAction altText="Goto schedule to undo">Ok</ToastAction>
        )
      })
    }
  }

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Insira seu e-mail abaixo para fazer login em sua conta.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Senha</Label>
              <Link
                to="#"
                className="ml-auto inline-block text-sm underline"
              >
                Esqueceu sua senha?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              required
            />
          </div>
          <Button
            onClick={signin}
            type="submit"
            className="w-full"
          >
            Entrar
          </Button>
          <GoogleLogin
            onSuccess={credentialResponse => {
              console.log(credentialResponse)
            }}
            onError={() => {
              console.log('Login Failed')
            }}
          />
        </div>
        <div className="mt-4 text-center text-sm">
          Não possui uma conta?{' '}
          <Link
            to="#"
            className="underline"
          >
            Registre-se
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
