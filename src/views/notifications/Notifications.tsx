import { useEffect, useMemo, useState } from 'react'
import classNames from 'classnames'
import dayjs from 'dayjs'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'
import Tag from '@/components/ui/Tag'
import {
    apiGetAllNotifications,
    apiMarkAllNotificationsAsRead,
    apiMarkNotificationAsRead,
} from '@/services/CommonService'
import { HiOutlineMailOpen, HiOutlineRefresh } from 'react-icons/hi'

import type { BackendNotification } from '@/services/CommonService'

const Notifications = () => {
    const [notifications, setNotifications] = useState<BackendNotification[]>(
        [],
    )
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState(false)

    const unreadCount = useMemo(
        () =>
            notifications.filter(
                (notification) => notification.status === 'unread',
            ).length,
        [notifications],
    )

    const fetchNotifications = async () => {
        setLoading(true)
        try {
            const response = await apiGetAllNotifications()
            setNotifications(response.data)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchNotifications()
    }, [])

    const handleMarkAsRead = async (notification: BackendNotification) => {
        if (notification.status === 'read') {
            return
        }

        await apiMarkNotificationAsRead(String(notification.id))
        setNotifications((current) =>
            current.map((item) =>
                item.id === notification.id
                    ? {
                          ...item,
                          status: 'read',
                          read_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                      }
                    : item,
            ),
        )
    }

    const handleMarkAllAsRead = async () => {
        setActionLoading(true)
        try {
            await apiMarkAllNotificationsAsRead()
            setNotifications((current) =>
                current.map((notification) => ({
                    ...notification,
                    status: 'read',
                    read_at:
                        notification.read_at ||
                        dayjs().format('YYYY-MM-DD HH:mm:ss'),
                })),
            )
        } finally {
            setActionLoading(false)
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                    <h3>Notifications</h3>
                    <p className="text-sm text-gray-500">
                        {unreadCount > 0
                            ? `${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}`
                            : 'All notifications are read'}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        icon={<HiOutlineRefresh />}
                        loading={loading}
                        onClick={fetchNotifications}
                    >
                        Refresh
                    </Button>
                    <Button
                        variant="solid"
                        icon={<HiOutlineMailOpen />}
                        loading={actionLoading}
                        disabled={unreadCount === 0}
                        onClick={handleMarkAllAsRead}
                    >
                        Mark all as read
                    </Button>
                </div>
            </div>

            <Card bodyClass="p-0">
                {loading ? (
                    <div className="flex min-h-[320px] items-center justify-center">
                        <Spinner size={40} />
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="flex min-h-[320px] items-center justify-center px-4 text-center">
                        <div>
                            <img
                                className="mx-auto mb-3 max-w-[150px]"
                                src="/img/others/no-notification.png"
                                alt="no-notification"
                            />
                            <h5>No notifications!</h5>
                            <p className="mt-1 text-sm text-gray-500">
                                New task notifications will appear here.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {notifications.map((notification) => (
                            <button
                                key={notification.id}
                                className={classNames(
                                    'w-full px-5 py-4 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/40',
                                    notification.status === 'unread' &&
                                        'bg-primary-subtle/40 dark:bg-gray-700/30',
                                )}
                                onClick={() => handleMarkAsRead(notification)}
                            >
                                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h6>{notification.title}</h6>
                                            <Tag
                                                className={
                                                    notification.status ===
                                                    'unread'
                                                        ? 'bg-primary-subtle text-primary'
                                                        : ''
                                                }
                                            >
                                                {notification.status}
                                            </Tag>
                                        </div>
                                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                                            {notification.message}
                                        </p>
                                    </div>
                                    <span className="shrink-0 text-xs text-gray-500">
                                        {dayjs(notification.created_at).format(
                                            'DD MMM YYYY, hh:mm A',
                                        )}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    )
}

export default Notifications
