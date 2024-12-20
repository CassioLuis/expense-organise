import HttpAdapter from '@/infra/http/http-adapter'
import env from '../env'

export default class AuthGateway {
  constructor (private readonly httpAdapter: HttpAdapter) { }

  async signin (credentials: object): Promise<Session> {
    return this.httpAdapter.post(`${env.BASE_URL}/auth`, credentials)
  }
}

export interface Session {
  data: {
    token: string
  },
  status: number
}
