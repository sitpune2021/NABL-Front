import { useMemo } from 'react'
import Tooltip from '@/components/ui/Tooltip'
import DataTable from '@/components/shared/DataTable'
import { useNavigate } from 'react-router'
import cloneDeep from 'lodash/cloneDeep'
import { TbPencil, TbEye } from 'react-icons/tb'
import type { OnSortParam, ColumnDef, Row } from '@/components/shared/DataTable'
import type { TableQueries } from '@/@types/common'
import useRolesList from '../hooks/useList'
import endpointConfig from '@/configs/endpoint.config'
import { Roles } from '@/@types/roles'

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

const RolesListTable = () => {
    const navigate = useNavigate()

    const {
        rolesList,
        rolesListTotal,
        tableData,
        isLoading,
        setTableData,
        setSelectAllRoles,
        setSelectedRoles,
        selectedRoles,
    } = useRolesList()

    const handleEdit = (roles: Roles) => {
        const path = endpointConfig.master.roles.edit.replace(
            ':id',
            String(roles.id),
        )
        navigate(path)
    }

    const handleViewDetails = (roles: Roles) => {
        const path = endpointConfig.master.roles.view.replace(
            ':id',
            String(roles.id),
        )
        navigate(path)
    }

    const columns: ColumnDef<Roles>[] = useMemo(
        () => [
            {
                header: 'Name',
                accessorKey: 'name',
            },
            {
                header: '',
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
        if (selectedRoles.length > 0) {
            setSelectAllRoles([])
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

    const handleRowSelect = (checked: boolean, row: Roles) => {
        setSelectedRoles(checked, row)
    }

    const handleAllRowSelect = (checked: boolean, rows: Row<Roles>[]) => {
        if (checked) {
            const originalRows = rows.map((row) => row.original)
            setSelectAllRoles(originalRows)
        } else {
            setSelectAllRoles([])
        }
    }

    return (
        <DataTable
            selectable
            columns={columns}
            data={rolesList}
            noData={!isLoading && rolesList.length === 0}
            skeletonAvatarColumns={[0]}
            skeletonAvatarProps={{ width: 28, height: 28 }}
            loading={isLoading}
            pagingData={{
                total: rolesListTotal,
                pageIndex: tableData.pageIndex as number,
                pageSize: tableData.pageSize as number,
            }}
            checkboxChecked={(row) =>
                selectedRoles.some((selected) => selected.id === row.id)
            }
            onPaginationChange={handlePaginationChange}
            onSelectChange={handleSelectChange}
            onSort={handleSort}
            onCheckBoxChange={handleRowSelect}
            onIndeterminateCheckBoxChange={handleAllRowSelect}
        />
    )
}

export default RolesListTable
