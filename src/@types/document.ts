/* eslint-disable @typescript-eslint/no-explicit-any */
import { TableQueries } from './common'

import type { Control, FieldErrors, UseFormSetValue } from 'react-hook-form'
import { z } from 'zod'

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
    triates: { daily: Field[]; oneTime: Field[] }
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
    mode: string
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
    mode: string
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
        json: any
    }
}

export type FormSectionBaseProps = {
    control: Control<DocumentFormSchema | EditorFormSchema>
    errors: FieldErrors<DocumentFormSchema & EditorFormSchema>
    readOnly?: boolean
    setValue: UseFormSetValue<DocumentFormSchema | EditorFormSchema>
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
    mode: z.string().optional(),
    labName: z.string().min(1, 'Lab Name is required'),
    location: z.string().optional(),
    department: z.array(z.union([z.string(), z.number()])).optional(),
    header: z.union([z.string(), z.number()]).optional(),
    footer: z.union([z.string(), z.number()]).optional(),
    category: z.string().optional(),
    documentName: z.string().min(1, 'Document Name is required'),
    documentNo: z.string().optional(),
    issuedNo: z.string().optional(),
    amendmentNo: z.string().optional(),
    copyNo: z.string().optional(),
    date: z.string().optional(),
    preparedByDate: z.string().optional(),
    time: z.string().optional(),
    preparedBy: z.string().optional(),
    quantityPrepared: z
        .union([z.string(), z.number()])
        .optional()
        .refine((val) => !val || Number(val) >= 0, {
            message: 'Quantity must be a positive number',
        }),
    approvedBy: z.string().optional(),
    issuedBy: z.string().optional(),
    issueDate: z.string().optional(),
    amendmentDate: z.string().optional(),
    effectiveDate: z.string().min(1, 'Effective Date is required'),
    frequency: z.string().optional(),
    duration: z.string().optional(),
    durationUnit: z.string().optional(),
    durationValue: z.string().optional(),
    prefix: z.string().optional(),
    status: z.enum(['Controlled', 'Uncontrolled']).optional(),
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

export interface FormFieldConfig {
    name: string
    label: string
    type: FormFieldType
    minDate?: any
    placeholder?: string
    options?: Option[]
    readOnly?: boolean
    condition?: (values: any) => boolean // conditional rendering
    customRender?: (
        field: any,
        formValues: any,
        extraProps?: any,
    ) => JSX.Element
    onChange?: (value: any) => void
}
