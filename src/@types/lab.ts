/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Control, FieldErrors } from 'react-hook-form'
import { TableQueries } from './common'
import { LabFormSchema } from '@/schemas/lab.schema'

export type ContactField = {
    type: string
    value: string
    label?: 'primary' | 'alternate'
    is_primary?: boolean
}

export type LocationField = {
    id?: string
    prefix: string
    shortName: string
    zone_id: string | number
    cluster_id: string | number
    location_id: string | number
    instruments: (string | number)[]
    departments: {
        name: string | number
        instruments: (string | number)[]
    }[]
    emails: ContactField[]
    phones: ContactField[]
}

export type Lab = {
    id?: string
    name: string
    lab_type: string
    lab_code: string
    location_limit: number | string
    user_limit: number | string
    emails: ContactField[]
    phones: ContactField[]
    location: LocationField[]
    standard_id?: number | null
    selectedClauses?: string[]
    documents: (string | number)[]
}

export type GetLabListResponse = {
    data: Lab[]
    total: number
}

export type GetLabDetailResponse = {
    data: Lab
}

export type LabListState = {
    tableData: TableQueries
    selected: Lab[]
}

export type LabListActions = {
    updateTable: (payload: Partial<TableQueries>) => void
    toggleRow: (checked: boolean, row: Lab) => void
    setAll: (rows: Lab[]) => void
    clearSelection: () => void
    resetQuery: () => void
}

export type FormSectionBaseProps = {
    control: Control<LabFormSchema>
    errors: FieldErrors<LabFormSchema>
    readOnly?: boolean
    setValue?: any
}
