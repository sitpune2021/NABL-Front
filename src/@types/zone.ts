import { TableQueries } from './common'

import type { Control, FieldErrors } from 'react-hook-form'

export type GetZoneListResponse = {
    list: Zone[]
    total: number
}

export type Filter = {
    purchasedProducts: string
    purchaseChannel: Array<string>
}

export type Zone = {
    id: string
    name: string
}

export type ZoneListState = {
    tableData: TableQueries
    filterData: Filter
    selectedZone: Partial<Zone>[]
}

export type ZoneListAction = {
    setFilterData: (payload: Filter) => void
    setTableData: (payload: TableQueries) => void
    setSelectedZone: (checked: boolean, customer: Zone) => void
    setSelectAllZone: (customer: Zone[]) => void
}

export type Fields = {
    id?: string
    name: string
}

export type TagsFields = {
    tags: Array<{ value: string; label: string }>
}

export type ZoneFormSchema = Fields

export type FormSectionBaseProps = {
    control: Control<ZoneFormSchema>
    errors: FieldErrors<ZoneFormSchema>
    readOnly?: boolean
}
