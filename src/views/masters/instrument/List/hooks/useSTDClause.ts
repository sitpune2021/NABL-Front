/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiGetClauseDocumentsList } from '@/services/LabService'
import useSWR from 'swr'

const LIST_KEY = 'standard-clause-list'

export const useStandardClauseList = (standardId?: number | null) => {
    const shouldFetch = !!standardId
    const swr: any = useSWR(
        shouldFetch ? [LIST_KEY, standardId] : null,
        ([id]) => apiGetClauseDocumentsList(id),
        { revalidateOnFocus: false },
    )

    return {
        ClauseDocumentList: swr.data?.data ?? [],
        total: swr.data?.total ?? 0,
        isLoading: swr.isLoading,
        error: swr.error,
        mutate: swr.mutate,
    }
}
