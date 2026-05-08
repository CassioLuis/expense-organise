import HttpAdapter from '@/infra/http/http-adapter'
import { Goal } from '@/application/entity/goal'

const basePath = '/metrics/goals'

export default class GoalGateway {
  constructor(private readonly httpAdapter: HttpAdapter) { }

  async getAllGoals (): Promise<Output<Goal[]>> {
    return this.httpAdapter.get(`${import.meta.env.VITE_API_URL}${basePath}`)
  }

  async upsertGoals (goals: Goal): Promise<Output<Goal>> {
    return this.httpAdapter.post(`${import.meta.env.VITE_API_URL}${basePath}`, { goals })
  }
}

export interface Output<T = Goal> {
  data: T,
  status: number
}