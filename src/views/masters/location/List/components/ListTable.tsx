import { useMemo } from 'react'
import ActionColumn from '@/components/form/ActionColumn'
import DataTable from '@/components/shared/DataTable'
import { useNavigate } from 'react-router'
import cloneDeep from 'lodash/cloneDeep'
import { TbPencil, TbEye } from 'react-icons/tb'
import type { OnSortParam, ColumnDef, Row } from '@/components/shared/DataTable'
import type { TableQueries } from '@/@types/common'
import useLocationList from '../hooks/useList'
import endpointConfig from '@/configs/endpoint.config'
import { Location } from '@/@types/location'

const LocationListTable = () => {
    const navigate = useNavigate()

    const {
        locationList,
        locationListTotal,
        tableData,
        isLoading,
        setTableData,
        setSelectAllLocation,
        setSelectedLocation,
        selectedLocation,
    } = useLocationList()

    const handleEdit = (location: Location) => {
        const path = endpointConfig.master.location.edit.replace(
            ':id',
            String(location.id),
        )
        navigate(path)
    }

    const handleViewDetails = (location: Location) => {
        const path = endpointConfig.master.location.view.replace(
            ':id',
            String(location.id),
        )
        navigate(path)
    }

    const columns: ColumnDef<Location>[] = useMemo(
        () => [
            {
                header: 'Id',
                accessorKey: 'id',
            },
            {
                header: 'Zone',
                accessorKey: 'zone',
                cell: (props) => {
                    const { name, identifier } = props.row.original.cluster.zone
                    return (
                        <div className="flex items-center gap-2">
                            <div>
                                <div className="font-bold heading-text">
                                    {name}
                                </div>
                                <div className="font-semibold">
                                    {identifier}
                                </div>
                            </div>
                        </div>
                    )
                },
            },
            {
                header: 'Cluster',
                accessorKey: 'cluster',
                cell: (props) => {
                    const { name, identifier } = props.row.original.cluster
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
                header: 'Location',
                accessorKey: 'location',
                cell: (props) => {
                    const { name, identifier, short_name } = props.row.original
                    return (
                        <div className="flex items-center gap-2">
                            <div>
                                <div className="font-bold heading-text">
                                    {name} - ({short_name})
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
        if (selectedLocation.length > 0) {
            setSelectAllLocation([])
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

    const handleRowSelect = (checked: boolean, row: Location) => {
        setSelectedLocation(checked, row)
    }

    const handleAllRowSelect = (checked: boolean, rows: Row<Location>[]) => {
        if (checked) {
            const originalRows = rows.map((row) => row.original)
            setSelectAllLocation(originalRows)
        } else {
            setSelectAllLocation([])
        }
    }

    return (
        <DataTable
            selectable
            columns={columns}
            data={locationList}
            noData={!isLoading && locationList.length === 0}
            skeletonAvatarColumns={[0]}
            skeletonAvatarProps={{ width: 28, height: 28 }}
            loading={isLoading}
            pagingData={{
                total: locationListTotal,
                pageIndex: tableData.pageIndex as number,
                pageSize: tableData.pageSize as number,
            }}
            checkboxChecked={(row) =>
                selectedLocation.some((selected) => selected.id === row.id)
            }
            onPaginationChange={handlePaginationChange}
            onSelectChange={handleSelectChange}
            onSort={handleSort}
            onCheckBoxChange={handleRowSelect}
            onIndeterminateCheckBoxChange={handleAllRowSelect}
        />
    )
}

export default LocationListTable
