import { AuthGateway } from "../../infra/gateways"

export default class SigninUseCase {

  constructor(
    private readonly authGateway: AuthGateway
  ) { }

  async execute (credentials: object) {
    try {
      const response = await this.authGateway.signin(credentials)
      localStorage.setItem('access-token', response.data.token)
      window.location.assign('/')
    } catch (e: any) {
      window.alert(e)
    }
  }
}

// import UseLoading from '@/composable/use-loading'
// import { AuthenticationGateway, Credentials, SignInResponse } from '@/infra/gateway/authentication-gateway'
// import LocalStorageHandler from '@/infra/localStorage/local-storage-handler'

// export default class Signin {

//   private readonly loader: UseLoading = UseLoading.getInstance()

//   constructor (private readonly authenticationHttpGateway: AuthenticationGateway) {}

//   async execute (input: Credentials): Promise<void> {
//     this.loader.start('LoadingSpinner2')
//     try {
//       const credentials: Credentials = {
//         cpfCnpj: input.cpfCnpj.replace(/[^a-zA-Z0-9]/g, ''),
//         password: input.password
//       }
//       const signInResponse: SignInResponse = await this.authenticationHttpGateway.signin(credentials)
//       await this.loader.stop(1000)
//       if (signInResponse.status !== 200) return
//       LocalStorageHandler.set('session', signInResponse.data)
//       window.location.assign('/home')
//     } finally {
//       await this.loader.stop(500)
//     }
//   }
// }