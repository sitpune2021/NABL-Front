/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiGetClauseDocumentsList } from '@/services/LabService'
import useSWR from 'swr'

const LIST_KEY = 'standard-clause-list'

export const useStandardClauseList = (standardId?: number | null) => {
    const shouldFetch = standardId !== null && standardId !== undefined

    const { data, error, isLoading, mutate }: any = useSWR(
        shouldFetch ? [LIST_KEY, standardId] : null,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, id]) => apiGetClauseDocumentsList(id),
        { revalidateOnFocus: false },
    )

    return {
        ClauseDocumentList: data?.data ?? null, // ✅ FIXED
        total: data?.total ?? 0,
        isLoading,
        error,
        mutate,
    }
}
