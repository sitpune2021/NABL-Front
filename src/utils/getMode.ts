import { PageMode } from '@/@types/common'

export const getMode = (pathname: string): PageMode => {
    if (pathname.includes('/edit')) return 'edit'
    if (pathname.includes('/view')) return 'view'
    return 'add'
}
