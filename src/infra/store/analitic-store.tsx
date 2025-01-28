import { Analitic } from '@/application/entity/analitic'
import { RelevanceBalance } from '@/application/entity/category'
import { create } from 'zustand'

interface State {
  analitic: Analitic[]
  relevanceBalance: RelevanceBalance
}

export interface AnaliticStoreAction {
  storeSetAnalitic: (analitic: Analitic[]) => void
  storeSetRelevanceBalance: (relevanceBalance: RelevanceBalance) => void
}

export const analiticStore = create<State & AnaliticStoreAction>((set) => ({
  analitic: [],
  relevanceBalance: {
    Essencial: 0,
    Eventual: 0,
    Dispensável: 0,
    Outro: 0
  },
  storeSetAnalitic: (analitic) => set({ analitic }),
  storeSetRelevanceBalance: (relevanceBalance) => set({ relevanceBalance })
}))
