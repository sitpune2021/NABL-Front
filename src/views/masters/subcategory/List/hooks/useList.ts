import { apiGetSubCategoryList } from '@/services/SubCategoryService'
import useSWR from 'swr'
import { useSubCategoryListStore } from '../store/listStore'
import type { TableQueries } from '@/@types/common'
import { GetSubCategoryListResponse } from '@/@types/subcategory'
import { LIST_KEY } from '@/constants/sub_category.constant'

export default function useSubCategoryList() {
    const {
        filterData,
        updateFilters,
        resetFilters,
        tableData,
        updateTable,
        selected,
        toggleRow,
        setAll,
        clearSelection,
    } = useSubCategoryListStore()

    const swr = useSWR(
        [LIST_KEY, { ...tableData, ...filterData }],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, params]) =>
            apiGetSubCategoryList<GetSubCategoryListResponse, TableQueries>(
                params,
            ),
        {
            keepPreviousData: true,
            revalidateOnFocus: false,
            revalidateIfStale: false, // <--- disables auto revalidation
        },
    )

    return {
        subcategoryList: swr.data?.data ?? [],
        total: swr.data?.total ?? 0,
        isLoading: swr.isLoading,
        error: swr.error,
        mutate: swr.mutate,

        tableData,
        updateTable,

        filterData,
        updateFilters,
        resetFilters,

        selected,
        toggleRow,
        setAll,
        clearSelection,
    }
}
