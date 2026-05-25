import useSWR from 'swr'

import { apiGetPrefixById } from '@/services/prefixService'

export const usePrefixDetail = (id?: string) => {
    const { data, isLoading, mutate } = useSWR(
        id ? [`/prefix/${id}`] : null,
        async () => {
            const res = await apiGetPrefixById(id as string)

            return res.data
        },
    )

    return {
        prefix: data,
        isLoading,
        mutate,
    }
}
