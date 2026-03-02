import type { ReactNode, CSSProperties } from 'react'

export interface CommonProps {
    id?: string
    className?: string
    children?: ReactNode
    style?: CSSProperties
}

export type TableQueries = {
    total?: number
    pageIndex?: number
    pageSize?: number
    query?: string
    sort?: {
        order: 'asc' | 'desc' | ''
        key: string | number
    }
}

export type TraslationFn = (
    key: string,
    fallback?: string | Record<string, string | number>,
) => string

export interface ActionButton {
    label: string
    icon?: React.ReactNode
    path: string
    disabled?: boolean
    action?: (
        event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
    ) => void
}

export interface ListActionToolsProps {
    buttons: ActionButton[]
}

export type IdentifierEntity = {
    identifier: string
}

export type PageMode =
    | 'add'
    | 'edit'
    | 'view'
    | 'data-entry'
    | 'editor'
    | 'editor-view'

export type Option = {
    label: string
    value: string | number
}
