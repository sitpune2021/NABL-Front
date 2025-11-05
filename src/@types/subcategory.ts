import { TableQueries } from './common'
import type { PrefixFEntity } from './common'

import type { Control, FieldErrors } from 'react-hook-form'

export type GetSubCategoryListResponse = {
    data: SubCategory[]
    total: number
}

export type Filter = {
    purchasedProducts: string
    purchaseChannel: Array<string>
}

export type SubCategory = {
    id: string
    name: string
    cat_id: string | number
} & PrefixFEntity

export type SubCategoryListState = {
    tableData: TableQueries
    filterData: Filter
    selectedSubCategory: Partial<SubCategory>[]
}

export type SubCategoryListAction = {
    setFilterData: (payload: Filter) => void
    setTableData: (payload: TableQueries) => void
    setSelectedSubCategory: (checked: boolean, subCategory: SubCategory) => void
    setSelectAllSubCategory: (subCategory: SubCategory[]) => void
}

export type Fields = {
    id?: string
    name: string
    cat_id: string | number
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
