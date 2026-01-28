import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { TableQueries } from '@/@types/common'
import { MenuListActions, MenuListState } from '@/@types/menu'

export const initialTableData: TableQueries = {
    pageIndex: 1,
    pageSize: 10,
    query: '',
    sort: { key: '', order: '' },
}

const initialState: MenuListState = {
    tableData: initialTableData,
    selected: [],
}

export const useMenuListStore = create<MenuListState & MenuListActions>()(
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
            name: 'menu-table',
            partialize: (state) => ({
                tableData: {
                    ...state.tableData,
                    query: '',
                },
            }),
        },
    ),
)
