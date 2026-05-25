import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { TableQueries } from '@/@types/common'
import type { Prefix } from '@/@types/prefix'

export type PrefixListState = {
    tableData: TableQueries
    selected: Prefix[]
    prefixList: Prefix[] // ✅ ADD
}

export type PrefixListActions = {
    updateTable: (payload: Partial<TableQueries>) => void
    toggleRow: (checked: boolean, row: Prefix) => void
    setAll: (rows: Prefix[]) => void
    clearSelection: () => void
    resetQuery: () => void
    setPrefixList: (data: Prefix[]) => void // ✅ ADD
}

export const initialTableData: TableQueries = {
    pageIndex: 1,
    pageSize: 10,
    query: '',
    sort: { key: '', order: '' },
}

export const usePrefixListStore = create<PrefixListState & PrefixListActions>()(
    persist(
        (set) => ({
            tableData: initialTableData,
            selected: [],
            prefixList: [],

            setPrefixList: (data) => set({ prefixList: data }),

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
            name: 'prefix-table',
            partialize: (state) => ({
                tableData: state.tableData,
            }),
        },
    ),
)
