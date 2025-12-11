import { Cluster } from './cluster'
import { IdentifierEntity, TableQueries } from './common'

import type { Control, FieldErrors } from 'react-hook-form'

export type GetLocationListResponse = {
    data: Location[]
    total: number
}

export type GetLocationDetailResponse = {
    data: Location
}

export type Filter = {
    purchasedProducts: string
    purchaseChannel: Array<string>
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
    filterData: Filter
    selectedLocation: Partial<Location>[]
}

export type LocationListAction = {
    setFilterData: (payload: Filter) => void
    setTableData: (payload: TableQueries) => void
    setSelectedLocation: (checked: boolean, customer: Location) => void
    setSelectAllLocation: (customer: Location[]) => void
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

export type LocationFormSchema = Fields

export type FormSectionBaseProps = {
    control: Control<LocationFormSchema>
    errors: FieldErrors<LocationFormSchema>
    readOnly?: boolean
}
