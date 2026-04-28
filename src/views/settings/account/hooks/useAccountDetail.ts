/* eslint-disable @typescript-eslint/no-explicit-any */
import useSWR from 'swr'
import { apiGetSettingsProfile } from '@/services/AccontsService'

export const useAccountDetail = () => {
    const swr = useSWR<any>(
        'account-profile', // ✅ stable key
        apiGetSettingsProfile, // ✅ fetcher function
        {
            revalidateOnFocus: false,
        },
    )

    return {
        account: swr.data?.data as any,
        isLoading: swr.isLoading,
        error: swr.error,
        mutate: swr.mutate,
    }
}
