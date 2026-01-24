/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo, useCallback } from 'react'
import { HiChevronDown, HiX } from 'react-icons/hi'
import {
    TbSearch,
    TbPlus,
    TbShieldCheck,
    TbUsers,
    TbCertificate,
} from 'react-icons/tb'
import { useWatch } from 'react-hook-form'
import { Input, Avatar, Dropdown, Tag, Tooltip, Button } from '@/components/ui'
import useLabList from '../../lab/List/hooks/useList'
import useRolesList from '../../RolesPermissions/hooks/useList'
import useUserList from '../../user/List/hooks/useList'

const LabLocationAssignmentSection = ({ control, setValue }: any) => {
    const { labList = [] } = useLabList()
    const { userList = [] } = useUserList()
    const { rolesList = [] } = useRolesList()
    const [expandedLabId, setExpandedLabId] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState('')

    const watchedAssignments =
        useWatch({ control, name: 'labAssignments' }) || {}

    const filteredLabs = useMemo(
        () =>
            labList.filter((lab: any) =>
                lab.name?.toLowerCase().includes(searchTerm.toLowerCase()),
            ),
        [labList, searchTerm],
    )

    const updateAssignments = useCallback(
        (newData: any) => {
            setValue('labAssignments', newData, {
                shouldDirty: true,
                shouldValidate: true,
            })
        },
        [setValue],
    )

    return (
        <div className="flex flex-col gap-6">
            <h5 className="font-bold text-gray-900">Lab & User Access</h5>
            <Input
                placeholder="Search labs by name..."
                value={searchTerm}
                prefix={<TbSearch className="text-lg opacity-40" />}
                className="w-full bg-gray-50 border-transparent focus:bg-white"
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="flex flex-col gap-4">
                {filteredLabs.map((lab: any) => (
                    <LabCard
                        key={lab.id}
                        lab={lab}
                        expanded={expandedLabId === lab.id}
                        toggleExpand={() =>
                            setExpandedLabId(
                                expandedLabId === lab.id ? null : lab.id,
                            )
                        }
                        allUsers={userList}
                        allRoles={rolesList}
                        selectedData={watchedAssignments}
                        onUpdate={updateAssignments}
                    />
                ))}
            </div>
        </div>
    )
}

const LabCard = ({
    lab,
    expanded,
    toggleExpand,
    allUsers,
    allRoles,
    selectedData,
    onUpdate,
}: any) => (
    <div
        className={`border rounded-xl transition-all 
     duration-300 bg-white 
     ${
         expanded
             ? 'shadow-md border-gray-300'
             : 'border-gray-200 hover:border-gray-300'
     }`}
    >
        <div
            className="flex items-center justify-between 
        p-4 cursor-pointer"
            onClick={toggleExpand}
        >
            <div className="flex items-center gap-4">
                <div
                    className={`w-10 h-10 rounded-lg flex 
                items-center justify-center transition-colors 
                ${expanded ? 'bg-primary-subtle text-primary' : 'bg-gray-100 text-gray-500'}`}
                >
                    <TbCertificate size={22} />
                </div>
                <div className="font-bold text-gray-800">{lab.name}</div>
            </div>
            <Button
                shape="circle"
                variant="plain"
                size="sm"
                icon={
                    <HiChevronDown
                        className={`text-xl transition-transform duration-300 
                ${expanded ? 'rotate-180 text-primary' : 'text-gray-400'}`}
                    />
                }
            />
        </div>
        {expanded && (
            <div className="p-5 border-t border-gray-200 bg-gray-50/30 rounded-b-xl">
                <UserAssignmentRow
                    labId={lab.id}
                    allUsers={allUsers}
                    allRoles={allRoles}
                    selectedData={selectedData}
                    onUpdate={onUpdate}
                />
            </div>
        )}
    </div>
)

const UserAssignmentRow = ({
    labId,
    allUsers,
    allRoles,
    selectedData,
    onUpdate,
}: any) => {
    const [activeUserId, setActiveUserId] = useState<string | null>(null)
    const assignedUsers = selectedData[labId]?.users || {}
    const getUserById = (id: string) =>
        allUsers.find((u: any) => String(u.id) === String(id))

    const handleAddUser = (userId: string) => {
        const newData = {
            ...selectedData,
            [labId]: {
                ...selectedData[labId],
                users: { ...assignedUsers, [userId]: { roles: [] } },
            },
        }
        onUpdate(newData)
        setActiveUserId(userId)
    }

    const handleRemoveUser = (userId: string) => {
        const updatedUsers = { ...assignedUsers }
        delete updatedUsers[userId]
        onUpdate({
            ...selectedData,
            [labId]: { ...selectedData[labId], users: updatedUsers },
        })
        if (activeUserId === userId) setActiveUserId(null)
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
                            const isActive = activeUserId === userId
                            return (
                                <div key={userId} className="relative group">
                                    <Tooltip title={user?.name}>
                                        <div
                                            className={`cursor-pointer transition-transform rounded-full border-2 w-[39px] h-[39px] flex items-center justify-center ${isActive ? 'border-primary' : 'border-transparent hover:scale-105'}`}
                                            onClick={() =>
                                                setActiveUserId(userId)
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
                            <div className="px-3 py-2 text-xs font-bold text-gray-400 uppercase">
                                Select Users
                            </div>
                            <div className="max-h-60 overflow-y-auto">
                                {allUsers
                                    .filter((u: any) => !assignedUsers[u.id])
                                    .map((user: any) => (
                                        <Dropdown.Item
                                            key={user.id}
                                            onSelect={() =>
                                                handleAddUser(user.id)
                                            }
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
            {activeUserId && (
                <UserRoles
                    labId={labId}
                    userId={activeUserId}
                    allRoles={allRoles}
                    selectedData={selectedData}
                    getUserById={getUserById}
                    onUpdate={onUpdate}
                />
            )}
        </div>
    )
}

const UserRoles = ({
    labId,
    userId,
    allRoles,
    selectedData,
    onUpdate,
    getUserById,
}: any) => {
    const roles = selectedData[labId]?.users[userId]?.roles || []

    const toggleRole = (role: any) => {
        const isSelected = roles.some((r: any) => r.id === role.id)
        const updatedRoles = isSelected
            ? roles.filter((r: any) => r.id !== role.id)
            : [...roles, role]

        onUpdate({
            ...selectedData,
            [labId]: {
                ...selectedData[labId],
                users: {
                    ...selectedData[labId].users,
                    [userId]: {
                        ...selectedData[labId].users[userId],
                        roles: updatedRoles,
                    },
                },
            },
        })
    }

    return (
        <div
            className="bg-white border 
        border-gray-100 rounded-xl p-4 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200"
        >
            <div className="flex items-center gap-2 mb-4 border-b border-gray-50 pb-3">
                <TbUsers className="text-primary" />
                <span className="text-sm font-bold text-gray-700">
                    Roles for
                    <span className="text-primary">
                        {getUserById(userId)?.name}
                    </span>
                </span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
                {roles.map((role: any) => (
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
                        <div className="px-2 py-1 text-[10px] font-bold text-gray-400 uppercase">
                            Available Roles
                        </div>
                        {allRoles.map((role: any) => {
                            const isSelected = roles.some(
                                (r: any) => r.id === role.id,
                            )
                            return (
                                <Dropdown.Item
                                    key={role.id}
                                    onSelect={() => toggleRole(role)}
                                >
                                    <div className="flex items-center justify-between w-full">
                                        <span
                                            className={`text-sm ${isSelected ? 'text-primary font-bold' : 'text-gray-600'}`}
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

export default LabLocationAssignmentSection
