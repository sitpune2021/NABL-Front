import { useMemo } from 'react'
import Tooltip from '@/components/ui/Tooltip'
import DataTable from '@/components/shared/DataTable'
import { useNavigate } from 'react-router'
import cloneDeep from 'lodash/cloneDeep'
import { TbPencil, TbEye } from 'react-icons/tb'
import type { OnSortParam, ColumnDef, Row } from '@/components/shared/DataTable'
import type { TableQueries } from '@/@types/common'
import useUnitList from '../hooks/useList'
import endpointConfig from '@/configs/endpoint.config'
import { Unit } from '@/@types/unit'

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

const UnitListTable = () => {
    const navigate = useNavigate()

    const {
        unitList,
        unitListTotal,
        tableData,
        isLoading,
        setTableData,
        setSelectAllUnit,
        setSelectedUnit,
        selectedUnit,
    } = useUnitList()

    const handleEdit = (unit: Unit) => {
        const path = endpointConfig.master.unit.edit.replace(
            ':id',
            String(unit.id),
        )
        navigate(path)
    }

    const handleViewDetails = (unit: Unit) => {
        const path = endpointConfig.master.unit.view.replace(
            ':id',
            String(unit.id),
        )
        navigate(path)
    }

    const columns: ColumnDef<Unit>[] = useMemo(
        () => [
            {
                header: 'Id',
                accessorKey: 'id',
            },
            {
                header: 'Name',
                accessorKey: 'name',
                cell: (props) => {
                    const { name } = props.row.original
                    return (
                        <div className="flex items-center gap-2">
                            <div>
                                <div className="font-bold heading-text">
                                    {name}
                                </div>
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
        if (selectedUnit.length > 0) {
            setSelectAllUnit([])
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

    const handleRowSelect = (checked: boolean, row: Unit) => {
        setSelectedUnit(checked, row)
    }

    const handleAllRowSelect = (checked: boolean, rows: Row<Unit>[]) => {
        if (checked) {
            const originalRows = rows.map((row) => row.original)
            setSelectAllUnit(originalRows)
        } else {
            setSelectAllUnit([])
        }
    }

    return (
        <DataTable
            selectable
            columns={columns}
            data={unitList}
            noData={!isLoading && unitList.length === 0}
            skeletonAvatarColumns={[0]}
            skeletonAvatarProps={{ width: 28, height: 28 }}
            loading={isLoading}
            pagingData={{
                total: unitListTotal,
                pageIndex: tableData.pageIndex as number,
                pageSize: tableData.pageSize as number,
            }}
            checkboxChecked={(row) =>
                selectedUnit.some((selected) => selected.id === row.id)
            }
            onPaginationChange={handlePaginationChange}
            onSelectChange={handleSelectChange}
            onSort={handleSort}
            onCheckBoxChange={handleRowSelect}
            onIndeterminateCheckBoxChange={handleAllRowSelect}
        />
    )
}

export default UnitListTable
