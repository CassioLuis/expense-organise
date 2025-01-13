export class Category {
  constructor (
    readonly id: string = '',
    readonly name: string = '',
    readonly subCategory: string = 'Indefinido'
  ) { }
}

export type CategoryPartial = Partial<Category>
