import useSWR from 'swr'
import { apiGetUserById } from '@/services/UserService'
import { GetUserDetailResponse, User } from '@/@types/user'

export const useUserDetail = (id?: string) => {
    const swr = useSWR<GetUserDetailResponse>(
        id ? ['user-detail', id] : null,
        () => apiGetUserById(id!),
        {
            revalidateOnFocus: false,
        },
    )

    return {
        user: swr.data?.data as User,
        isLoading: swr.isLoading,
        error: swr.error,
        mutate: swr.mutate,
    }
}
