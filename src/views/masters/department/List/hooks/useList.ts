import {
    apiDepartment,
    apiGetDepartmentList,
    apiGetDepartmentById,
    apiUpdateDepartment,
} from '@/services/DepartmentService'
import useSWR from 'swr'
import { useDepartmentListStore } from '../store/listStore'
import type { TableQueries } from '@/@types/common'
import { Fields, GetDepartmentListResponse } from '@/@types/department'

export default function useDepartmentList() {
    const {
        tableData,
        filterData,
        setTableData,
        selectedDepartment,
        setSelectedDepartment,
        setSelectAllDepartment,
        setFilterData,
    } = useDepartmentListStore((state) => state)

    const { data, error, isLoading, mutate } = useSWR(
        ['/api/department', { ...tableData, ...filterData }],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, params]) =>
            apiGetDepartmentList<GetDepartmentListResponse, TableQueries>(
                params,
            ),
        {
            revalidateOnFocus: false,
        },
    )
    const saveDepartmentData = async (department: Fields) => {
        if (department.id) {
            await apiUpdateDepartment(department.id, department)
        } else {
            await apiDepartment(department)
        }
        await mutate() // refresh list
    }

    // ✅ Get single department by ID (for edit or view)
    const getDepartmentById = async (id: string) => {
        const department = await apiGetDepartmentById(id)
        return department
    }

    const departmentList = data?.list || []

    const departmentListTotal = data?.total || 0

    return {
        departmentList,
        departmentListTotal,
        error,
        isLoading,
        tableData,
        filterData,
        mutate,
        setTableData,
        selectedDepartment,
        setSelectedDepartment,
        setSelectAllDepartment,
        setFilterData,
        saveDepartmentData,
        getDepartmentById, // ✅ Now defined properly
    }
}
