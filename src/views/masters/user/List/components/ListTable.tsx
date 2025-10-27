import { useMemo } from 'react'
import Tooltip from '@/components/ui/Tooltip'
import DataTable from '@/components/shared/DataTable'
import { useNavigate } from 'react-router'
import cloneDeep from 'lodash/cloneDeep'
import { TbPencil, TbEye } from 'react-icons/tb'
import type { OnSortParam, ColumnDef, Row } from '@/components/shared/DataTable'
import type { TableQueries } from '@/@types/common'
import useUserList from '../hooks/useList'
import endpointConfig from '@/configs/endpoint.config'
import { User } from '@/@types/user'

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

const UserListTable = () => {
    const navigate = useNavigate()

    const {
        userList,
        userListTotal,
        tableData,
        isLoading,
        setTableData,
        setSelectAllUser,
        setSelectedUser,
        selectedUser,
    } = useUserList()

    const handleEdit = (user: User) => {
        const path = endpointConfig.master.user.edit.replace(
            ':id',
            String(user.id),
        )
        navigate(path)
    }

    const handleViewDetails = (user: User) => {
        const path = endpointConfig.master.user.view.replace(
            ':id',
            String(user.id),
        )
        navigate(path)
    }

    const columns: ColumnDef<User>[] = useMemo(
        () => [
            {
                header: 'Name',
                accessorKey: 'name',
            },
            {
                header: 'Username',
                accessorKey: 'username',
            },
            {
                header: 'Email',
                accessorKey: 'email',
            },
            {
                header: 'Role',
                accessorKey: 'role',
                cell: (props) => {
                    const rolesArray = props.row.original.role // assuming this is an array
                    // If it's a single value, wrap it in an array: [props.row.original.role]
                    return Array.isArray(rolesArray)
                        ? rolesArray.map((r) => r.label || r).join(' | ')
                        : rolesArray
                },
            },
            {
                header: 'Phone',
                accessorKey: 'phone',
            },
            {
                header: 'Address',
                accessorKey: 'address',
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
            // {
            //     header: 'image',
            //     accessorKey: 'profileImage',
            //     enableSorting: false,
            //     enableColumnFilter: false,
            //     size: 60,
            // }
        ],

        [],
    )

    const handleSetTableData = (data: TableQueries) => {
        setTableData(data)
        if (selectedUser.length > 0) {
            setSelectAllUser([])
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

    const handleRowSelect = (checked: boolean, row: User) => {
        setSelectedUser(checked, row)
    }

    const handleAllRowSelect = (checked: boolean, rows: Row<User>[]) => {
        if (checked) {
            const originalRows = rows.map((row) => row.original)
            setSelectAllUser(originalRows)
        } else {
            setSelectAllUser([])
        }
    }

    return (
        <DataTable
            selectable
            columns={columns}
            data={userList}
            noData={!isLoading && userList.length === 0}
            skeletonAvatarColumns={[0]}
            skeletonAvatarProps={{ width: 28, height: 28 }}
            loading={isLoading}
            pagingData={{
                total: userListTotal,
                pageIndex: tableData.pageIndex as number,
                pageSize: tableData.pageSize as number,
            }}
            checkboxChecked={(row) =>
                selectedUser.some((selected) => selected.id === row.id)
            }
            onPaginationChange={handlePaginationChange}
            onSelectChange={handleSelectChange}
            onSort={handleSort}
            onCheckBoxChange={handleRowSelect}
            onIndeterminateCheckBoxChange={handleAllRowSelect}
        />
    )
}

export default UserListTable
