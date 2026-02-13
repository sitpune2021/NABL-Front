/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiGetClusterList } from '@/services/ClusterService'
import useSWR from 'swr'
import { useEffect, useState } from 'react'
import { useClusterListStore } from '../store/listStore'
import type { TableQueries } from '@/@types/common'
import { GetClusterListResponse } from '@/@types/cluster'
import { LIST_KEY } from '@/constants/cluster.constant'

export default function useClusterList() {
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
    } = useClusterListStore()
    const [allCluster, setAllCluster] = useState<any[]>([])

    const swr = useSWR(
        [LIST_KEY, { ...tableData, ...filterData }],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, params]) =>
            apiGetClusterList<GetClusterListResponse, TableQueries>(params),
        {
            revalidateOnFocus: false,
        },
    )

    useEffect(() => {
        if (!swr.data?.data) return

        if (tableData.pageIndex === 1) {
            setAllCluster(swr.data.data)
        } else {
            setAllCluster((prev) => [...prev, ...(swr.data?.data ?? [])])
        }
    }, [swr.data, tableData.pageIndex])

    const hasMore = allCluster.length < (swr.data?.total ?? 0)

    return {
        clusterList: swr.data?.data ?? [],
        total: swr.data?.total ?? 0,
        isLoading: swr.isLoading,
        error: swr.error,
        mutate: swr.mutate,
        tableData,
        updateTable,
        filterData,
        updateFilters,
        resetFilters,
        hasMore,

        selected,
        toggleRow,
        setAll,
        clearSelection,
        allCluster,
    }
}
