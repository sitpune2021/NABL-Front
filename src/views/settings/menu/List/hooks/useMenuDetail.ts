/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiGetMenuById } from '@/services/MenuService'
import useSWR from 'swr'

export const useMenuDetail = (id?: string) => {
    const swr = useSWR<any>(
        id ? ['menu-detail', id] : null,
        () => apiGetMenuById(id!),
        { revalidateOnFocus: false },
    )

    return {
        menu: swr?.data as any,
        isLoading: swr.isLoading,
        error: swr.error,
        mutate: swr.mutate,
    }
}
