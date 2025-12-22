import useSWR from 'swr'
import { Fields, GetSubCategoryDetailResponse } from '@/@types/subcategory'
import { apiGetSubCategoryById } from '@/services/SubCategoryService'

export const useSubCategoryDetail = (id?: string) => {
    const swr = useSWR<GetSubCategoryDetailResponse>(
        id ? ['sub-category-detail', id] : null,
        () => apiGetSubCategoryById(id!),
        { revalidateOnFocus: false },
    )

    return {
        subCategory: swr.data?.data as Fields | undefined,
        isLoading: swr.isLoading,
        error: swr.error,
        mutate: swr.mutate,
    }
}
