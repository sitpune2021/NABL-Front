import { IdentifierEntity, TableQueries } from './common'

export type PrefixConfigSegmentType =
    | 'any'
    | 'letters'
    | 'numbers'
    | 'alphanumeric'

export type PrefixConfigCase = 'any' | 'upper' | 'lower' | 'title'

export type PrefixConfigStartsWith = 'any' | 'letter' | 'number'

export type PrefixConfigSegmentRule = {
    type: PrefixConfigSegmentType
    case: PrefixConfigCase
    min_length: number
    max_length: number
    starts_with: PrefixConfigStartsWith
}

export type PrefixConfigMaster = {
    master_key: string
    master_name: string
}

export type GetPrefixConfigListResponse = {
    data: PrefixConfig[]
    total?: number
}

export type GetPrefixConfigDetailResponse = {
    data: Fields
    success?: boolean
}

export type GetPrefixConfigMastersResponse = {
    success: boolean
    data: PrefixConfigMaster[]
}

export type ValidatePrefixConfigValueRequest = {
    master_key: string
    value: string
}

export type ValidatePrefixConfigValueResponse = {
    success: boolean
    errors: string[]
}

export type PrefixConfig = {
    id: string
    master_key: string
    master_name: string
    separator: string
    segment_count: number
    value_min_length: number
    value_max_length: number
    characters_min_length: number
    characters_max_length: number
    segments: PrefixConfigSegmentRule[]
    is_active: boolean
    created_at?: string
    updated_at?: string
} & Partial<IdentifierEntity>

export type Fields = {
    id?: string
    master_key: string
    master_name?: string
    separator?: string
    segment_count: number
    value_min_length?: number
    value_max_length?: number
    characters_min_length?: number
    characters_max_length?: number
    segments?: PrefixConfigSegmentRule[]
    is_active?: boolean
}

export type TagsFields = {
    tags: Array<{ value: string; label: string }>
}

export type PrefixConfigListState = {
    tableData: TableQueries
    selected: PrefixConfig[]
}

export type PrefixConfigListActions = {
    updateTable: (payload: Partial<TableQueries>) => void
    toggleRow: (checked: boolean, row: PrefixConfig) => void
    setAll: (rows: PrefixConfig[]) => void
    clearSelection: () => void
    resetQuery: () => void
}
