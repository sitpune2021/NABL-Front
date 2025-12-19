/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiGetStandardById } from '@/services/StandardService'
import useSWR from 'swr'

export const useStandardDetail = (id?: string) => {
    const swr = useSWR<any>(
        id ? ['standard-detail', id] : null,
        () => apiGetStandardById(id!),
        { revalidateOnFocus: false },
    )

    return {
        standard: swr.data?.data as undefined,
        isLoading: swr.isLoading,

        error: swr.error,
        mutate: swr.mutate,
    }
}
