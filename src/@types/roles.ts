import { TableQueries } from './common'

import type { Control, FieldErrors } from 'react-hook-form'
import { KeyedMutator } from 'swr'

export type GetRolesListResponse = {
    list: Roles[]
    total: number
}

export type Filter = {
    purchasedProducts: string
    purchaseChannel: Array<string>
}

type User = Record<string, string>

export type Roles = {
    id: string
    name: string
    description: string
    level: number
    users: User[]
    accessRight?: Record<string, string[]>
}

export type RolesListState = {
    tableData: TableQueries
    filterData: Filter
    selectedRoles: Partial<Roles>[]
}

export type RolesListAction = {
    setFilterData: (payload: Filter) => void
    setTableData: (payload: TableQueries) => void
    setSelectedRoles: (checked: boolean, customer: Roles) => void
    setSelectAllRoles: (customer: Roles[]) => void
}

export type Fields = {
    id?: string
    name: string
    description: string
    level: number
}

export type TagsFields = {
    tags: Array<{ value: string; label: string }>
}

export type RolesFormSchema = Fields

export type FormSectionBaseProps = {
    control: Control<RolesFormSchema>
    errors: FieldErrors<RolesFormSchema>
    readOnly?: boolean
}

export type MutateRolesPermissionsRolesResponse = KeyedMutator<Roles>
