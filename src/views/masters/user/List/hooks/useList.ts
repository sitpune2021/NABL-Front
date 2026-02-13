import { apiGetUserList } from '@/services/UserService'
import useSWR from 'swr'
import { useUserListStore } from '../store/listStore'
import type { TableQueries } from '@/@types/common'
import { GetUserListResponse } from '@/@types/user'

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
    }
}
