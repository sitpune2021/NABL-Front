/* eslint-disable @typescript-eslint/no-explicit-any */
import { TableQueries } from './common'
import type { Control, FieldErrors } from 'react-hook-form'

export type GetUserListResponse = {
    list: User[]
    total: number
}

export type Filter = {
    purchasedProducts: string
    purchaseChannel: Array<string>
}

export type User = {
    id: string
    name: string
    email: string
    phone: string
    username: string
    address?: string
    issuedBy: boolean
    approvedBy: boolean
    signUpload?: string
    preparedBy: boolean
    dialCode: string
    status?: string
    city?: string
    postcode?: string
    userRoles?: UserRole[]
}

export type UserListState = {
    tableData: TableQueries
    filterData: Filter
    selectedUser: Partial<User>[]
}

export type UserListAction = {
    setFilterData: (payload: Filter) => void
    setTableData: (payload: TableQueries) => void
    setSelectedUser: (checked: boolean, customer: User) => void
    setSelectAllUser: (customer: User[]) => void
}

export type Department = {
    department_name?: string
    roles?: Array<{ value?: string; label?: string }>
    permissions?: Record<string, any>
}

export type UserRole = {
    id?: string
    zone_name?: string
    cluster_name?: string
    location_name?: string
    department?: Array<Department>
}

export type Fields = {
    id?: string
    name: string
    username: string
    email: string
    phone: string
    dialCode: string

    address?: string
    city?: string
    postcode?: string

    issuedBy: boolean
    approvedBy: boolean
    preparedBy: boolean

    signUpload?: string
    status?: string

    userRoles?: Array<UserRole>
}

export type TagsFields = {
    tags: Array<{ value: string; userel: string }>
}

export type UserFormSchema = Fields

export type FormSectionBaseProps = {
    control: Control<UserFormSchema>
    errors: FieldErrors<UserFormSchema>
    readOnly?: boolean
    setValue?: any
}
