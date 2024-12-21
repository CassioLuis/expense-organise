import { create } from 'zustand'

interface State {
  token: string
}

interface Action {
  setUser: (token: string) => void
}

export const userStore = create<State & Action>(set => ({
  token: '',
  setUser: (token: string) => set(() => ({ token }))
}))
