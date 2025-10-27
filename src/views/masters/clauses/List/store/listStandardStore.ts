import { create } from 'zustand'
import type { TableQueries } from '@/@types/common'
import { StandardListAction, StandardListState } from '@/@types/standard'

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

const initialState: StandardListState = {
    tableData: initialTableData,
    filterData: initialFilterData,
    selectedStandard: [],
}

export const useStandardListStore = create<
    StandardListState & StandardListAction
>((set) => ({
    ...initialState,
    setFilterData: (payload) => set(() => ({ filterData: payload })),
    setTableData: (payload) => set(() => ({ tableData: payload })),
    setSelectedStandard: (checked, row) =>
        set((state) => {
            const prevData = state.selectedStandard
            if (checked) {
                return { selectedStandard: [...prevData, ...[row]] }
            } else {
                if (
                    prevData.some((prevStandard) => row.id === prevStandard.id)
                ) {
                    return {
                        selectedStandard: prevData.filter(
                            (prevStandard) => prevStandard.id !== row.id,
                        ),
                    }
                }
                return { selectedStandard: prevData }
            }
        }),
    setSelectAllStandard: (row) => set(() => ({ selectedStandard: row })),
}))
