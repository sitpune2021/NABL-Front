import { create } from 'zustand'
import type { TableQueries } from '@/@types/common'
import { ZoneListAction, ZoneListState } from '@/@types/zone'

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

const initialState: ZoneListState = {
    tableData: initialTableData,
    filterData: initialFilterData,
    selectedZone: [],
}

export const useZoneListStore = create<ZoneListState & ZoneListAction>(
    (set) => ({
        ...initialState,
        setFilterData: (payload) => set(() => ({ filterData: payload })),
        setTableData: (payload) => set(() => ({ tableData: payload })),
        setSelectedZone: (checked, row) =>
            set((state) => {
                const prevData = state.selectedZone
                if (checked) {
                    return { selectedZone: [...prevData, ...[row]] }
                } else {
                    if (prevData.some((prevZone) => row.id === prevZone.id)) {
                        return {
                            selectedZone: prevData.filter(
                                (prevZone) => prevZone.id !== row.id,
                            ),
                        }
                    }
                    return { selectedZone: prevData }
                }
            }),
        setSelectAllZone: (row) => set(() => ({ selectedZone: row })),
    }),
)
