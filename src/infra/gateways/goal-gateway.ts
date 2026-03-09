import { Goal } from '@/application/entity/goal'
import AxiosInterceptor from '@/infra/http/axios/axios-interceptor'

const api = new AxiosInterceptor().getInstance()

export interface IGoalGateway {
  getAllGoals (): Promise<Goal[]>
  upsertGoals (goals: { categoryName: string, amount: number }[]): Promise<Goal[]>
}

export class GoalGateway implements IGoalGateway {
  async getAllGoals (): Promise<Goal[]> {
    const { data } = await api.get('/metrics/goals')
    return data
  }

  async upsertGoals (goals: { categoryName: string, amount: number }[]): Promise<Goal[]> {
    const { data } = await api.post('/metrics/goals', { goals })
    return data
  }
}

export const goalGateway = new GoalGateway()
