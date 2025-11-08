import { PrefixFEntity, TableQueries } from './common'

import type { Control, FieldErrors } from 'react-hook-form'

export type GetInstrumentListResponse = {
    data: Instrument[]
    total?: number
}

export type Filter = {
    purchasedProducts: string
    purchaseChannel: Array<string>
}

export type Instrument = {
    id: string
    full_name: string
    short_name: string
    manufacture: string
    serial_number: string
} & PrefixFEntity

export type InstrumentListState = {
    tableData: TableQueries
    filterData: Filter
    selectedInstrument: Partial<Instrument>[]
}

export type InstrumentListAction = {
    setFilterData: (payload: Filter) => void
    setTableData: (payload: TableQueries) => void
    setSelectedInstrument: (checked: boolean, customer: Instrument) => void
    setSelectAllInstrument: (customer: Instrument[]) => void
}

export type Fields = {
    id?: string
    full_name: string
    short_name: string
    manufacture: string
    serial_number: string
} & PrefixFEntity

export type TagsFields = {
    tags: Array<{ value: string; label: string }>
}

export type InstrumentFormSchema = Fields

export type FormSectionBaseProps = {
    control: Control<InstrumentFormSchema>
    errors: FieldErrors<InstrumentFormSchema>
    readOnly?: boolean
}
