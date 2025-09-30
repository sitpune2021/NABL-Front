import { create } from 'zustand'
import type { TableQueries } from '@/@types/common'
import { LabListAction, LabListState } from '@/@types/lab'

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

const initialState: LabListState = {
    tableData: initialTableData,
    filterData: initialFilterData,
    selectedLab: [],
}

export const useLabListStore = create<LabListState & LabListAction>((set) => ({
    ...initialState,
    setFilterData: (payload) => set(() => ({ filterData: payload })),
    setTableData: (payload) => set(() => ({ tableData: payload })),
    setSelectedLab: (checked, row) =>
        set((state) => {
            const prevData = state.selectedLab
            if (checked) {
                return { selectedLab: [...prevData, ...[row]] }
            } else {
                if (prevData.some((prevLab) => row.id === prevLab.id)) {
                    return {
                        selectedLab: prevData.filter(
                            (prevLab) => prevLab.id !== row.id,
                        ),
                    }
                }
                return { selectedLab: prevData }
            }
        }),
    setSelectAllLab: (row) => set(() => ({ selectedLab: row })),
}))
