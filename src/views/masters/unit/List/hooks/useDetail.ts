import { GetUnitDetailResponse, Unit } from '@/@types/unit'
import { apiGetUnitById } from '@/services/UnitService'
import useSWR from 'swr'

export const useUnitDetail = (id?: string) => {
    const swr = useSWR<GetUnitDetailResponse>(
        id ? ['unit-detail', id] : null,
        () => apiGetUnitById(id!),
        {
            revalidateOnFocus: false,
        },
    )

    return {
        unit: swr.data?.data as Unit | undefined,
        isLoading: swr.isLoading,
        error: swr.error,
        mutate: swr.mutate,
    }
}
