import env from '@/infra/env'
import axios, { AxiosError, AxiosHeaders, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

export default class AxiosInterceptor {
  private instance!: AxiosInstance
  private statusCodeError: number[] = [401, 403]

  constructor () {
    // this.initializeInterceptors()
    this.instance = axios.create({
      baseURL: env.BASE_URL || ''
    })

    // Configurar os interceptors
    this.instance.interceptors.request.use(
      this.requestInterceptor.bind(this)
    )
    this.instance.interceptors.response.use(
      this.responseInterceptor.bind(this),
      this.handleResponseError.bind(this)
    )
  }

  // private initializeInterceptors () {
  // }

  private requestInterceptor (request: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
    Object.assign(request.headers, this.setHeaders())
    return request
  }

  private async responseInterceptor (response: AxiosResponse): Promise<AxiosResponse> {
    if (response.status !== 200 && response.config.method !== 'get') {
      throw new Error(response.data.message)
    }
    return response
  }

  private handleResponseError (axiosError: AxiosError): void | AxiosError {
    const { data, status, config } = axiosError.response! as AxiosResponse
    if (!this.statusCodeError.includes(status as number)) {
      throw new Error(data.message)
    }
    if (this.statusCodeError.includes(status as number) && config.url === `${this.instance.defaults.baseURL}/auth`) {
      throw new Error(data.message)
    }
    // window.location.assign('/signin')
  }

  private setHeaders (): AxiosHeaders {
    const token = localStorage.getItem('access-token')
    if (!token) return new AxiosHeaders()
    return new AxiosHeaders({
      authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    })
  }

  public getInstance () {
    if (!this.instance) new AxiosInterceptor()
    return this.instance
  }
}