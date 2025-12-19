import { IdentifierEntity, TableQueries } from './common'

export type GetDepartmentListResponse = {
    data: Department[]
    total: number
}

export type GetDepartmentDetailResponse = {
    data: Department
}

export type Department = {
    id: string
    name: string
} & IdentifierEntity

export type Fields = {
    id?: string
    name: string
} & IdentifierEntity

export type TagsFields = {
    tags: Array<{ value: string; label: string }>
}

export type DepartmentListState = {
    tableData: TableQueries
    selected: Department[]
}

export type DepartmentListActions = {
    updateTable: (payload: Partial<TableQueries>) => void
    toggleRow: (checked: boolean, row: Department) => void
    setAll: (rows: Department[]) => void
    clearSelection: () => void
    resetQuery: () => void
}
