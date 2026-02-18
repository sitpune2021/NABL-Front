import { useMemo, useCallback } from 'react'
import DataTable from '@/components/shared/DataTable'
import { useNavigate } from 'react-router'
import type { OnSortParam, Row } from '@/components/shared/DataTable'
import useClusterList from '../hooks/useList'
import endpointConfig from '@/configs/endpoint.config'
import { Cluster } from '@/@types/cluster'
import { buildClusterColumns } from '@/columns/cluster.columns'
import useAuth from '@/auth/useAuth'

const ClusterListTable = () => {
    const navigate = useNavigate()

    const {
        clusterList,
        total,
        tableData,
        isLoading,
        updateTable,
        selected,
        toggleRow,
        setAll,
        clearSelection,
    } = useClusterList()

    const navigateTo = useCallback((path: string) => navigate(path), [navigate])
    const { can } = useAuth()

    const handleEdit = useCallback(
        (cluster: Cluster) =>
            navigateTo(
                endpointConfig.master.cluster.edit.replace(
                    ':id',
                    String(cluster.id),
                ),
            ),
        [navigateTo],
    )

    const handleView = useCallback(
        (cluster: Cluster) =>
            navigateTo(
                endpointConfig.master.cluster.view.replace(
                    ':id',
                    String(cluster.id),
                ),
            ),
        [navigateTo],
    )

    const columns = useMemo(
        () =>
            buildClusterColumns({
                onEdit: handleEdit,
                onView: handleView,
                can,
            }),
        [handleEdit, handleView, can],
    )

    const handlePaginationChange = (page: number) => {
        updateTable({ pageIndex: page })
        clearSelection()
    }

    const handlePageSizeChange = (pageSize: number) => {
        updateTable({ pageSize, pageIndex: 1 })
        clearSelection()
    }

    const handleSort = (sort: OnSortParam) => {
        updateTable({ sort })
        clearSelection()
    }

    const handleRowSelect = (checked: boolean, row: Cluster) => {
        toggleRow(checked, row)
    }

    const handleAllRowSelect = (checked: boolean, rows: Row<Cluster>[]) => {
        setAll(checked ? rows.map((r) => r.original) : [])
    }

    return (
        <DataTable
            selectable={can('masters.cluster.delete')}
            columns={columns}
            data={clusterList}
            noData={!isLoading && clusterList.length === 0}
            skeletonAvatarColumns={[0]}
            skeletonAvatarProps={{ width: 28, height: 28 }}
            loading={isLoading}
            pagingData={{
                total: total,
                pageIndex: tableData.pageIndex!,
                pageSize: tableData.pageSize!,
            }}
            checkboxChecked={(row) => selected.some((z) => z.id === row.id)}
            onPaginationChange={handlePaginationChange}
            onSelectChange={handlePageSizeChange}
            onSort={handleSort}
            onCheckBoxChange={handleRowSelect}
            onIndeterminateCheckBoxChange={handleAllRowSelect}
        />
    )
}

export default ClusterListTable
