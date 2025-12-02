/* eslint-disable @typescript-eslint/no-explicit-any */
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
        try {
            let response

            if (user.id) {
                response = await apiUpdateUser(user.id, user)
            } else {
                response = await apiUser(user)
            }
            await mutate()

            return response
        } catch (error: any) {
            // If API sends validation error in response
            const message =
                error?.response?.data?.message || 'Failed to save user data'

            return {
                success: false,
                message,
            }
        }
    }

    // ✅ Get single user by ID (for edit or view)
    const getUserById = async (id: string) => {
        const user = await apiGetUserById(id)
        return user
    }

    const userList = data?.data || []

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
