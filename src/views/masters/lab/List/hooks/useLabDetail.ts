import { GetLabDetailResponse, Lab } from '@/@types/lab'
import { apiGetLabById } from '@/services/LabService'
import useSWR from 'swr'

export const useLabDetail = (id?: string) => {
    const swr = useSWR<GetLabDetailResponse>(
        id ? ['lab-detail', id] : null,
        () => apiGetLabById(id!),
        { revalidateOnFocus: false },
    )

    return {
        lab: swr.data?.data as Lab | undefined,
        isLoading: swr.isLoading,
        error: swr.error,
        mutate: swr.mutate,
    }
}
