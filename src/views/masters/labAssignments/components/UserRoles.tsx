/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dropdown, Tag, Button } from '@/components/ui'
import { HiX } from 'react-icons/hi'
import { TbPlus, TbShieldCheck, TbUsers } from 'react-icons/tb'
import { apiAssignUserRole } from '@/services/LabService'

const UserRoles = ({
    labId,
    locationId,
    userId,
    roles,
    assignments,
    onUpdate,
    getUserById,
}: any) => {
    const selectedRoles = assignments[labId]?.users[userId]?.roles || []

    const toggleRole = async (role: any) => {
        const exists = selectedRoles.some((r: any) => r.id === role.id)

        // 1️⃣ Optimistic UI update
        onUpdate((prev: any) => {
            const updatedRoles = exists
                ? selectedRoles.filter((r: any) => r.id !== role.id)
                : [...selectedRoles, role]

            return {
                ...prev,
                [labId]: {
                    ...prev[labId],
                    users: {
                        ...prev[labId].users,
                        [userId]: { roles: updatedRoles },
                    },
                },
            }
        })

        // 2️⃣ API call ONLY here
        try {
            await apiAssignUserRole({
                lab_id: labId,
                location_id: locationId,
                user_id: Number(userId),
                role_id: role.id,
                action: exists ? 'remove' : 'assign',
            })
        } catch (err) {
            console.error(err)

            // 3️⃣ Rollback if API fails
            onUpdate((prev: any) => ({
                ...prev,
                [labId]: {
                    ...prev[labId],
                    users: {
                        ...prev[labId].users,
                        [userId]: { roles: selectedRoles },
                    },
                },
            }))
        }
    }

    return (
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
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
            <div className="flex items-center gap-2 flex-wrap">
                {selectedRoles.map((r: any) => (
                    <Tag
                        key={r.id}
                        className="bg-primary-subtle text-primary border-primary-subtle font-bold"
                        suffix={
                            <HiX
                                className="cursor-pointer ml-1 hover:text-red-500"
                                onClick={() => toggleRole(r)}
                            />
                        }
                    >
                        {r.name}
                    </Tag>
                ))}

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
                        {roles.map((role: any) => (
                            <Dropdown.Item
                                key={role.id}
                                onSelect={() => toggleRole(role)}
                            >
                                <div className="flex items-center justify-between w-full">
                                    <span
                                        className={`text-sm ${
                                            selectedRoles.some(
                                                (sr: any) => sr.id === role.id,
                                            )
                                                ? 'text-primary font-bold'
                                                : 'text-gray-600'
                                        }`}
                                    >
                                        {role.name}
                                    </span>
                                    {selectedRoles.some(
                                        (sr: any) => sr.id === role.id,
                                    ) && (
                                        <TbShieldCheck className="text-primary text-lg" />
                                    )}
                                </div>
                            </Dropdown.Item>
                        ))}
                    </div>
                </Dropdown>
            </div>
        </div>
    )
}

export default UserRoles
