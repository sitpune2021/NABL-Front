import useSWR from 'swr'
import { apiGetCategoryById } from '@/services/CategoriesService'
import type { GetCategoryDetailResponse, Fields } from '@/@types/category'

export const useCategoryDetail = (id?: string) => {
    const swr = useSWR<GetCategoryDetailResponse>(
        id ? ['category-detail', id] : null,
        () => apiGetCategoryById(id!),
        {
            revalidateOnFocus: false,
        },
    )

    return {
        category: swr.data?.data as Fields | undefined,
        isLoading: swr.isLoading,
        error: swr.error,
        mutate: swr.mutate,
        data: swr.data?.data as Fields | undefined,
    }
}
