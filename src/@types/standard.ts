import { TableQueries } from './common'

export type Clause = {
    id: number
    standardId: number
    parentId: number | null
    title: string
    message: string
    note: boolean
    is_child: boolean
    numbering_type: 'numerical' | 'dot' | string
    numbering_value: string
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

export type StandardFieldPath =
    | 'clauses'
    | `clauses.${number}`
    | `clauses.${number}.children`

export interface StandardRecursiveSectionProps {
    name: StandardFieldPath
    readOnly: boolean
    isRoot?: boolean
    depth?: number
}
