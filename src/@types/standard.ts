import { TableQueries } from './common'

import type { Control, FieldErrors } from 'react-hook-form'

export type GetStandardListResponse = {
    list: Standard[]
    total: number
}

export type Filter = {
    purchasedProducts: string
    purchaseChannel: Array<string>
}

export type Standard = {
    id: string
    name: string
}

export type StandardListState = {
    tableData: TableQueries
    filterData: Filter
    selectedStandard: Partial<Standard>[]
}

export type StandardListAction = {
    setFilterData: (payload: Filter) => void
    setTableData: (payload: TableQueries) => void
    setSelectedStandard: (checked: boolean, customer: Standard) => void
    setSelectAllStandard: (customer: Standard[]) => void
}

export type Fields = {
    id?: string
    name: string
}

export type TagsFields = {
    tags: Array<{ value: string; label: string }>
}

export type StandardFormSchema = Fields

export type FormSectionBaseProps = {
    control: Control<StandardFormSchema>
    errors: FieldErrors<StandardFormSchema>
    readOnly?: boolean
}
