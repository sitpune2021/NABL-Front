/* eslint-disable @typescript-eslint/no-explicit-any */
import { HiChevronDown } from 'react-icons/hi'
import { TbMapPin } from 'react-icons/tb'
import { Button } from '@/components/ui'
import { useState } from 'react'
import UserAssignmentRow from './UserAssignmentRow'

const LocationCard = ({
    labId,
    assingn,
    location,
    users,
    roles,
    assignments,
    onUpdate,
}: any) => {
    const [expanded, setExpanded] = useState(false)

    return (
        <div
            className={`border rounded-xl transition-all duration-300 bg-white dark:bg-gray-800 ${expanded ? 'shadow-md border-gray-300 dark:border-gray-600' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500'}`}
        >
            <div
                className="flex justify-between items-center p-3 cursor-pointer"
                onClick={() => setExpanded((v) => !v)}
            >
                <div className="flex items-center gap-2">
                    <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${expanded ? 'bg-primary-subtle text-primary' : 'dark:bg-gray-700 text-gray-500 dark:text-gray-300'}`}
                    >
                        <TbMapPin className="text-purple-500" />
                    </div>
                    <span className="font-semibold text-gray-700 dark:text-gray-100">
                        {location.name}
                    </span>
                </div>

                <Button
                    shape="circle"
                    variant="plain"
                    size="xs"
                    icon={
                        <HiChevronDown
                            className={`text-xl transition-transform duration-300 ${
                                expanded
                                    ? 'rotate-180 text-primary'
                                    : 'text-gray-400 dark:text-gray-500'
                            }`}
                        />
                    }
                />
            </div>

            {expanded && (
                <div className="p-5 border-t border-gray-200 bg-gray-50/30 rounded-b-xl dark:border-gray-700 dark:bg-gray-800/40">
                    <UserAssignmentRow
                        assingn={assingn}
                        labId={labId}
                        locationId={location.id}
                        users={users}
                        roles={roles}
                        assignments={assignments}
                        onUpdate={onUpdate}
                    />
                </div>
            )}
        </div>
    )
}

export default LocationCard
