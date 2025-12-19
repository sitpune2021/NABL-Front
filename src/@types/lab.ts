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
    zone_name: string | number
    cluster_name: string | number
    location_name: string | number
    instruments: (string | number)[]
    departments: {
        name: string | number
        instruments: (string | number)[]
    }[]
    emails: ContactField[]
    phones: ContactField[]
    address?: string
}

export type Lab = {
    id?: string
    name: string
    labType: string
    labCode: string
    emails: ContactField[]
    phones: ContactField[]
    address?: string
    location: LocationField[]
}

export type GetLabListResponse = {
    data: Lab[]
    total: number
}

export type GetLabDetailResponse = {
    data: Lab
}

export type Filter = {
    purchasedProducts: string
    purchaseChannel: string[]
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

export type FormSectionBaseProps = {
    control: Control<LabFormSchema>
    errors: FieldErrors<LabFormSchema>
    readOnly?: boolean
    setValue?: any
}
