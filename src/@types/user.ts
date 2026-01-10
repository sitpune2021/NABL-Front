/* eslint-disable @typescript-eslint/no-explicit-any */
import { TableQueries } from './common'
import type { Control, FieldErrors } from 'react-hook-form'

export type GetUserListResponse = {
    data: User[]
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
    signature?: string
    profileImage?: string
    dialCode: string
    status?: string
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
    department_id?: number
    roles?: Array<{ value?: number; label?: string }>
    permissions?: Record<string | number, any>
}
export type LabAssignment = {
    locationId: string
    roleId?: string
}

export type LabAssignments = Record<string, Record<string, LabAssignment>>

export type UserRole = {
    id?: string
    zone_id?: number
    cluster_id?: number
    location_id?: number
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

    signature?: string
    profileImage?: string
    labAssignments?: LabAssignments
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
