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
    name: string
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
    prefix: string
    shortName: string
    zone_name: string | null
    cluster_name: string | null
    location_name: string | null
    department: string | null
}

export type Fields = {
    id?: string
    name: string
    labType: string
    department: string[]
    labCode: string
    emails?: { value: string | undefined }[] // or string[] if you prefer plain strings
    phones?: { value: string | undefined }[]
    address?: string
    location: LocationField[]
    zone_name?: string[]
    cluster_name?: string[]
    location_name?: string[]
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
