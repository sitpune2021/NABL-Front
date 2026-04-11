import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { TableQueries } from '@/@types/common'
import type { FormSchema } from '../components/ListTableFilter'
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

export const initialFilterData: FormSchema = {
    zones: [],
    clusters: [],
    cluster_id: '', // ✅ important
}

const initialState: LocationListState = {
    tableData: initialTableData,
    filterData: initialFilterData,
    selected: [],
}

export const useLocationListStore = create<
    LocationListState & LocationListAction
>()(
    persist(
        (set) => ({
            ...initialState,

            updateTable: (payload) =>
                set((state) => ({
                    tableData: { ...state.tableData, ...payload },
                })),

            updateFilters: (payload) =>
                set((state) => ({
                    filterData: { ...state.filterData, ...payload },
                    tableData: {
                        ...state.tableData,
                        pageIndex: 1,
                    },
                })),

            resetFilters: () =>
                set((state) => ({
                    filterData: { ...initialFilterData },
                    tableData: {
                        ...state.tableData,
                    },
                })),

            toggleRow: (checked, row) =>
                set((state) => ({
                    selected: checked
                        ? [...state.selected, row]
                        : state.selected.filter((r) => r.id !== row.id),
                })),

            setAll: (rows) => set({ selected: rows }),

            clearSelection: () => set({ selected: [] }),

            resetQuery: () =>
                set((state) => ({
                    tableData: {
                        ...state.tableData,
                        query: '',
                        pageIndex: 1,
                    },
                })),
        }),
        {
            name: 'location-table',
            partialize: (state) => ({
                tableData: {
                    ...state.tableData,
                    query: '', // do not persist search text
                },
                filterData: state.filterData,
            }),
        },
    ),
)
