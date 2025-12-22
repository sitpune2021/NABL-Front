import { apiGetDepartmentList } from '@/services/DepartmentService'
import useSWR from 'swr'
import { useDepartmentListStore } from '../store/listStore'
import type { TableQueries } from '@/@types/common'
import { GetDepartmentListResponse } from '@/@types/department'

const LIST_KEY = 'department-list'
export default function useDepartmentList() {
    const {
        tableData,
        updateTable,
        selected,
        toggleRow,
        setAll,
        clearSelection,
    } = useDepartmentListStore()

    const swr = useSWR(
        [LIST_KEY, tableData],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, params]) =>
            apiGetDepartmentList<GetDepartmentListResponse, TableQueries>(
                params,
            ),
        {
            keepPreviousData: true,
            revalidateOnFocus: false,
            revalidateIfStale: false,
        },
    )

    return {
        departmentList: swr.data?.data ?? [],
        total: swr.data?.total ?? 0,
        isLoading: swr.isLoading,
        error: swr.error,
        mutate: swr.mutate,

        tableData,
        updateTable,

        selected,
        toggleRow,
        setAll,
        clearSelection,
    }
}
