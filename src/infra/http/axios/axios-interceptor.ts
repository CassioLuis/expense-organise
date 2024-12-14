import { Session } from '@/infra/gateway/authentication-gateway'
import env from '@/infra/env'
import axios, { AxiosError, AxiosHeaders, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import UserSessionStore from '@/store/user-session-store'
import User from '@/entity/user'
import { jwtDecode } from 'jwt-decode'
import UseToast from '@/composable/use-toast'

export default class AxiosInterceptor {
  private instance!: AxiosInstance
  private statusCodeError: number[] = [401, 403]
  private toaster = UseToast.getInstance()

  constructor () {
    this.initializeInterceptors()
  }

  private initializeInterceptors () {
    this.instance = axios.create({
      baseURL: env.BASE_URL || 'https://fiscal.genesis.bio.br'
    })
    this.instance.interceptors.request.use(this.requestInterceptor.bind(this))
    this.instance.interceptors.response.use(this.responseInterceptor.bind(this), this.handleResponseError.bind(this))
  }

  private requestInterceptor (request: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
    Object.assign(request.headers, this.setHeaders())
    return request
  }

  private async responseInterceptor (response: AxiosResponse): Promise<AxiosResponse> {
    if (response.status !== 200 && response.config.method !== 'get') {
      this.toaster.execute(response.data.message, 'success')
    }
    return response
  }

  private handleResponseError (axiosError: AxiosError): Promise<AxiosResponse> | AxiosError {
    const { data, status, config } = axiosError.response! as AxiosResponse
    if (!this.statusCodeError.includes(status as number)) {
      this.toaster.execute(data.message, 'error')
      throw new Error(data.message)
    }
    if (this.statusCodeError.includes(status as number) && config.url === '/authentication/signin') {
      this.toaster.execute(data.message, 'error')
      throw new Error(data.message)
    }
    return this.refreshToken(axiosError)
  }

  private async refreshToken (axiosError: AxiosError): Promise<AxiosResponse<any, any>> {
    try {
      const session: Session = await this.requestNewToken()
      const responseConfig: InternalAxiosRequestConfig = axiosError.config as InternalAxiosRequestConfig
      this.setSession(session)
      Object.assign(responseConfig.headers, new AxiosHeaders({
        'X-Fiscal-Token': session.token,
        'X-User-Id': session.userId,
        'X-Session-Id': session.id
      }))
      return this.instance.request(responseConfig)
    } catch (error) {
      const toaster = UseToast.getInstance()
      toaster.execute('Sessão Expirou!', 'warning')
      localStorage.clear()
      window.location.assign('/login')
      return Promise.reject(error)
    }
  }

  private setSession (session: Session): void {
    if (!session) return
    localStorage.set('session', session)
    const userSessionStore = UserSessionStore.getInstance()
    const decodedToken: { usuario: User } = jwtDecode(session.token)
    userSessionStore.setUser(decodedToken.usuario)
  }

  private async requestNewToken (): Promise<Session> {
    const response = await axios.post<Session>(
      `${this.instance.defaults.baseURL}/authentication/refresh`,
      {},
      { headers: this.setHeaders() }
    )
    return response.data
  }

  private setHeaders (): AxiosHeaders {
    const localSession = localStorage.get('session')
    if (!localSession || !localSession?.token) return new AxiosHeaders()
    return new AxiosHeaders({
      'X-Fiscal-Token': localSession.token,
      'X-User-Id': localSession.userId,
      'X-Session-Id': localSession.id
    })
  }

  public getInstance () {
    if (!this.instance) new AxiosInterceptor()
    return this.instance
  }
}