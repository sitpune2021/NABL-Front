import { IdentifierEntity, TableQueries } from './common'
import type { Control, FieldErrors } from 'react-hook-form'

export type GetZoneListResponse = {
    data: Zone[]
    total?: number
}

export interface GetZoneDetailResponse {
    data: Zone
}

export type Zone = {
    id: string
    name: string
} & IdentifierEntity

export type ZoneListState = {
    tableData: TableQueries
    selectedZone: Partial<Zone>[]
}

export type ZoneListAction = {
    setTableData: (payload: TableQueries) => void
    setSelectedZone: (checked: boolean, zone: Zone) => void
    setSelectAllZone: (zones: Zone[]) => void
}

export type Fields = {
    id?: string
    name: string
} & IdentifierEntity

export type TagsFields = {
    tags: Array<{ value: string; label: string }>
}

export type ZoneFormSchema = Fields

export type FormSectionBaseProps = {
    control: Control<ZoneFormSchema>
    errors: FieldErrors<ZoneFormSchema>
    readOnly?: boolean
}
