/* eslint-disable @typescript-eslint/no-explicit-any */
import useSWR from 'swr'
import { apiGetLabMasterCluster } from '@/services/ClusterService'

interface Params {
    id?: number
    zoneId?: number
    start_date?: string | null
    end_date?: string | null
}

const useLabClusters = (params: Params) => {
    const shouldFetch = !!params?.id && !!params?.zoneId

    const LIST_KEY = shouldFetch
        ? `lab-cluster-detail-${params.id}-${params.zoneId}-${params.start_date}-${params.end_date}`
        : null // 👈 prevents API call

    const swr = useSWR(
        shouldFetch ? [LIST_KEY, params] : null,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, queryParams]) => apiGetLabMasterCluster<any, any>(queryParams),
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

export default useLabClusters
