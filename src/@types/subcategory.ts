import { TableQueries } from './common'
import type { PrefixFEntity } from './common'

import type { Control, FieldErrors } from 'react-hook-form'

export type GetSubCategoryListResponse = {
    list: SubCategory[]
    total: number
}

export type Filter = {
    purchasedProducts: string
    purchaseChannel: Array<string>
}

export type SubCategory = {
    id: string
    name: string
} & PrefixFEntity

export type SubCategoryListState = {
    tableData: TableQueries
    filterData: Filter
    selectedSubCategory: Partial<SubCategory>[]
}

export type SubCategoryListAction = {
    setFilterData: (payload: Filter) => void
    setTableData: (payload: TableQueries) => void
    setSelectedSubCategory: (checked: boolean, customer: SubCategory) => void
    setSelectAllSubCategory: (customer: SubCategory[]) => void
}

export type Fields = {
    id?: string
    name: string
    subcategory: string
    required: boolean
    initialtimezone: boolean
} & PrefixFEntity

export type TagsFields = {
    tags: Array<{ value: string; label: string }>
}

export type SubCategoryFormSchema = Fields

export type FormSectionBaseProps = {
    control: Control<SubCategoryFormSchema>
    errors: FieldErrors<SubCategoryFormSchema>
    readOnly?: boolean
}
