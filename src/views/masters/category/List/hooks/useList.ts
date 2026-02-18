/* eslint-disable @typescript-eslint/no-explicit-any */
import useSWR from 'swr'
import { useEffect, useState } from 'react'
import { apiGetCategoryList } from '@/services/CategoriesService'
import type { TableQueries } from '@/@types/common'
import type { GetCategoryListResponse } from '@/@types/category'
import { useCategoryListStore } from '../store/listStore'

const LIST_KEY = 'category-list'
export const useCategoryList = () => {
    const {
        tableData,
        updateTable,
        selected,
        toggleRow,
        setAll,
        clearSelection,
    } = useCategoryListStore()
    //   holds accumulated data for dropdown
    const [allCategories, setAllCategories] = useState<any[]>([])

    const swr = useSWR(
        [LIST_KEY, tableData],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, params]) =>
            apiGetCategoryList<GetCategoryListResponse, TableQueries>(params),
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
        categoryList: swr.data?.data ?? [],
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
