import { apiGetLabsAssignmentsList } from '@/services/LabService'
import useSWR from 'swr'

const LIST_KEY = 'labs-assignments-list'
export const useLabsAssignmentsList = () => {
    const swr = useSWR(
        [LIST_KEY],

        () => apiGetLabsAssignmentsList(),
        {
            revalidateOnFocus: false,
        },
    )

    return {
        labsAssignmentsList: swr.data?.data ?? [],
        isLoading: swr.isLoading,
        error: swr.error,
        mutate: swr.mutate,
    }
}
