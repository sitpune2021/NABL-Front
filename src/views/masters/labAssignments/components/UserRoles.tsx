/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dropdown, Tag, Button, toast, Notification } from '@/components/ui'
import { HiX } from 'react-icons/hi'
import { TbPlus, TbUsers } from 'react-icons/tb'
import { apiAssignUserRole } from '@/services/LabService'

interface Role {
    id: number
    name: string
}

interface UserRolesProps {
    labId: number
    locationId: number
    userId: number
    roles: Role[]
    assignments: any
    onUpdate: (updater: (prev: any) => any) => void
    getUserById: (id: number) => { id: number; name: string } | undefined
}

const UserRoles = ({
    labId,
    locationId,
    userId,
    roles,
    assignments,
    onUpdate,
    getUserById,
}: UserRolesProps) => {
    const selectedRoleIds: number[] = locationId
        ? (assignments[labId]?.locations?.[locationId]?.users?.[userId]
              ?.roles ?? [])
        : (assignments[labId]?.users?.[userId]?.roles ?? [])

    const isPending = selectedRoleIds.length === 0

    const selectedRoles = roles.filter((r) => selectedRoleIds.includes(r.id))

    const availableRoles = roles.filter((r) => !selectedRoleIds.includes(r.id))

    const toggleRole = async (role: Role) => {
        let action: 'assign' | 'remove' = 'assign'

        onUpdate((prev: any) => {
            const currentRoles = locationId
                ? (prev[labId]?.locations?.[locationId]?.users?.[userId]
                      ?.roles ?? [])
                : (prev[labId]?.users?.[userId]?.roles ?? [])

            const isAssigned = currentRoles.includes(role.id)

            action = isAssigned ? 'remove' : 'assign'

            const updatedRoleIds = isAssigned
                ? currentRoles.filter((id: number) => id !== role.id)
                : [...currentRoles, role.id]

            if (updatedRoleIds.length === 0) {
                if (locationId) {
                    const users = {
                        ...prev[labId]?.locations?.[locationId]?.users,
                    }
                    delete users[userId]

                    return {
                        ...prev,
                        [labId]: {
                            ...prev[labId],
                            locations: {
                                ...prev[labId]?.locations,
                                [locationId]: { users },
                            },
                        },
                    }
                } else {
                    const users = { ...prev[labId]?.users }
                    delete users[userId]

                    return {
                        ...prev,
                        [labId]: {
                            ...prev[labId],
                            users,
                        },
                    }
                }
            }

            if (locationId) {
                return {
                    ...prev,
                    [labId]: {
                        ...prev[labId],
                        locations: {
                            ...prev[labId]?.locations,
                            [locationId]: {
                                users: {
                                    ...prev[labId]?.locations?.[locationId]
                                        ?.users,
                                    [userId]: { roles: updatedRoleIds },
                                },
                            },
                        },
                    },
                }
            }

            return {
                ...prev,
                [labId]: {
                    ...prev[labId],
                    users: {
                        ...prev[labId]?.users,
                        [userId]: { roles: updatedRoleIds },
                    },
                },
            }
        })

        try {
            await apiAssignUserRole({
                lab_id: labId,
                location_id: locationId,
                user_id: userId,
                role_id: role.id,
                action,
            })

            toast.push(
                <Notification type="success">
                    {action === 'assign'
                        ? 'Role assigned successfully'
                        : 'Role removed successfully'}
                </Notification>,
                { placement: 'top-center' },
            )
        } catch (err) {
            console.error(err)

            toast.push(
                <Notification type="danger">Something went wrong</Notification>,
                { placement: 'top-center' },
            )
        }
    }

    return (
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-4 border-b border-gray-50 pb-3">
                <TbUsers className="text-primary" />
                <span className="text-sm font-bold text-gray-700">
                    Roles for
                    <span className="text-primary">
                        {' '}
                        {getUserById(userId)?.name}
                    </span>
                </span>
                {isPending && (
                    <div className="text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded mb-2">
                        Pending: Please assign at least one role
                    </div>
                )}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
                {selectedRoles.length > 0 ? (
                    selectedRoles.map((role) => (
                        <Tag
                            key={role.id}
                            className="bg-primary-subtle text-primary font-bold"
                            suffix={
                                <HiX
                                    className="cursor-pointer ml-1 hover:text-red-500"
                                    onClick={() => toggleRole(role)}
                                />
                            }
                        >
                            {role.name}
                        </Tag>
                    ))
                ) : (
                    <span className="text-xs text-gray-400 italic">
                        No roles assigned
                    </span>
                )}

                {/* Dropdown */}
                <Dropdown
                    renderTitle={
                        <Button
                            size="xs"
                            variant="default"
                            icon={<TbPlus size={14} />}
                            disabled={availableRoles.length === 0}
                        />
                    }
                >
                    <div className="p-2 min-w-[180px]">
                        {availableRoles.length > 0 ? (
                            availableRoles.map((role) => (
                                <Dropdown.Item
                                    key={role.id}
                                    onSelect={() => toggleRole(role)}
                                >
                                    <div className="flex justify-between w-full">
                                        <span className="text-sm text-gray-600">
                                            {role.name}
                                        </span>
                                    </div>
                                </Dropdown.Item>
                            ))
                        ) : (
                            <div className="text-xs text-gray-400 text-center py-2">
                                No roles available
                            </div>
                        )}
                    </div>
                </Dropdown>
            </div>
        </div>
    )
}

export default UserRoles
