import { IdentifierEntity, TableQueries } from './common'

import type { Control, FieldErrors } from 'react-hook-form'

export type GetCategoryListResponse = {
    data: Category[]
    total?: number
}

export type GetCategoryDetailResponse = {
    id: string
    data: Fields
}

export type Category = {
    id: string
    name: string
} & IdentifierEntity

export type CategoryListState = {
    tableData: TableQueries
    selectedCategory: Partial<Category>[]
}

export type CategoryListAction = {
    setTableData: (payload: TableQueries) => void
    setSelectedCategory: (checked: boolean, customer: Category) => void
    setSelectAllCategory: (customer: Category[]) => void
}

export type Fields = {
    id?: string
    name: string
} & IdentifierEntity

export type TagsFields = {
    tags: Array<{ value: string; label: string }>
}

export type CategoryFormSchema = Fields

export type FormSectionBaseProps = {
    control: Control<CategoryFormSchema>
    errors: FieldErrors<CategoryFormSchema>
    readOnly?: boolean
}
