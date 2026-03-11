import { IdentifierEntity, TableQueries } from './common'

export type GetZoneListResponse = {
    data: Zone[]
    total?: number
}

export type GetZoneDetailResponse = {
    data: Fields
}

export type Zone = {
    id: string
    name: string
    lab: null | { name: string }
} & IdentifierEntity

export type ZoneListState = {
    tableData: TableQueries
    selected: Zone[]
}

export type ZoneListActions = {
    updateTable: (payload: Partial<TableQueries>) => void
    toggleRow: (checked: boolean, row: Zone) => void
    setAll: (rows: Zone[]) => void
    clearSelection: () => void
    resetQuery: () => void
}

export type Fields = {
    id?: string
    name: string
} & IdentifierEntity

export type TagsFields = {
    tags: Array<{ value: string; label: string }>
}
