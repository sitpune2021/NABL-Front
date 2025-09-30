import { create } from 'zustand'
import type { TableQueries } from '@/@types/common'
import { UserListAction, UserListState } from '@/@types/user'

export const initialTableData: TableQueries = {
    pageIndex: 1,
    pageSize: 10,
    query: '',
    sort: {
        order: '',
        key: '',
    },
}

export const initialFilterData = {
    purchasedProducts: '',
    purchaseChannel: [
        'all',
        'header',
        'footer',
        'generic',
        'draft',
        'draft-header',
        'draft-footer',
        'draft-generic',
        'archived-all',
        'archived-header',
        'archived-footer',
        'archived-generic',
    ],
}

const initialState: UserListState = {
    tableData: initialTableData,
    filterData: initialFilterData,
    selectedUser: [],
}

export const useUserListStore = create<UserListState & UserListAction>(
    (set) => ({
        ...initialState,
        setFilterData: (payload) => set(() => ({ filterData: payload })),
        setTableData: (payload) => set(() => ({ tableData: payload })),
        setSelectedUser: (checked, row) =>
            set((state) => {
                const prevData = state.selectedUser
                if (checked) {
                    return { selectedUser: [...prevData, ...[row]] }
                } else {
                    if (prevData.some((prevUser) => row.id === prevUser.id)) {
                        return {
                            selectedUser: prevData.filter(
                                (prevUser) => prevUser.id !== row.id,
                            ),
                        }
                    }
                    return { selectedUser: prevData }
                }
            }),
        setSelectAllUser: (row) => set(() => ({ selectedUser: row })),
    }),
)
