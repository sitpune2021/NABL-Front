import { useAssignmentStore } from '../store/assignmentStore'
import Tag from '@/components/ui/Tag'
import {
    TbMapPin,
    TbUser,
    TbCircleCheck,
    TbClock,
    TbCertificate,
} from 'react-icons/tb'
import type { ReactNode } from 'react'

interface StatProps {
    title: string
    count: number
    icon: ReactNode
    colorClass: string
    label: string
}

const SummaryCard = ({ title, count, icon, colorClass, label }: StatProps) => (
    <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className={`p-3 rounded-xl ${colorClass}`}>
            <span className="text-2xl">{icon}</span>
        </div>
        <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                {title}
            </p>
            <h3 className="text-xl font-extrabold text-gray-900 dark:text-gray-100">
                {count}{' '}
                <span className="text-sm font-medium text-gray-500">
                    {label}
                </span>
            </h3>
        </div>
    </div>
)

const AssignmentBody = () => {
    const { labList, locationList, userList } = useAssignmentStore()

    const stats = [
        {
            title: 'Labs',
            total: labList.length,
            assigned: labList.filter((i) => i.assigned).length,
            icon: <TbCertificate />,
            color: 'bg-primary-subtle text-primary bg-primary-subtle',
        },
        {
            title: 'Locations',
            total: locationList.length,
            assigned: locationList.filter((i) => i.assigned).length,
            icon: <TbMapPin />,
            color: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20',
        },
        {
            title: 'Users',
            total: userList.length,
            assigned: userList.filter((i) => i.assigned).length,
            icon: <TbUser />,
            color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20',
        },
    ]

    return (
        <div className="flex flex-col gap-8 p-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stats.map((s) => (
                    <SummaryCard
                        key={s.title}
                        title={`Total ${s.title}`}
                        count={s.total}
                        label={s.title}
                        icon={s.icon}
                        colorClass={s.color}
                    />
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-2">
                {stats.map((s) => {
                    const unassigned = s.total - s.assigned
                    return (
                        <div key={s.title} className="flex flex-col gap-4">
                            <h6 className="text-sm font-bold text-gray-400 uppercase tracking-widest px-1">
                                {s.title} Status
                            </h6>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-transparent dark:hover:border-gray-700 transition-all">
                                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 font-medium">
                                        <TbCircleCheck className="text-emerald-500 text-lg" />
                                        <span>Assigned</span>
                                    </div>
                                    <Tag className="bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-200 font-bold px-3">
                                        {s.assigned}
                                    </Tag>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-transparent dark:hover:border-gray-700 transition-all">
                                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 font-medium">
                                        <TbClock className="text-amber-500 text-lg" />
                                        <span>Pending</span>
                                    </div>
                                    <Tag className="bg-red-50 text-red-600 border-none font-bold px-3">
                                        {unassigned}
                                    </Tag>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default AssignmentBody
