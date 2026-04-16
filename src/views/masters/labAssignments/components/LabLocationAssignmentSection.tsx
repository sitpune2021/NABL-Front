/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo, useCallback, useEffect } from 'react'
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
    const [isInitialLoad, setIsInitialLoad] = useState(true)
    const labs = labsAssignmentsList?.labs ?? []
    const users = labsAssignmentsList?.users ?? []
    const assingn = labsAssignmentsList?.assingn ?? []

    const assignments =
        useWatch({
            control,
            name: 'labAssignments',
        }) || {}

    useEffect(() => {
        if (!assingn.length || !isInitialLoad) return

        const initialAssignments = assingn.reduce((acc: any, item: any) => {
            const labId = item.lab_id
            const userId = String(item.user_id)
            const locationId = item.location_id
            const roleId = item.role_id

            if (!acc[labId]) {
                acc[labId] = { users: {}, locations: {} }
            }

            // LAB LEVEL
            if (!locationId) {
                if (!acc[labId].users[userId]) {
                    acc[labId].users[userId] = { roles: [] }
                }

                // prevent duplicate
                if (!acc[labId].users[userId].roles.includes(roleId)) {
                    acc[labId].users[userId].roles.push(roleId)
                }
            }

            // LOCATION LEVEL
            else {
                if (!acc[labId].locations[locationId]) {
                    acc[labId].locations[locationId] = { users: {} }
                }

                if (!acc[labId].locations[locationId].users[userId]) {
                    acc[labId].locations[locationId].users[userId] = {
                        roles: [],
                    }
                }

                //  prevent duplicate
                if (
                    !acc[labId].locations[locationId].users[
                        userId
                    ].roles.includes(roleId)
                ) {
                    acc[labId].locations[locationId].users[userId].roles.push(
                        roleId,
                    )
                }
            }

            return acc
        }, {})

        setValue('labAssignments', initialAssignments)
        setIsInitialLoad(false)
    }, [assingn, isInitialLoad, setValue])

    const filteredLabs = useMemo(
        () =>
            labs.filter((l: any) =>
                l.name?.toLowerCase().includes(search.toLowerCase()),
            ),
        [labs, search],
    )

    const updateAssignments = useCallback(
        (updater: (prev: any) => any) => {
            setValue('labAssignments', updater)
        },
        [setValue],
    )

    if (isLoading) {
        return (
            <div className="p-6 text-sm text-gray-500 dark:text-gray-400">
                Loading lab assignments…
            </div>
        )
    }

    if (!labs.length) {
        return (
            <div className="p-6 text-sm text-gray-500 dark:text-gray-400">
                No labs available
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-6">
            <h5 className="font-bold text-gray-800 dark:text-gray-100">
                Lab & User Access
            </h5>
            <Input
                placeholder="Search labs..."
                value={search}
                prefix={
                    <TbSearch className="text-lg text-gray-400 dark:text-gray-500" />
                }
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-700"
                onChange={(e) => setSearch(e.target.value)}
            />
            <div className="flex flex-col gap-4">
                {filteredLabs.map((lab: any) => (
                    <LabCard
                        key={lab.id}
                        lab={lab}
                        assingn={assingn}
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
