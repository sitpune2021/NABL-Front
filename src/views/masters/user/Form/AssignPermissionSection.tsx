import React, { useState, useEffect } from 'react'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import Card from '@/components/ui/Card'
import { FormItem } from '@/components/ui/Form'
import { Checkbox, Select, Button } from '@/components/ui'
import { FormSectionBaseProps } from '@/@types/user'
import useZoneList from '../../zone/List/hooks/useList'
import useClusterList from '../../cluster/List/hooks/useList'
import useLocationList from '../../location/List/hooks/useList'
import useRolesList from '../../roles/List/hooks/useList'
import useDepartmentList from '../../department/List/hooks/useList'

type AccessModule = {
    id: string
    name: string
    accessor: string[]
}

const accessModules: AccessModule[] = [
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

type OptionType = {
    label: string
    value: string
}

type Role = {
    name: string
    accessRight?: Record<string, string[]>
}

type Zone = { zone_name: string }
type Cluster = { cluster_name: string; zone_name: string }
type Location = { location_name: string; cluster_name: string }
type Department = { name: string }

type LocationRoleData = {
    zone_name: string
    cluster_name: string
    location_name: string
    department_name: string
    roles: string[]
}

const AddressSection: React.FC<FormSectionBaseProps> = () => {
    const { handleSubmit, control, watch } = useForm<{
        items: LocationRoleData[]
    }>({
        defaultValues: {
            items: [
                {
                    zone_name: '',
                    cluster_name: '',
                    location_name: '',
                    department_name: '',
                    roles: [],
                },
            ],
        },
    })

    const { fields, append } = useFieldArray({
        control,
        name: 'items',
    })

    const { zoneList } = useZoneList() as { zoneList: Zone[] }
    const { clusterList } = useClusterList() as { clusterList: Cluster[] }
    const { locationList } = useLocationList() as { locationList: Location[] }
    const { rolesList } = useRolesList() as { rolesList: Role[] }
    const { departmentList } = useDepartmentList() as {
        departmentList: Department[]
    }

    const [rolePermissions, setRolePermissions] = useState<
        Record<string, Record<string, string[]>>
    >({})

    const allSelectedRoles = watch('items').flatMap((item) => item.roles || [])

    useEffect(() => {
        if (allSelectedRoles.length > 0) {
            const newPermissions: Record<string, Record<string, string[]>> = {}
            allSelectedRoles.forEach((roleName) => {
                const roleData = rolesList.find((r) => r.name === roleName)
                newPermissions[roleName] = roleData?.accessRight || {}
            })
            setRolePermissions(newPermissions)
        }
    }, [allSelectedRoles, rolesList])

    const togglePermission = (
        role: string,
        moduleId: string,
        accessValue: string,
    ) => {
        setRolePermissions((prev) => {
            const rolePerms = prev[role] || {}
            const modulePerms = rolePerms[moduleId] || []
            const updatedModulePerms = modulePerms.includes(accessValue)
                ? modulePerms.filter((v) => v !== accessValue)
                : [...modulePerms, accessValue]

            return {
                ...prev,
                [role]: {
                    ...rolePerms,
                    [moduleId]: updatedModulePerms,
                },
            }
        })
    }

    const onSubmit = (data: { items: LocationRoleData[] }) => {
        const payload = { ...data, permissions: rolePermissions }
        console.log('Final Payload:', payload)
    }

    return (
        <Card>
            <h4 className="text-xl font-semibold mb-6 text-gray-800">
                Assign Roles
            </h4>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-8">
                    {fields.map((field, index) => {
                        const selectedZone = watch(`items.${index}.zone_name`)
                        const selectedCluster = watch(
                            `items.${index}.cluster_name`,
                        )
                        const selectedRoles =
                            watch(`items.${index}.roles`) || []

                        const zoneOptions: OptionType[] = zoneList.map((z) => ({
                            label: z.zone_name,
                            value: z.zone_name,
                        }))

                        const clusterOptions: OptionType[] = clusterList
                            .filter((c) => c.zone_name === selectedZone)
                            .map((c) => ({
                                label: c.cluster_name,
                                value: c.cluster_name,
                            }))

                        const locationOptions: OptionType[] = locationList
                            .filter((l) => l.cluster_name === selectedCluster)
                            .map((l) => ({
                                label: l.location_name,
                                value: l.location_name,
                            }))

                        const roleOptions: OptionType[] = rolesList.map(
                            (r) => ({
                                label: r.name,
                                value: r.name,
                            }),
                        )

                        const departmentOptions: OptionType[] =
                            departmentList.map((d) => ({
                                label: d.name,
                                value: d.name,
                            }))

                        return (
                            <div
                                key={field.id}
                                className="border border-gray-300 rounded-lg p-5 bg-gray-50 relative"
                            >
                                <div className="grid md:grid-cols-3 gap-4 mb-6">
                                    {/* Zone */}
                                    <FormItem label="Zone">
                                        <Controller
                                            name={`items.${index}.zone_name`}
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    placeholder="Select Zone"
                                                    options={zoneOptions}
                                                    value={
                                                        zoneOptions.find(
                                                            (o) =>
                                                                o.value ===
                                                                field.value,
                                                        ) || null
                                                    }
                                                    onChange={(selected) =>
                                                        field.onChange(
                                                            selected?.value ||
                                                                '',
                                                        )
                                                    }
                                                />
                                            )}
                                        />
                                    </FormItem>

                                    {/* Cluster */}
                                    <FormItem label="Cluster">
                                        <Controller
                                            name={`items.${index}.cluster_name`}
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    placeholder="Select Cluster"
                                                    options={clusterOptions}
                                                    value={
                                                        clusterOptions.find(
                                                            (o) =>
                                                                o.value ===
                                                                field.value,
                                                        ) || null
                                                    }
                                                    isDisabled={!selectedZone}
                                                    onChange={(selected) =>
                                                        field.onChange(
                                                            selected?.value ||
                                                                '',
                                                        )
                                                    }
                                                />
                                            )}
                                        />
                                    </FormItem>

                                    {/* Location */}
                                    <FormItem label="Location">
                                        <Controller
                                            name={`items.${index}.location_name`}
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    placeholder="Select Location"
                                                    options={locationOptions}
                                                    value={
                                                        locationOptions.find(
                                                            (o) =>
                                                                o.value ===
                                                                field.value,
                                                        ) || null
                                                    }
                                                    isDisabled={
                                                        !selectedCluster
                                                    }
                                                    onChange={(selected) =>
                                                        field.onChange(
                                                            selected?.value ||
                                                                '',
                                                        )
                                                    }
                                                />
                                            )}
                                        />
                                    </FormItem>

                                    {/* Department */}
                                    <FormItem label="Department">
                                        <Controller
                                            name={`items.${index}.department_name`}
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    placeholder="Select Department"
                                                    options={departmentOptions}
                                                    value={
                                                        field.value
                                                            ? {
                                                                  label: field.value,
                                                                  value: field.value,
                                                              }
                                                            : null
                                                    }
                                                    onChange={(selected) =>
                                                        field.onChange(
                                                            selected?.value ||
                                                                '',
                                                        )
                                                    }
                                                />
                                            )}
                                        />
                                    </FormItem>

                                    {/* Roles */}
                                    <FormItem label="Roles">
                                        <Controller
                                            name={`items.${index}.roles`}
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    isMulti
                                                    placeholder="Select Roles"
                                                    options={roleOptions}
                                                    value={roleOptions.filter(
                                                        (o) =>
                                                            field.value?.includes(
                                                                o.value,
                                                            ),
                                                    )}
                                                    onChange={(selected) =>
                                                        field.onChange(
                                                            selected.map(
                                                                (s) => s.value,
                                                            ),
                                                        )
                                                    }
                                                />
                                            )}
                                        />
                                    </FormItem>
                                </div>

                                {/* Permissions Table */}
                                {selectedRoles?.length > 0 && (
                                    <div className="mt-4">
                                        {selectedRoles.map((role) => (
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
                                                                ].map(
                                                                    (
                                                                        header,
                                                                    ) => (
                                                                        <th
                                                                            key={
                                                                                header
                                                                            }
                                                                            className="px-3 py-2 text-center"
                                                                        >
                                                                            {
                                                                                header
                                                                            }
                                                                        </th>
                                                                    ),
                                                                )}
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {accessModules.map(
                                                                (mod, idx) => (
                                                                    <tr
                                                                        key={
                                                                            mod.id
                                                                        }
                                                                        className={
                                                                            idx %
                                                                                2 ===
                                                                            0
                                                                                ? 'bg-white'
                                                                                : 'bg-gray-50'
                                                                        }
                                                                    >
                                                                        <td className="px-4 py-2 border-t font-medium text-gray-700">
                                                                            {
                                                                                mod.name
                                                                            }
                                                                        </td>
                                                                        {[
                                                                            'read',
                                                                            'write',
                                                                            'delete',
                                                                            'data-entry',
                                                                            'data-review',
                                                                        ].map(
                                                                            (
                                                                                perm,
                                                                            ) => (
                                                                                <td
                                                                                    key={
                                                                                        perm
                                                                                    }
                                                                                    className="text-center border-t px-2"
                                                                                >
                                                                                    {mod.accessor.includes(
                                                                                        perm,
                                                                                    ) ? (
                                                                                        <Checkbox
                                                                                            checked={rolePermissions[
                                                                                                role
                                                                                            ]?.[
                                                                                                mod
                                                                                                    .id
                                                                                            ]?.includes(
                                                                                                perm,
                                                                                            )}
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
                                                                            ),
                                                                        )}
                                                                    </tr>
                                                                ),
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )
                    })}

                    <div className="flex justify-start">
                        <Button
                            variant="default"
                            onClick={() =>
                                append({
                                    zone_name: '',
                                    cluster_name: '',
                                    location_name: '',
                                    department_name: '',
                                    roles: [],
                                })
                            }
                        >
                            +
                        </Button>
                    </div>
                </div>

                <div className="flex justify-end mt-6">
                    <Button type="submit" variant="solid">
                        Submit
                    </Button>
                </div>
            </form>
        </Card>
    )
}

export default AddressSection
