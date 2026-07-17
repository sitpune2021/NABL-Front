import ApiService from './ApiService'
import apiEndpointConfig from '@/configs/api-endpoint.config'

export type BackendNotification = {
    id: string | number
    type: string
    title: string
    message: string
    data?: Record<string, unknown>
    status: 'read' | 'unread'
    read_at?: string | null
    created_at: string
}

type NotificationListItem = {
    id: string
    target: string
    description: string
    date: string
    image: string
    type: number
    location: string
    locationLabel: string
    status: string
    readed: boolean
}

export async function apiGetNotificationCount() {
    const response = await ApiService.fetchDataWithAxios<{
        status: boolean
        data: { unread: number }
    }>({
        url: apiEndpointConfig.notificationsUnreadCount,
        method: 'get',
    })

    return {
        count: response.data?.unread ?? 0,
    }
}

export async function apiGetNotificationList() {
    const response = await apiGetAllNotifications()

    return response.data.map<NotificationListItem>((notification) => ({
        id: String(notification.id),
        target: notification.title,
        description: notification.message,
        date: notification.created_at,
        image: '',
        type: 1,
        location: '',
        locationLabel: '',
        status: notification.status,
        readed: notification.status === 'read',
    }))
}

export async function apiGetAllNotifications() {
    return ApiService.fetchDataWithAxios<{
        status: boolean
        data: BackendNotification[]
    }>({
        url: apiEndpointConfig.notifications,
        method: 'get',
    })
}

export async function apiMarkNotificationAsRead(id: string) {
    return ApiService.fetchDataWithAxios({
        url: `${apiEndpointConfig.notifications}/${id}/read`,
        method: 'post',
    })
}

export async function apiMarkAllNotificationsAsRead() {
    return ApiService.fetchDataWithAxios({
        url: `${apiEndpointConfig.notifications}/read-all`,
        method: 'post',
    })
}

export async function apiGetSearchResult<T>(params: { query: string }) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/search/query',
        method: 'get',
        params,
    })
}
