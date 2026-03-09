/* eslint-disable @typescript-eslint/no-explicit-any */
import useSWR from 'swr'
import { apiGetLabSubCategories } from '@/services/SubCategoryService'

interface Params {
    id?: number
    catId?: number
    start_date?: string | null
    end_date?: string | null
}

const useLabSubCategories = (params: Params) => {
    const shouldFetch = !!params?.id && !!params?.catId

    const LIST_KEY = shouldFetch
        ? `lab-subcat-detail-${params.id}-${params.catId}-${params.start_date}-${params.end_date}`
        : null // 👈 prevents API call

    const swr = useSWR(
        shouldFetch ? [LIST_KEY, params] : null,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, queryParams]) => apiGetLabSubCategories<any, any>(queryParams),
        {
            revalidateOnFocus: false,
        },
    )

    return {
        isLoading: swr.isLoading,
        error: swr.error,
        mutate: swr.mutate,
        data: swr.data?.data ?? [],
    }
}

export default useLabSubCategories
