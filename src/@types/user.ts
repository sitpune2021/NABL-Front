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
    role?: string
    username: string
    address?: string
    issuedBy: boolean
    approvedBy: boolean
    signUpload?: string
    preparedBy: boolean
    dialCode: string
    zone_name?: string
    cluster_name?: string
    location_name?: string
    department_name?: string
    status?: string
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

export type UserRole = {
    id?: string
    zone_name?: string
    cluster_name?: string
    location_name?: string
    department_name?: string
    roles?: { value?: string; label?: string }[]
}

export type Fields = {
    id?: string
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
    city?: string
    postcode?: string
    status?: string
    userRoles?: UserRole[]
}

export type TagsFields = {
    tags: Array<{ value: string; userel: string }>
}

export type UserFormSchema = Fields

export type FormSectionBaseProps = {
    control: Control<UserFormSchema>
    errors: FieldErrors<UserFormSchema>
    readOnly?: boolean
}
