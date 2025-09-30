import { TableQueries } from './common'

import type { Control, FieldErrors } from 'react-hook-form'

export type GetSignatoryByListResponse = {
    list: SignatoryBy[]
    total: number
}

export type Filter = {
    purchasedProducts: string
    purchaseChannel: Array<string>
}

export type SignatoryBy = {
    id: string
    name: string
}

export type SignatoryByListState = {
    tableData: TableQueries
    filterData: Filter
    selectedSignatoryBy: Partial<SignatoryBy>[]
}

export type SignatoryByListAction = {
    setFilterData: (payload: Filter) => void
    setTableData: (payload: TableQueries) => void
    setSelectedSignatoryBy: (checked: boolean, customer: SignatoryBy) => void
    setSelectAllSignatoryBy: (customer: SignatoryBy[]) => void
}

export type Fields = {
    id?: string
    name: string
}

export type TagsFields = {
    tags: Array<{ value: string; label: string }>
}

export type SignatoryByFormSchema = Fields

export type FormSectionBaseProps = {
    control: Control<SignatoryByFormSchema>
    errors: FieldErrors<SignatoryByFormSchema>
    readOnly?: boolean
}
