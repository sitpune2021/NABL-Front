/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import { FormSectionBaseProps } from '@/@types/user'
import { HiChevronDown, HiX } from 'react-icons/hi'
import { TbSearch } from 'react-icons/tb'
import useLabList from '../../lab/List/hooks/useList'
import useRolesList from '../../roles/List/hooks/useList'
import { useWatch } from 'react-hook-form'

type LabAssignmentSectionProps = FormSectionBaseProps & {
    setValue: any
}

const LabAssignmentSection = ({
    control,
    readOnly,
    setValue,
}: LabAssignmentSectionProps) => {
    const { labList, labListTotal, getLocationsByLabId } = useLabList()
    const { rolesList } = useRolesList()

    const [expandedLabs, setExpandedLabs] = useState<Record<string, boolean>>(
        {},
    )
    const [searchTerm, setSearchTerm] = useState('')
    const [labLocations, setLabLocations] = useState<Record<string, any[]>>({})
    const [loadingLabs, setLoadingLabs] = useState<Record<string, boolean>>({})
    const [selectedData, setSelectedData] = useState<
        Record<string, Record<string, { locationId: string; roleId: string }>>
    >({})

    const watchedAssignments = useWatch({ control, name: 'labAssignments' })

    useEffect(() => {
        if (!watchedAssignments) return
        setSelectedData(watchedAssignments)
        Object.keys(watchedAssignments).forEach(async (labId) => {
            setExpandedLabs((p) => ({ ...p, [labId]: true }))
            if (!labLocations[labId]) {
                const locations = await getLocationsByLabId(labId)
                setLabLocations((p) => ({ ...p, [labId]: locations }))
            }
        })
    }, [watchedAssignments])

    const roleOptions = useMemo(
        () =>
            rolesList.map((role: any) => ({
                value: role.id,
                label: role.name,
            })),
        [rolesList],
    )
    const totalLocations = useMemo(
        () => Object.values(labLocations).reduce((s, l) => s + l.length, 0),
        [labLocations],
    )
    const totalSelected = useMemo(
        () =>
            Object.values(selectedData).reduce(
                (s, lab) => s + Object.keys(lab).length,
                0,
            ),
        [selectedData],
    )
    const filteredLabs = useMemo(() => {
        if (!searchTerm) return labList
        return labList.filter((lab: any) =>
            lab.name.toLowerCase().includes(searchTerm.toLowerCase()),
        )
    }, [labList, searchTerm])

    const toggleLab = async (labId: string) => {
        const isOpen = !expandedLabs[labId]
        setExpandedLabs((prev) => {
            const newExpanded = { ...prev }
            if (isOpen) {
                Object.keys(newExpanded).forEach((key) => {
                    newExpanded[key] = false
                })
            }
            newExpanded[labId] = isOpen
            return newExpanded
        })

        if (isOpen && !labLocations[labId]) {
            setLoadingLabs((p) => ({ ...p, [labId]: true }))
            const locations = await getLocationsByLabId(labId)
            setLabLocations((p) => ({
                ...p,
                [labId]: Array.isArray(locations) ? locations : [],
            }))
            setLoadingLabs((p) => ({ ...p, [labId]: false }))
        }
    }

    const updateSelection = (
        labId: string,
        locationId: string,
        checked: boolean,
    ) => {
        setSelectedData((prev) => {
            const data = { ...prev }
            if (!data[labId]) data[labId] = {}
            if (checked) {
                data[labId][locationId] = { locationId, roleId: '' }
            } else {
                delete data[labId][locationId]
                if (Object.keys(data[labId]).length === 0) delete data[labId]
            }
            setValue('labAssignments', data, {
                shouldDirty: true,
                shouldValidate: true,
            })
            return data
        })
    }

    const updateLocationRole = (
        labId: string,
        locationId: string,
        roleId: string,
    ) => {
        setSelectedData((prev) => {
            const data = { ...prev }
            if (!data[labId]?.[locationId]) return prev
            data[labId][locationId].roleId = String(roleId)
            setValue('labAssignments', data, {
                shouldDirty: true,
                shouldValidate: true,
            })
            return data
        })
    }

    if (readOnly) {
        return (
            <Card className="shadow-lg rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="p-6">
                    <h3 className="font-semibold text-lg mb-2 text-gray-800">
                        Lab Assignments (View Only)
                    </h3>
                    <p className="text-gray-600">
                        {totalSelected} location(s) assigned
                    </p>
                </div>
            </Card>
        )
    }

    return (
        <Card className="shadow-lg rounded-xl bg-white">
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                    Lab Location Assignment
                </h2>

                <div className="grid grid-cols-3 gap-4 mb-6">
                    <Stat title="Labs" value={labListTotal} />
                    <Stat title="Locations" value={totalLocations || '—'} />
                    <Stat title="Selected" value={totalSelected} />
                </div>

                <div className="relative mb-6">
                    <TbSearch className="absolute left-3 top-4 text-gray-400" />
                    <Input
                        value={searchTerm}
                        placeholder="Search labs..."
                        className="pl-10 pr-10 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <Button
                            type="button"
                            className="absolute right-3 top-2 p-1 rounded-full hover:bg-gray-100"
                            variant="solid"
                            onClick={() => setSearchTerm('')}
                        >
                            <HiX />
                        </Button>
                    )}
                </div>

                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                    {filteredLabs.map((lab: any) => (
                        <div
                            key={lab.id}
                            className="border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                        >
                            <Button
                                type="button"
                                className="w-full p-4 flex justify-between items-center bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 rounded-t-lg"
                                variant="plain"
                                onClick={() => toggleLab(lab.id)}
                            >
                                <span className="font-medium text-gray-800">
                                    {lab.name}
                                </span>
                                <HiChevronDown
                                    className={`transition-transform ${expandedLabs[lab.id] ? 'rotate-180' : ''}`}
                                />
                            </Button>

                            {expandedLabs[lab.id] && (
                                <div className="bg-white rounded-b-lg">
                                    {loadingLabs[lab.id] ? (
                                        <div className="p-4 text-center text-gray-500">
                                            Loading locations...
                                        </div>
                                    ) : (
                                        labLocations[lab.id]?.map(
                                            (loc: any) => (
                                                <LocationRow
                                                    key={loc.id}
                                                    labId={lab.id}
                                                    locationId={String(loc.id)}
                                                    locationName={
                                                        loc.location_name ||
                                                        `Location ${loc.id}`
                                                    }
                                                    roleOptions={roleOptions}
                                                    updateSelection={
                                                        updateSelection
                                                    }
                                                    updateLocationRole={
                                                        updateLocationRole
                                                    }
                                                    selectedData={selectedData}
                                                />
                                            ),
                                        )
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    )
}

const Stat = ({ title, value }: any) => (
    <div className="border border-gray-200 rounded-lg p-4 text-center bg-gradient-to-br from-white to-gray-50 shadow-sm">
        <div className="text-3xl font-bold text-blue-600">{value}</div>
        <div className="text-sm text-gray-500 uppercase tracking-wide">
            {title}
        </div>
    </div>
)

const LocationRow = ({
    labId,
    locationId,
    locationName,
    roleOptions,
    updateSelection,
    updateLocationRole,
    selectedData,
}: any) => {
    const selected = !!selectedData[labId]?.[locationId]
    const role = selectedData[labId]?.[locationId]?.roleId

    return (
        <div className="p-4 border-t border-gray-100 hover:bg-gray-50 transition-colors">
            <label className="flex items-center gap-3 cursor-pointer">
                <input
                    type="checkbox"
                    checked={selected}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    onChange={(e) =>
                        updateSelection(labId, locationId, e.target.checked)
                    }
                />
                <span className="text-gray-700 font-medium">
                    {locationName}
                </span>
            </label>
            {selected && (
                <div className="mt-3 ml-7">
                    <Select
                        options={roleOptions}
                        value={roleOptions.find((r: any) => r.value === role)}
                        placeholder="Select Role"
                        className="w-full"
                        onChange={(o: any) =>
                            updateLocationRole(labId, locationId, o?.value)
                        }
                    />
                </div>
            )}
        </div>
    )
}

export default LabAssignmentSection
