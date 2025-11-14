/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react'
import { Controller, useWatch, useFormContext } from 'react-hook-form'
import Card from '@/components/ui/Card'
import { FormItem } from '@/components/ui/Form'
import { Checkbox, Select, Button } from '@/components/ui'
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

const maxBlocks = 10

const AssignPermissionSection: React.FC<FormSectionBaseProps> = ({
    control,
}) => {
    // ✅ Safe access: handle case when component is rendered outside a FormProvider
    const formContext = useFormContext()
    const setValue = formContext?.setValue ?? (() => {})

    const { zoneList } = useZoneList()
    const { clusterList } = useClusterList()
    const { locationList } = useLocationList()
    const { rolesList } = useRolesList()
    const { departmentList } = useDepartmentList()

    const [blocks, setBlocks] = useState<number[]>([0])
    const [rolePermissions, setRolePermissions] = useState<Record<number, any>>(
        {},
    )

    const watched = useWatch({ control })

    const zoneOptions = zoneList.map((z: any) => ({
        label: z.zone_name,
        value: z.zone_name,
    }))
    const roleOptions = rolesList.map((r: any) => ({
        label: r.name,
        value: r.name,
    }))
    const departmentOptions = departmentList.map((d: any) => ({
        label: d.name,
        value: d.name,
    }))

    useEffect(() => {
        blocks.forEach((index) => {
            const selectedRoles = watched?.[`role_${index}`] || []
            const newPerms: any = {}

            selectedRoles.forEach((roleObj: any) => {
                const roleData = rolesList.find(
                    (r: any) => r.name === roleObj.value,
                )
                if (roleData?.accessRight) {
                    newPerms[roleObj.value] = { ...roleData.accessRight }
                }
            })

            setRolePermissions((prev) => ({
                ...prev,
                [index]: newPerms,
            }))
        })
    }, [watched, rolesList, blocks])

    const togglePermission = (
        index: number,
        role: string,
        moduleId: string,
        perm: string,
    ) => {
        setRolePermissions((prev) => {
            const current = prev[index]?.[role]?.[moduleId] || []
            const updated = current.includes(perm)
                ? current.filter((p: string) => p !== perm)
                : [...current, perm]

            return {
                ...prev,
                [index]: {
                    ...prev[index],
                    [role]: {
                        ...prev[index]?.[role],
                        [moduleId]: updated,
                    },
                },
            }
        })
    }

    const addBlock = () => {
        if (blocks.length < maxBlocks) setBlocks([...blocks, blocks.length])
    }

    return (
        <Card>
            <h4 className="text-xl font-semibold mb-4">
                Assign Roles & Permissions
            </h4>

            {blocks.map((index) => {
                const selectedZone = watched?.[`zone_name_${index}`]
                const selectedCluster = watched?.[`cluster_name_${index}`]
                const filteredClusters = clusterList.filter(
                    (c) => c.zone_name === selectedZone,
                )
                const filteredLocations = locationList.filter(
                    (l) => l.cluster_name === selectedCluster,
                )
                const selectedRoles = watched?.[`role_${index}`] || []

                return (
                    <div
                        key={index}
                        className="border p-4 rounded-lg mb-4 bg-white"
                    >
                        <div className="grid md:grid-cols-4 gap-4 mb-4">
                            {/* Zone */}
                            <FormItem label="Zone">
                                <Controller
                                    name={`zone_name_${index}`}
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            options={zoneOptions}
                                            value={
                                                zoneOptions.find(
                                                    (o) =>
                                                        o.value === field.value,
                                                ) || null
                                            }
                                            placeholder="Select zone"
                                            onChange={(val) => {
                                                field.onChange(val?.value)
                                                setValue(
                                                    `cluster_name_${index}`,
                                                    '',
                                                )
                                                setValue(
                                                    `location_name_${index}`,
                                                    '',
                                                )
                                                setValue(
                                                    `department_name_${index}`,
                                                    '',
                                                )
                                            }}
                                        />
                                    )}
                                />
                            </FormItem>

                            {/* Cluster */}
                            <FormItem label="Cluster">
                                <Controller
                                    name={`cluster_name_${index}`}
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            options={filteredClusters.map(
                                                (c) => ({
                                                    label: c.cluster_name,
                                                    value: c.cluster_name,
                                                }),
                                            )}
                                            value={
                                                filteredClusters
                                                    .map((c) => ({
                                                        label: c.cluster_name,
                                                        value: c.cluster_name,
                                                    }))
                                                    .find(
                                                        (o) =>
                                                            o.value ===
                                                            field.value,
                                                    ) || null
                                            }
                                            placeholder="Select cluster"
                                            onChange={(val) => {
                                                field.onChange(val?.value)
                                                setValue(
                                                    `location_name_${index}`,
                                                    '',
                                                )
                                                setValue(
                                                    `department_name_${index}`,
                                                    '',
                                                )
                                            }}
                                        />
                                    )}
                                />
                            </FormItem>

                            {/* Location */}
                            <FormItem label="Location">
                                <Controller
                                    name={`location_name_${index}`}
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            options={filteredLocations.map(
                                                (l) => ({
                                                    label: l.location_name,
                                                    value: l.location_name,
                                                }),
                                            )}
                                            value={
                                                filteredLocations
                                                    .map((l) => ({
                                                        label: l.location_name,
                                                        value: l.location_name,
                                                    }))
                                                    .find(
                                                        (o) =>
                                                            o.value ===
                                                            field.value,
                                                    ) || null
                                            }
                                            placeholder="Select location"
                                            onChange={(val) =>
                                                field.onChange(val?.value)
                                            }
                                        />
                                    )}
                                />
                            </FormItem>

                            {/* Department */}
                            <FormItem label="Department">
                                <Controller
                                    name={`department_name_${index}`}
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            options={departmentOptions}
                                            value={
                                                departmentOptions.find(
                                                    (o) =>
                                                        o.value === field.value,
                                                ) || null
                                            }
                                            placeholder="Select department"
                                            onChange={(val) =>
                                                field.onChange(val?.value)
                                            }
                                        />
                                    )}
                                />
                            </FormItem>

                            {/* Roles */}
                            <FormItem label="Roles">
                                <Controller
                                    name={`role_${index}`}
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            isMulti
                                            options={roleOptions}
                                            value={field.value}
                                            placeholder="Select roles"
                                            onChange={field.onChange}
                                        />
                                    )}
                                />
                            </FormItem>
                        </div>

                        {/* Role Permissions */}
                        {selectedRoles.length > 0 &&
                            selectedRoles.map((roleObj: any) => (
                                <div
                                    key={roleObj.value}
                                    className="border rounded mt-4"
                                >
                                    <div className="bg-gray-50 px-4 py-2 font-semibold">
                                        {roleObj.value}
                                    </div>
                                    <table className="min-w-full text-sm">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="px-4 py-2 text-left">
                                                    Module
                                                </th>
                                                {[
                                                    'read',
                                                    'write',
                                                    'delete',
                                                    'data-entry',
                                                    'data-review',
                                                ].map((perm) => (
                                                    <th
                                                        key={perm}
                                                        className="px-2 text-center capitalize"
                                                    >
                                                        {perm}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {accessModules.map((mod) => (
                                                <tr key={mod.id}>
                                                    <td className="px-4 py-2 border">
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
                                                            className="text-center border"
                                                        >
                                                            {mod.accessor.includes(
                                                                perm,
                                                            ) ? (
                                                                <Checkbox
                                                                    checked={
                                                                        rolePermissions[
                                                                            index
                                                                        ]?.[
                                                                            roleObj
                                                                                .value
                                                                        ]?.[
                                                                            mod
                                                                                .id
                                                                        ]?.includes(
                                                                            perm,
                                                                        ) ||
                                                                        false
                                                                    }
                                                                    onChange={() =>
                                                                        togglePermission(
                                                                            index,
                                                                            roleObj.value,
                                                                            mod.id,
                                                                            perm,
                                                                        )
                                                                    }
                                                                />
                                                            ) : (
                                                                <span>—</span>
                                                            )}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ))}
                    </div>
                )
            })}

            {blocks.length < maxBlocks && (
                <Button
                    type="button"
                    variant="solid"
                    size="sm"
                    onClick={addBlock}
                >
                    + Add Block
                </Button>
            )}
        </Card>
    )
}

export default AssignPermissionSection
