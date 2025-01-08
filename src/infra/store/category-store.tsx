import { Category, CategoryPartial } from '@/application/entity/category'
import { create } from 'zustand'

interface State {
  categories: Category[]
}

export interface CategoryStoreAction {
  storeSetCategory: (categories: Category[]) => void
  storeSaveCategory: (category: Category) => void
  storeRemoveCategory: (category: Category) => void
  storeUpdateCategory: (updatePayload: CategoryPartial) => void
}

export const categoryStore = create<State & CategoryStoreAction>((set) => ({
  categories: [],
  storeSetCategory: (categories) => set({ categories }),
  storeSaveCategory: (category) => set((state) => ({ categories: [category, ...state.categories] })),
  storeRemoveCategory: (category) => set((state) => ({
    categories: state.categories.filter(item => item.id !== category.id)
  })),
  storeUpdateCategory: (updatePayload) =>
    set((state) => (
      {
        categories: state.categories.map((item) => item.id === updatePayload.id ? Object.assign(item, updatePayload) : item)
      }
    ))
}))
