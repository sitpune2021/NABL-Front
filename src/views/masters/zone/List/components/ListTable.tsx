import { useMemo } from 'react'
import ActionColumn from '@/components/form/ActionColumn'
import DataTable from '@/components/shared/DataTable'
import { useNavigate } from 'react-router'
import cloneDeep from 'lodash/cloneDeep'
import { TbPencil, TbEye } from 'react-icons/tb'
import type { OnSortParam, ColumnDef, Row } from '@/components/shared/DataTable'
import type { TableQueries } from '@/@types/common'
import useZoneList from '../hooks/useList'
import endpointConfig from '@/configs/endpoint.config'
import { Zone } from '@/@types/zone'

const ZoneListTable = () => {
    const navigate = useNavigate()
    const {
        zoneList,
        zoneListTotal,
        tableData,
        isLoading,
        setTableData,
        setSelectAllZone,
        setSelectedZone,
        selectedZone,
    } = useZoneList()

    const handleEdit = (zone: Zone) => {
        const path = endpointConfig.master.zone.edit.replace(
            ':id',
            String(zone.id),
        )
        navigate(path)
    }

    const handleViewDetails = (zone: Zone) => {
        const path = endpointConfig.master.zone.view.replace(
            ':id',
            String(zone.id),
        )
        navigate(path)
    }

    const columns: ColumnDef<Zone>[] = useMemo(
        () => [
            {
                header: 'Id',
                accessorKey: 'id',
            },
            {
                header: 'Zone',
                accessorKey: 'zone',
                cell: (props) => {
                    const { name, identifier } = props.row.original
                    return (
                        <div className="flex items-center gap-2">
                            <div>
                                <div className="font-bold heading-text">
                                    {name}
                                </div>
                                <div>{identifier}</div>
                            </div>
                        </div>
                    )
                },
            },
            {
                header: 'Action',
                accessorKey: 'action',
                id: 'action',
                cell: (props) => (
                    <ActionColumn
                        buttons={[
                            {
                                icon: <TbPencil />,
                                tooltip: 'Edit',
                                onClick: () => handleEdit(props.row.original),
                            },
                            {
                                icon: <TbEye />,
                                tooltip: 'View',
                                onClick: () =>
                                    handleViewDetails(props.row.original),
                            },
                        ]}
                    />
                ),
            },
        ],

        [],
    )

    const handleSetTableData = (data: TableQueries) => {
        setTableData(data)
        if (selectedZone.length > 0) {
            setSelectAllZone([])
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

    const handleRowSelect = (checked: boolean, row: Zone) => {
        setSelectedZone(checked, row)
    }

    const handleAllRowSelect = (checked: boolean, rows: Row<Zone>[]) => {
        if (checked) {
            const originalRows = rows.map((row) => row.original)
            setSelectAllZone(originalRows)
        } else {
            setSelectAllZone([])
        }
    }

    return (
        <DataTable
            selectable
            columns={columns}
            data={zoneList}
            noData={!isLoading && zoneList.length === 0}
            skeletonAvatarColumns={[0]}
            skeletonAvatarProps={{ width: 28, height: 28 }}
            loading={isLoading}
            pagingData={{
                total: zoneListTotal,
                pageIndex: tableData.pageIndex as number,
                pageSize: tableData.pageSize as number,
            }}
            checkboxChecked={(row) =>
                selectedZone.some((selected) => selected.id === row.id)
            }
            onPaginationChange={handlePaginationChange}
            onSelectChange={handleSelectChange}
            onSort={handleSort}
            onCheckBoxChange={handleRowSelect}
            onIndeterminateCheckBoxChange={handleAllRowSelect}
        />
    )
}

export default ZoneListTable
