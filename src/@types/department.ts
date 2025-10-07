import { PrefixFEntity, TableQueries } from './common'

import type { Control, FieldErrors } from 'react-hook-form'

export type GetDepartmentListResponse = {
    list: Department[]
    total: number
}

export type Filter = {
    purchasedProducts: string
    purchaseChannel: Array<string>
}

export type Department = {
    id: string
    name: string
} & PrefixFEntity

export type DepartmentListState = {
    tableData: TableQueries
    filterData: Filter
    selectedDepartment: Partial<Department>[]
}

export type DepartmentListAction = {
    setFilterData: (payload: Filter) => void
    setTableData: (payload: TableQueries) => void
    setSelectedDepartment: (checked: boolean, customer: Department) => void
    setSelectAllDepartment: (customer: Department[]) => void
}

export type Fields = {
    id?: string
    name: string
} & PrefixFEntity

export type TagsFields = {
    tags: Array<{ value: string; label: string }>
}

export type DepartmentFormSchema = Fields

export type FormSectionBaseProps = {
    control: Control<DepartmentFormSchema>
    errors: FieldErrors<DepartmentFormSchema>
    readOnly?: boolean
}
