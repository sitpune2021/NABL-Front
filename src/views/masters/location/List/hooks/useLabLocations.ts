/* eslint-disable @typescript-eslint/no-explicit-any */
import useSWR from 'swr'
import { apiGetLabMasterLocation } from '@/services/LocationService'

interface Params {
    id?: number
    zoneId?: number
    clusterId?: number
    start_date?: string | null
    end_date?: string | null
}

const useLabLocations = (params: Params) => {
    const shouldFetch = !!params?.id && !!params?.zoneId && !!params?.clusterId

    const LIST_KEY = shouldFetch
        ? `lab-location-detail-${params.id}-${params.zoneId}-${params.clusterId}-${params.start_date}-${params.end_date}`
        : null // prevent API call

    const swr = useSWR(
        shouldFetch ? [LIST_KEY, params] : null,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, queryParams]) => apiGetLabMasterLocation<any, any>(queryParams),
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

export default useLabLocations
