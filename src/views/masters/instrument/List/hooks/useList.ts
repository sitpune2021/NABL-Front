import useSWR from 'swr'
import { apiGetInstrumentList } from '@/services/InstrumentService'
import type { TableQueries } from '@/@types/common'
import type { GetInstrumentListResponse } from '@/@types/instrument'
import { useInstrumentListStore } from '../store/listStore'

const LIST_KEY = 'instrument-list'
export const useInstrumentList = () => {
    const {
        tableData,
        updateTable,
        selected,
        toggleRow,
        setAll,
        clearSelection,
    } = useInstrumentListStore()

    const swr = useSWR(
        [LIST_KEY, tableData],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, params]) =>
            apiGetInstrumentList<GetInstrumentListResponse, TableQueries>(
                params,
            ),
        {
            revalidateOnFocus: false,
        },
    )

    return {
        instrumentList: swr.data?.data ?? [],
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
