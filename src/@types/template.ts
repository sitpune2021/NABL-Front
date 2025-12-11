import { TableQueries } from './common'

import type { Control, FieldErrors } from 'react-hook-form'

export type GetTemplateListResponse = {
    data: Template[]
    total: number
}

export type GetTemplateDetailResponse = {
    data: Template
}

export type Filter = {
    purchasedProducts: string
    purchaseChannel: Array<string>
}

export type Template = {
    id: string
    name: string
    type: string
    template: {
        html: string | undefined
        css: string | undefined
        /* eslint-disable @typescript-eslint/no-explicit-any */
        json: any
    }
}

export type TemplateListState = {
    tableData: TableQueries
    filterData: Filter
    selectedTemplate: Partial<Template>[]
}

export type TemplateListAction = {
    setFilterData: (payload: Filter) => void
    setTableData: (payload: TableQueries) => void
    setSelectedTemplate: (checked: boolean, customer: Template) => void
    setSelectAllTemplate: (customer: Template[]) => void
}

export type Fields = {
    id?: string
    name: string
    type: string
    template: {
        html: string | undefined
        css: string | undefined
        /* eslint-disable @typescript-eslint/no-explicit-any */
        json: any
    }
    status?: string
    change_type?: string
    message?: string
}

export type TagsFields = {
    tags: Array<{ value: string; label: string }>
}

export type TemplateFormSchema = Fields

export type FormSectionBaseProps = {
    control: Control<TemplateFormSchema>
    errors: FieldErrors<TemplateFormSchema>
    readOnly?: boolean
}
