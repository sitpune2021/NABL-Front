import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { TableQueries } from '@/@types/common'
import type { Category } from '@/@types/category'

type CategoryListState = {
    tableData: TableQueries
    selected: Category[]
}

type CategoryListActions = {
    updateTable: (payload: Partial<TableQueries>) => void
    toggleRow: (checked: boolean, row: Category) => void
    setAll: (rows: Category[]) => void
    clearSelection: () => void
    resetQuery: () => void
}

export const initialTableData: TableQueries = {
    pageIndex: 1,
    pageSize: 10,
    query: '',
    sort: { key: '', order: '' },
}

export const useCategoryListStore = create<
    CategoryListState & CategoryListActions
>()(
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
            name: 'category-table',
            partialize: (state) => ({
                tableData: { ...state.tableData, query: '' }, // persist only page/sort, not query
            }),
        },
    ),
)
