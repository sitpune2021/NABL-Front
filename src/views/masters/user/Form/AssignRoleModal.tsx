import { useState, useMemo } from 'react'
import { Dialog } from '@/components/ui/Dialog'
import { Select, Button, FormItem, Card, Checkbox } from '@/components/ui'
import { Controller, useForm } from 'react-hook-form'
import useZoneList from '../../zone/List/hooks/useList'
import useClusterList from '../../cluster/List/hooks/useList'
import useLocationList from '../../location/List/hooks/useList'
import useRolesList from '../../roles/List/hooks/useList'

// ---------- Types ----------
interface Zone {
    zone_name: string
}

interface Cluster {
    cluster_name: string
    zone_name: string
}

interface Location {
    location_name: string
    cluster_name: string
}

interface Role {
    id: string
    name: string
}

type AccessModule = {
    id: string
    name: string
    accessor: { value: string; label: string }[]
}

type AssignRoleLocationForm = {
    zone_name: string
    cluster_name: string
    location_name: string[]
    roles: string[]
}

interface AssignRolesLocationModalProps {
    isOpen: boolean
    onClose: () => void
    onSave?: (assignment: {
        zone_name: string
        cluster_name: string
        location_name: string[]
        roles: string[]
        permissions: Record<string, Record<string, string[]>>
    }) => void
}

// ---------- Data ----------
const accessModules: AccessModule[] = [
    {
        id: 'dashboard',
        name: 'Dashboard',
        accessor: [
            { value: 'read', label: 'Read' },
            { value: 'write', label: 'Write' },
            { value: 'delete', label: 'Delete' },
        ],
    },
    {
        id: 'users',
        name: 'Users',
        accessor: [
            { value: 'read', label: 'Read' },
            { value: 'write', label: 'Write' },
            { value: 'delete', label: 'Delete' },
        ],
    },
    {
        id: 'roles',
        name: 'Roles',
        accessor: [
            { value: 'read', label: 'Read' },
            { value: 'write', label: 'Write' },
            { value: 'delete', label: 'Delete' },
        ],
    },
]

// ---------- Component ----------
const AssignRolesLocationModal = ({
    isOpen,
    onClose,
    onSave,
}: AssignRolesLocationModalProps) => {
    const { control, handleSubmit, reset, watch } =
        useForm<AssignRoleLocationForm>({
            defaultValues: {
                zone_name: '',
                cluster_name: '',
                location_name: [],
                roles: [],
            },
        })

    const { zoneList } = useZoneList()
    const { clusterList } = useClusterList()
    const { locationList } = useLocationList()
    const { rolesList } = useRolesList()

    const [selectedZone, setSelectedZone] = useState('')
    const [selectedCluster, setSelectedCluster] = useState('')
    const [rolePermissions, setRolePermissions] = useState<
        Record<string, Record<string, string[]>>
    >({})

    const selectedRoles = watch('roles')

    // ---------- Options ----------
    const zoneOptions = zoneList.map((z: Zone) => ({
        label: z.zone_name,
        value: z.zone_name,
    }))

    const filteredClusters = useMemo(() => {
        if (!selectedZone) return []
        return clusterList.filter((c: Cluster) => c.zone_name === selectedZone)
    }, [selectedZone, clusterList])

    const clusterOptions = filteredClusters.map((c: Cluster) => ({
        label: c.cluster_name,
        value: c.cluster_name,
    }))

    const filteredLocations = useMemo(() => {
        if (!selectedCluster) return []
        return locationList.filter(
            (l: Location) => l.cluster_name === selectedCluster,
        )
    }, [selectedCluster, locationList])

    const locationOptions = filteredLocations.map((l: Location) => ({
        label: l.location_name,
        value: l.location_name,
    }))

    const roleOptions = rolesList.map((r: Role) => ({
        label: r.name,
        value: r.name,
    }))

    // ---------- Permissions ----------
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

    const onSubmit = (data: AssignRoleLocationForm) => {
        if (
            !data.zone_name ||
            !data.cluster_name ||
            !data.location_name.length ||
            !data.roles.length
        )
            return

        const payload = { ...data, permissions: rolePermissions }
        onSave?.(payload)

        reset()
        setSelectedZone('')
        setSelectedCluster('')
        setRolePermissions({})
        onClose()
    }

    // ---------- JSX ----------
    return (
        <Dialog
            isOpen={isOpen}
            width={1000}
            onClose={onClose}
            onRequestClose={onClose}
        >
            <div className="p-6 max-h-[80vh] overflow-y-auto">
                <h3 className="text-xl font-semibold mb-6 text-gray-800">
                    Assign Roles
                </h3>

                <Card>
                    {/* Zone / Cluster / Location / Roles */}
                    <div className="grid md:grid-cols-4 gap-4 mb-6">
                        {/* Zone */}
                        <FormItem label="Zone">
                            <Controller
                                name="zone_name"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        placeholder="Select Zone"
                                        options={zoneOptions}
                                        value={
                                            zoneOptions.find(
                                                (o) => o.value === field.value,
                                            ) || null
                                        }
                                        onChange={(selected) => {
                                            const val = selected?.value || ''
                                            field.onChange(val)
                                            setSelectedZone(val)
                                            setSelectedCluster('')
                                        }}
                                    />
                                )}
                            />
                        </FormItem>

                        {/* Cluster */}
                        <FormItem label="Cluster">
                            <Controller
                                name="cluster_name"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        placeholder={
                                            selectedZone
                                                ? 'Select Cluster'
                                                : 'Select Zone first'
                                        }
                                        options={clusterOptions}
                                        value={
                                            clusterOptions.find(
                                                (o) => o.value === field.value,
                                            ) || null
                                        }
                                        isDisabled={!selectedZone}
                                        onChange={(selected) => {
                                            const val = selected?.value || ''
                                            field.onChange(val)
                                            setSelectedCluster(val)
                                        }}
                                    />
                                )}
                            />
                        </FormItem>

                        {/* Location */}
                        <FormItem label="Location">
                            <Controller
                                name="location_name"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        isMulti
                                        placeholder={
                                            selectedCluster
                                                ? 'Select Location(s)'
                                                : 'Select Cluster first'
                                        }
                                        options={locationOptions}
                                        value={locationOptions.filter((o) =>
                                            field.value?.includes(o.value),
                                        )}
                                        isDisabled={!selectedCluster}
                                        onChange={(selected) =>
                                            field.onChange(
                                                selected.map((s) => s.value),
                                            )
                                        }
                                    />
                                )}
                            />
                        </FormItem>

                        {/* Roles */}
                        <FormItem label="Roles">
                            <Controller
                                name="roles"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        isMulti
                                        placeholder="Select Roles"
                                        options={roleOptions}
                                        value={roleOptions.filter((o) =>
                                            field.value?.includes(o.value),
                                        )}
                                        onChange={(selected) =>
                                            field.onChange(
                                                selected.map((s) => s.value),
                                            )
                                        }
                                    />
                                )}
                            />
                        </FormItem>
                    </div>

                    {/* Permissions */}
                    {selectedRoles?.length > 0 && (
                        <div className="mt-4">
                            {selectedRoles.map((role) => (
                                <div key={role} className="mb-6 border-t pt-4">
                                    <h4 className="text-lg font-semibold text-gray-700 mb-3">
                                        Permissions for: {role}
                                    </h4>

                                    <div className="overflow-x-auto">
                                        <table className="min-w-full border border-gray-200 text-sm">
                                            <thead className="bg-gray-100">
                                                <tr>
                                                    <th className="px-4 py-2 text-left">
                                                        Module
                                                    </th>
                                                    <th className="px-4 py-2 text-center">
                                                        Read
                                                    </th>
                                                    <th className="px-4 py-2 text-center">
                                                        Write
                                                    </th>
                                                    <th className="px-4 py-2 text-center">
                                                        Delete
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {accessModules.map((mod) => (
                                                    <tr
                                                        key={mod.id}
                                                        className="border-t"
                                                    >
                                                        <td className="px-4 py-2">
                                                            {mod.name}
                                                        </td>
                                                        {mod.accessor.map(
                                                            (a) => (
                                                                <td
                                                                    key={
                                                                        a.value
                                                                    }
                                                                    className="text-center px-2"
                                                                >
                                                                    <Checkbox
                                                                        checked={
                                                                            rolePermissions[
                                                                                role
                                                                            ]?.[
                                                                                mod
                                                                                    .id
                                                                            ]?.includes(
                                                                                a.value,
                                                                            ) ||
                                                                            false
                                                                        }
                                                                        onChange={() =>
                                                                            togglePermission(
                                                                                role,
                                                                                mod.id,
                                                                                a.value,
                                                                            )
                                                                        }
                                                                    />
                                                                </td>
                                                            ),
                                                        )}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex justify-end gap-2 mt-6">
                        <Button variant="plain" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            variant="solid"
                            onClick={handleSubmit(onSubmit)}
                        >
                            Save Assign
                        </Button>
                    </div>
                </Card>
            </div>
        </Dialog>
    )
}

export default AssignRolesLocationModal
