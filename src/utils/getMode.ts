import { PageMode } from '@/@types/common'

export const getMode = (pathname: string): PageMode => {
    if (pathname.includes('/edit')) return 'edit'
    if (pathname.includes('/view')) return 'view'
    if (pathname.includes('/editor')) return 'editor'
    if (pathname.includes('/data-entry')) return 'data-entry'
    return 'add'
}
