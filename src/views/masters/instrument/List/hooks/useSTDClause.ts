/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiGetClauseDocumentsList } from '@/services/LabService'
import useSWR from 'swr'

const LIST_KEY = 'standard-clause-list'

export const useStandardClauseList = (standardId: number) => {
    const swr: any = useSWR(
        [LIST_KEY, standardId],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, id]) => apiGetClauseDocumentsList(id),
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
