import { IdentifierEntity, TableQueries } from './common'

export type GetMenuListResponse = {
    data: Menu[]
    total?: number
}

export type GetMenuDetailResponse = {
    data: Menu
}

export type Menu = {
    id: string
    name: string
    title?: string
    identifier?: string
    path?: string
    parent?: string
    icon?: string
    type?: string
} & IdentifierEntity

export type MenuListState = {
    tableData: TableQueries
    selected: Menu[]
}

export type MenuListActions = {
    updateTable: (payload: Partial<TableQueries>) => void
    toggleRow: (checked: boolean, row: Menu) => void
    setAll: (rows: Menu[]) => void
    clearSelection: () => void
    resetQuery: () => void
}
