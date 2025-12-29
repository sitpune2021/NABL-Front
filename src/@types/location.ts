import { FormSchema } from '@/views/masters/location/List/components/ListTableFilter'
import { Cluster } from './cluster'
import { IdentifierEntity, TableQueries } from './common'

export type GetLocationListResponse = {
    data: Location[]
    total: number
}

export type GetLocationDetailResponse = {
    data: Location
}

export type Location = {
    id: string
    name: string
    zone_id: string | number
    cluster_id: string | number
    cluster: Cluster
    short_name: string
} & IdentifierEntity

export type LocationListState = {
    tableData: TableQueries
    filterData: FormSchema
    selected: Partial<Location>[]
}

export type LocationListAction = {
    updateTable: (payload: Partial<TableQueries>) => void
    updateFilters: (payload: Partial<FormSchema>) => void
    resetFilters: () => void
    toggleRow: (checked: boolean, row: Location) => void
    setAll: (rows: Location[]) => void
    clearSelection: () => void
    resetQuery: () => void
}

export type Fields = {
    id?: string
    name: string
    zone_id: string | number
    cluster_id: string | number
    short_name: string
} & IdentifierEntity

export type TagsFields = {
    tags: Array<{ value: string; label: string }>
}
