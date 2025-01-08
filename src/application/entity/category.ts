export class Category {
  constructor (
    readonly id: string = '',
    readonly name: string = '',
    readonly subCategory: string = 'indefinido'
  ) { }
}

export interface RawCategory {
  _id: string
  name: string
  subCategory: string
}

export type CategoryPartial = Partial<Category>

export type RawCategoryPartial = Partial<RawCategory>
