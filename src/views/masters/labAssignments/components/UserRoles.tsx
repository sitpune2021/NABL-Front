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
    const selectedRoleIds: number[] =
        assignments[labId]?.users[userId]?.roles ?? []

    /* -----------------------
       Derived data for UI
    ----------------------- */
    const selectedRoles: Role[] = roles.filter((role) =>
        selectedRoleIds.includes(role.id),
    )

    /* -----------------------
       Toggle handler
    ----------------------- */
    const toggleRole = async (role: Role) => {
        const isAssigned = selectedRoleIds.includes(role.id)

        // 1️⃣ Optimistic UI update
        onUpdate((prev) => {
            const updatedRoleIds = isAssigned
                ? selectedRoleIds.filter((id) => id !== role.id)
                : [...selectedRoleIds, role.id]

            return {
                ...prev,
                [labId]: {
                    ...prev[labId],
                    users: {
                        ...prev[labId].users,
                        [userId]: {
                            roles: updatedRoleIds,
                        },
                    },
                },
            }
        })

        // 2️⃣ API call
        try {
            await apiAssignUserRole({
                lab_id: labId,
                location_id: locationId,
                user_id: userId,
                role_id: role.id,
                action: isAssigned ? 'remove' : 'assign',
            })
        } catch (error) {
            console.error('Role update failed', error)

            // 3️⃣ Rollback on failure
            onUpdate((prev) => ({
                ...prev,
                [labId]: {
                    ...prev[labId],
                    users: {
                        ...prev[labId].users,
                        [userId]: {
                            roles: selectedRoleIds,
                        },
                    },
                },
            }))
        }
    }

    /* =======================
       Render
    ======================== */

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
                {selectedRoles.map((role) => (
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
                        {roles.map((role) => {
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
