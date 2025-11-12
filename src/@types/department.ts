import { IdentifierEntity, TableQueries } from './common'

import type { Control, FieldErrors } from 'react-hook-form'

export type GetDepartmentListResponse = {
    data: Department[]
    total: number
}

export type GetDepartmentDetailResponse = {
    data: Department
}

export type Department = {
    id: string
    name: string
} & IdentifierEntity

export type DepartmentListState = {
    tableData: TableQueries
    selectedDepartment: Partial<Department>[]
}

export type DepartmentListAction = {
    setTableData: (payload: TableQueries) => void
    setSelectedDepartment: (checked: boolean, department: Department) => void
    setSelectAllDepartment: (department: Department[]) => void
}

export type Fields = {
    id?: string
    name: string
} & IdentifierEntity

export type TagsFields = {
    tags: Array<{ value: string; label: string }>
}

export type DepartmentFormSchema = Fields

export type FormSectionBaseProps = {
    control: Control<DepartmentFormSchema>
    errors: FieldErrors<DepartmentFormSchema>
    readOnly?: boolean
}
