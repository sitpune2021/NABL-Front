/* eslint-disable @typescript-eslint/no-explicit-any */
import useSWR from 'swr'
import { apiGetClauseDocumentsList } from '@/services/InstrumentService'

const LIST_KEY = 'standard-clause-list'

export const useStandardClauseList = (path: any) => {
    const swr = useSWR(
        [LIST_KEY, path],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, path]) => apiGetClauseDocumentsList(path),
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
