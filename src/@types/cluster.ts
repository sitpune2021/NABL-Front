import { IdentifierEntity, TableQueries } from './common'

import { FormSchema } from '@/views/masters/cluster/List/components/ListTableFilter'

export type GetClusterListResponse = {
    data: Cluster[]
    total: number
}
export type GetClusterDetailResponse = {
    data: Cluster
}

export type Cluster = {
    id: string
    zone_id: string | number
    zone: {
        id: string
        name: string
        identifier: string
    }
    name: string
} & IdentifierEntity

export type ClusterListState = {
    tableData: TableQueries
    filterData: FormSchema
    selected: Partial<Cluster>[]
}

export type ClusterListAction = {
    updateTable: (payload: Partial<TableQueries>) => void
    updateFilters: (payload: Partial<FormSchema>) => void
    resetFilters: () => void
    toggleRow: (checked: boolean, row: Cluster) => void
    setAll: (rows: Cluster[]) => void
    clearSelection: () => void
    resetQuery: () => void
}

export type Fields = {
    id?: string
    zone_id: string | number
    name: string
} & IdentifierEntity

export type TagsFields = {
    tags: Array<{ value: string; label: string }>
}
