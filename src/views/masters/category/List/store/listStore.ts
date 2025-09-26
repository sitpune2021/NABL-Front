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

const initialState: CategoryListState = {
    tableData: initialTableData,
    filterData: initialFilterData,
    selectedCategory: [],
}

export const useCategoryListStore = create<
    CategoryListState & CategoryListAction
>((set) => ({
    ...initialState,
    setFilterData: (payload) => set(() => ({ filterData: payload })),
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
