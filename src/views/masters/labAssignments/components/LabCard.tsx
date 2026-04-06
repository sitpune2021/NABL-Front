/* eslint-disable @typescript-eslint/no-explicit-any */
import { HiChevronDown } from 'react-icons/hi'
import { TbCertificate } from 'react-icons/tb'
import { Button } from '@/components/ui'
import LocationCard from './LocationCard'
import UserAssignmentRow from './UserAssignmentRow'

const LabCard = ({
    lab,
    assingn,
    expanded,
    onToggle,
    users,
    assignments,
    onUpdate,
}: any) => {
    const locations = lab.location || []
    const roles = lab.roles || []

    return (
        <div
            className={`border rounded-xl transition-all duration-300 bg-white dark:bg-gray-800 ${expanded ? 'shadow-md border-gray-300 dark:border-gray-600' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500'}`}
        >
            <div
                className="flex justify-between p-4 cursor-pointer"
                onClick={onToggle}
            >
                <div className="flex items-center gap-3">
                    <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${expanded ? 'bg-primary-subtle text-primary' : 'dark:bg-gray-700 text-gray-500 dark:text-gray-300'}`}
                    >
                        <TbCertificate size={22} />
                    </div>
                    <div className="font-bold text-gray-800 dark:text-gray-100">
                        {lab.name}
                    </div>
                </div>

                <Button
                    shape="circle"
                    variant="plain"
                    size="sm"
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
                <div className="p-5 border-t border-gray-200 dark:border-gray-700  bg-gray-50/30 dark:bg-gray-800/40 rounded-b-xl">
                    <UserAssignmentRow
                        assingn={assingn}
                        labId={lab.id}
                        locationId={null}
                        users={users}
                        roles={roles.filter((r: any) => r.level === 1)}
                        assignments={assignments}
                        onUpdate={onUpdate}
                    />
                    {locations.map((location: any) => (
                        <LocationCard
                            key={location.id}
                            assingn={assingn}
                            labId={lab.id}
                            location={location}
                            users={users}
                            roles={roles}
                            assignments={assignments}
                            onUpdate={onUpdate}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default LabCard
