import { apiGetLocationList } from '@/services/LocationService'
import useSWR from 'swr'
import { useLocationListStore } from '../store/listStore'
import type { TableQueries } from '@/@types/common'
import { GetLocationListResponse } from '@/@types/location'
import { LIST_KEY } from '@/constants/location.constant'

export default function useLocationList() {
    const {
        filterData,
        updateFilters,
        resetFilters,
        tableData,
        updateTable,
        selected,
        toggleRow,
        setAll,
        clearSelection,
    } = useLocationListStore((state) => state)

    const swr = useSWR(
        [LIST_KEY, { ...tableData, ...filterData }],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, params]) =>
            apiGetLocationList<GetLocationListResponse, TableQueries>(params),
        {
            revalidateOnFocus: false,
        },
    )

    return {
        locationList: swr.data?.data ?? [],
        total: swr.data?.total ?? 0,
        isLoading: swr.isLoading,
        error: swr.error,
        mutate: swr.mutate,
        tableData,
        updateTable,
        filterData,
        updateFilters,
        resetFilters,

        selected,
        toggleRow,
        setAll,
        clearSelection,
    }
}
