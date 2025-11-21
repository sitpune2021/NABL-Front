/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo } from 'react'
import { Controller, useWatch, useFieldArray } from 'react-hook-form'
import { Button, Select, Checkbox } from '@/components/ui'
import { FormItem } from '@/components/ui/Form'
import { HiMinus } from 'react-icons/hi'

import useZoneList from '../../zone/List/hooks/useList'
import useClusterList from '../../cluster/List/hooks/useList'
import useLocationList from '../../location/List/hooks/useList'
import useRolesList from '../../roles/List/hooks/useList'
import useDepartmentList from '../../department/List/hooks/useList'

type Option = { label: string; value: string }

export type AssignPermissionItemProps = {
    index: number
    readOnly?: boolean
    onRemove?: () => void
    control: any
    errors: any
    setValue: any
}

const AssignPermissionItem = ({
    control,
    errors,
    readOnly = false,
    index,
    onRemove,
    setValue,
}: AssignPermissionItemProps) => {
    /** Lists */
    const { zoneList } = useZoneList()
    const { clusterList } = useClusterList()
    const { locationList } = useLocationList()
    const { rolesList, accessModules } = useRolesList()
    const { departmentList } = useDepartmentList()

    /** Department Field Array */
    const {
        fields: deptFields,
        append: appendDept,
        remove: removeDept,
    } = useFieldArray({
        control,
        name: `userRoles.${index}.department`,
    })

    /** Watch dependent values */
    const selectedZone = useWatch({
        control,
        name: `userRoles.${index}.zone_name`,
    })
    const selectedCluster = useWatch({
        control,
        name: `userRoles.${index}.cluster_name`,
    })

    /** Dropdown options (memoized) */
    const zoneOptions = useMemo<Option[]>(
        () =>
            zoneList.map((z: any) => ({
                label: z.zone_name,
                value: z.zone_name,
            })),
        [zoneList],
    )

    const clusterOptions = useMemo<Option[]>(
        () =>
            clusterList
                .filter((c: any) => c.zone_name === selectedZone)
                .map((c: any) => ({
                    label: c.cluster_name,
                    value: c.cluster_name,
                })),
        [clusterList, selectedZone],
    )

    const locationOptions = useMemo<Option[]>(
        () =>
            locationList
                .filter((l: any) => l.cluster_name === selectedCluster)
                .map((l: any) => ({
                    label: l.location_name,
                    value: l.location_name,
                })),
        [locationList, selectedCluster],
    )

    const roleOptions = useMemo<Option[]>(
        () => rolesList.map((r: any) => ({ label: r.name, value: r.name })),
        [rolesList],
    )

    const departmentOptions = useMemo<Option[]>(
        () =>
            departmentList.map((d: any) => ({ label: d.name, value: d.name })),
        [departmentList],
    )

    return (
        <>
            {/* Remove entire user role block */}
            <div className="flex justify-end mb-2">
                {!readOnly && onRemove && (
                    <Button
                        size="xs"
                        type="button"
                        icon={<HiMinus />}
                        onClick={onRemove}
                    />
                )}
            </div>

            {/* Zone / Cluster / Location */}
            <div className="grid md:grid-cols-3 gap-4 mb-4">
                {/* Zone */}
                <FormItem
                    label="Zone"
                    invalid={!!errors?.userRoles?.[index]?.zone_name}
                    errorMessage={
                        errors?.userRoles?.[index]?.zone_name?.message
                    }
                >
                    <Controller
                        name={`userRoles.${index}.zone_name`}
                        control={control}
                        render={({ field }) => (
                            <Select
                                options={zoneOptions}
                                placeholder="Select Zone"
                                isDisabled={readOnly}
                                value={zoneOptions.find(
                                    (o) => o.value === field.value,
                                )}
                                onChange={(opt) =>
                                    field.onChange(opt?.value || '')
                                }
                            />
                        )}
                    />
                </FormItem>

                {/* Cluster */}
                <FormItem
                    label="Cluster"
                    invalid={!!errors?.userRoles?.[index]?.cluster_name}
                    errorMessage={
                        errors?.userRoles?.[index]?.cluster_name?.message
                    }
                >
                    <Controller
                        name={`userRoles.${index}.cluster_name`}
                        control={control}
                        render={({ field }) => (
                            <Select
                                options={clusterOptions}
                                placeholder="Select Cluster"
                                isDisabled={!selectedZone || readOnly}
                                value={clusterOptions.find(
                                    (o) => o.value === field.value,
                                )}
                                onChange={(opt) =>
                                    field.onChange(opt?.value || '')
                                }
                            />
                        )}
                    />
                </FormItem>

                {/* Location */}
                <FormItem
                    label="Location"
                    invalid={!!errors?.userRoles?.[index]?.location_name}
                    errorMessage={
                        errors?.userRoles?.[index]?.location_name?.message
                    }
                >
                    <Controller
                        name={`userRoles.${index}.location_name`}
                        control={control}
                        render={({ field }) => (
                            <Select
                                options={locationOptions}
                                placeholder="Select Location"
                                isDisabled={!selectedCluster || readOnly}
                                value={locationOptions.find(
                                    (o) => o.value === field.value,
                                )}
                                onChange={(opt) =>
                                    field.onChange(opt?.value || '')
                                }
                            />
                        )}
                    />
                </FormItem>
            </div>

            {/* Department Blocks */}
            {deptFields.map((dept, dIndex) => (
                <DepartmentBlock
                    key={dept.id}
                    index={index}
                    dIndex={dIndex}
                    control={control}
                    errors={errors}
                    readOnly={readOnly}
                    removeDept={removeDept}
                    departmentOptions={departmentOptions}
                    roleOptions={roleOptions}
                    rolesList={rolesList}
                    accessModules={accessModules}
                    setValue={setValue}
                />
            ))}

            {/* Add Department */}
            {!readOnly && (
                <Button
                    size="xs"
                    type="button"
                    onClick={() =>
                        appendDept({
                            department_name: '',
                            roles: [],
                            permissions: {},
                        })
                    }
                >
                    + Add Department
                </Button>
            )}
        </>
    )
}

export default AssignPermissionItem

/* =======================================================
   DEPARTMENT BLOCK
======================================================= */
const DepartmentBlock = React.memo(
    ({
        index,
        dIndex,
        control,
        errors,
        readOnly,
        removeDept,
        departmentOptions,
        roleOptions,
        rolesList,
        accessModules,
        setValue,
    }: any) => {
        /** Selected roles */
        const roles =
            useWatch({
                control,
                name: `userRoles.${index}.department.${dIndex}.roles`,
            }) || []

        /** Permissions */
        const permissions =
            useWatch({
                control,
                name: `userRoles.${index}.department.${dIndex}.permissions`,
            }) || {}

        /** Initialize / Cleanup permissions for roles */
        useEffect(() => {
            if (!Array.isArray(roles)) return

            const updated: Record<string, any> = {}

            roles.forEach((roleObj: any) => {
                const roleName = roleObj?.value
                if (!roleName) return
                updated[roleName] =
                    permissions[roleName] ||
                    rolesList.find((r: { name: any }) => r.name === roleName)
                        ?.accessRight ||
                    {}
            })

            setValue(
                `userRoles.${index}.department.${dIndex}.permissions`,
                updated,
                { shouldDirty: false },
            )
        }, [roles, setValue, rolesList])
        /** Toggle Permission */
        const setPermission = (
            role: string,
            moduleId: string,
            perm: string,
        ) => {
            const existing = permissions?.[role]?.[moduleId] || []

            const updated = existing.includes(perm)
                ? existing.filter((p: string) => p !== perm)
                : [...existing, perm]

            setValue(
                `userRoles.${index}.department.${dIndex}.permissions.${role}.${moduleId}`,
                updated,
                { shouldDirty: true },
            )
        }

        return (
            <div className="grid md:grid-cols-2 gap-4 mb-4 border p-3 bg-gray-50 rounded">
                {/* Department */}
                <FormItem
                    label="Department"
                    invalid={
                        !!errors?.userRoles?.[index]?.department?.[dIndex]
                            ?.department_name
                    }
                    errorMessage={
                        errors?.userRoles?.[index]?.department?.[dIndex]
                            ?.department_name?.message
                    }
                >
                    <Controller
                        name={`userRoles.${index}.department.${dIndex}.department_name`}
                        control={control}
                        render={({ field }) => (
                            <Select
                                options={departmentOptions}
                                placeholder="Select Department"
                                isDisabled={readOnly}
                                value={departmentOptions.find(
                                    (o: { value: any }) =>
                                        o.value === field.value,
                                )}
                                onChange={(opt) =>
                                    field.onChange(opt?.value || '')
                                }
                            />
                        )}
                    />
                </FormItem>

                {/* Roles */}
                <FormItem
                    label="Roles"
                    invalid={
                        !!errors?.userRoles?.[index]?.department?.[dIndex]
                            ?.roles
                    }
                    errorMessage={
                        errors?.userRoles?.[index]?.department?.[dIndex]?.roles
                            ?.message
                    }
                >
                    <Controller
                        name={`userRoles.${index}.department.${dIndex}.roles`}
                        control={control}
                        render={({ field }) => (
                            <Select
                                isMulti
                                options={roleOptions}
                                placeholder="Select Roles"
                                isDisabled={readOnly}
                                value={roleOptions.filter(
                                    (opt: { value: any }) =>
                                        field.value?.some(
                                            (r: any) => r.value === opt.value,
                                        ),
                                )}
                                onChange={(selected) =>
                                    field.onChange(selected || [])
                                }
                            />
                        )}
                    />
                </FormItem>

                {/* Permission Table */}
                {roles.length > 0 && (
                    <div className="mt-4 md:col-span-2">
                        {roles.map((r: any) => (
                            <PermissionTable
                                key={r.value}
                                role={r.value}
                                accessModules={accessModules}
                                permissions={permissions?.[r.value] || {}}
                                readOnly={readOnly}
                                onToggle={setPermission}
                            />
                        ))}
                    </div>
                )}

                {/* Remove Department */}
                {!readOnly && dIndex > 0 && (
                    <Button
                        size="xs"
                        type="button"
                        icon={<HiMinus />}
                        onClick={() => removeDept(dIndex)}
                    />
                )}
            </div>
        )
    },
)

/* =======================================================
   PERMISSION TABLE
======================================================= */
const PermissionTable = React.memo(
    ({ role, permissions, accessModules, onToggle, readOnly }: any) => {
        if (!accessModules?.length) return null

        const permOptions = [
            'read',
            'write',
            'delete',
            'data-entry',
            'data-review',
        ]

        return (
            <div className="mb-6 border border-gray-200 rounded-lg bg-white">
                <div className="bg-indigo-50 px-4 py-2 border-b">
                    <h5 className="text-md font-semibold text-indigo-700">
                        Permissions for: {role}
                    </h5>
                </div>

                <table className="min-w-full text-sm">
                    <thead className="bg-indigo-100">
                        <tr>
                            <th className="px-4 py-2 text-left">Module</th>
                            {permOptions.map((p) => (
                                <th key={p} className="px-3 py-2 text-center">
                                    {p.replace('-', ' ')}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {accessModules.map((mod: any, idx: number) => (
                            <tr
                                key={mod.id}
                                className={
                                    idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                }
                            >
                                <td className="px-4 py-2 border-t font-medium">
                                    {mod.name}
                                </td>

                                {permOptions.map((perm) => (
                                    <td
                                        key={perm}
                                        className="text-center border-t px-2"
                                    >
                                        {mod.accessor.some(
                                            (a: any) => a.value === perm,
                                        ) ? (
                                            <Checkbox
                                                checked={permissions?.[
                                                    mod.id
                                                ]?.includes(perm)}
                                                disabled={readOnly}
                                                onChange={() =>
                                                    onToggle(role, mod.id, perm)
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
        )
    },
)
