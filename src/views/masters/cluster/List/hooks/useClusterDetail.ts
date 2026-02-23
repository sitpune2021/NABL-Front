import useSWR from 'swr'
import { Fields, GetClusterDetailResponse } from '@/@types/cluster'
import { apiGetClusterById } from '@/services/ClusterService'

export const useClusterDetail = (id?: string) => {
    const swr = useSWR<GetClusterDetailResponse>(
        id ? ['cluster-detail', id] : null,
        () => apiGetClusterById(id!),
        { revalidateOnFocus: false },
    )
    return {
        cluster: swr.data?.data as Fields | undefined,
        isLoading: swr.isLoading,
        error: swr.error,
        mutate: swr.mutate,
        data: swr.data?.data as Fields | undefined,
    }
}
