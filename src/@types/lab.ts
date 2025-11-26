import { TableQueries } from './common'
import type { Control, FieldErrors } from 'react-hook-form'

export type GetLabListResponse = {
    list: Lab[]
    total: number
}

export type Filter = {
    purchasedProducts: string
    purchaseChannel: string[]
}

export type Lab = {
    id: string
    prefix: string
    name: string
    labType: string
    labCode: string
    shortName: string
    zone_name: string | null
    cluster_name: string | null
    location_name: string | null
    instruments: (string | number)[]
    departments: {
        name: string
        instruments: (string | number)[]
    }[]
    emails: { value: string }[]
    phones: { value: string }[]
    address?: string
}

export type LabListState = {
    tableData: TableQueries
    filterData: Filter
    selectedLab: Partial<Lab>[]
}

export type LabListAction = {
    setFilterData: (payload: Filter) => void
    setTableData: (payload: TableQueries) => void
    setSelectedLab: (checked: boolean, lab: Lab) => void
    setSelectAllLab: (labs: Lab[]) => void
}

export type LocationField = {
    id?: string
    prefix: string
    shortName: string
    zone_name: string | null
    cluster_name: string | null
    location_name: string | null
    instruments: (string | number)[]
    departments: {
        name: string
        instruments: (string | number)[]
    }[]
    emails: { value: string }[]
    phones: { value: string }[]
    address?: string
}

export type Fields = {
    id?: string
    name: string
    labType: string
    department: string[] // Kept as string[] based on your provided type, though schema suggests it might be a single string; adjust if needed
    labCode: string
    emails: { value: string }[]
    phones: { value: string }[]
    address?: string
    location: LocationField[]
}

export type TagsFields = {
    tags: Array<{ value: string; label: string }>
}

export type LabFormSchema = Fields

export type FormSectionBaseProps = {
    control: Control<LabFormSchema>
    errors: FieldErrors<LabFormSchema>
    readOnly?: boolean
}
