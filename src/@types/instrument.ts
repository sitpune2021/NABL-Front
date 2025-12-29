import { IdentifierEntity, TableQueries } from './common'

export type GetInstrumentListResponse = {
    data: Instrument[]
    total?: number
}

export type GetInstrumentDetailResponse = {
    data: Instrument
}

export type Instrument = {
    id: string
    name: string
    short_name: string
    manufacturer: string
    serial_no: string
} & IdentifierEntity

export type InstrumentListState = {
    tableData: TableQueries
    selected: Instrument[]
}

export type InstrumentListActions = {
    updateTable: (payload: Partial<TableQueries>) => void
    toggleRow: (checked: boolean, row: Instrument) => void
    setAll: (rows: Instrument[]) => void
    clearSelection: () => void
    resetQuery: () => void
}

export type Fields = {
    id?: string
    name: string
    short_name: string
    manufacturer: string
    serial_no: string
} & IdentifierEntity

export type TagsFields = {
    tags: Array<{ value: string; label: string }>
}
