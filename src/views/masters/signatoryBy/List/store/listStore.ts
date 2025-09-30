import { create } from 'zustand'
import type { TableQueries } from '@/@types/common'
import {
    SignatoryByListAction,
    SignatoryByListState,
} from '@/@types/signatoryBy'

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

const initialState: SignatoryByListState = {
    tableData: initialTableData,
    filterData: initialFilterData,
    selectedSignatoryBy: [],
}

export const useSignatoryByListStore = create<
    SignatoryByListState & SignatoryByListAction
>((set) => ({
    ...initialState,
    setFilterData: (payload) => set(() => ({ filterData: payload })),
    setTableData: (payload) => set(() => ({ tableData: payload })),
    setSelectedSignatoryBy: (checked, row) =>
        set((state) => {
            const prevData = state.selectedSignatoryBy
            if (checked) {
                return { selectedSignatoryBy: [...prevData, ...[row]] }
            } else {
                if (
                    prevData.some(
                        (prevSignatoryBy) => row.id === prevSignatoryBy.id,
                    )
                ) {
                    return {
                        selectedSignatoryBy: prevData.filter(
                            (prevSignatoryBy) => prevSignatoryBy.id !== row.id,
                        ),
                    }
                }
                return { selectedSignatoryBy: prevData }
            }
        }),
    setSelectAllSignatoryBy: (row) => set(() => ({ selectedSignatoryBy: row })),
}))
