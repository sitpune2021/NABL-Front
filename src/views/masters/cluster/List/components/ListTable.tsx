import { useMemo } from 'react'
import Tooltip from '@/components/ui/Tooltip'
import DataTable from '@/components/shared/DataTable'
import { useNavigate } from 'react-router'
import cloneDeep from 'lodash/cloneDeep'
import { TbPencil, TbEye } from 'react-icons/tb'
import type { OnSortParam, ColumnDef, Row } from '@/components/shared/DataTable'
import type { TableQueries } from '@/@types/common'
import useClusterList from '../hooks/useList'
import endpointConfig from '@/configs/endpoint.config'
import { Cluster } from '@/@types/cluster'

const ActionColumn = ({
    onEdit,
    onViewDetail,
}: {
    onEdit: () => void
    onViewDetail: () => void
}) => {
    return (
        <div className="flex items-center gap-3">
            <Tooltip title="Edit">
                <div
                    className={`text-xl cursor-pointer select-none font-semibold`}
                    role="button"
                    onClick={onEdit}
                >
                    <TbPencil />
                </div>
            </Tooltip>
            <Tooltip title="View">
                <div
                    className={`text-xl cursor-pointer select-none font-semibold`}
                    role="button"
                    onClick={onViewDetail}
                >
                    <TbEye />
                </div>
            </Tooltip>
        </div>
    )
}

const ClusterListTable = () => {
    const navigate = useNavigate()

    const {
        clusterList,
        clusterListTotal,
        tableData,
        isLoading,
        setTableData,
        setSelectAllCluster,
        setSelectedCluster,
        selectedCluster,
    } = useClusterList()

    const handleEdit = (cluster: Cluster) => {
        const path = endpointConfig.master.cluster.edit.replace(
            ':id',
            String(cluster.id),
        )
        navigate(path)
    }

    const handleViewDetails = (cluster: Cluster) => {
        const path = endpointConfig.master.cluster.view.replace(
            ':id',
            String(cluster.id),
        )
        navigate(path)
    }

    const columns: ColumnDef<Cluster>[] = useMemo(
        () => [
            {
                header: 'Zone',
                accessorKey: 'zone_name',
            },
            {
                header: 'Cluster',
                accessorKey: 'cluster_name',
            },
            {
                header: 'Action',
                id: 'action',
                cell: (props) => (
                    <ActionColumn
                        onEdit={() => handleEdit(props.row.original)}
                        onViewDetail={() =>
                            handleViewDetails(props.row.original)
                        }
                    />
                ),
            },
        ],

        [],
    )

    const handleSetTableData = (data: TableQueries) => {
        setTableData(data)
        if (selectedCluster.length > 0) {
            setSelectAllCluster([])
        }
    }

    const handlePaginationChange = (page: number) => {
        const newTableData = cloneDeep(tableData)
        newTableData.pageIndex = page
        handleSetTableData(newTableData)
    }

    const handleSelectChange = (value: number) => {
        const newTableData = cloneDeep(tableData)
        newTableData.pageSize = Number(value)
        newTableData.pageIndex = 1
        handleSetTableData(newTableData)
    }

    const handleSort = (sort: OnSortParam) => {
        const newTableData = cloneDeep(tableData)
        newTableData.sort = sort
        handleSetTableData(newTableData)
    }

    const handleRowSelect = (checked: boolean, row: Cluster) => {
        setSelectedCluster(checked, row)
    }

    const handleAllRowSelect = (checked: boolean, rows: Row<Cluster>[]) => {
        if (checked) {
            const originalRows = rows.map((row) => row.original)
            setSelectAllCluster(originalRows)
        } else {
            setSelectAllCluster([])
        }
    }

    return (
        <DataTable
            selectable
            columns={columns}
            data={clusterList}
            noData={!isLoading && clusterList.length === 0}
            skeletonAvatarColumns={[0]}
            skeletonAvatarProps={{ width: 28, height: 28 }}
            loading={isLoading}
            pagingData={{
                total: clusterListTotal,
                pageIndex: tableData.pageIndex as number,
                pageSize: tableData.pageSize as number,
            }}
            checkboxChecked={(row) =>
                selectedCluster.some((selected) => selected.id === row.id)
            }
            onPaginationChange={handlePaginationChange}
            onSelectChange={handleSelectChange}
            onSort={handleSort}
            onCheckBoxChange={handleRowSelect}
            onIndeterminateCheckBoxChange={handleAllRowSelect}
        />
    )
}

export default ClusterListTable
