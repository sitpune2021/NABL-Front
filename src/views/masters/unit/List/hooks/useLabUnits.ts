/* eslint-disable @typescript-eslint/no-explicit-any */
import useSWR from 'swr'
import { apiGetLabMasterUnits } from '@/services/UnitService'

const useLabUnits = (params: any) => {
    const shouldFetch = !!params?.id

    const LIST_KEY = shouldFetch
        ? `lab-unit-detail-${params.id}-${params.start_date}-${params.end_date}`
        : null

    const swr = useSWR(
        shouldFetch ? [LIST_KEY, params] : null,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, queryParams]) => apiGetLabMasterUnits<any, any>(queryParams),
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

export default useLabUnits
