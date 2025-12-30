/* eslint-disable @typescript-eslint/no-explicit-any */
import { TableQueries } from './common'
import { Document } from './document'
import { Category } from './category'

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
    category_id: string
    document: {
        id: string
        version_id: string
        version: string
    }
}

export type AccordionItem = {
    title: string
    message: string
    note?: boolean
    children?: AccordionItem[]
}

export type TitleSpecificData = {
    notes: string
    clause_documents_tagging: ClauseItem[]
    id: string
    parentId?: string
}

export type Fields = {
    id?: string
    Standard_id: string
    standard_clauses: TitleSpecificData[]
}

export type TagsFields = {
    tags: Array<{ value: string; label: string }>
}

export type ClausesFormSchema = Fields

export type FormSectionBaseProps = {
    readOnly?: boolean
}

export type OverviewSectionProps = FormSectionBaseProps & {
    accordionData: any[]
    documentList: Document[]
    categoryList: Category[]
    loading?: any
    standardId?: number | string
}
