export type GetCategoryListResponse = {
    list: Category[]
    total: number
}

export type Filter = {
    purchasedProducts: string
    purchaseChannel: Array<string>
}

export type Category = {
    id: string
    name: string
}

export type CategoryAdd = {
    name: string
}
