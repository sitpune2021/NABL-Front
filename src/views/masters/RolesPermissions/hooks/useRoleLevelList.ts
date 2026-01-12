import useSWR from 'swr'
import { apiGetRoleLevelsList } from '@/services/RolesService'

const LIST_KEY = 'roles-levels-list'
export const useRoleLevelList = () => {
    const swr = useSWR([LIST_KEY], () => apiGetRoleLevelsList(), {
        revalidateOnFocus: false,
    })

    return {
        roleLevelsList: swr.data ?? [],
        isLoading: swr.isLoading,
        error: swr.error,
        mutate: swr.mutate,
    }
}
