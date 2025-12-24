import useSWR from 'swr'
import { apiGetZoneList } from '@/services/ZoneService'
import type { TableQueries } from '@/@types/common'
import type { GetZoneListResponse } from '@/@types/zone'
import { useZoneListStore } from '../store/listStore'

const LIST_KEY = 'zone-list'
export const useZoneList = () => {
    const {
        tableData,
        updateTable,
        selected,
        toggleRow,
        setAll,
        clearSelection,
    } = useZoneListStore()

    const swr = useSWR(
        [LIST_KEY, tableData],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, params]) =>
            apiGetZoneList<GetZoneListResponse, TableQueries>(params),
        {
            keepPreviousData: true,
            revalidateOnFocus: false,
            revalidateIfStale: false,
        },
    )

    return {
        zoneList: swr.data?.data ?? [],
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
