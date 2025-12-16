import { TableQueries } from './common'
import type { Control, FieldErrors } from 'react-hook-form'

export type Child = {
    title: string
    message: string
    note: boolean
    isChild: boolean
    count: number
    children: Child[]
    depth?: number
}

export type Clause = {
    id: number
    standardId: number
    parentId: number | null
    title: string
    message: string
    note: boolean
    isChild: boolean
    numberingType: 'numerical' | 'dot' | string
    numberingValue: string
    sortOrder: number
    createdAt: string
    updatedAt: string
    children: Clause[]
}

export type Standard = {
    id: number
    uuid: string
    name: string
    description: string | null
    versionMajor: number
    versionMinor: number
    changesType: 'minor' | 'major' | string
    status: 'published' | 'draft' | string
    isCurrent: boolean
    createdBy: number
    createdAt: string
    updatedAt: string
    clauses: Clause[]
}

export type GetStandardListResponse = {
    list: Standard[]
    total: number
}

export type GetStandardResponse = Standard

export type Filter = {
    purchasedProducts: string
    purchaseChannel: string[]
}

export type Note = {
    id?: number
    content: string
}

export type Field = {
    id?: number
    category: string
    documentName: string
    frequency: string
    isRequired: boolean
    timezone: boolean
}

export type Fields = {
    id?: string
    uuid?: string
    name: string
    standards: Child | Child[] // support single or multiple standards
}

export type StandardFormSchema = Fields

export type TagsFields = {
    tags: Array<{ value: string; label: string }>
}

export type FormSectionBaseProps = {
    control: Control<StandardFormSchema>
    errors: FieldErrors<StandardFormSchema>
    readOnly?: boolean
}

export type StandardListState = {
    tableData: TableQueries
    filterData: Filter
    selectedStandard: Partial<Standard>[]
}

export type StandardListAction = {
    setFilterData: (payload: Filter) => void
    setTableData: (payload: TableQueries) => void
    setSelectedStandard: (checked: boolean, customer: Standard) => void
    setSelectAllStandard: (customer: Standard[]) => void
}
