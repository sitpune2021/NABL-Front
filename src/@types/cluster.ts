import { PrefixFEntity, TableQueries } from './common'

import type { Control, FieldErrors } from 'react-hook-form'

export type GetClusterListResponse = {
    list: Cluster[]
    total: number
}

export type Filter = {
    purchasedProducts: string
    purchaseChannel: Array<string>
}

export type Cluster = {
    id: string
    cluster_name: string
    zone_name: string
} & PrefixFEntity

export type ClusterListState = {
    tableData: TableQueries
    filterData: Filter
    selectedCluster: Partial<Cluster>[]
}

export type ClusterListAction = {
    setFilterData: (payload: Filter) => void
    setTableData: (payload: TableQueries) => void
    setSelectedCluster: (checked: boolean, customer: Cluster) => void
    setSelectAllCluster: (customer: Cluster[]) => void
}

export type Fields = {
    id?: string
    cluster_name: string
    zone_name: string
} & PrefixFEntity

export type TagsFields = {
    tags: Array<{ value: string; label: string }>
}

export type ClusterFormSchema = Fields

export type FormSectionBaseProps = {
    control: Control<ClusterFormSchema>
    errors: FieldErrors<ClusterFormSchema>
    readOnly?: boolean
}
