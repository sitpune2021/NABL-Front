/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    apiDepartment,
    apiGetDepartmentList,
    apiGetDepartmentById,
    apiUpdateDepartment,
} from '@/services/DepartmentService'
import useSWR from 'swr'
import { useDepartmentListStore } from '../store/listStore'
import type { TableQueries } from '@/@types/common'
import {
    Fields,
    GetDepartmentListResponse,
    GetDepartmentDetailResponse,
} from '@/@types/department'

export default function useDepartmentList(departmentId?: string) {
    const {
        tableData,
        setTableData,
        selectedDepartment,
        setSelectedDepartment,
        setSelectAllDepartment,
    } = useDepartmentListStore((state) => state)

    const { data, error, isLoading, mutate } = useSWR(
        ['/api/department', { ...tableData }],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, params]) =>
            apiGetDepartmentList<GetDepartmentListResponse, TableQueries>(
                params,
            ),
        { revalidateOnFocus: false },
    )

    const {
        data: detailData,
        error: detailError,
        isLoading: isDetailLoading,
        mutate: mutateDetail,
    } = useSWR<GetDepartmentDetailResponse>(
        departmentId ? `/api/department/${departmentId}` : null,
        () => apiGetDepartmentById(departmentId!),
        { revalidateOnFocus: false },
    )

    const saveDepartmentData = async (department: Fields) => {
        let savedData: any
        if (department.id) {
            /* eslint-disable @typescript-eslint/no-unused-vars */
            const { id, ...departmentWithoutId } = department
            savedData = await apiUpdateDepartment(
                department.id,
                departmentWithoutId,
            )
        } else {
            savedData = await apiDepartment(department)
        }

        await mutate()

        if (department.id && mutateDetail) {
            mutateDetail({ data: savedData }, false)
        }

        return savedData
    }

    const departmentList = data?.data || []
    const departmentListTotal = data?.total || 0

    const departmentDetail = detailData?.data || {
        name: '',
        identifier: '',
    }

    return {
        departmentList,
        departmentListTotal,
        error,
        isLoading,
        departmentDetail,
        isDetailLoading,
        detailError,
        mutateDetail,
        tableData,
        mutate,
        setTableData,
        selectedDepartment,
        setSelectedDepartment,
        setSelectAllDepartment,
        saveDepartmentData,
    }
}
