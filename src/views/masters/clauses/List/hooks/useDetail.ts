import {
    apiGetClausesById,
    apiGetDocumentLinks,
} from '@/services/ClausesService'
import useSWR from 'swr'

type ClauseParams = {
    type?: string
}

export const useClauseDetail = (id?: number, params?: ClauseParams) => {
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

export const useDocumentLinks = (params?: Record<string, unknown>) => {
    const swr = useSWR(
        ['document-links', params],
        () => apiGetDocumentLinks(params),
        { revalidateOnFocus: false },
    )

    return {
        documentLinks: swr?.data,
        isLoading: swr.isLoading,
        error: swr.error,
        mutate: swr.mutate,
    }
}
