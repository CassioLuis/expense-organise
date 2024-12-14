import axios from 'axios'
import HttpAdapter from '../http-adapter'

export default class AxiosAdapter implements HttpAdapter {

  async get (url: string, body: any): Promise<any> {
    try {
      const { data, status } = await axios.get(url, body)
      return {
        data,
        status
      }
    } catch ({ response }: any) {
      return {
        status: response.status,
        message: response.data.message
      }
    }
  }

  async post (url: string, body: object): Promise<any> {
    try {
      const { data, status } = await axios.post(url, body)
      return {
        data,
        status
      }
    } catch ({ response }: any) {
      return {
        status: response.status,
        message: response.data.message
      }
    }
  }
}
