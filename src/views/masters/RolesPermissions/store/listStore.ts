import { create } from 'zustand'
import type { TableQueries } from '@/@types/common'
import { RolesListAction, RolesListState } from '@/@types/roles'

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

const initialState: RolesListState = {
    tableData: initialTableData,
    filterData: initialFilterData,
    selectedRoles: [],
}

export const useRolesListStore = create<RolesListState & RolesListAction>(
    (set) => ({
        ...initialState,
        setFilterData: (payload) => set(() => ({ filterData: payload })),
        setTableData: (payload) => set(() => ({ tableData: payload })),
        setSelectedRoles: (checked, row) =>
            set((state) => {
                const prevData = state.selectedRoles
                if (checked) {
                    return { selectedRoles: [...prevData, ...[row]] }
                } else {
                    if (prevData.some((prevRoles) => row.id === prevRoles.id)) {
                        return {
                            selectedRoles: prevData.filter(
                                (prevRoles) => prevRoles.id !== row.id,
                            ),
                        }
                    }
                    return { selectedRoles: prevData }
                }
            }),
        setSelectAllRoles: (row) => set(() => ({ selectedRoles: row })),
    }),
)
