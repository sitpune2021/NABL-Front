/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from 'react'
import { useAssignmentStore } from '../store/assignmentStore'
import Tag from '@/components/ui/Tag'
import {
    TbMapPin,
    TbUser,
    TbCircleCheck,
    TbClock,
    TbCertificate,
} from 'react-icons/tb'
import useLabList from '../../lab/List/hooks/useList'
import useLocationList from '../../location/List/hooks/useList'
import useUserList from '../../user/List/hooks/useList'

const SummaryCard = ({ title, count, label, icon, color }: any) => (
    <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border shadow-sm">
        <div className={`p-3 rounded-xl ${color}`}>
            <span className="text-2xl">{icon}</span>
        </div>
        <div>
            <p className="text-xs font-bold text-gray-400 uppercase">{title}</p>
            <h3 className="text-xl font-extrabold">
                {count}{' '}
                <span className="text-sm font-medium text-gray-500">
                    {label}
                </span>
            </h3>
        </div>
    </div>
)

const AssignmentBody = () => {
    const { labCount, locationCount, userCount } = useAssignmentStore()

    const { labList = [] } = useLabList()
    const { locationList = [] } = useLocationList()
    const { userList = [] } = useUserList()

    const stats = useMemo(
        () => ({
            labs: {
                total: labCount,
                assigned: labList.filter((l: any) => l.assigned).length,
            },
            locations: {
                total: locationCount,
                assigned: locationList.filter((l: any) => l.assigned).length,
            },
            users: {
                total: userCount,
                assigned: userList.filter((u: any) => u.assigned).length,
            },
        }),
        [labList, locationList, userList, labCount, locationCount, userCount],
    )

    const cards = [
        {
            title: 'Total Labs',
            data: stats.labs,
            icon: <TbCertificate />,
            color: 'bg-primary-subtle text-primary bg-primary-subtle',
        },
        {
            title: 'Total Locations',
            data: stats.locations,
            icon: <TbMapPin />,
            color: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20',
        },
        {
            title: 'Total Users',
            data: stats.users,
            icon: <TbUser />,
            color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20',
        },
    ]

    return (
        <div className="flex flex-col gap-8 p-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {cards.map((c) => (
                    <SummaryCard
                        key={c.title}
                        title={c.title}
                        count={c.data.total}
                        label={c.title.split(' ')[1]}
                        icon={c.icon}
                        color={c.color}
                    />
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cards.map((c) => {
                    const pending = Math.max(c.data.total - c.data.assigned, 0)
                    return (
                        <div key={c.title} className="space-y-3">
                            <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
                                <div className="flex items-center gap-2">
                                    <TbCircleCheck className="text-emerald-500" />
                                    Assigned
                                </div>
                                <Tag>{c.data.assigned}</Tag>
                            </div>

                            <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
                                <div className="flex items-center gap-2">
                                    <TbClock className="text-amber-500" />
                                    Pending
                                </div>
                                <Tag className="bg-red-50 text-red-600">
                                    {pending}
                                </Tag>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default AssignmentBody
