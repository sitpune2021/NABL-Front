import { TableQueries } from './common'

import type { Control, FieldErrors } from 'react-hook-form'

export type GetSignatoryOnListResponse = {
    list: SignatoryOn[]
    total: number
}

export type Filter = {
    purchasedProducts: string
    purchaseChannel: Array<string>
}

export type SignatoryOn = {
    id: string
    name: string
}

export type SignatoryOnListState = {
    tableData: TableQueries
    filterData: Filter
    selectedSignatoryOn: Partial<SignatoryOn>[]
}

export type SignatoryOnListAction = {
    setFilterData: (payload: Filter) => void
    setTableData: (payload: TableQueries) => void
    setSelectedSignatoryOn: (checked: boolean, customer: SignatoryOn) => void
    setSelectAllSignatoryOn: (customer: SignatoryOn[]) => void
}

export type Fields = {
    id?: string
    name: string
}

export type TagsFields = {
    tags: Array<{ value: string; label: string }>
}

export type SignatoryOnFormSchema = Fields

export type FormSectionBaseProps = {
    control: Control<SignatoryOnFormSchema>
    errors: FieldErrors<SignatoryOnFormSchema>
    readOnly?: boolean
}
