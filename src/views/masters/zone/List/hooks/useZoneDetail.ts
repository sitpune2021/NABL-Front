import useSWR from 'swr'
import { apiGetZoneById } from '@/services/ZoneService'
import type { GetZoneDetailResponse, Fields } from '@/@types/zone'

export const useZoneDetail = (id?: string) => {
    const swr = useSWR<GetZoneDetailResponse>(
        id ? ['zone-detail', id] : null,
        () => apiGetZoneById(id!),
        {
            keepPreviousData: true,
            revalidateOnFocus: false,
            revalidateIfStale: false,
        },
    )

    return {
        zone: swr.data?.data as Fields | undefined,
        isLoading: swr.isLoading,
        error: swr.error,
        mutate: swr.mutate,
        data: swr.data?.data as Fields | undefined,
    }
}
