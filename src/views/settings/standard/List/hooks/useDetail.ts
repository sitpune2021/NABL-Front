import { StandardFormSchema } from '@/schemas/standard.schema'
import { apiGetStandardById } from '@/services/StandardService'
import useSWR from 'swr'

const LIST_KEY = 'standard-detail'
export const useStandardDetail = (id: number | undefined | null) => {
    const shouldFetch = id !== null && id !== undefined

    const { data, error, isLoading, mutate } = useSWR<StandardFormSchema>(
        shouldFetch ? [LIST_KEY, id] : null,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, id]) => apiGetStandardById(id as number).then((res) => res.data),
        { revalidateOnFocus: false },
    )

    return {
        standard: data as StandardFormSchema,
        isLoading: isLoading,
        error: error,
        mutate: mutate,
    }
}
