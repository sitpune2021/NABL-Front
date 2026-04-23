/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import {
    Avatar,
    Dropdown,
    Button,
    Tooltip,
    toast,
    Notification,
} from '@/components/ui'
import { TbPlus } from 'react-icons/tb'
import UserRoles from './UserRoles'
import { HiX } from 'react-icons/hi'
import { apiAssignUserRole } from '@/services/LabService'

const UserAssignmentRow = ({
    labId,
    locationId,
    users,
    roles,
    assignments,
    onUpdate,
    assingn,
}: any) => {
    console.log(assingn)

    const [activeUser, setActiveUser] = useState<number | null>(null)

    const assignedUsers = locationId
        ? assignments[labId]?.locations?.[locationId]?.users || {}
        : assignments[labId]?.users || {}

    const assignedUserIds = Object.keys(assignedUsers)

    const availableUsers = users.filter((u: any) => !assignedUsers[u.id])

    const getUserById = (id: number) =>
        users.find((u: any) => Number(u.id) === Number(id))

    const handleRemoveUser = async (userId: number) => {
        const roles = locationId
            ? assignments[labId]?.locations?.[locationId]?.users?.[userId]
                  ?.roles || []
            : assignments[labId]?.users?.[userId]?.roles || []

        const userName = getUserById(userId)?.name || 'User'

        try {
            await Promise.all(
                roles.map((roleId: number) =>
                    apiAssignUserRole({
                        lab_id: labId,
                        location_id: locationId,
                        user_id: userId,
                        role_id: roleId,
                        action: 'remove',
                    }),
                ),
            )

            //  remove from UI
            onUpdate((prev: any) => {
                if (locationId) {
                    const updatedUsers = {
                        ...prev[labId]?.locations?.[locationId]?.users,
                    }
                    delete updatedUsers[userId]

                    return {
                        ...prev,
                        [labId]: {
                            ...prev[labId],
                            locations: {
                                ...prev[labId]?.locations,
                                [locationId]: {
                                    users: updatedUsers,
                                },
                            },
                        },
                    }
                }

                const updatedUsers = { ...prev[labId]?.users }
                delete updatedUsers[userId]

                return {
                    ...prev,
                    [labId]: {
                        ...prev[labId],
                        users: updatedUsers,
                    },
                }
            })

            if (activeUser === userId) {
                setActiveUser(null)
            }

            toast.push(
                <Notification type="success">
                    {userName} removed successfully
                </Notification>,
                { placement: 'top-center' },
            )
        } catch (error) {
            console.log(error)
            toast.push(
                <Notification type="danger">
                    Failed to remove {userName}
                </Notification>,
                { placement: 'top-center' },
            )
        }
    }

    const addUser = (userId: number) => {
        if (assignedUsers[userId]) return
        onUpdate((prev: any) => {
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
                                    [userId]: { roles: [] },
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
                        [userId]: { roles: [] },
                    },
                },
            }
        })

        setActiveUser(userId)
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
                <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">
                    Assigned User:
                </span>
                <div className="flex items-center gap-2">
                    {assignedUserIds.length > 0 ? (
                        <Avatar.Group chained maxCount={6}>
                            {assignedUserIds.map((userId) => {
                                const userRoles =
                                    assignedUsers[userId]?.roles || []
                                const isPending = userRoles.length === 0
                                const user = getUserById(Number(userId))
                                const isActive = activeUser === Number(userId)

                                return (
                                    <div
                                        key={userId}
                                        className="relative group"
                                    >
                                        <Tooltip title={user?.name}>
                                            <div
                                                className={`cursor-pointer transition-transform rounded-full border-2 w-[39px] h-[39px] flex items-center justify-center ${
                                                    isActive
                                                        ? 'border-primary'
                                                        : 'border-transparent hover:scale-105'
                                                }`}
                                                onClick={() =>
                                                    setActiveUser(
                                                        Number(userId),
                                                    )
                                                }
                                            >
                                                <Avatar
                                                    size={36}
                                                    shape="circle"
                                                    src={user?.img}
                                                />
                                            </div>
                                        </Tooltip>
                                        <Button
                                            shape="circle"
                                            size="xs"
                                            variant="solid"
                                            color="red-600"
                                            className="absolute -top-1 -right-1 !w-4 !h-4 opacity-0 group-hover:opacity-100 transition-opacity z-20"
                                            icon={<HiX size={8} />}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleRemoveUser(Number(userId))
                                            }}
                                        />
                                        {isPending ? (
                                            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[8px] bg-yellow-100 text-yellow-600 px-1 rounded">
                                                Pending
                                            </span>
                                        ) : (
                                            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[8px] bg-green-100 text-green-600 px-1 rounded">
                                                Assigned
                                            </span>
                                        )}
                                    </div>
                                )
                            })}
                        </Avatar.Group>
                    ) : (
                        <span className="text-sm text-gray-400 italic">
                            No users assigned
                        </span>
                    )}

                    <Dropdown
                        renderTitle={
                            <Button
                                size="sm"
                                shape="circle"
                                variant="default"
                                icon={<TbPlus />}
                                className="ml-2"
                                disabled={availableUsers.length === 0}
                            />
                        }
                    >
                        <div className="p-2 min-w-[220px]">
                            <div className="max-h-60 overflow-y-auto">
                                {availableUsers.length > 0 ? (
                                    availableUsers.map((user: any) => (
                                        <Dropdown.Item
                                            key={user.id}
                                            onSelect={() => addUser(user.id)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Avatar
                                                    size={25}
                                                    src={user.img}
                                                    shape="circle"
                                                />
                                                <span className="text-sm font-semibold">
                                                    {user.name}
                                                </span>
                                            </div>
                                        </Dropdown.Item>
                                    ))
                                ) : (
                                    <div className="text-xs text-gray-400 px-2 py-2 text-center">
                                        No users available
                                    </div>
                                )}
                            </div>
                        </div>
                    </Dropdown>
                </div>
            </div>

            {activeUser && (
                <UserRoles
                    labId={labId}
                    locationId={locationId}
                    userId={activeUser}
                    roles={roles}
                    assignments={assignments}
                    getUserById={getUserById}
                    onUpdate={onUpdate}
                />
            )}
        </div>
    )
}

export default UserAssignmentRow
