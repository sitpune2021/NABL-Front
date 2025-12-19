/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { useApiError } from '@/utils/hoc/useApiError'

type UseFormSubmitProps<T> = {
    apiCall: (values: T) => Promise<{ message?: string; data?: any }>
    navigateTo?: string
}

export const useFormSubmit = <T,>({
    apiCall,
    navigateTo,
}: UseFormSubmitProps<T>) => {
    const navigate = useNavigate()
    const handleApiError = useApiError()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = useCallback(
        async (values: T) => {
            setIsSubmitting(true)
            try {
                const response = await apiCall(values)

                const msg =
                    response?.message || 'Operation completed successfully!'

                toast.push(<Notification type="success">{msg}</Notification>, {
                    placement: 'top-center',
                })

                if (navigateTo) navigate(navigateTo)

                return response
            } catch (error: any) {
                handleApiError(error, 'Operation failed!')
                throw error
            } finally {
                setIsSubmitting(false)
            }
        },
        [apiCall, navigateTo, navigate, handleApiError],
    )

    return { handleSubmit, isSubmitting }
}
