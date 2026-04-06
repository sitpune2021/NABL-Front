/* eslint-disable @typescript-eslint/no-explicit-any */
import useSWR from 'swr'
import { apiGetLabTaskAssign } from '@/services/LabService'

export const useAssignmentList = () => {
    const swr = useSWR<any>('document-detail', () => apiGetLabTaskAssign(), {
        revalidateOnFocus: false,
    })

    return {
        assignment: swr.data?.data as any,
        isLoading: swr.isLoading,
        error: swr.error,
        mutate: swr.mutate,
    }
}
