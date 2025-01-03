import { create } from 'zustand'

interface State {
  token: string
}

export interface UserStoreAction {
  setUser: (token: string) => void
}

export const userStore = create<State & UserStoreAction>(set => ({
  token: '',
  setUser: (token: string) => set(() => ({ token }))
}))
