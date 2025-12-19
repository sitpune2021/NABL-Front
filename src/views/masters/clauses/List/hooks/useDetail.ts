/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiGetClausesById } from '@/services/ClausesService'
import useSWR from 'swr'

export const useClauseDetail = (id?: string) => {
    const swr = useSWR<any>(
        id ? ['clause-detail', id] : null,
        () => apiGetClausesById(id!),
        { revalidateOnFocus: false },
    )

    return {
        clause: swr.data?.data as undefined,
        isLoading: swr.isLoading,
        error: swr.error,
        mutate: swr.mutate,
    }
}
