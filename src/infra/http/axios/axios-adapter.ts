import { Axios } from 'axios'
import HttpAdapter from '../http-adapter'

export default class AxiosAdapter implements HttpAdapter {
  constructor (private readonly axiosInstance: Axios) { }

  async get (url: string, body: any): Promise<any> {
    try {
      const { data, status } = await this.axiosInstance.get(url, body)
      return {
        data,
        status
      }
    } catch (error: any) {
      throw new Error(error)
    }
  }

  async post (url: string, body: object): Promise<any> {
    try {
      const { data, status } = await this.axiosInstance.post(url, body)
      return {
        data,
        status
      }
    } catch (error: any) {
      throw new Error(error)
    }
  }
}
