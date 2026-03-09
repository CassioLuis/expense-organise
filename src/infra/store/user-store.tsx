import { create } from 'zustand'

interface State {
  token: string
  name?: string
  lastName?: string
  email?: string
}

export interface UserStoreAction {
  setUser: (token: string, name?: string, lastName?: string, email?: string) => void
}

export const userStore = create<State & UserStoreAction>(set => ({
  token: '',
  name: '',
  lastName: '',
  email: '',
  setUser: (token: string, name?: string, lastName?: string, email?: string) => set(() => ({ token, name, lastName, email }))
}))
