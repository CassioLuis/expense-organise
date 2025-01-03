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
      throw new Error(error.message)
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
      throw new Error(error.message)
    }
  }

  async delete (url: string): Promise<any> {
    try {
      const { data, status } = await this.axiosInstance.delete(url)
      return {
        data,
        status
      }
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  async patch (url: string, body: object): Promise<any> {
    try {
      const { data, status } = await this.axiosInstance.patch(url, body)
      return {
        data,
        status
      }
    } catch (error: any) {
      throw new Error(error.message)
    }
  }
}
