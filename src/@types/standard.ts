import { TableQueries } from './common'
import type { Control, FieldErrors } from 'react-hook-form'

export type GetStandardListResponse = {
    list: Standard[]
    total: number
}

export type Filter = {
    purchasedProducts: string
    purchaseChannel: Array<string>
}

// Note type
export type Note = {
    id?: number
    content: string
}

// Field type
export type Field = {
    id?: number
    category: string
    documentName: string
    frequency: string
    isRequired: boolean
    timezone: boolean
}

// Child type (recursive)
export type Child = {
    title: string
    message: string
    note: boolean
    isChild: boolean
    count: number
    children: Child[]
    depth?: number
}

// Standard type
export type Standard = {
    id: string
    name: string
    title: string
    message: string
    note: boolean
    isChild: boolean
    count: number
    children: Child[]
    depth?: number
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

export type Fields = {
    id?: string
    uuid?: string
    name: string
    standards: {
        title: string
        message: string
        note: boolean
        isChild: boolean
        count: number
        children: Child[]
    }
}

export type TagsFields = {
    tags: Array<{ value: string; label: string }>
}

export type StandardFormSchema = Fields

export type FormSectionBaseProps = {
    control: Control<StandardFormSchema>
    errors: FieldErrors<StandardFormSchema>
    readOnly?: boolean
}
