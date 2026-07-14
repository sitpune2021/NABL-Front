/* eslint-disable @typescript-eslint/no-explicit-any */
import { Option, TableQueries } from './common'

import type { Control, FieldErrors, UseFormSetValue } from 'react-hook-form'
import { Department } from './department'
import { Category } from './category'
import { Template as TemplateSh } from './template'
import { DocumentFormSchema } from '@/schemas/document.schema'

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

export interface FrequencyProps {
    isOpen: boolean
    initialData?: any
    control: any
    errors?: FieldErrors<any>
    setValue: UseFormSetValue<any>
    onClose: () => void
    onConfirm: () => void // ✅ NEW
    readOnly?: boolean
    isEdit?: boolean
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
    mode: string
    category_id?: string
    name: string
    status: string
    current_version: {
        id: number
        schedule: any
        full_version: string
        workflow_state: string
        workflow_logs?: Array<{
            id: number
            step_type: string
            step_status: string
            performed_by: string
            performed_date: string
        }>
    }
    category?: {
        name?: string
    }
    editor?: any
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
    mode: 'create' | 'upload'
    category_id?: string | number
    department?: string[]
    number?: string // documentNo
    name: string // documentName
    status?: 'controlled' | 'uncontrolled'

    header?: {
        template_id: string | number
        type: string
        current_version: string
    }
    footer?: {
        template_id: string | number
        type: string
        current_version: string
    }
    copy_no?: string
    quantity_prepared?: string | number

    workflow_state?: string
    step_type?: string
    performed_by?: string
    performed_date?: string
    effective_date?: string

    review_frequency?: string
    notification_unit?: string
    notification_value?: number | string

    editor_schema?: {
        html: string
        css: string
        json: string
    }
    form_fields?: any
    issued_by?: string
    issue_date?: string
    amendment_no?: string
    amendment_date?: string
    schedule?: FrequencyConfig
    amendment_type?: string
    amendment_reason?: string
}

export type TagsFields = {
    tags: Array<Option>
}

export type EditorFormSchema = {
    documentId: string
    document: {
        html: string
        css: string
        json: any
    }
}

export type FormSectionBaseProps = {
    readOnly?: boolean
    departmentList: Department[]
    categoryList: Category[]
    categoryOptions?: Option[]
    isCategoryLoading?: boolean
    hasMoreCategories?: boolean
    onLoadMoreCategories?: () => void
    templateList: TemplateSh[]
    isEdit: boolean
}

export type DocumentResolved = Document & {
    genericDate?: string
    subcategory?: string
    userName?: string
    user?: string

    // userDetails fields
    name?: string
    role?: string
    type?: string
    email?: string
    phone?: string
}

export interface ThDetail {
    headerText: string
    traits: Trait[]
}

export interface TextBlockDetail {
    componentType: 'text-block'
    tagName: string
    headerText: string
    content: string
    mode: 'dynamic' | 'static'
    traits: Trait[]
}

export interface CategorizedDetails {
    daily: (ThDetail | TextBlockDetail)[]
    oneTime: TextBlockDetail[]
}

export function categorizeThDetails(components: any): CategorizedDetails {
    const daily: any[] = []
    const oneTime: any[] = []

    const extractTraits = (comp: any): Trait[] =>
        (comp.get?.('traits') || comp.traits || []).map((t: any) => {
            const value =
                t.get?.('value') ??
                t.attributes?.value ??
                t.default ??
                t.attributes?.default ??
                ''
            return {
                name: t.get?.('name') ?? t.name,
                value:
                    value === ''
                        ? (t.default ?? t.attributes?.default ?? '')
                        : value,
            }
        })

    const extractHeaderText = (comp: any): string => {
        const inner = comp.components?.() || comp.components || []
        const child = inner.find(
            (c: any) =>
                ['span'].includes(c.get?.('tagName') || c.tagName) ||
                ['text'].includes(c.get?.('type') || c.type),
        )
        return (child?.view?.el?.innerText || 'text').trim()
    }

    const traverse = (components: any): any[] => {
        const models = components?.models || components || []
        const result: any[] = []

        for (const comp of models) {
            const tag = comp.get?.('tagName') || comp.tagName
            const type = comp.get?.('type') || comp.type
            const inner = comp.components?.() || comp.components || []

            if (tag === 'th') {
                result.push({
                    headerText: extractHeaderText(comp),
                    traits: extractTraits(comp),
                })
            }

            if (type === 'text-block') {
                const traits = extractTraits(comp)
                const traitMap = Object.fromEntries(
                    traits.map((t) => [t.name, t.value]),
                )
                const mode = traitMap.mode ?? 'static'

                if (mode === 'dynamic') {
                    result.push({
                        componentType: 'text-block',
                        tagName: tag || 'p',
                        headerText: traitMap.label?.trim() || '',
                        content: (
                            comp.get?.('content') ||
                            comp.content ||
                            ''
                        ).trim(),
                        traits,
                        mode: 'dynamic',
                    })
                }
            }

            if (inner.length) result.push(...traverse(inner))
        }

        return result
    }

    const all = traverse(components)

    all.forEach((item) =>
        item.componentType === 'text-block' && item.mode === 'dynamic'
            ? oneTime.push(item)
            : daily.push(item),
    )

    return { daily, oneTime }
}

export type FormFieldType =
    | 'text'
    | 'number'
    | 'select'
    | 'multiSelect'
    | 'date'
    | 'time'
    | 'header'
    | 'footer'
    | 'checkbox'
    | 'switch'

export interface FormFieldConfig {
    name: string
    label: string
    type: FormFieldType
    minDate?: any
    placeholder?: string
    options?: Option[]
    isLoading?: boolean
    hasMore?: boolean
    onLoadMore?: () => void
    readOnly?: boolean
    condition?: (values: any) => boolean // conditional rendering
    customRender?: (field: any, formValues: any, extraProps?: any) => any
    onChange?: (value: any) => void
    defaultValue?: any
}

export type TemplateOption = Option & {
    html: string
    css: string
}

export interface EditorSectionProps {
    control: Control<any>
    errors: any
    readOnly: boolean
    setValue: UseFormSetValue<any>
    documentData?: DocumentFormSchema | null
    isEdit?: boolean
    getTemplateById: any
    defaultValues?: any
    loading?: boolean
}

export interface TemplatePart {
    html: string | undefined
    json: any | undefined
    css: string | undefined
}

export interface Template {
    header: TemplatePart
    footer: TemplatePart
    section?: TemplatePart
}

export type DocumentFormProps = {
    onFormSubmit: (values: DocumentFormSchema) => void
    defaultValues: DocumentFormSchema
    readOnly?: boolean
    isEdit?: boolean
    isForEditor?: boolean
    isForEditorView?: boolean
    loading?: boolean
    isSubmitting?: boolean
}
