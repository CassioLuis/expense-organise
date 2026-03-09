import { create } from 'zustand'

interface State {
  name?: string
  lastName?: string
  email?: string
}

export interface UserStoreAction {
  setUser: (name?: string, lastName?: string, email?: string) => void
}

export const userStore = create<State & UserStoreAction>(set => ({
  name: '',
  lastName: '',
  email: '',
  setUser: (name?: string, lastName?: string, email?: string) => set(() => ({ name, lastName, email }))
}))
