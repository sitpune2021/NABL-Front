import { create } from 'zustand'
import type { TableQueries } from '@/@types/common'
import { InstrumentListAction, InstrumentListState } from '@/@types/instrument'

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

const initialState: InstrumentListState = {
    tableData: initialTableData,
    filterData: initialFilterData,
    selectedInstrument: [],
}

export const useInstrumentListStore = create<
    InstrumentListState & InstrumentListAction
>((set) => ({
    ...initialState,
    setFilterData: (payload) => set(() => ({ filterData: payload })),
    setTableData: (payload) => set(() => ({ tableData: payload })),
    setSelectedInstrument: (checked, row) =>
        set((state) => {
            const prevData = state.selectedInstrument
            if (checked) {
                return { selectedInstrument: [...prevData, ...[row]] }
            } else {
                if (
                    prevData.some(
                        (prevInstrument) => row.id === prevInstrument.id,
                    )
                ) {
                    return {
                        selectedInstrument: prevData.filter(
                            (prevInstrument) => prevInstrument.id !== row.id,
                        ),
                    }
                }
                return { selectedInstrument: prevData }
            }
        }),
    setSelectAllInstrument: (row) => set(() => ({ selectedInstrument: row })),
}))
