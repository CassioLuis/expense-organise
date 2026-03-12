import HttpAdapter from '@/infra/http/http-adapter'
import { Goal } from '@/application/entity/goal'

const basePath = '/metrics/goals'

export default class GoalGateway {
  constructor(private readonly httpAdapter: HttpAdapter) { }

  async getAllGoals (): Promise<Output> {
    return this.httpAdapter.get(`${import.meta.env.VITE_API_URL}${basePath}`)
  }

  async upsertGoals (goals: Goal): Promise<Output> {
    return this.httpAdapter.post(`${import.meta.env.VITE_API_URL}${basePath}`, { goals })
  }
}

export interface Output {
  data: Goal,
  status: number
}