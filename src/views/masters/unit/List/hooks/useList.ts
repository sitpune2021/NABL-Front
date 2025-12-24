import useSWR from 'swr'
import type { TableQueries } from '@/@types/common'
import { useUnitListStore } from '../store/listStore'
import { apiGetUnitList } from '@/services/UnitService'
import { GetUnitListResponse } from '@/@types/unit'

const LIST_KEY = 'unit-list'
export default function useDepartmentList() {
    const {
        tableData,
        updateTable,
        selected,
        toggleRow,
        setAll,
        clearSelection,
    } = useUnitListStore()

    const swr = useSWR(
        [LIST_KEY, tableData],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, params]) =>
            apiGetUnitList<GetUnitListResponse, TableQueries>(params),
        {
            revalidateOnFocus: false,
        },
    )

    return {
        unitList: swr.data?.data ?? [],
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
