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
                return { selectedCategory: [...prevData, ...[row]] }
            } else {
                if (
                    prevData.some((prevCategory) => row.id === prevCategory.id)
                ) {
                    return {
                        selectedCategory: prevData.filter(
                            (prevCategory) => prevCategory.id !== row.id,
                        ),
                    }
                }
                return { selectedCategory: prevData }
            }
        }),
    setSelectAllCategory: (row) => set(() => ({ selectedCategory: row })),
}))
