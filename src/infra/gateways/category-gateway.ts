import HttpAdapter from '@/infra/http/http-adapter'
import { Category, CategoryPartial, RawCategoryReceived } from '@/application/entity/category'

const basePath = '/category'

export default class CategoryGateway {
  constructor(private readonly httpAdapter: HttpAdapter) { }

  async getAllByUser (): Promise<Output> {
    return this.httpAdapter.get(`${import.meta.env.VITE_API_URL}${basePath}`)
  }

  async save (category: Category): Promise<void> {
    return this.httpAdapter.post(`${import.meta.env.VITE_API_URL}${basePath}`, category)
  }

  async delete (categoryId: Category['id']): Promise<void> {
    return this.httpAdapter.delete(`${import.meta.env.VITE_API_URL}${basePath}/${categoryId}`)
  }

  async update (categoryPayload: CategoryPartial): Promise<void> {
    return this.httpAdapter.patch(`${import.meta.env.VITE_API_URL}${basePath}/${categoryPayload.id}`, categoryPayload)
  }
}

export interface Output {
  data: RawCategoryReceived[],
  status: number
}
