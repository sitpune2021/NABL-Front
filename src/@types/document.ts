/* eslint-disable @typescript-eslint/no-explicit-any */
import { TableQueries } from './common'

import type { Control, FieldErrors, UseFormSetValue } from 'react-hook-form'

export type FrequencyType =
    | 'Daily'
    | 'Weekly'
    | 'Fortnightly'
    | 'Monthly'
    | 'Quarterly'
    | 'Half-Yearly'
    | 'Yearly'
    | 'Bi-Yearly'

export interface ItemConfig {
    interval: number
    cutOffTimes: string[]
    considerLastDay?: boolean
}

export interface FrequencyPopupProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: (config: FrequencyConfig, settings: any) => void
    initialData?: FrequencyConfig
    initialSettings?: any
    triates: Field[]
}

export type Trait = {
    name: string
    value: string
}

export type Field = {
    headerText: string
    traits: Trait[]
}

export interface FrequencyConfig {
    type: FrequencyType
    interval: number
    cutOffTime: string
    cutOffTimes: string[]
    count: number
    selectedItems?: string[]
    itemConfigs?: Record<string, ItemConfig>
    selectedMonth?: string
    selectedDay?: string
}

export interface DataEntrySchedule {
    id?: string | number
    frequency: FrequencyConfig
    startDate: string
    endDate?: string
}

export type GetDocumentListResponse = {
    data: Document[]
    total: number
}

export type GetDocumentResponse = {
    data: Document
    total: number
}

export type Filter = {
    purchasedProducts: string
    purchaseChannel: Array<string>
}

export type Document = {
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
    durationUnit?: string
    durationValue?: number
    status?: 'Controlled' | 'Uncontrolled'
    dataEntrySchedule?: DataEntrySchedule
    editor?: {
        id?: string
        documentId?: string | number
        document?: {
            html: string
            css: string
            js: string
        }
    }
}

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
    department?: string[]
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
    durationUnit?: string
    durationValue?: number
    status?: 'Controlled' | 'Uncontrolled'
    dataEntrySchedule?: DataEntrySchedule
    document?: {
        html: string
        css: string
        js: string
        json: string
    }
    settings?: any
}

export type TagsFields = {
    tags: Array<{ value: string; label: string }>
}

export type DocumentFormSchema = Fields

export type EditorFormSchema = {
    documentId: string
    document: {
        html: string
        css: string
    }
}

export type FormSectionBaseProps = {
    control: Control<DocumentFormSchema | EditorFormSchema>
    errors: FieldErrors<DocumentFormSchema & EditorFormSchema>
    readOnly?: boolean
    setValue: UseFormSetValue<DocumentFormSchema | EditorFormSchema>
}
