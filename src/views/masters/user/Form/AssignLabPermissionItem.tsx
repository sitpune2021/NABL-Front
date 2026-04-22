/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState, useEffect } from 'react'
import { Controller, useWatch } from 'react-hook-form'
import { Button, Select, Input } from '@/components/ui'
import { FormItem } from '@/components/ui/Form'
import {
    TbMinus,
    TbMapPin,
    TbChevronDown,
    TbHierarchy2,
    TbX,
    TbCheck,
    TbSearch,
} from 'react-icons/tb'
import useZoneList from '../../zone/List/hooks/useList'
import useClusterList from '../../cluster/List/hooks/useList'
import useLocationList from '../../location/List/hooks/useList'
import useDepartmentList from '../../department/List/hooks/useList'
import useRolesList from '../../RolesPermissions/hooks/useList'

export type AssignPermissionItemProps = {
    index: number
    readOnly?: boolean
    onRemove?: () => void
    control: any
    setValue: any
    errors?: any
    openIndex?: number | null
    onOpenChange?: (index: number | null) => void
}

const SearchableList = ({
    items,
    selected,
    onToggle,
    onSelectAll,
    onClear,
    query,
    onQuery,
    label,
    readOnly,
}: any) => {
    const filtered = useMemo(
        () =>
            items.filter((i: any) =>
                (i.label || '').toLowerCase().includes(query.toLowerCase()),
            ),
        [items, query],
    )

    return (
        <div className="flex-1 flex flex-col border border-gray-200 rounded-xl bg-gray-50/30 overflow-hidden transition-all focus-within:ring-2 focus-within:ring-primary/10">
            <div className="px-4 py-3 bg-white border-b border-gray-100 flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    {label}
                </label>
                <span className="text-[11px] font-medium px-2 py-0.5 bg-gray-100 rounded-full text-gray-600">
                    {selected.size} selected
                </span>
            </div>

            <div className="p-2 bg-white">
                <Input
                    size="sm"
                    placeholder={`Search ${label}...`}
                    prefix={<TbSearch className="text-lg" />}
                    value={query}
                    className="bg-gray-50 border-none"
                    disabled={readOnly}
                    onChange={(e) => {
                        if (readOnly) return
                        onQuery(e.target.value)
                    }}
                />
            </div>

            <div className="flex justify-between px-4 py-2 bg-white/50 border-b border-gray-100">
                <Button
                    variant="default"
                    size="xs"
                    type="button"
                    className="text-[11px] font-semibold text-primary"
                    disabled={readOnly}
                    onClick={() => {
                        if (readOnly) return
                        onSelectAll(filtered)
                    }}
                >
                    Select All
                </Button>
                <Button
                    variant="default"
                    size="xs"
                    type="button"
                    className="text-[11px] font-semibold text-gray-400 hover:text-primary-500"
                    disabled={readOnly}
                    onClick={() => {
                        if (readOnly) return
                        onClear()
                    }}
                >
                    Clear
                </Button>
            </div>

            <div className="h-48 overflow-y-auto p-1 custom-scrollbar bg-white">
                {filtered.map((it: any) => {
                    const active = selected.has(it.value)
                    return (
                        <div
                            key={it.value}
                            className={`group flex items-center justify-between px-3 py-2.5 mb-1 rounded-lg cursor-pointer transition-colors ${
                                active
                                    ? 'bg-primary/10 text-primary-dark'
                                    : 'hover:bg-gray-100 text-gray-600'
                            }`}
                            onClick={() => {
                                if (readOnly) return
                                onToggle(it.value)
                            }}
                        >
                            <span
                                className={`text-xs pointer-events-none ${active ? 'font-bold' : 'font-medium'}`}
                            >
                                {it.label}
                            </span>
                            {active && (
                                <TbCheck className="text-primary animate-in zoom-in-75 duration-200" />
                            )}
                        </div>
                    )
                })}
                {filtered.length === 0 && (
                    <p className="text-center text-[10px] text-gray-400 py-4">
                        No results found
                    </p>
                )}
            </div>
        </div>
    )
}

const AssignLabPermissionItem = ({
    control,
    readOnly = false,
    index,
    onRemove,
    setValue,
    openIndex,
    onOpenChange,
}: AssignPermissionItemProps) => {
    const { zoneList } = useZoneList()
    const { clusterList } = useClusterList()
    const { locationList } = useLocationList()
    const { rolesList } = useRolesList()
    const { departmentList } = useDepartmentList()

    const [selDepts, setSelDepts] = useState<Set<number>>(new Set())
    const [selRoles, setSelRoles] = useState<Set<number>>(new Set())
    const [assigned, setAssigned] = useState<Record<number, Set<number>>>({})
    const [qD, setQD] = useState('')
    const [qR, setQR] = useState('')

    const isOpen = openIndex === index

    const selectedZone = useWatch({
        control,
        name: `userRoles.${index}.zone_id`,
    })
    const selectedCluster = useWatch({
        control,
        name: `userRoles.${index}.cluster_id`,
    })
    const selectedLocation = useWatch({
        control,
        name: `userRoles.${index}.location_id`,
    })

    const zoneOptions = useMemo(
        () => zoneList?.map((z: any) => ({ label: z.name, value: z.id })) || [],
        [zoneList],
    )
    const clusterOptions = useMemo(
        () =>
            clusterList
                ?.filter((c: any) => c.zone_id === selectedZone)
                .map((c: any) => ({ label: c.name, value: c.id })) || [],
        [clusterList, selectedZone],
    )
    const locationOptions = useMemo(
        () =>
            locationList
                ?.filter((l: any) => l.cluster_id === selectedCluster)
                .map((l: any) => ({ label: l.name, value: l.id })) || [],
        [locationList, selectedCluster],
    )
    const roleOptions = useMemo(
        () =>
            rolesList?.map((r: any) => ({ label: r.name, value: r.id })) || [],
        [rolesList],
    )
    const departmentOptions = useMemo(
        () =>
            departmentList?.map((d: any) => ({ label: d.name, value: d.id })) ||
            [],
        [departmentList],
    )

    const syncToForm = (data: any) => {
        setValue(
            `userRoles.${index}.department`,
            Object.entries(data).map(([deptId, roles]: any) => ({
                department_id: Number(deptId),
                roles: [...roles].map((r: any) => ({ value: r })),
            })),
        )
    }

    const handleAssign = () => {
        const newAssign: any = { ...assigned }
        selDepts.forEach((d) => {
            if (!newAssign[d]) newAssign[d] = new Set()
            selRoles.forEach((r) => newAssign[d].add(r))
        })
        setAssigned(newAssign)
        setSelDepts(new Set())
        setSelRoles(new Set())
        syncToForm(newAssign)
    }

    const removeRole = (deptId: number, roleId: number) => {
        const newAssign = { ...assigned }
        const roles = new Set(newAssign[deptId] || [])
        roles.delete(roleId)
        if (roles.size === 0) {
            delete newAssign[deptId]
        } else {
            newAssign[deptId] = roles
        }
        setAssigned(newAssign)
        syncToForm(newAssign)
    }

    const removeDepartment = (deptId: number) => {
        const newAssign = { ...assigned }
        delete newAssign[deptId]
        setAssigned(newAssign)
        syncToForm(newAssign)
    }

    const assignedCount = Object.keys(assigned).length
    const locationLabel =
        locationOptions.find((l) => l.value === selectedLocation)?.label ||
        'Location'

    const handleToggleAccordion = () => {
        if (isOpen) {
            onOpenChange?.(null)
        } else {
            onOpenChange?.(index)
        }
    }
    const formDepartments = useWatch({
        control,
        name: `userRoles.${index}.department`,
    })
    const [initialized, setInitialized] = useState(false)

    useEffect(() => {
        if (!formDepartments?.length || initialized) return

        const assignedMap: Record<number, Set<number>> = {}
        const deptSet = new Set<number>()
        const roleSet = new Set<number>()

        for (const { department_id, roles } of formDepartments) {
            if (!department_id) continue

            deptSet.add(department_id)

            const roleIds = new Set<number>(
                roles?.map((r: any) => r.value).filter(Boolean) || [],
            )

            assignedMap[department_id] = roleIds
            roleIds.forEach((id) => roleSet.add(id))
        }

        setAssigned(assignedMap)
        setSelDepts(deptSet)
        setSelRoles(roleSet)

        setInitialized(true)
    }, [formDepartments, initialized])

    return (
        <div className="mb-4 border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm transition-all hover:shadow-md">
            <div
                className={`px-6 py-4 flex justify-between items-center cursor-pointer transition-colors ${
                    isOpen
                        ? 'bg-white border-b border-gray-200'
                        : 'bg-white hover:bg-gray-50'
                }`}
                onClick={handleToggleAccordion}
            >
                <div className="flex items-center gap-3 flex-1">
                    <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                            isOpen
                                ? 'bg-primary/10 text-primary'
                                : 'bg-gray-100 text-gray-600'
                        }`}
                    >
                        <TbMapPin className="text-xl" />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold text-gray-800 leading-none text-sm">
                            {locationLabel}
                        </h4>
                        <span className="text-[11px] text-gray-400 font-medium">
                            {assignedCount > 0
                                ? `${assignedCount} department${assignedCount !== 1 ? 's' : ''} • `
                                : ''}
                            Index #{index + 1}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {assignedCount > 0 && (
                        <span className="text-xs font-bold px-2 py-1 bg-primary/10 text-primary rounded-full">
                            {assignedCount}
                        </span>
                    )}

                    {!readOnly && onRemove && (
                        <Button
                            type="button"
                            variant="plain"
                            shape="circle"
                            size="sm"
                            icon={<TbMinus />}
                            className="text-gray-400 hover:text-red-500 hover:bg-red-50"
                            onClick={(e) => {
                                e.stopPropagation()
                                onRemove()
                            }}
                        />
                    )}

                    <TbChevronDown
                        className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                        size={20}
                    />
                </div>
            </div>

            {isOpen && (
                <div className="p-6 border-t border-gray-100 animate-in fade-in duration-200">
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        <FormItem label="Zone">
                            <Controller
                                name={`userRoles.${index}.zone_id`}
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        placeholder="Select Zone"
                                        options={zoneOptions}
                                        isDisabled={readOnly}
                                        value={zoneOptions.find(
                                            (o) => o.value === field.value,
                                        )}
                                        onChange={(opt) => {
                                            field.onChange(opt?.value || '')
                                            setValue(
                                                `userRoles.${index}.cluster_id`,
                                                '',
                                            )
                                            setValue(
                                                `userRoles.${index}.location_id`,
                                                '',
                                            )
                                        }}
                                    />
                                )}
                            />
                        </FormItem>

                        <FormItem label="Cluster">
                            <Controller
                                name={`userRoles.${index}.cluster_id`}
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        options={clusterOptions}
                                        placeholder="Select Cluster"
                                        isDisabled={!selectedZone || readOnly}
                                        value={clusterOptions.find(
                                            (o) => o.value === field.value,
                                        )}
                                        onChange={(opt) => {
                                            field.onChange(opt?.value || '')
                                            setValue(
                                                `userRoles.${index}.location_id`,
                                                '',
                                            )
                                        }}
                                    />
                                )}
                            />
                        </FormItem>

                        <FormItem label="Location">
                            <Controller
                                name={`userRoles.${index}.location_id`}
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        options={locationOptions}
                                        placeholder="Select Location"
                                        isDisabled={
                                            !selectedCluster || readOnly
                                        }
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

                    <div className="space-y-6">
                        <div className="flex flex-col md:flex-row gap-6">
                            <SearchableList
                                items={departmentOptions}
                                selected={selDepts}
                                query={qD}
                                label="Departments"
                                readOnly={readOnly}
                                onQuery={setQD}
                                onToggle={(id: number) => {
                                    const s = new Set(selDepts)
                                    s.has(id) ? s.delete(id) : s.add(id)
                                    setSelDepts(new Set(s))
                                }}
                                onSelectAll={(list: any) => {
                                    const s = new Set(selDepts)
                                    list.forEach((i: any) => s.add(i.value))
                                    setSelDepts(new Set(s))
                                }}
                                onClear={() => setSelDepts(new Set())}
                            />

                            <SearchableList
                                items={roleOptions}
                                selected={selRoles}
                                query={qR}
                                label="Roles"
                                readOnly={readOnly}
                                onQuery={setQR}
                                onToggle={(id: number) => {
                                    const s = new Set(selRoles)
                                    s.has(id) ? s.delete(id) : s.add(id)
                                    setSelRoles(new Set(s))
                                }}
                                onSelectAll={(list: any) => {
                                    const s = new Set(selRoles)
                                    list.forEach((i: any) => s.add(i.value))
                                    setSelRoles(new Set(s))
                                }}
                                onClear={() => setSelRoles(new Set())}
                            />
                        </div>

                        <Button
                            type="button"
                            variant="solid"
                            disabled={
                                !selectedLocation ||
                                !selDepts.size ||
                                !selRoles.size ||
                                readOnly
                            }
                            className="shadow-lg"
                            onClick={handleAssign}
                        >
                            Assign
                        </Button>

                        {/* Active Permissions */}
                        <div className="pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-2 mb-4 text-gray-400">
                                <TbHierarchy2 />
                                <span className="text-xs font-bold uppercase tracking-widest">
                                    Active Permissions{' '}
                                    {assignedCount > 0 && `(${assignedCount})`}
                                </span>
                            </div>

                            {assignedCount > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                    {Object.entries(assigned).map(
                                        ([deptId, roles]: any) => (
                                            <div
                                                key={deptId}
                                                className="group relative flex flex-col bg-white border border-gray-100 rounded-xl p-3 shadow-sm transition-all hover:border-primary/30"
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="overflow-hidden flex-1">
                                                        <h5 className="text-xs font-bold text-gray-800 truncate pr-1">
                                                            {departmentOptions.find(
                                                                (d) =>
                                                                    d.value ==
                                                                    deptId,
                                                            )?.label ||
                                                                'Unknown'}
                                                        </h5>
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="plain"
                                                        size="xs"
                                                        shape="circle"
                                                        disabled={readOnly}
                                                        icon={<TbX size={14} />}
                                                        className="text-gray-300 hover:text-red-500 hover:bg-red-50 flex-shrink-0"
                                                        onClick={() =>
                                                            removeDepartment(
                                                                Number(deptId),
                                                            )
                                                        }
                                                    />
                                                </div>

                                                <div className="flex gap-1 flex-wrap">
                                                    {[...roles].map(
                                                        (r: any) => (
                                                            <div
                                                                key={r}
                                                                className="inline-flex items-center px-1.5 py-0.5 bg-primary/5 text-black border border-primary/10 text-[10px] font-medium rounded"
                                                            >
                                                                <span className="truncate max-w-[50px]">
                                                                    {
                                                                        roleOptions.find(
                                                                            (
                                                                                x,
                                                                            ) =>
                                                                                x.value ==
                                                                                r,
                                                                        )?.label
                                                                    }
                                                                </span>
                                                                {!readOnly && (
                                                                    <TbX
                                                                        className="ml-1 cursor-pointer opacity-40 hover:opacity-100 text-red-500 shrink-0"
                                                                        size={
                                                                            10
                                                                        }
                                                                        onClick={() =>
                                                                            removeRole(
                                                                                Number(
                                                                                    deptId,
                                                                                ),
                                                                                r,
                                                                            )
                                                                        }
                                                                    />
                                                                )}
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        ),
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-8 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                                    <p className="text-xs text-gray-400 italic">
                                        No permissions assigned yet
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AssignLabPermissionItem
