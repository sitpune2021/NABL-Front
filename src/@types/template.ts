import { TemplateFormSchema } from '@/schemas/template.schema'
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
    status: Array<string>
    type: Array<string>
}

export type Template = {
    id: string | number
    name: string
    type: string
    current_version: string
    is_current: boolean
    template: {
        html: string | undefined
        css: string | undefined
        /* eslint-disable @typescript-eslint/no-explicit-any */
        json: any
    }
    status?: 'published' | 'archived'
    appended_from_lab_id?: number | null
    parent_id?: number | null
}

export type TemplateListState = {
    tableData: TableQueries
    filterData: Filter
    selected: Partial<Template>[]
}

export type TemplateListActions = {
    updateTable: (payload: Partial<TableQueries>) => void
    updateFilters: (payload: Partial<Filter>) => void
    resetFilters: () => void
    toggleRow: (checked: boolean, row: Template) => void
    setAll: (rows: Template[]) => void
    clearSelection: () => void
    resetQuery: () => void
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
    appended_from_lab_id?: number | null
    parent_id?: number | null
}

export type TagsFields = {
    tags: Array<{ value: string; label: string }>
}

export type FormSectionBaseProps = {
    control: Control<TemplateFormSchema>
    errors: FieldErrors<TemplateFormSchema>
    readOnly?: boolean
}

export type SaveBoxSectionProps = {
    readOnly?: boolean
    loading?: boolean
    isEdit: boolean
    dialogIsOpen: boolean
    onDialogClose: () => void
    onSubmit: (values: TemplateFormSchema) => void
    isSubmiting: boolean
}
