export class Category {
  constructor (
    readonly id: string = '',
    readonly name: string = '',
    readonly subCategory: string = 'Indefinido'
  ) { }
}

export interface RawCategoryReceived {
  _id: string
  name: string,
  subCategory: string
}

export type CategoryPartial = Partial<Category>

export type SubCategory = 'Essencial' | 'Eventual' | 'Dispensável' | 'Outro'
export type RelevanceBalance = Record<SubCategory, number>
