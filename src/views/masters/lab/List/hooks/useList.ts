import { apiGetLabList } from '@/services/LabService'
import useSWR from 'swr'
import { useLabListStore } from '../store/listStore'
import type { TableQueries } from '@/@types/common'
import { GetLabListResponse } from '@/@types/lab'

const LIST_KEY = 'lab-list'
export default function useLabList() {
    const {
        tableData,
        updateTable,
        selected,
        toggleRow,
        setAll,
        clearSelection,
    } = useLabListStore((state) => state)

    const { data, error, isLoading, mutate } = useSWR(
        [LIST_KEY, tableData],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, params]) =>
            apiGetLabList<GetLabListResponse, TableQueries>(params),
        {
            revalidateOnFocus: false,
        },
    )

    return {
        labList: data?.data ?? [],
        total: data?.total ?? 0,
        isLoading,
        error,
        mutate,

        tableData,
        updateTable,

        selected,
        toggleRow,
        setAll,
        clearSelection,
    }
}
