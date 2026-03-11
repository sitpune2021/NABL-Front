import { FormSchema } from '@/views/masters/subcategory/List/components/ListTableFilter'
import { Category } from './category'
import type { IdentifierEntity, TableQueries } from './common'

export type GetSubCategoryListResponse = {
    data: SubCategory[]
    total: number
}

export type GetSubCategoryDetailResponse = {
    data: SubCategories
}

export type SubCategory = {
    id: string
    name: string
    cat_id: string | number
    category: Category
    parent_id?: number | null
    lab: null | { name: string }
} & IdentifierEntity

export type SubCategories = {
    id: string
    name: string
    cat_id: string | number
} & IdentifierEntity

export type Fields = {
    id?: string
    name: string
    cat_id: string | number
    category?: Category
} & IdentifierEntity

export type TagsFields = {
    tags: Array<{ value: string; label: string }>
}

export type SubCategoryListState = {
    tableData: TableQueries
    filterData: FormSchema
    selected: SubCategory[]
}

export type SubCategoryListActions = {
    updateTable: (payload: Partial<TableQueries>) => void
    updateFilters: (payload: Partial<FormSchema>) => void
    resetFilters: () => void
    toggleRow: (checked: boolean, row: SubCategory) => void
    setAll: (rows: SubCategory[]) => void
    clearSelection: () => void
    resetQuery: () => void
}
