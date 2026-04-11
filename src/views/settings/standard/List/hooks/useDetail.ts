import { StandardFormSchema } from '@/schemas/standard.schema'
import { apiGetStandardById } from '@/services/StandardService'
import useSWR from 'swr'

export const useStandardDetail = (id?: string) => {
    const swr = useSWR<StandardFormSchema>(
        id ? ['standard-detail', id] : null,
        () => apiGetStandardById(id!),
        { revalidateOnFocus: false },
    )

    return {
        standard: swr?.data as StandardFormSchema,
        isLoading: swr.isLoading,

        error: swr.error,
        mutate: swr.mutate,
    }
}
