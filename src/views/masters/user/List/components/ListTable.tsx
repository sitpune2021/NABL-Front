import { useMemo } from 'react'
import Tooltip from '@/components/ui/Tooltip'
import DataTable from '@/components/shared/DataTable'
import Avatar from '@/components/ui/Avatar'
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
        const path = endpointConfig.setting.user.edit.replace(
            ':id',
            String(user.id),
        )
        navigate(path)
    }

    const handleViewDetails = (user: User) => {
        const path = endpointConfig.setting.user.view.replace(
            ':id',
            String(user.id),
        )
        navigate(path)
    }

    const columns: ColumnDef<User>[] = useMemo(
        () => [
            {
                header: 'Id',
                accessorKey: 'id',
            },
            {
                header: 'Name',
                accessorKey: 'name',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <div className="flex items-center gap-2">
                            <Avatar
                                size={40}
                                shape="circle"
                                src={row.profileImage}
                            />
                            <div>
                                <div className="font-bold heading-text">
                                    {row.name}
                                </div>
                                <div>{row.email}</div>
                            </div>
                        </div>
                    )
                },
            },
            {
                header: 'username',
                accessorKey: 'username',
                cell: (props) => {
                    const row = props.row.original
                    return <span className="font-semibold">{row.username}</span>
                },
            },
            {
                header: 'phone',
                accessorKey: 'phone',
            },
            {
                header: 'Roles',
                accessorKey: 'locations',
                cell: ({ row }) => {
                    const user = row.original as User & {
                        locations?: {
                            id: number
                            name: string
                            departments?: {
                                id: number
                                name: string
                                roles?: {
                                    id: number
                                    name: string
                                    permissions?: string[]
                                }[]
                            }[]
                        }[]
                    }

                    if (!user.locations || user.locations.length === 0)
                        return '-'

                    // Map location → departments → roles
                    const locationBlocks = user.locations.map((location) => {
                        const departmentBlocks =
                            location.departments?.map((dept) => {
                                const roleNames =
                                    dept.roles
                                        ?.map((role) =>
                                            role.name
                                                ? `<b>${role.name}</b>`
                                                : '',
                                        )
                                        .filter(Boolean) ?? []
                                return `${dept.name}: ${roleNames.join(' | ')}`
                            }) ?? []

                        return `${location.name} → ${departmentBlocks.join(' ; ')}`
                    })

                    return (
                        <span
                            dangerouslySetInnerHTML={{
                                __html: locationBlocks.join(' || '),
                            }}
                        />
                    )
                },
            },
            {
                header: '',
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
