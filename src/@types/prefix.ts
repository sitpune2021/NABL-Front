import type { TableQueries } from './common'

export type Prefix = {
    id: number
    prefix_master: string
    type: string
    min_length: number
    max_length: number
}

export type PrefixListState = {
    tableData: TableQueries
    selected: Prefix[]
    prefixList: Prefix[]
}

export type PrefixListActions = {
    updateTable: (payload: Partial<TableQueries>) => void
    toggleRow: (checked: boolean, row: Prefix) => void
    setAll: (rows: Prefix[]) => void
    clearSelection: () => void
    resetQuery: () => void
    setPrefixList: (data: Prefix[]) => void // ✅ ADD THIS
}
