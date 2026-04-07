import { apiGetClausesById } from '@/services/ClausesService'
import useSWR from 'swr'

type ClauseParams = {
    type?: string
}

export const useClauseDetail = (id?: string, params?: ClauseParams) => {
    const swr = useSWR(
        id ? ['clause-detail', id, params] : null,
        () => apiGetClausesById(id!, params),
        { revalidateOnFocus: false },
    )

    return {
        clause: swr?.data,
        isLoading: swr.isLoading,
        error: swr.error,
        mutate: swr.mutate,
    }
}
