/* eslint-disable @typescript-eslint/no-explicit-any */
import useSWR from 'swr'
import { useEffect, useState } from 'react'
import { apiGetPrefixConfigList } from '@/services/prefixConfigService'
import type { TableQueries } from '@/@types/common'
import type { GetPrefixConfigListResponse } from '@/@types/prefixConfig'
import { usePrefixConfigListStore } from '../store/listStore'

const LIST_KEY = 'prefixConfig-list'
export const usePrefixConfigList = () => {
    const {
        tableData,
        updateTable,
        selected,
        toggleRow,
        setAll,
        clearSelection,
    } = usePrefixConfigListStore()
    //   holds accumulated data for dropdown
    const [allCategories, setAllCategories] = useState<any[]>([])

    const swr = useSWR(
        [LIST_KEY, tableData],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, params]) =>
            apiGetPrefixConfigList<GetPrefixConfigListResponse, TableQueries>(
                params,
            ),
        {
            revalidateOnFocus: false,
        },
    )
    useEffect(() => {
        if (!swr.data?.data) return

        if (tableData.pageIndex === 1) {
            // first page → reset list
            setAllCategories(swr.data.data)
        } else {
            setAllCategories((prev) => [...prev, ...(swr.data?.data ?? [])])
        }
    }, [swr.data, tableData.pageIndex])
    const hasMore = allCategories.length < (swr.data?.total ?? 0)

    return {
        prefixConfigList: swr.data?.data ?? [],
        total: swr.data?.total ?? 0,
        hasMore,
        isLoading: swr.isLoading,
        error: swr.error,
        mutate: swr.mutate,

        tableData,
        updateTable,

        selected,
        toggleRow,
        setAll,
        clearSelection,
        record: allCategories,
    }
}
