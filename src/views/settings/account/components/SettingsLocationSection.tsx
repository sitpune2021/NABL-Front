/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import {
    useFieldArray,
    useWatch,
    type Control,
    type FieldErrors,
} from 'react-hook-form'
import { Button, Tag, Input } from '@/components/ui'
import {
    HiOutlineLocationMarker,
    HiOutlineOfficeBuilding,
    HiOutlinePlus,
    HiOutlineX,
    HiCheck,
} from 'react-icons/hi'
import SettingsLocationItems from './SettingsLocationItems'
import { useSessionUser } from '@/store/authStore'

type SettingsLocationSectionProps = {
    control: Control<any>
    errors: FieldErrors<any>
    readOnly?: boolean
    setValue?: any
    zoneList: any[]
    clusterList: any[]
    locationList: any[]
    departmentList: any[]
    instrumentList: any[]
}

const SettingsLocationSection = ({
    control,
    errors,
    readOnly = false,
    setValue,
    zoneList,
    clusterList,
    locationList,
    departmentList,
    instrumentList,
}: SettingsLocationSectionProps) => {
    const { fields, append } = useFieldArray({ control, name: 'location' })
    const user: any = useSessionUser((state) => state.user)
    const userRoles = useWatch({ control, name: 'userRoles' })

    const [addingRolePath, setAddingRolePath] = useState<{
        rIdx: number
        dIdx: number
    } | null>(null)
    const [newRoleName, setNewRoleName] = useState('')

    const saveRole = (rIdx: number, dIdx: number) => {
        if (!newRoleName.trim()) return

        const updatedRoles = [...userRoles]
        const newRole = {
            label: newRoleName,
            value: newRoleName.toLowerCase().replace(/\s+/g, '_'),
        }

        updatedRoles[rIdx].department[dIdx].roles.push(newRole)
        setValue('userRoles', updatedRoles)

        setNewRoleName('')
        setAddingRolePath(null)
    }

    const handleRemoveRole = (rIdx: number, dIdx: number, roleIdx: number) => {
        const updatedRoles = [...userRoles]
        updatedRoles[rIdx].department[dIdx].roles.splice(roleIdx, 1)
        setValue('userRoles', updatedRoles)
    }

    const handleAddLocation = () => {
        append({
            zone_name: '',
            cluster_name: '',
            location_name: '',
            departments: [{ name: '', instruments: [] }],
            prefix: '',
            shortName: '',
            emails: [],
            instruments: [],
            phones: [],
            address: '',
        })
    }

    return (
        <div className="flex flex-col gap-6">
            {!user?.is_super_admin && (
                <div className="mt-4">
                    <h4 className="mb-6 font-bold text-xl text-gray-800">
                        Assign Locations & Departments
                    </h4>
                    {userRoles && userRoles.length > 0 ? (
                        <div className="grid gap-6">
                            {userRoles.map((roleBlock: any, rIdx: number) => (
                                <div
                                    key={rIdx}
                                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                                >
                                    <div className="flex items-center gap-4 p-4 bg-gray-50/50 border-b border-gray-100">
                                        <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center text-xl">
                                            <HiOutlineLocationMarker />
                                        </div>
                                        <div className="font-bold text-gray-900">
                                            {roleBlock.location_name}
                                        </div>
                                    </div>

                                    <div className="p-4 grid gap-4">
                                        {roleBlock.department?.map(
                                            (dept: any, dIdx: number) => (
                                                <div
                                                    key={dIdx}
                                                    className="flex flex-col gap-3 p-3 rounded-lg border border-gray-50 bg-white shadow-sm"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2 text-indigo-600 font-semibold">
                                                            <HiOutlineOfficeBuilding />
                                                            <span>
                                                                {
                                                                    dept.department_name
                                                                }
                                                            </span>
                                                        </div>

                                                        {!readOnly && (
                                                            <Button
                                                                type="button"
                                                                size="xs"
                                                                variant="default"
                                                                icon={
                                                                    <HiOutlinePlus />
                                                                }
                                                                onClick={() =>
                                                                    setAddingRolePath(
                                                                        {
                                                                            rIdx,
                                                                            dIdx,
                                                                        },
                                                                    )
                                                                }
                                                            >
                                                                Add Role
                                                            </Button>
                                                        )}
                                                    </div>

                                                    <div className="flex flex-wrap gap-2 ml-6">
                                                        {dept.roles?.map(
                                                            (
                                                                role: any,
                                                                roleIdx: number,
                                                            ) => (
                                                                <Tag
                                                                    key={
                                                                        roleIdx
                                                                    }
                                                                    className="bg-indigo-50 text-indigo-700 border-none flex items-center gap-1 group"
                                                                >
                                                                    {role.label}
                                                                    {!readOnly && (
                                                                        <HiOutlineX
                                                                            className="cursor-pointer hover:text-red-500 opacity-60 group-hover:opacity-100"
                                                                            onClick={() =>
                                                                                handleRemoveRole(
                                                                                    rIdx,
                                                                                    dIdx,
                                                                                    roleIdx,
                                                                                )
                                                                            }
                                                                        />
                                                                    )}
                                                                </Tag>
                                                            ),
                                                        )}

                                                        {addingRolePath?.rIdx ===
                                                            rIdx &&
                                                            addingRolePath?.dIdx ===
                                                                dIdx && (
                                                                <div className="flex items-center gap-2">
                                                                    <Input
                                                                        autoFocus
                                                                        size="sm"
                                                                        placeholder="Role name..."
                                                                        className="w-32"
                                                                        value={
                                                                            newRoleName
                                                                        }
                                                                        onChange={(
                                                                            e,
                                                                        ) =>
                                                                            setNewRoleName(
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                            )
                                                                        }
                                                                    />
                                                                    <Button
                                                                        type="button"
                                                                        size="xs"
                                                                        variant="solid"
                                                                        icon={
                                                                            <HiCheck />
                                                                        }
                                                                        onClick={() =>
                                                                            saveRole(
                                                                                rIdx,
                                                                                dIdx,
                                                                            )
                                                                        }
                                                                    />
                                                                    <Button
                                                                        type="button"
                                                                        size="xs"
                                                                        variant="default"
                                                                        icon={
                                                                            <HiOutlineX />
                                                                        }
                                                                        onClick={() => {
                                                                            setAddingRolePath(
                                                                                null,
                                                                            )
                                                                            setNewRoleName(
                                                                                '',
                                                                            )
                                                                        }}
                                                                    />
                                                                </div>
                                                            )}
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-6 bg-gray-50 rounded-lg text-gray-400 italic border border-dashed text-center">
                            No assignments found.
                        </div>
                    )}
                </div>
            )}

            <hr className="my-2 border-gray-200" />

            <div className="flex items-center justify-between">
                {!readOnly && (
                    <Button
                        type="button"
                        size="sm"
                        variant="solid"
                        onClick={handleAddLocation}
                    >
                        + Add Location
                    </Button>
                )}
            </div>

            {fields.map((item, index) => (
                <div key={item.id} id={`location-item-${index}`}>
                    <SettingsLocationItems
                        control={control}
                        errors={errors}
                        readOnly={readOnly}
                        index={index}
                        item={item}
                        zoneList={zoneList}
                        clusterList={clusterList}
                        locationList={locationList}
                        departmentList={departmentList}
                        instrumentList={instrumentList}
                    />
                </div>
            ))}
        </div>
    )
}

export default SettingsLocationSection
