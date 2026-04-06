import { useMemo } from 'react'
import ActionColumn from '@/components/form/ActionColumn'
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
import useAuth from '@/auth/useAuth'

const UserListTable = () => {
    const navigate = useNavigate()
    const { can } = useAuth()

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
                            roles?: {
                                id: number
                                name: string
                            }[]
                            departments?: {
                                id: number
                                name: string
                                roles?: {
                                    id: number
                                    name: string
                                }[]
                            }[]
                        }[]
                    }

                    if (!user.locations || user.locations.length === 0)
                        return '-'

                    const locationBlocks = user.locations.map((location) => {
                        // ✅ 1. LOCATION LEVEL ROLES
                        const locationRoles =
                            location.roles
                                ?.map((role) =>
                                    role.name ? `<b>${role.name}</b>` : '',
                                )
                                .filter(Boolean)
                                .join(' | ') ?? ''

                        // ✅ 2. DEPARTMENT LEVEL ROLES
                        const departmentBlocks =
                            location.departments
                                ?.map((dept) => {
                                    const roleNames =
                                        dept.roles
                                            ?.map((role) =>
                                                role.name
                                                    ? `<b>${role.name}</b>`
                                                    : '',
                                            )
                                            .filter(Boolean)
                                            .join(' | ') ?? ''

                                    return roleNames
                                        ? `${dept.name}: ${roleNames}`
                                        : ''
                                })
                                .filter(Boolean)
                                .join(' ; ') ?? ''

                        // ✅ FINAL COMBINE
                        return `
                <div>
                    <b>${location.name}</b>
                    ${locationRoles ? ` → ${locationRoles}` : ''}
                    ${departmentBlocks ? `<br/>${departmentBlocks}` : ''}
                </div>
            `
                    })

                    return (
                        <span
                            dangerouslySetInnerHTML={{
                                __html: locationBlocks.join('<br/><br/>'),
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
                        buttons={[
                            {
                                icon: <TbPencil />,
                                tooltip: 'Edit',
                                onClick: () => handleEdit(props.row.original),
                                show: can('settings.user.create'),
                            },
                            {
                                icon: <TbEye />,
                                tooltip: 'View',
                                onClick: () =>
                                    handleViewDetails(props.row.original),
                                show: can('settings.user.index'),
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
            selectable={can('settings.user.delete')}
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
