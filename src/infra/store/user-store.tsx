import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface State {
  name?: string
  lastName?: string
  email?: string
}

export interface UserStoreAction {
  setUser: (name?: string, lastName?: string, email?: string) => void
}

export const userStore = create<State & UserStoreAction>()(
  persist(
    (set) => ({
      name: '',
      lastName: '',
      email: '',
      setUser: (name?: string, lastName?: string, email?: string) => set(() => ({ name, lastName, email }))
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)
