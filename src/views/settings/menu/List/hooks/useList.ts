/* eslint-disable @typescript-eslint/no-explicit-any */
import useSWR from 'swr'
import type { TableQueries } from '@/@types/common'
import type { GetMenuListResponse } from '@/@types/menu'
import { useMenuListStore } from '../store/listStore'
import { apiGetMenuList } from '@/services/MenuService'

const LIST_KEY = 'menu-list'

const flatten = (items: any[], parentTitle = ''): any[] => {
    let result: any[] = []

    items.forEach((item) => {
        if (item.path) {
            result.push({
                id: String(item.id),
                name: item.title,
                title: item.title,
                identifier: item.key,
                path: item.path,
                parent: parentTitle || item.title,

                icon: item.icon ?? null,
                type: item.type ?? null,
            })
        }

        if (item.children && item.children.length) {
            result = result.concat(flatten(item.children, item.title))
        }
    })

    return result
}

export const useMenuList = () => {
    const {
        tableData,
        updateTable,
        selected,
        toggleRow,
        setAll,
        clearSelection,
    } = useMenuListStore()

    const swr = useSWR(
        [LIST_KEY, tableData.pageIndex, tableData.pageSize, tableData.query],
        async (): Promise<GetMenuListResponse> => {
            const res: any = await apiGetMenuList<any, TableQueries>(tableData)
            const tree = Array.isArray(res) ? res : (res?.data ?? [])

            let all = flatten(tree)

            if (tableData.query) {
                const q = tableData.query.toLowerCase()
                all = all.filter(
                    (m) =>
                        m.name.toLowerCase().includes(q) ||
                        m.identifier?.toLowerCase().includes(q) ||
                        m.path?.toLowerCase().includes(q) ||
                        m.parent?.toLowerCase().includes(q) ||
                        m.description?.toLowerCase().includes(q),
                )
            }

            all = all.sort((a, b) => a.parent.localeCompare(b.parent))

            const total = all.length

            return { data: all, total }
        },
        {
            revalidateOnFocus: false,
        },
    )

    return {
        menuList: swr.data?.data ?? [],
        total: swr.data?.total ?? 0,
        isLoading: swr.isLoading,
        error: swr.error,
        mutate: swr.mutate,

        tableData,
        updateTable,

        selected,
        toggleRow,
        setAll,
        clearSelection,
    }
}
