/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from '@/components/ui'
import Notification from '@/components/ui/Notification'

export const useApiError = () => {
    return (error: any, fallbackMessage: string) => {
        const backendErrors = error?.response?.data?.errors

        if (backendErrors) {
            Object.values(backendErrors).forEach((messages: any) => {
                const message = Array.isArray(messages) ? messages[0] : messages
                toast.push(
                    <Notification type="danger"> {message} </Notification>,
                    { placement: 'top-center' },
                )
            })
            return
        }

        toast.push(
            <Notification type="danger">
                {error?.response?.data?.message || fallbackMessage}
            </Notification>,
            { placement: 'top-center' },
        )
    }
}
