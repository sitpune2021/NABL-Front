import { TableQueries, PrefixFEntity } from './common'

import type { Control, FieldErrors } from 'react-hook-form'

export type GetUnitListResponse = {
    list: Unit[]
    total: number
}

export type Filter = {
    purchasedProducts: string
    purchaseChannel: Array<string>
}

export type Unit = {
    id: string
    name: string
} & PrefixFEntity

export type UnitListState = {
    tableData: TableQueries
    filterData: Filter
    selectedUnit: Partial<Unit>[]
}

export type UnitListAction = {
    setFilterData: (payload: Filter) => void
    setTableData: (payload: TableQueries) => void
    setSelectedUnit: (checked: boolean, customer: Unit) => void
    setSelectAllUnit: (customer: Unit[]) => void
}

export type Fields = {
    id?: string
    name: string
} & PrefixFEntity

export type TagsFields = {
    tags: Array<{ value: string; label: string }>
}

export type UnitFormSchema = Fields

export type FormSectionBaseProps = {
    control: Control<UnitFormSchema>
    errors: FieldErrors<UnitFormSchema>
    readOnly?: boolean
}
