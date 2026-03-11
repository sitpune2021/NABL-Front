/* eslint-disable @typescript-eslint/no-explicit-any */
import useSWR from 'swr'
import { apiGetLabMasterDepartments } from '@/services/DepartmentService'

const useLabDepartments = (params: any) => {
    const shouldFetch = !!params?.id

    const LIST_KEY = shouldFetch
        ? `lab-dep-detail-${params.id}-${params.start_date}-${params.end_date}`
        : null

    const swr = useSWR(
        shouldFetch ? [LIST_KEY, params] : null,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, queryParams]) => apiGetLabMasterDepartments<any, any>(queryParams),
        {
            revalidateOnFocus: false,
        },
    )

    return {
        isLoading: swr.isLoading,
        error: swr.error,
        mutate: swr.mutate,
        data: swr.data?.data,
    }
}

export default useLabDepartments
