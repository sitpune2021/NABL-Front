import { create } from 'zustand'
import type { TableQueries } from '@/@types/common'
import { UnitListAction, UnitListState } from '@/@types/unit'

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

const initialState: UnitListState = {
    tableData: initialTableData,
    filterData: initialFilterData,
    selectedUnit: [],
}

export const useUnitListStore = create<UnitListState & UnitListAction>(
    (set) => ({
        ...initialState,
        setFilterData: (payload) => set(() => ({ filterData: payload })),
        setTableData: (payload) => set(() => ({ tableData: payload })),
        setSelectedUnit: (checked, row) =>
            set((state) => {
                const prevData = state.selectedUnit
                if (checked) {
                    return { selectedUnit: [...prevData, ...[row]] }
                } else {
                    if (prevData.some((prevUnit) => row.id === prevUnit.id)) {
                        return {
                            selectedUnit: prevData.filter(
                                (prevUnit) => prevUnit.id !== row.id,
                            ),
                        }
                    }
                    return { selectedUnit: prevData }
                }
            }),
        setSelectAllUnit: (row) => set(() => ({ selectedUnit: row })),
    }),
)
