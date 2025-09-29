import { TableQueries } from './common'

import type { Control, FieldErrors } from 'react-hook-form'

export type GetLabListResponse = {
    list: Lab[]
    total: number
}

export type Filter = {
    purchasedProducts: string
    purchaseChannel: Array<string>
}

export type Lab = {
    id: string
    name: string
}

export type LabListState = {
    tableData: TableQueries
    filterData: Filter
    selectedLab: Partial<Lab>[]
}

export type LabListAction = {
    setFilterData: (payload: Filter) => void
    setTableData: (payload: TableQueries) => void
    setSelectedLab: (checked: boolean, customer: Lab) => void
    setSelectAllLab: (customer: Lab[]) => void
}

export type Fields = {
    id?: string
    name: string
    labType: string
    department: string
    category: string
    labCode: string
    email?: string
    phone?: string
    address?: string
}

export type TagsFields = {
    tags: Array<{ value: string; label: string }>
}

export type LabFormSchema = Fields

export type FormSectionBaseProps = {
    control: Control<LabFormSchema>
    errors: FieldErrors<LabFormSchema>
    readOnly?: boolean
}
