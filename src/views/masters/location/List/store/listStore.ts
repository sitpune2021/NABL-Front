import { create } from 'zustand'
import type { TableQueries } from '@/@types/common'
import { LocationListAction, LocationListState } from '@/@types/location'

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

const initialState: LocationListState = {
    tableData: initialTableData,
    filterData: initialFilterData,
    selectedLocation: [],
}

export const useLocationListStore = create<
    LocationListState & LocationListAction
>((set) => ({
    ...initialState,
    setFilterData: (payload) => set(() => ({ filterData: payload })),
    setTableData: (payload) => set(() => ({ tableData: payload })),
    setSelectedLocation: (checked, row) =>
        set((state) => {
            const prevData = state.selectedLocation
            if (checked) {
                return { selectedLocation: [...prevData, ...[row]] }
            } else {
                if (
                    prevData.some((prevLocation) => row.id === prevLocation.id)
                ) {
                    return {
                        selectedLocation: prevData.filter(
                            (prevLocation) => prevLocation.id !== row.id,
                        ),
                    }
                }
                return { selectedLocation: prevData }
            }
        }),
    setSelectAllLocation: (row) => set(() => ({ selectedLocation: row })),
}))
