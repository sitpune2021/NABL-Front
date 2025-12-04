import { create } from 'zustand'
import type { TableQueries } from '@/@types/common'
import { CategoryListAction, CategoryListState } from '@/@types/category'

export const initialTableData: TableQueries = {
    pageIndex: 1,
    pageSize: 10,
    query: '',
    sort: {
        order: '',
        key: '',
    },
}

const initialState: CategoryListState = {
    tableData: initialTableData,
    selectedCategory: [],
}

export const useCategoryListStore = create<
    CategoryListState & CategoryListAction
>((set) => ({
    ...initialState,
    setTableData: (payload) => set(() => ({ tableData: payload })),
    setSelectedCategory: (checked, row) =>
        set((state) => {
            const prevData = state.selectedCategory
            if (checked) {
                return { selectedCategory: [...prevData, row] }
            } else {
                return {
                    selectedCategory: prevData.filter(
                        (prevCategory) => prevCategory.id !== row.id,
                    ),
                }
            }
        }),
    setSelectAllCategory: (rows) => set(() => ({ selectedCategory: rows })),
}))
