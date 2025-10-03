import { PrefixFEntity, TableQueries } from './common'

import type { Control, FieldErrors } from 'react-hook-form'

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
} & PrefixFEntity

export type CategoryListState = {
    tableData: TableQueries
    filterData: Filter
    selectedCategory: Partial<Category>[]
}

export type CategoryListAction = {
    setFilterData: (payload: Filter) => void
    setTableData: (payload: TableQueries) => void
    setSelectedCategory: (checked: boolean, customer: Category) => void
    setSelectAllCategory: (customer: Category[]) => void
}

export type Fields = {
    id?: string
    name: string
} & PrefixFEntity

export type TagsFields = {
    tags: Array<{ value: string; label: string }>
}

export type CategoryFormSchema = Fields

export type FormSectionBaseProps = {
    control: Control<CategoryFormSchema>
    errors: FieldErrors<CategoryFormSchema>
    readOnly?: boolean
}
