import {
    apiUser,
    apiGetUserList,
    apiGetUserById,
    apiUpdateUser,
} from '@/services/UserService'
import useSWR from 'swr'
import { useUserListStore } from '../store/listStore'
import type { TableQueries } from '@/@types/common'
import { Fields, GetUserListResponse } from '@/@types/user'

export default function useUserList() {
    const {
        tableData,
        filterData,
        setTableData,
        selectedUser,
        setSelectedUser,
        setSelectAllUser,
        setFilterData,
    } = useUserListStore((state) => state)

    const { data, error, isLoading, mutate } = useSWR(
        ['/api/user', { ...tableData, ...filterData }],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, params]) =>
            apiGetUserList<GetUserListResponse, TableQueries>(params),
        {
            revalidateOnFocus: false,
        },
    )
    const saveUserData = async (user: Fields) => {
        if (user.id) {
            await apiUpdateUser(user.id, user)
        } else {
            await apiUser(user)
        }
        await mutate() // refresh list
    }

    // ✅ Get single user by ID (for edit or view)
    const getUserById = async (id: string) => {
        const user = await apiGetUserById(id)
        return user
    }

    const userList = data?.list || []

    const userListTotal = data?.total || 0

    return {
        userList,
        userListTotal,
        error,
        isLoading,
        tableData,
        filterData,
        mutate,
        setTableData,
        selectedUser,
        setSelectedUser,
        setSelectAllUser,
        setFilterData,
        saveUserData,
        getUserById, // ✅ Now defined properly
    }
}
