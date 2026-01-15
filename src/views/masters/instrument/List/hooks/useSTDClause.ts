/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiGetClauseDocumentsList } from '@/services/LabService'
import useSWR from 'swr'

export const useStandardClauseList = (standardId?: number | null) => {
    const swr: any = useSWR(
        standardId ? ['standard-clause-list', standardId] : null,
        ([id]) => apiGetClauseDocumentsList(id),
        { revalidateOnFocus: false },
    )

    return {
        ClauseDocumentList: swr.data?.data ?? null,
        isLoading: swr.isLoading,
        error: swr.error,
        mutate: swr.mutate,
    }
}
