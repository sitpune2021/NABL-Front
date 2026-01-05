import { GetDepartmentDetailResponse } from '@/@types/department'
import { apiGetDepartmentById } from '@/services/DepartmentService'
import useSWR from 'swr'

export const useDepartmentDetail = (id?: string) => {
    const swr = useSWR<GetDepartmentDetailResponse>(
        id ? ['department-detail', id] : null,
        () => apiGetDepartmentById(id!),
        {
            revalidateOnFocus: false,
        },
    )

    return {
        department: swr.data?.data,
        isLoading: swr.isLoading,
        error: swr.error,
        mutate: swr.mutate,
    }
}
