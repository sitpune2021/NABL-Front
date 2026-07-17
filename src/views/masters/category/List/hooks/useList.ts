/* eslint-disable @typescript-eslint/no-explicit-any */
import useSWR from 'swr'
import { useEffect, useState } from 'react'
import { apiGetCategoryList } from '@/services/CategoriesService'
import type { TableQueries } from '@/@types/common'
import type { GetCategoryListResponse } from '@/@types/category'
import { initialTableData, useCategoryListStore } from '../store/listStore'

const LIST_KEY = 'category-list'
const CATEGORY_OPTIONS_KEY = 'category-options'

const mergeById = <T extends { id: string | number }>(items: T[]) =>
    Array.from(new Map(items.map((item) => [String(item.id), item])).values())

export const useCategoryList = () => {
    const {
        tableData,
        updateTable,
        selected,
        toggleRow,
        setAll,
        clearSelection,
    } = useCategoryListStore()
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
            setAllCategories((prev) =>
                mergeById([...prev, ...(swr.data?.data ?? [])]),
            )
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

export const useCategoryOptions = () => {
    const [tableData, setTableData] = useState<TableQueries>({
        ...initialTableData,
        pageSize: 20,
        query: '',
    })
    const [record, setRecord] = useState<GetCategoryListResponse['data']>([])

    const swr = useSWR(
        [CATEGORY_OPTIONS_KEY, tableData],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, params]) =>
            apiGetCategoryList<GetCategoryListResponse, TableQueries>(params),
        {
            revalidateOnFocus: false,
        },
    )

    useEffect(() => {
        if (!swr.data?.data) return

        const nextCategories = swr.data.data

        setRecord((prev) => {
            if (tableData.pageIndex === 1) {
                return mergeById(nextCategories)
            }

            return mergeById([...prev, ...nextCategories])
        })
    }, [swr.data, tableData.pageIndex])

    const updateTable = (payload: Partial<TableQueries>) => {
        setTableData((prev) => ({
            ...prev,
            ...payload,
        }))
    }

    return {
        categoryList: record,
        record,
        total: swr.data?.total ?? 0,
        hasMore: record.length < (swr.data?.total ?? 0),
        isLoading: swr.isLoading,
        error: swr.error,
        mutate: swr.mutate,
        tableData,
        updateTable,
    }
}
