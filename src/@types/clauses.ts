/* eslint-disable @typescript-eslint/no-explicit-any */
import { TableQueries } from './common'
import type { Control, FieldErrors } from 'react-hook-form'

export type GetClausesListResponse = {
    list: Clauses[]
    total: number
}

export type Filter = {
    purchasedProducts: string
    purchaseChannel: Array<string>
}

export type Clauses = {
    titleSpecificData: any
    id: string
    title: string
    category: string
    documentName: string
    status: 'active' | 'inactive'
    created_at: string
    name: string
}

export type ClausesListState = {
    tableData: TableQueries
    filterData: Filter
    selectedClauses: Partial<Clauses>[]
}

export type ClausesListAction = {
    setFilterData: (payload: Filter) => void
    setTableData: (payload: TableQueries) => void
    setSelectedClauses: (checked: boolean, customer: Clauses) => void
    setSelectAllClauses: (customer: Clauses[]) => void
}

export type ClauseItem = {
    category: string
    documentName: string
    frequency: string
}

export type AccordionItem = {
    title: string
    message: string
    note?: boolean
    children?: AccordionItem[]
}

export type TitleSpecificData = {
    notes: string
    clauses: ClauseItem[]
    id: string
    parentId?: string
}

export type Fields = {
    id?: string
    Standard_id: string
    clause_documents: TitleSpecificData[]
}

export type TagsFields = {
    tags: Array<{ value: string; label: string }>
}

export type ClausesFormSchema = Fields

export type FormSectionBaseProps = {
    control: Control<ClausesFormSchema>
    errors: FieldErrors<ClausesFormSchema>
    readOnly?: boolean
    setValue: any
    getValues: any
}

export type OverviewSectionProps = FormSectionBaseProps & {
    setValue: any
    getValues: any
    accordionData: any[]
}
