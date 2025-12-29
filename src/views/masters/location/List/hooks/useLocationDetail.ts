import useSWR from 'swr'
import { Fields, GetLocationDetailResponse } from '@/@types/location'
import { apiGetLocationById } from '@/services/LocationService'

export const useLocationDetail = (id?: string) => {
    const swr = useSWR<GetLocationDetailResponse>(
        id ? ['location-detail', id] : null,
        () => apiGetLocationById(id!),
        { revalidateOnFocus: false },
    )
    return {
        location: swr.data?.data as Fields | undefined,
        isLoading: swr.isLoading,
        error: swr.error,
        mutate: swr.mutate,
    }
}
