import { StandardFormSchema } from '@/schemas/standard.schema'
import { TableQueries } from './common'
import type { Control, FieldErrors } from 'react-hook-form'

export type Child = {
    title: string
    message: string
    note: boolean
    is_child: boolean
    children_count: number
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
    is_child: boolean
    numbering_type: 'numerical' | 'dot' | string
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
    is_document_link: boolean
    createdBy: number
    created_at: string
    updatedAt: string
    clauses: Clause[]
}

export type GetStandardListResponse = {
    data: Standard[]
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
    clauses: Child | Child[] // support single or multiple standards
}

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
    selected: Partial<Standard>[]
}

export type StandardListActions = {
    updateTable: (payload: Partial<TableQueries>) => void
    toggleRow: (checked: boolean, row: Standard) => void
    setAll: (rows: Standard[]) => void
    clearSelection: () => void
    resetQuery: () => void
}
