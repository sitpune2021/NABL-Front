import { create } from 'zustand'
import type { TableQueries } from '@/@types/common'
import {
    SignatoryOnListAction,
    SignatoryOnListState,
} from '@/@types/signatoryOn'

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

const initialState: SignatoryOnListState = {
    tableData: initialTableData,
    filterData: initialFilterData,
    selectedSignatoryOn: [],
}

export const useSignatoryOnListStore = create<
    SignatoryOnListState & SignatoryOnListAction
>((set) => ({
    ...initialState,
    setFilterData: (payload) => set(() => ({ filterData: payload })),
    setTableData: (payload) => set(() => ({ tableData: payload })),
    setSelectedSignatoryOn: (checked, row) =>
        set((state) => {
            const prevData = state.selectedSignatoryOn
            if (checked) {
                return { selectedSignatoryOn: [...prevData, ...[row]] }
            } else {
                if (
                    prevData.some(
                        (prevSignatoryOn) => row.id === prevSignatoryOn.id,
                    )
                ) {
                    return {
                        selectedSignatoryOn: prevData.filter(
                            (prevSignatoryOn) => prevSignatoryOn.id !== row.id,
                        ),
                    }
                }
                return { selectedSignatoryOn: prevData }
            }
        }),
    setSelectAllSignatoryOn: (row) => set(() => ({ selectedSignatoryOn: row })),
}))
