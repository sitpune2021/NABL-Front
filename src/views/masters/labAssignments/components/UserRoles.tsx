/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dropdown, Tag, Button } from '@/components/ui'
import { HiX } from 'react-icons/hi'
import { TbPlus, TbShieldCheck, TbUsers } from 'react-icons/tb'
import { apiAssignUserRole } from '@/services/LabService'

/* =======================
   Types
======================= */

interface Role {
    id: number
    name: string
}

interface UserRolesProps {
    labId: number
    locationId: number
    userId: number
    roles: Role[]
    assignments: Record<
        number,
        {
            locations: any
            users: Record<
                number,
                {
                    roles: number[] // IMPORTANT: IDs only
                }
            >
        }
    >
    onUpdate: (updater: (prev: any) => any) => void
    getUserById: (id: number) => { id: number; name: string } | undefined
}

/* =======================
   Component
======================= */

const UserRoles = ({
    labId,
    locationId,
    userId,
    roles,
    assignments,
    onUpdate,
    getUserById,
}: UserRolesProps) => {
    /* -----------------------
       Source of truth (IDs)
    ----------------------- */
    const selectedRoleIds: number[] = locationId
        ? (assignments[labId]?.locations?.[locationId]?.users?.[userId]
              ?.roles ?? [])
        : (assignments[labId]?.users?.[userId]?.roles ?? [])

    const selectedRoles = roles.filter((role: Role) =>
        selectedRoleIds.includes(role.id),
    )

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
                                    [userId]: {
                                        roles: updatedRoleIds,
                                    },
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
                        [userId]: {
                            roles: updatedRoleIds,
                        },
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
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4 border-b border-gray-50 pb-3">
                <TbUsers className="text-primary" />
                <span className="text-sm font-bold text-gray-700">
                    Roles for
                    <span className="text-primary">
                        {' '}
                        {getUserById(userId)?.name}
                    </span>
                </span>
            </div>

            {/* Selected roles */}
            <div className="flex items-center gap-2 flex-wrap">
                {selectedRoles.map((role: Role) => (
                    <Tag
                        key={role.id}
                        className="bg-primary-subtle text-primary border-primary-subtle font-bold"
                        suffix={
                            <HiX
                                className="cursor-pointer ml-1 hover:text-red-500"
                                onClick={() => toggleRole(role)}
                            />
                        }
                    >
                        {role.name}
                    </Tag>
                ))}

                {/* Dropdown */}
                <Dropdown
                    renderTitle={
                        <Button
                            size="xs"
                            variant="default"
                            icon={<TbPlus size={14} />}
                        />
                    }
                >
                    <div className="p-2 min-w-[180px]">
                        {roles.map((role: Role) => {
                            const isSelected = selectedRoleIds.includes(role.id)

                            return (
                                <Dropdown.Item
                                    key={role.id}
                                    onSelect={() => toggleRole(role)}
                                >
                                    <div className="flex items-center justify-between w-full">
                                        <span
                                            className={`text-sm ${
                                                isSelected
                                                    ? 'text-primary font-bold'
                                                    : 'text-gray-600'
                                            }`}
                                        >
                                            {role.name}
                                        </span>

                                        {isSelected && (
                                            <TbShieldCheck className="text-primary text-lg" />
                                        )}
                                    </div>
                                </Dropdown.Item>
                            )
                        })}
                    </div>
                </Dropdown>
            </div>
        </div>
    )
}

export default UserRoles
