import { apiDataEntryTaskList } from '@/services/DataEntryService'
import useSWR from 'swr'

const LIST_KEY = 'data-entry-list'
export const useDateEntryList = () => {
    const swr = useSWR(
        [LIST_KEY],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_]) => apiDataEntryTaskList(),
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
