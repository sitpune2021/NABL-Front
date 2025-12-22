import useSWR from 'swr'
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

    const swr = useSWR(
        [LIST_KEY, tableData],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, params]) =>
            apiGetCategoryList<GetCategoryListResponse, TableQueries>(params),
        {
            keepPreviousData: true,
            revalidateOnFocus: false,
            revalidateIfStale: false,
        },
    )

    return {
        categoryList: swr.data?.data ?? [],
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
