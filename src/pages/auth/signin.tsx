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
import { useAppDependencies } from '@/hooks/use-app-dependencies'
import { GoogleLogin } from '@react-oauth/google'
import { Link } from 'react-router'

export default function LoginForm () {

  const { signinUsecase } = useAppDependencies()

  const credentials = {
    email: 'cassiocaruzo@gmail.com',
    password: '123456'
  }

  async function signin () {
    await signinUsecase.execute(credentials)
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
