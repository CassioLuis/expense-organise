import { ToastAction } from '@/components/ui/toast'
import { toast } from '@/hooks/use-toast'
import env from '@/infra/env'
import Utilities from '@/utils/Utilities'
import axios, { AxiosError, AxiosHeaders, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

export default class AxiosInterceptor {
  private instance!: AxiosInstance
  private statusCodeError: number[] = [401, 403]

  constructor () {
    this.instance = axios.create({
      baseURL: env.BASE_URL || ''
    })
    this.instance.interceptors.request.use(
      this.requestInterceptor.bind(this)
    )
    this.instance.interceptors.response.use(
      this.responseInterceptor.bind(this),
      this.handleResponseError.bind(this)
    )
  }

  private requestInterceptor (request: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
    Object.assign(request.headers, this.setHeaders())
    return request
  }

  private async responseInterceptor (response: AxiosResponse): Promise<AxiosResponse> {
    return response
  }

  private async handleResponseError (axiosError: AxiosError): Promise<void | AxiosError> {
    const { data, status, config } = axiosError.response! as AxiosResponse
    if (!this.statusCodeError.includes(status as number)) {
      throw new Error(data.message)
    }
    if (this.statusCodeError.includes(status as number) && config.url === `${this.instance.defaults.baseURL}/auth`) {
      throw new Error(data.message)
    }
    toast({
      variant: 'destructive',
      title: data.message,
      description: Utilities.dateFormat(new Date(), 'dddd, D MMMM [de] YYYY [às] h:mm A'),
      action: (
        <ToastAction altText="Goto schedule to undo">Ok</ToastAction>
      )
    })
    await Utilities.sleep(1000)
    throw window.location.assign('/signin')
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