import useSWR from 'swr'
import { apiGetInstrumentById } from '@/services/InstrumentService'
import type { GetInstrumentDetailResponse, Fields } from '@/@types/instrument'

export const useInstrumentDetail = (id?: string) => {
    const swr = useSWR<GetInstrumentDetailResponse>(
        id ? ['instrument-detail', id] : null,
        () => apiGetInstrumentById(id!),
        {
            revalidateOnFocus: false,
        },
    )

    return {
        instrument: swr.data?.data as Fields | undefined,
        isLoading: swr.isLoading,
        error: swr.error,
        mutate: swr.mutate,
    }
}
