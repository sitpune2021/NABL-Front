import { Department, GetDepartmentDetailResponse } from '@/@types/department'
import { apiGetDepartmentById } from '@/services/DepartmentService'
import useSWR from 'swr'

export const useDepartmentDetail = (id?: string) => {
    const swr = useSWR<GetDepartmentDetailResponse>(
        id ? ['department-detail', id] : null,
        () => apiGetDepartmentById(id!),
        {
            keepPreviousData: true,
            revalidateOnFocus: false,
            revalidateIfStale: false,
        },
    )

    return {
        department: swr.data?.data as Department | undefined,
        isLoading: swr.isLoading,
        error: swr.error,
        mutate: swr.mutate,
    }
}
