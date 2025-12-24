import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { TableQueries } from '@/@types/common'
import { StandardListActions, StandardListState } from '@/@types/standard'

export const initialTableData: TableQueries = {
    pageIndex: 1,
    pageSize: 10,
    query: '',
    sort: { key: '', order: '' },
}

const initialState: StandardListState = {
    tableData: initialTableData,
    selected: [],
}

export const useStandardListStore = create<
    StandardListState & StandardListActions
>()(
    persist(
        (set) => ({
            ...initialState,

            updateTable: (payload) =>
                set((state) => ({
                    tableData: { ...state.tableData, ...payload },
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
            name: 'standard-table',
            partialize: (state) => ({
                tableData: {
                    ...state.tableData,
                    query: '', // do not persist search text
                },
                // filterData: state.filterData,
            }),
        },
    ),
)
