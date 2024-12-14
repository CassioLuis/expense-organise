import HttpAdapter from '@/infra/http/http-adapter'
import env from '../env'

export default class AuthGateway {
  constructor(private readonly httpAdapter: HttpAdapter) { }

  async signin (credentials: object) {
    const response = await this.httpAdapter.post(`${env.BASE_URL}/auth`, credentials)
    if (response.status !== 200) {
      throw new Error(response.message)
    }
    return response
  }
}
