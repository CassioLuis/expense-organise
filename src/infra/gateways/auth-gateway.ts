import HttpAdapter from '@/infra/http/http-adapter'

export default class AuthGateway {
  constructor(private readonly httpAdapter: HttpAdapter) { }

  async signin (credentials: object): Promise<Session> {
    return this.httpAdapter.post(`${import.meta.env.VITE_API_URL}/auth`, credentials)
  }

  async googleSignin (credential: string): Promise<Session> {
    return this.httpAdapter.post(`${import.meta.env.VITE_API_URL}/auth/google`, { credential })
  }

  async logout (): Promise<void> {
    return this.httpAdapter.post(`${import.meta.env.VITE_API_URL}/auth/logout`, {})
  }
}

export interface Session {
  data: {
    name?: string
    lastName?: string
    email?: string
  },
  status: number
}
