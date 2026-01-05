import { PageMode } from '@/@types/common'

export const getMode = (pathname: string): PageMode => {
    if (pathname.includes('/editor-view')) return 'editor-view'
    if (pathname.includes('/data-entry')) return 'data-entry'
    if (pathname.includes('/editor')) return 'editor'
    if (pathname.includes('/view')) return 'view'
    if (pathname.includes('/edit')) return 'edit'
    return 'add'
}
