/* eslint-disable @typescript-eslint/no-explicit-any */
import useSWR from 'swr'
import { apiGetNavigationItemsList } from '@/services/NavigationItemsService'
import { useSessionUser } from '@/store/authStore'

function unescapePath(path: string | null | undefined): string | null {
    if (typeof path !== 'string') return path ?? ''
    return path.replace(/\\\//g, '/')
}

function cleanNavigationItems(items: any[]): any[] {
    return items.map((item) => {
        const cleanedItem: any = {}

        for (const key in item) {
            const value = item[key]

            if (key === 'path') {
                cleanedItem.path = unescapePath(value)
            } else if (key === 'children') {
                cleanedItem.subMenu = Array.isArray(value)
                    ? cleanNavigationItems(value)
                    : []
            } else if (key === 'translate_key') {
                if (value !== null) {
                    cleanedItem.translateKey = value
                }
            } else if (value !== null) {
                cleanedItem[key] = value
            }
        }
        if (!('subMenu' in cleanedItem)) {
            cleanedItem.subMenu = []
        }
        return cleanedItem
    })
}

export default function useNavigationItemsList() {
    const activeRole = useSessionUser((state) => state.activeRole)

    const { data, error, isLoading, mutate } = useSWR(
        activeRole ? ['/api/v1/navigation-items', activeRole?.id] : null, // 👈 BLOCK
        () => apiGetNavigationItemsList<any>(),
        {
            revalidateOnFocus: false,
        },
    )

    const navigationItems = data ? cleanNavigationItems(data) : []

    return {
        navigationItems,
        error,
        isLoading,
        mutate,
    }
}
