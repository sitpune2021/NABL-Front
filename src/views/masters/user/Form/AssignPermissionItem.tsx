/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react'
import { Controller, useWatch } from 'react-hook-form'
import Card from '@/components/ui/Card'
import { FormItem } from '@/components/ui/Form'
import { Checkbox, Select, Button } from '@/components/ui'
import { HiMinus } from 'react-icons/hi'
import { FormSectionBaseProps } from '@/@types/user'
import useZoneList from '../../zone/List/hooks/useList'
import useClusterList from '../../cluster/List/hooks/useList'
import useLocationList from '../../location/List/hooks/useList'
import useRolesList from '../../roles/List/hooks/useList'
import useDepartmentList from '../../department/List/hooks/useList'

const accessModules = [
    {
        id: 'category',
        name: 'Category Management',
        accessor: ['read', 'write', 'delete'],
    },
    {
        id: 'subcategory',
        name: 'Subcategory Management',
        accessor: ['read', 'write', 'delete'],
    },
    {
        id: 'department',
        name: 'Department Management',
        accessor: ['read', 'write', 'delete'],
    },
    {
        id: 'template',
        name: 'Template Management',
        accessor: ['read', 'write', 'delete'],
    },
    {
        id: 'document',
        name: 'Document Management',
        accessor: ['read', 'write', 'data-entry', 'data-review', 'delete'],
    },
    {
        id: 'lab',
        name: 'Lab Management',
        accessor: ['read', 'write', 'delete'],
    },
    {
        id: 'unit',
        name: 'Unit Management',
        accessor: ['read', 'write', 'delete'],
    },
    {
        id: 'rolesPermission',
        name: 'Roles & Permissions',
        accessor: ['read', 'write', 'delete'],
    },
    {
        id: 'user',
        name: 'User Management',
        accessor: ['read', 'write', 'delete'],
    },
    {
        id: 'clauses',
        name: 'Clauses Management',
        accessor: ['read', 'write', 'delete'],
    },
    {
        id: 'signatoryBy',
        name: 'Signatory By Management',
        accessor: ['read', 'write', 'delete'],
    },
    {
        id: 'signatoryOn',
        name: 'Signatory On Management',
        accessor: ['read', 'write', 'delete'],
    },
]

type RoleType = {
    name: string
    accessRight?: Record<string, string[]>
}

type Option = { label: string; value: string }

export type AssignPermissionItemProps = {
    index: number
    item: any
    onRemove?: () => void
} & FormSectionBaseProps

const AssignPermissionItem = ({
    control,
    errors,
    readOnly = false,
    index,
    item,
    onRemove,
}: AssignPermissionItemProps) => {
    const { zoneList } = useZoneList()
    const { clusterList } = useClusterList()
    const { locationList } = useLocationList()
    const { rolesList } = useRolesList()
    const { departmentList } = useDepartmentList()

    const [rolePermissions, setRolePermissions] = useState<
        Record<string, Record<string, string[]>>
    >({})

    const selectedZone = useWatch({
        control,
        name: `userRoles.${index}.zone_name`,
    })
    const selectedCluster = useWatch({
        control,
        name: `userRoles.${index}.cluster_name`,
    })
    const selectedRoles =
        useWatch({ control, name: `userRoles.${index}.roles` }) || []

    const zoneOptions: Option[] = zoneList.map((z: { zone_name: string }) => ({
        label: z.zone_name,
        value: z.zone_name,
    }))

    const clusterOptions: Option[] = clusterList
        .filter((c: { zone_name: string }) => c.zone_name === selectedZone)
        .map((c: { cluster_name: string }) => ({
            label: c.cluster_name,
            value: c.cluster_name,
        }))

    const locationOptions: Option[] = locationList
        .filter(
            (l: { cluster_name: string }) => l.cluster_name === selectedCluster,
        )
        .map((l: { location_name: string }) => ({
            label: l.location_name,
            value: l.location_name,
        }))

    const roleOptions: Option[] = (rolesList as RoleType[]).map((r) => ({
        label: r.name,
        value: r.name,
    }))

    const departmentOptions: Option[] = departmentList.map(
        (d: { name: string }) => ({
            label: d.name,
            value: d.name,
        }),
    )

    useEffect(() => {
        if (Array.isArray(selectedRoles) && selectedRoles.length > 0) {
            const newPermissions: Record<string, Record<string, string[]>> = {}
            selectedRoles.forEach((roleObj: any) => {
                const roleName = roleObj?.value
                if (!roleName) return
                const roleData = (rolesList as RoleType[]).find(
                    (r) => r.name === roleName,
                )
                newPermissions[roleName] = roleData?.accessRight ?? {}
            })
            setRolePermissions(newPermissions)
        } else {
            setRolePermissions({})
        }
    }, [JSON.stringify(selectedRoles), rolesList])

    const togglePermission = (
        role: string,
        moduleId: string,
        accessValue: string,
    ) => {
        if (readOnly) return

        setRolePermissions((prev) => {
            const rolePerms = prev[role] || {}
            const modulePerms = rolePerms[moduleId] || []
            const updatedModulePerms = modulePerms.includes(accessValue)
                ? modulePerms.filter((v) => v !== accessValue)
                : [...modulePerms, accessValue]

            return {
                ...prev,
                [role]: { ...rolePerms, [moduleId]: updatedModulePerms },
            }
        })
    }

    return (
        <Card key={item.id} className="mt-4">
            <div className="flex items-center justify-between mb-4">
                {!readOnly && onRemove && (
                    <Button
                        type="button"
                        size="xs"
                        icon={<HiMinus />}
                        onClick={onRemove}
                    ></Button>
                )}
            </div>

            <div className="grid md:grid-cols-3 gap-4 p-3 mb-3">
                <FormItem
                    label="Zone"
                    invalid={!!errors.userRoles?.[index]?.zone_name}
                    errorMessage={errors.userRoles?.[index]?.zone_name?.message}
                >
                    <Controller
                        name={`userRoles.${index}.zone_name`}
                        control={control}
                        render={({ field }) => (
                            <Select
                                placeholder="Select Zone"
                                options={zoneOptions}
                                value={zoneOptions.find(
                                    (o) => o.value === field.value,
                                )}
                                isDisabled={readOnly}
                                onChange={(selected) =>
                                    field.onChange(selected?.value || '')
                                }
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label="Cluster"
                    invalid={!!errors.userRoles?.[index]?.cluster_name}
                    errorMessage={
                        errors.userRoles?.[index]?.cluster_name?.message
                    }
                >
                    <Controller
                        name={`userRoles.${index}.cluster_name`}
                        control={control}
                        render={({ field }) => (
                            <Select
                                placeholder={
                                    selectedZone
                                        ? 'Select Cluster'
                                        : 'Select Zone'
                                }
                                options={clusterOptions}
                                isDisabled={readOnly || !selectedZone}
                                value={clusterOptions.find(
                                    (o) => o.value === field.value,
                                )}
                                onChange={(selected) =>
                                    field.onChange(selected?.value || '')
                                }
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label="Location"
                    invalid={!!errors.userRoles?.[index]?.location_name}
                    errorMessage={
                        errors.userRoles?.[index]?.location_name?.message
                    }
                >
                    <Controller
                        name={`userRoles.${index}.location_name`}
                        control={control}
                        render={({ field }) => (
                            <Select
                                placeholder={
                                    selectedCluster
                                        ? 'Select Location'
                                        : 'Select Cluster'
                                }
                                options={locationOptions}
                                isDisabled={readOnly || !selectedCluster}
                                value={locationOptions.find(
                                    (o) => o.value === field.value,
                                )}
                                onChange={(selected) =>
                                    field.onChange(selected?.value || '')
                                }
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label="Department"
                    invalid={!!errors.userRoles?.[index]?.department_name}
                    errorMessage={
                        errors.userRoles?.[index]?.department_name?.message
                    }
                >
                    <Controller
                        name={`userRoles.${index}.department_name`}
                        control={control}
                        render={({ field }) => (
                            <Select
                                placeholder="Select Department"
                                options={departmentOptions}
                                value={departmentOptions.find(
                                    (o) => o.value === field.value,
                                )}
                                isDisabled={readOnly}
                                onChange={(selected) =>
                                    field.onChange(selected?.value || '')
                                }
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Roles"
                    invalid={!!errors.userRoles?.[index]?.roles}
                    errorMessage={errors.userRoles?.[index]?.roles?.message}
                >
                    <Controller
                        name={`userRoles.${index}.roles`}
                        control={control}
                        render={({ field }) => (
                            <Select
                                isMulti
                                placeholder="Select Roles"
                                options={roleOptions}
                                value={roleOptions.filter((o) =>
                                    field.value?.some(
                                        (v: any) => v.value === o.value,
                                    ),
                                )}
                                isDisabled={readOnly}
                                onChange={(selected) =>
                                    field.onChange(selected || [])
                                }
                            />
                        )}
                    />
                </FormItem>
            </div>

            {selectedRoles?.length > 0 && (
                <div className="mt-4">
                    {selectedRoles.map((roleObj: any) => {
                        const role = roleObj.value
                        return (
                            <div
                                key={role}
                                className="mb-6 border border-gray-200 rounded-lg bg-white"
                            >
                                <div className="bg-indigo-50 px-4 py-2 border-b border-gray-200">
                                    <h5 className="text-md font-semibold text-indigo-700">
                                        Permissions for: {role}
                                    </h5>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full text-sm">
                                        <thead className="bg-indigo-100">
                                            <tr>
                                                <th className="px-4 py-2 text-left">
                                                    Module
                                                </th>
                                                {[
                                                    'Read',
                                                    'Write',
                                                    'Delete',
                                                    'Data Entry',
                                                    'Data Review',
                                                ].map((header) => (
                                                    <th
                                                        key={header}
                                                        className="px-3 py-2 text-center"
                                                    >
                                                        {header}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {accessModules.map((mod, idx) => (
                                                <tr
                                                    key={mod.id}
                                                    className={
                                                        idx % 2 === 0
                                                            ? 'bg-white'
                                                            : 'bg-gray-50'
                                                    }
                                                >
                                                    <td className="px-4 py-2 border-t font-medium text-gray-700">
                                                        {mod.name}
                                                    </td>
                                                    {[
                                                        'read',
                                                        'write',
                                                        'delete',
                                                        'data-entry',
                                                        'data-review',
                                                    ].map((perm) => (
                                                        <td
                                                            key={perm}
                                                            className="text-center border-t px-2"
                                                        >
                                                            {mod.accessor.includes(
                                                                perm,
                                                            ) ? (
                                                                <Checkbox
                                                                    checked={
                                                                        rolePermissions[
                                                                            role
                                                                        ]?.[
                                                                            mod
                                                                                .id
                                                                        ]?.includes(
                                                                            perm,
                                                                        ) ||
                                                                        false
                                                                    }
                                                                    disabled={
                                                                        readOnly
                                                                    }
                                                                    onChange={() =>
                                                                        togglePermission(
                                                                            role,
                                                                            mod.id,
                                                                            perm,
                                                                        )
                                                                    }
                                                                />
                                                            ) : (
                                                                <span className="text-gray-400">
                                                                    —
                                                                </span>
                                                            )}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </Card>
    )
}

export default AssignPermissionItem
