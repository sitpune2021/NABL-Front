import { create } from 'zustand'
import type { TableQueries } from '@/@types/common'
import { ClausesListAction, ClausesListState } from '@/@types/clauses'

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

const initialState: ClausesListState = {
    tableData: initialTableData,
    filterData: initialFilterData,
    selectedClauses: [],
}

export const useClausesListStore = create<ClausesListState & ClausesListAction>(
    (set) => ({
        ...initialState,
        setFilterData: (payload) => set(() => ({ filterData: payload })),
        setTableData: (payload) => set(() => ({ tableData: payload })),
        setSelectedClauses: (checked, row) =>
            set((state) => {
                const prevData = state.selectedClauses
                if (checked) {
                    return { selectedClauses: [...prevData, ...[row]] }
                } else {
                    if (
                        prevData.some(
                            (prevClauses) => row.id === prevClauses.id,
                        )
                    ) {
                        return {
                            selectedClauses: prevData.filter(
                                (prevClauses) => prevClauses.id !== row.id,
                            ),
                        }
                    }
                    return { selectedClauses: prevData }
                }
            }),
        setSelectAllClauses: (row) => set(() => ({ selectedClauses: row })),
    }),
)
