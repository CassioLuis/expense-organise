import HttpAdapter from '@/infra/http/http-adapter'
import env from '../env'
import { Category, CategoryPartial } from '@/application/entity/category'

const basePath = '/category'

export default class CategoryGateway {
  constructor (private readonly httpAdapter: HttpAdapter) { }

  async getAllByUser (): Promise<Output> {
    return this.httpAdapter.get(`${env.BASE_URL}${basePath}`)
  }

  async save (category: Category): Promise<void> {
    return this.httpAdapter.post(`${env.BASE_URL}${basePath}`, category)
  }

  async delete (categoryId: Category['id']): Promise<void> {
    return this.httpAdapter.delete(`${env.BASE_URL}${basePath}/${categoryId}`)
  }

  async update (categoryPayload: CategoryPartial): Promise<void> {
    return this.httpAdapter.patch(`${env.BASE_URL}${basePath}/${categoryPayload.id}`, categoryPayload)
  }
}

export interface Output {
  data: Category[],
  status: number
}
