import {
    apiCategory,
    apiGetCategoryList,
    apiGetCategoryById,
    apiUpdateCategory,
} from '@/services/CategoriesService'
import useSWR from 'swr'
import { useCategoryListStore } from '../store/listStore'
import type { TableQueries } from '@/@types/common'
import type { Fields, GetCategoryListResponse } from '@/@types/category'

export default function useCategoryList() {
    const {
        tableData,
        setTableData,
        selectedCategory,
        setSelectedCategory,
        setSelectAllCategory,
    } = useCategoryListStore((state) => state)

    const { data, error, isLoading, mutate } = useSWR(
        ['/api/category', { ...tableData }],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, params]) =>
            apiGetCategoryList<GetCategoryListResponse, TableQueries>(params),
        {
            revalidateOnFocus: false,
        },
    )
    const saveCategoryData = async (category: Fields) => {
        if (category.id) {
            await apiUpdateCategory(category.id, category)
        } else {
            await apiCategory(category)
        }
        await mutate() // refresh list
    }

    const getCategoryById = async (id: string): Promise<Fields> => {
        const response = await apiGetCategoryById(id)
        return response
    }

    const categoryList = data?.data || []

    const categoryListTotal = data?.total || 0

    return {
        categoryList,
        categoryListTotal,
        error,
        isLoading,
        tableData,
        mutate,
        setTableData,
        selectedCategory,
        setSelectedCategory,
        setSelectAllCategory,
        saveCategoryData,
        getCategoryById, // ✅ Now defined properly
    }
}
