import { PrefixFEntity, TableQueries } from './common'

import type { Control, FieldErrors } from 'react-hook-form'

export type GetDocumentListResponse = {
    list: Document[]
    total: number
}

export type Filter = {
    purchasedProducts: string
    purchaseChannel: Array<string>
}

export type Document = {
    id: string
    name: string
} & PrefixFEntity

export type DocumentListState = {
    tableData: TableQueries
    filterData: Filter
    selectedDocument: Partial<Document>[]
}

export type DocumentListAction = {
    setFilterData: (payload: Filter) => void
    setTableData: (payload: TableQueries) => void
    setSelectedDocument: (checked: boolean, customer: Document) => void
    setSelectAllDocument: (customer: Document[]) => void
}

export type Fields = {
    id?: string
    labName: string
    location?: string
    department?: string
    header?: string
    footer?: string
    category?: string
    documentName: string
    documentNo?: string
    issuedNo?: string
    amendmentNo?: string
    copyNo?: string
    date?: string
    preparedByDate?: string
    time?: string
    preparedBy: string
    quantityPrepared?: string | number
    approvedBy: string
    issuedBy?: string
    issueDate: string
    amendmentDate?: string
    effectiveDate: string
    frequency?: string
    duration?: string
} & PrefixFEntity

export type TagsFields = {
    tags: Array<{ value: string; label: string }>
}

export type DocumentFormSchema = Fields

export type FormSectionBaseProps = {
    control: Control<DocumentFormSchema>
    errors: FieldErrors<DocumentFormSchema>
    readOnly?: boolean
}
