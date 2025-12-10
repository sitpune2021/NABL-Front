/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    apiCategory,
    apiGetCategoryList,
    apiGetCategoryById,
    apiUpdateCategory,
} from '@/services/CategoriesService'
import useSWR from 'swr'
import { useCategoryListStore } from '../store/listStore'
import type { TableQueries } from '@/@types/common'
import {
    Fields,
    GetCategoryListResponse,
    GetCategoryDetailResponse,
} from '@/@types/category'

export default function useCategoryList(categoryId?: string) {
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

    const {
        data: detailData,
        error: detailError,
        isLoading: isDetailLoading,
        mutate: mutateDetail,
    } = useSWR<GetCategoryDetailResponse>(
        categoryId ? `/api/category/${categoryId}` : null,
        () => apiGetCategoryById(categoryId!),
        { revalidateOnFocus: false },
    )
    const getCategoryById = async (id: string): Promise<Fields> => {
        const response = await apiGetCategoryById(id)
        return response.data || response
    }

    const saveCategoryData = async (category: Fields) => {
        let savedData: any
        if (category.id) {
            /* eslint-disable @typescript-eslint/no-unused-vars */
            const { id, ...categoryWithoutId } = category
            savedData = await apiUpdateCategory(category.id, categoryWithoutId)
        } else {
            savedData = await apiCategory(category)
        }
        await mutate()

        if (category.id && mutateDetail) {
            mutateDetail({ data: savedData }, false)
        }

        return savedData
    }

    const categoryList = data?.data || []
    const categoryListTotal = data?.total || 0

    const categoryDetail = detailData?.data || {
        name: '',
        identifier: '',
    }

    return {
        categoryList,
        categoryListTotal,
        error,
        isLoading,
        categoryDetail,
        isDetailLoading,
        detailError,
        mutateDetail,
        tableData,
        mutate,
        setTableData,
        selectedCategory,
        setSelectedCategory,
        setSelectAllCategory,
        saveCategoryData,
        getCategoryById,
    }
}
