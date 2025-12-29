import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { TableQueries } from '@/@types/common'
import type { ZoneListActions, ZoneListState } from '@/@types/zone'

export const initialTableData: TableQueries = {
    pageIndex: 1,
    pageSize: 10,
    query: '',
    sort: { key: '', order: '' },
}

export const useZoneListStore = create<ZoneListState & ZoneListActions>()(
    persist(
        (set) => ({
            tableData: initialTableData,
            selected: [],

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
                    tableData: { ...state.tableData, query: '', pageIndex: 1 },
                })),
        }),
        {
            name: 'zone-table',
            partialize: (state) => ({
                tableData: { ...state.tableData, query: '' }, // persist only page/sort, not query
            }),
        },
    ),
)
