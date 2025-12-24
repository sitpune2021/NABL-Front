/* eslint-disable @typescript-eslint/no-explicit-any */
import useSWR from 'swr'
import { apiDataEntryList } from '@/services/ClausesService'

const LIST_KEY = 'data-entry-list'
export const useDateEntryList = (id) => {
    const swr = useSWR(
        [LIST_KEY],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_]) => apiDataEntryList<any>(id),
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
