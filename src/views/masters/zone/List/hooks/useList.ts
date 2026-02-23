/* eslint-disable @typescript-eslint/no-explicit-any */
import useSWR from 'swr'
import { useEffect, useState } from 'react'
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
    //   holds accumulated data for dropdown
    const [allZone, setAllZone] = useState<any[]>([])

    const swr = useSWR(
        [LIST_KEY, tableData],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, params]) =>
            apiGetZoneList<GetZoneListResponse, TableQueries>(params),
        {
            revalidateOnFocus: false,
        },
    )
    useEffect(() => {
        if (!swr.data?.data) return

        if (tableData.pageIndex === 1) {
            setAllZone(swr.data.data)
        } else {
            setAllZone((prev) => [...prev, ...(swr.data?.data ?? [])])
        }
    }, [swr.data, tableData.pageIndex])

    const hasMore = allZone.length < (swr.data?.total ?? 0)

    return {
        zoneList: swr.data?.data ?? [],
        total: swr.data?.total ?? 0,
        hasMore,
        isLoading: swr.isLoading,
        error: swr.error,
        mutate: swr.mutate,

        tableData,
        updateTable,

        selected,
        toggleRow,
        setAll,
        clearSelection,
        record: allZone,
    }
}
