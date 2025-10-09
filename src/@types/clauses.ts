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
    id: string
    name: string
    prefix: string
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

export type Fields = {
    id?: string
    name: string
}

export type TagsFields = {
    tags: Array<{ value: string; label: string }>
}

export type ClausesFormSchema = Fields

export type FormSectionBaseProps = {
    control: Control<ClausesFormSchema>
    errors: FieldErrors<ClausesFormSchema>
    readOnly?: boolean
}
