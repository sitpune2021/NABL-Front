/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo, useCallback } from 'react'
import { useWatch } from 'react-hook-form'
import { Input } from '@/components/ui'
import { TbSearch } from 'react-icons/tb'
import useRolesList from '../../RolesPermissions/hooks/useList'
import LabCard from './LabCard'
import { useLabsAssignmentsList } from '../hooks/useList'

const LabLocationAssignmentSection = ({ control, setValue }: any) => {
    const { labsAssignmentsList, isLoading } = useLabsAssignmentsList()

    const { rolesList = [] } = useRolesList()
    const [expandedLabId, setExpandedLabId] = useState<string | null>(null)
    const [search, setSearch] = useState('')
    const labs = labsAssignmentsList?.labs ?? []
    const users = labsAssignmentsList?.users ?? []

    const assignments =
        useWatch({
            control,
            name: 'labAssignments',
        }) || {}

    const filteredLabs = useMemo(
        () =>
            labs.filter((l: any) =>
                l.name?.toLowerCase().includes(search.toLowerCase()),
            ),
        [labs, search],
    )

    const updateAssignments = useCallback(
        (updater: (prev: any) => any) => {
            setValue('labAssignments', updater, {
                shouldDirty: true,
                shouldValidate: true,
            })
        },
        [setValue],
    )

    if (isLoading) {
        return (
            <div className="p-6 text-sm text-gray-500">
                Loading lab assignments…
            </div>
        )
    }

    if (!labs.length) {
        return (
            <div className="p-6 text-sm text-gray-500">No labs available</div>
        )
    }

    return (
        <div className="flex flex-col gap-6">
            <h5 className="font-bold">Lab & User Access</h5>
            <Input
                placeholder="Search labs..."
                value={search}
                prefix={<TbSearch className="text-lg opacity-40" />}
                className="w-full bg-gray-50 border-transparent focus:bg-white"
                onChange={(e) => setSearch(e.target.value)}
            />
            <div className="flex flex-col gap-4">
                {filteredLabs.map((lab: any) => (
                    <LabCard
                        key={lab.id}
                        lab={lab}
                        expanded={expandedLabId === lab.id}
                        users={users}
                        roles={rolesList}
                        assignments={assignments}
                        onToggle={() =>
                            setExpandedLabId(
                                expandedLabId === lab.id ? null : lab.id,
                            )
                        }
                        onUpdate={updateAssignments}
                    />
                ))}
            </div>
        </div>
    )
}

export default LabLocationAssignmentSection
