/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo } from 'react'
import { Controller, useWatch, useFieldArray } from 'react-hook-form'
import { Button, Select, Checkbox } from '@/components/ui'
import { FormItem } from '@/components/ui/Form'
import { HiMinus, HiPlus } from 'react-icons/hi'
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
    const { zoneList } = useZoneList()
    const { clusterList } = useClusterList()
    const { locationList } = useLocationList()
    const { rolesList, accessModules } = useRolesList()
    const { departmentList } = useDepartmentList()

    const {
        fields: deptFields,
        append: appendDept,
        remove: removeDept,
    } = useFieldArray({
        control,
        name: `userRoles.${index}.department`,
    })

    const selectedZone = useWatch({
        control,
        name: `userRoles.${index}.zone_name`,
    })
    const selectedCluster = useWatch({
        control,
        name: `userRoles.${index}.cluster_name`,
    })

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
        <div className="bg-white shadow-lg rounded-xl p-6 mb-6 border border-gray-200">
            <div className="flex justify-end mb-4">
                {!readOnly && onRemove && (
                    <Button
                        size="sm"
                        type="button"
                        icon={<HiMinus />}
                        className="border border-blue-500 text-blue-500  rounded-full shadow-md transition-all duration-200"
                        onClick={onRemove}
                    />
                )}
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-6">
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
                                className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                onChange={(opt) =>
                                    field.onChange(opt?.value || '')
                                }
                            />
                        )}
                    />
                </FormItem>

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
                                className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                onChange={(opt) =>
                                    field.onChange(opt?.value || '')
                                }
                            />
                        )}
                    />
                </FormItem>

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
                                className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                onChange={(opt) =>
                                    field.onChange(opt?.value || '')
                                }
                            />
                        )}
                    />
                </FormItem>
            </div>

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

            {!readOnly && (
                <div className="mt-6 flex">
                    <Button
                        size="sm"
                        type="button"
                        icon={<HiPlus />}
                        className="border border-blue-500 text-blue-500 shadow-md transition-all duration-200"
                        onClick={() =>
                            appendDept({
                                department_name: '',
                                roles: [],
                                permissions: {},
                            })
                        }
                    >
                        Add Department
                    </Button>
                </div>
            )}
        </div>
    )
}

export default AssignPermissionItem

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
        const roles =
            useWatch({
                control,
                name: `userRoles.${index}.department.${dIndex}.roles`,
            }) || []

        const permissions =
            useWatch({
                control,
                name: `userRoles.${index}.department.${dIndex}.permissions`,
            }) || {}

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
            <div className="relative bg-blue-50/20 border border-blue-200 rounded-lg p-4 mb-4 shadow-sm">
                <div className="grid md:grid-cols-2 gap-6 mb-4">
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
                                    className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                    onChange={(opt) =>
                                        field.onChange(opt?.value || '')
                                    }
                                />
                            )}
                        />
                    </FormItem>

                    <FormItem
                        label="Roles"
                        invalid={
                            !!errors?.userRoles?.[index]?.department?.[dIndex]
                                ?.roles
                        }
                        errorMessage={
                            errors?.userRoles?.[index]?.department?.[dIndex]
                                ?.roles?.message
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
                                                (r: any) =>
                                                    r.value === opt.value,
                                            ),
                                    )}
                                    className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                    onChange={(selected) =>
                                        field.onChange(selected || [])
                                    }
                                />
                            )}
                        />
                    </FormItem>
                </div>

                {roles.length > 0 && (
                    <div className="mt-6">
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
                {!readOnly && dIndex > 0 && (
                    <div className="absolute top-2 right-2">
                        <Button
                            size="xs"
                            type="button"
                            icon={<HiMinus />}
                            className="border border-blue-500 text-blue-500 hover:bg-blue-50 rounded-full shadow-md transition-all duration-200"
                            onClick={() => removeDept(dIndex)}
                        />
                    </div>
                )}
            </div>
        )
    },
)

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
            <div className="mb-6 border border-gray-300 rounded-lg bg-white shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-3 border-b">
                    <h5 className="text-md font-semibold text-white">
                        Permissions for: {role}
                    </h5>
                </div>

                <table className="min-w-full text-sm">
                    <thead className="bg-blue-100">
                        <tr>
                            <th className="px-4 py-3 text-left font-semibold text-blue-800">
                                Module
                            </th>
                            {permOptions.map((p) => (
                                <th
                                    key={p}
                                    className="px-3 py-3 text-center font-semibold text-blue-800"
                                >
                                    {p.replace('-', ' ')}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {accessModules.map((mod: any, idx: number) => (
                            <tr
                                key={mod.id}
                                className={`hover:bg-blue-50 transition-colors duration-150 ${
                                    idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                }`}
                            >
                                <td className="px-4 py-3 border-t font-medium text-gray-800">
                                    {mod.name}
                                </td>

                                {permOptions.map((perm) => (
                                    <td
                                        key={perm}
                                        className="text-center border-t px-2 py-3"
                                    >
                                        {mod.accessor.some(
                                            (a: any) => a.value === perm,
                                        ) ? (
                                            <Checkbox
                                                checked={permissions?.[
                                                    mod.id
                                                ]?.includes(perm)}
                                                disabled={readOnly}
                                                className="rounded focus:ring-blue-500"
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
