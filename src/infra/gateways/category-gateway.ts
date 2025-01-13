import HttpAdapter from '@/infra/http/http-adapter'
import env from '../env'
import { RawCategory, RawCategoryPartial } from '@/application/entity/category'
// import querystring from 'querystring'

const basePath = '/category'

export default class CategoryGateway {
  constructor (private readonly httpAdapter: HttpAdapter) { }

  async getAllByUser (): Promise<Output> {
    return this.httpAdapter.get(`${env.BASE_URL}${basePath}`)
  }

  async save (category: RawCategoryPartial): Promise<void> {
    return this.httpAdapter.post(`${env.BASE_URL}${basePath}`, category)
  }

  async delete (categoryId: RawCategory['_id']): Promise<void> {
    return this.httpAdapter.delete(`${env.BASE_URL}${basePath}/${categoryId}`)
  }

  async update (categoryPayload: RawCategoryPartial): Promise<void> {
    return this.httpAdapter.patch(`${env.BASE_URL}${basePath}/${categoryPayload._id}`, categoryPayload)
  }
}

export interface Output {
  data: RawCategory[],
  status: number
}
