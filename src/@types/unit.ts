import { TableQueries } from './common'

export type GetUnitListResponse = {
    data: Unit[]
    total: number
}

export type GetUnitDetailResponse = {
    data: Unit
    total: number
}

export type Unit = {
    id: string
    name: string
    appended_from_lab_id?: number | null
}

export type UnitListState = {
    tableData: TableQueries
    selected: Unit[]
}

export type UnitListActions = {
    updateTable: (payload: Partial<TableQueries>) => void
    toggleRow: (checked: boolean, row: Unit) => void
    setAll: (rows: Unit[]) => void
    clearSelection: () => void
    resetQuery: () => void
}

export type Fields = {
    id?: string
    name: string
}

export type TagsFields = {
    tags: Array<{ value: string; label: string }>
}
