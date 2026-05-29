import useSWR from 'swr'
import { apiGetPrefixConfigById } from '@/services/prefixConfigService'
import type {
    GetPrefixConfigDetailResponse,
    Fields,
} from '@/@types/prefixConfig'

export const usePrefixConfigDetail = (id?: string) => {
    const swr = useSWR<GetPrefixConfigDetailResponse>(
        id ? ['prefixConfig-detail', id] : null,
        () => apiGetPrefixConfigById(id!),
        {
            revalidateOnFocus: false,
        },
    )

    const prefixConfig = swr.data?.data as Fields | undefined

    return {
        prefixConfig,
        isLoading: swr.isLoading,
        error: swr.error,
        mutate: swr.mutate,
        data: prefixConfig,
    }
}
