import useSWR from 'swr'
import type { TableQueries } from '@/@types/common'
import { useStandardListStore } from '../store/listStore'
import { apiGetStandardList } from '@/services/StandardService'
import { GetStandardListResponse } from '@/@types/standard'

const LIST_KEY = 'standard-list'
export const useStandardList = () => {
    const {
        tableData,
        updateTable,
        selected,
        toggleRow,
        setAll,
        clearSelection,
    } = useStandardListStore()

    const swr = useSWR(
        [LIST_KEY, tableData],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, params]) =>
            apiGetStandardList<GetStandardListResponse, TableQueries>(params),
        {
            revalidateOnFocus: false,
        },
    )

    return {
        standardList: swr?.data?.data ?? [],
        total: 0,
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
