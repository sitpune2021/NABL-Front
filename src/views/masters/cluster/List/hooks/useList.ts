import {
    apiCluster,
    apiGetClusterList,
    apiGetClusterById,
    apiUpdateCluster,
} from '@/services/ClusterService'
import useSWR from 'swr'
import { useClusterListStore } from '../store/listStore'
import type { TableQueries } from '@/@types/common'
import { Fields, GetClusterListResponse } from '@/@types/cluster'

export default function useClusterList() {
    const {
        tableData,
        filterData,
        setTableData,
        selectedCluster,
        setSelectedCluster,
        setSelectAllCluster,
        setFilterData,
    } = useClusterListStore((state) => state)

    const { data, error, isLoading, mutate } = useSWR(
        ['/api/cluster', { ...tableData, ...filterData }],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, params]) =>
            apiGetClusterList<GetClusterListResponse, TableQueries>(params),
        {
            revalidateOnFocus: false,
        },
    )
    const saveClusterData = async (cluster: Fields) => {
        if (cluster.id) {
            await apiUpdateCluster(cluster.id, cluster)
        } else {
            await apiCluster(cluster)
        }
        await mutate() // refresh list
    }

    // ✅ Get single cluster by ID (for edit or view)
    const getClusterById = async (id: string) => {
        const cluster = await apiGetClusterById(id)
        return cluster
    }

    const clusterList = data?.data || []

    const clusterListTotal = data?.total || 0

    return {
        clusterList,
        clusterListTotal,
        error,
        isLoading,
        tableData,
        filterData,
        mutate,
        setTableData,
        selectedCluster,
        setSelectedCluster,
        setSelectAllCluster,
        setFilterData,
        saveClusterData,
        getClusterById, // ✅ Now defined properly
    }
}
