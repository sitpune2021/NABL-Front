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

export type Fields = {
    id?: string
    name: string
    email: string
    phone?: string
    role: string
    username: string
    address?: string
    profileImage?: string
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
