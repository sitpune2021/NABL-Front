import { apiCategory, apiGetCategoryList } from '@/services/CategoriesService'
import useSWR from 'swr'
import { useCategoryListStore } from '../store/listStore'
import type { TableQueries } from '@/@types/common'
import { Fields, GetCategoryListResponse } from '@/@types/category'

export default function useCategoryList() {
    const {
        tableData,
        filterData,
        setTableData,
        selectedCategory,
        setSelectedCategory,
        setSelectAllCategory,
        setFilterData,
    } = useCategoryListStore((state) => state)

    const { data, error, isLoading, mutate } = useSWR(
        ['/api/category', { ...tableData, ...filterData }],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, params]) =>
            apiGetCategoryList<GetCategoryListResponse, TableQueries>(params),
        {
            revalidateOnFocus: false,
        },
    )
    const saveCategoryData = async (category: Fields) => {
        await apiCategory(category)
        await mutate() // refresh list
    }

    const categoryList = data?.list || []

    const categoryListTotal = data?.total || 0

    return {
        categoryList,
        categoryListTotal,
        error,
        isLoading,
        tableData,
        filterData,
        mutate,
        setTableData,
        selectedCategory,
        setSelectedCategory,
        setSelectAllCategory,
        setFilterData,
        saveCategoryData,
    }
}
