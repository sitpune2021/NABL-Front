/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiDataEntryList } from '@/services/DataEntryService'
import useSWR from 'swr'

const LIST_KEY = 'data-entry-list'
export const useDateEntryList = (id: any, params?: any) => {
    const swr = useSWR(
        [LIST_KEY, params],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, params]) => apiDataEntryList(id, params),
        {
            revalidateOnFocus: false,
        },
    )

    return {
        dataEntryList: swr?.data ?? [],
        isLoading: swr.isLoading,
        error: swr.error,
        mutate: swr.mutate,
    }
}
