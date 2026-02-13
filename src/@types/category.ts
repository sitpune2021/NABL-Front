import { IdentifierEntity, TableQueries } from './common'

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
    appended_from_lab_id?: number | null
    parent_id?: number | null
} & IdentifierEntity

export type Fields = {
    id?: string
    name: string
} & IdentifierEntity

export type TagsFields = {
    tags: Array<{ value: string; label: string }>
}

export type CategoryListState = {
    tableData: TableQueries
    selected: Category[]
}

export type CategoryListActions = {
    updateTable: (payload: Partial<TableQueries>) => void
    toggleRow: (checked: boolean, row: Category) => void
    setAll: (rows: Category[]) => void
    clearSelection: () => void
    resetQuery: () => void
}
