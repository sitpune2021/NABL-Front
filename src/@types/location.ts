import { TableQueries } from './common'

import type { Control, FieldErrors } from 'react-hook-form'

export type GetLocationListResponse = {
    list: Location[]
    total: number
}

export type Filter = {
    purchasedProducts: string
    purchaseChannel: Array<string>
}

export type Location = {
    id: string
    location_name: string
    zone_name: string
    cluster_name: string
    short_name: string
}

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
    location_name: string
    zone_name: string
    cluster_name: string
    short_name: string
}

export type TagsFields = {
    tags: Array<{ value: string; label: string }>
}

export type LocationFormSchema = Fields

export type FormSectionBaseProps = {
    control: Control<LocationFormSchema>
    errors: FieldErrors<LocationFormSchema>
    readOnly?: boolean
}
