/* eslint-disable @typescript-eslint/no-explicit-any */
import { TableQueries } from './common'

import type { Control, FieldErrors, UseFormSetValue } from 'react-hook-form'
import { z } from 'zod'
import { Department } from './department'
import { Category } from './category'
import { Template as TemplateSh } from './template'

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
    initialData?: any
    control: Control<any>
    errors?: FieldErrors<any>
    setValue: UseFormSetValue<any>
    onClose: () => void
    onConfirm: () => void // ✅ NEW
    readOnly?: boolean
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
        id: string
        schedule: any
        full_version: string
    }
    category?: {
        name?: string
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
    mode: 'create' | 'upload'
    category_id?: string
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
}

export type TagsFields = {
    tags: Array<{ value: string; label: string }>
}

export type DocumentFormSchema = Fields | Document

export type EditorFormSchema = {
    documentId: string
    document: {
        html: string
        css: string
        json: any
    }
}

export type FormSectionBaseProps = {
    control: Control<DocumentFormSchema>
    errors: FieldErrors<DocumentFormSchema>
    readOnly?: boolean
    setValue: UseFormSetValue<DocumentFormSchema>
    departmentList: Department[]
    categoryList: Category[]
    templateList: TemplateSh[]
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
        (comp.get?.('traits') || comp.traits || []).map((t: any) => ({
            name: t.get?.('name') ?? t.name,
            value:
                t.get?.('value') ??
                t.attributes?.value ??
                t.attributes?.default ??
                t.default ??
                '',
        }))

    const extractHeaderText = (comp: any): string => {
        const inner = comp.components?.() || comp.components || []
        const child = inner.find(
            (c: any) =>
                ['span'].includes(c.get?.('tagName') || c.tagName) ||
                ['text'].includes(c.get?.('type') || c.type),
        )
        return (
            child?.get?.('content') ??
            child?.view?.el?.innerText ??
            child?.content ??
            ''
        ).trim()
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

export const documentFormSchema = z.object({
    // From documentFieldOne
    mode: z.enum(['create', 'upload']).optional(),
    category_id: z.union([
        z.string().min(1, 'Category is required'),
        z.number(),
    ]),
    department: z.array(z.union([z.string(), z.number()])).optional(),
    number: z.string(),
    name: z.string().min(1, 'Document Name is required'),
    status: z.enum(['controlled', 'uncontrolled']),

    // From documentFieldTwo
    header: z
        .object({
            template_id: z.union([z.string(), z.number()]),
            type: z.literal('header'),
            current_version: z.string(),
        })
        .optional(),
    footer: z
        .object({
            template_id: z.union([z.string(), z.number()]),
            type: z.literal('footer'),
            current_version: z.string(),
        })
        .optional(),
    copy_no: z.string().optional(),
    quantity_prepared: z
        .union([z.string(), z.number()])
        .optional()
        .refine((val) => !val || Number(val) >= 0, {
            message: 'Quantity must be a positive number',
        }),

    // From documentFieldThree
    workflow_state: z.string(),
    step_type: z.string(),
    performed_by: z.string(),
    performed_date: z.string(), // can add date parsing later if needed
    effective_date: z.string().min(1, 'Effective Date is required'),
    review_frequency: z.enum(
        ['Weekly', 'Monthly', 'Yearly'],
        'Select frequency',
    ),
    notification_unit: z.string(),
    notification_value: z
        .union([z.string(), z.number()])
        .refine((val) => !val || Number(val) > 0, {
            message: 'Duration Value must be positive',
        }),
    editor_schema: z.any(),
    schedule: z.any(),
    form_fields: z.any(),
})

export const editorSchema = z.object({
    documentId: z.string().min(1, 'Document ID is required'),
    document: z.any(),
})

export type DocumentFormValidationSchema = z.infer<typeof documentFormSchema>
export type EditorFormValidationSchema = z.infer<typeof editorSchema>

// types.ts
export type Option = { value: string; label: string }

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
    readOnly?: boolean
    condition?: (values: any) => boolean // conditional rendering
    customRender?: (field: any, formValues: any, extraProps?: any) => any
    onChange?: (value: any) => void
    defaultValue?: any
}

export type TemplateOption = {
    value: string
    label: string
    html: string
    css: string
}

export type DepartmentOption = {
    label: string
    value: string
}

export interface GrapesEditorProps {
    control: Control<any>
    errors: any
    readOnly: boolean
    setValue: UseFormSetValue<any>
    documentData?: DocumentFormSchema | null
    isEdit?: boolean
    getTemplateById: any
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
