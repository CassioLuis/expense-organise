import { AuthLayout } from '@/layouts'

function DefaultErrorPage () {
  return (
    <div className='h-svh flex items-center justify-center text-xl'>
      <span>Erro 404, Página Não Encontrada!</span>
    </div>
  )
}

function AuthErrorPage () {
  return (
    <AuthLayout>
      <div className='h-svh flex items-center justify-center text-xl'>
        <span>Erro 404, Página Não Encontrada!</span>
      </div>
    </AuthLayout>
  )
}

export default {
  AuthErrorPage,
  DefaultErrorPage
}