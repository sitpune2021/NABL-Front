/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { Avatar, Dropdown, Button, Tooltip } from '@/components/ui'
import { TbPlus } from 'react-icons/tb'
import UserRoles from './UserRoles'
import { HiX } from 'react-icons/hi'

const UserAssignmentRow = ({
    labId,
    locationId,
    users,
    roles,
    assignments,
    onUpdate,
}: any) => {
    const [activeUser, setActiveUser] = useState<string | null>(null)

    const assignedUsers = assignments[labId]?.users || {}

    const getUserById = (id: string) =>
        users.find((u: any) => String(u.id) === String(id))

    const handleRemoveUser = (userId: string) => {
        const updatedUsers = { ...assignedUsers }
        delete updatedUsers[userId]
        onUpdate({
            ...assignments,
            [labId]: { ...assignments[labId], users: updatedUsers },
        })
        if (activeUser === userId) setActiveUser(null)
    }

    const addUser = (userId: string) => {
        onUpdate((prev: any) => ({
            ...prev,
            [labId]: {
                ...prev[labId],
                users: {
                    ...prev[labId]?.users,
                    [userId]: { roles: [] },
                },
            },
        }))
        setActiveUser(userId)
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
                <span
                    className="text-[10px] font-extrabold 
                text-gray-400 uppercase tracking-wider"
                >
                    Assigned User:
                </span>
                <div className="flex items-center gap-2">
                    <Avatar.Group chained maxCount={6}>
                        {Object.keys(assignedUsers).map((userId) => {
                            const user = getUserById(userId)
                            const isActive = activeUser === userId
                            return (
                                <div key={userId} className="relative group">
                                    <Tooltip title={user?.name}>
                                        <div
                                            className={`cursor-pointer transition-transform rounded-full border-2 w-[39px] h-[39px] flex items-center justify-center ${isActive ? 'border-primary' : 'border-transparent hover:scale-105'}`}
                                            onClick={() =>
                                                setActiveUser(userId)
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
                                            handleRemoveUser(userId)
                                        }}
                                    />
                                </div>
                            )
                        })}
                    </Avatar.Group>

                    <Dropdown
                        renderTitle={
                            <Button
                                size="sm"
                                shape="circle"
                                variant="default"
                                icon={<TbPlus />}
                                className="ml-2"
                            />
                        }
                    >
                        <div className="p-2 min-w-[220px]">
                            <div className="max-h-60 overflow-y-auto">
                                {users
                                    .filter((u: any) => !assignedUsers[u.id])
                                    .map((user: any) => (
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
                                    ))}
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
