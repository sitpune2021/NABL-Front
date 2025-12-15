/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    apiCluster,
    apiGetClusterList,
    apiGetClusterById,
    apiUpdateCluster,
} from '@/services/ClusterService'
import useSWR from 'swr'
import { useClusterListStore } from '../store/listStore'
import type { TableQueries } from '@/@types/common'
import {
    Fields,
    GetClusterListResponse,
    GetClusterDetailResponse,
} from '@/@types/cluster'

export default function useClusterList(clusterId?: string) {
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

    const {
        data: detailData,
        error: detailError,
        isLoading: isDetailLoading,
        mutate: mutateDetail,
    } = useSWR<GetClusterDetailResponse>(
        clusterId ? `/api/cluster/${clusterId}` : null,
        () => apiGetClusterById(clusterId!),
        { revalidateOnFocus: false },
    )

    const saveClusterData = async (cluster: Fields) => {
        let savedData: any

        if (cluster.id) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { id, ...withoutId } = cluster
            savedData = await apiUpdateCluster(cluster.id, withoutId)
        } else {
            savedData = await apiCluster(cluster)
        }

        await mutate()

        if (cluster.id && mutateDetail) {
            mutateDetail({ data: savedData }, false)
        }

        return savedData
    }

    const clusterList = data?.data || []
    const clusterListTotal = data?.total || 0

    const clusterDetail = detailData?.data || {
        name: '',
        zone_id: '',
        identifier: '',
    }

    return {
        clusterList,
        clusterListTotal,
        error,
        isLoading,
        clusterDetail,
        isDetailLoading,
        detailError,
        mutateDetail,
        tableData,
        filterData,
        mutate,
        setTableData,
        selectedCluster,
        setSelectedCluster,
        setSelectAllCluster,
        setFilterData,
        saveClusterData,
    }
}
