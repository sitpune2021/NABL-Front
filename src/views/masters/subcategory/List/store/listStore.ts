import { create } from 'zustand'
import type { TableQueries } from '@/@types/common'
import {
    SubCategoryListAction,
    SubCategoryListState,
} from '@/@types/subcategory'

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

const initialState: SubCategoryListState = {
    tableData: initialTableData,
    filterData: initialFilterData,
    selectedSubCategory: [],
}

export const useSubCategoryListStore = create<
    SubCategoryListState & SubCategoryListAction
>((set) => ({
    ...initialState,
    setFilterData: (payload) => set(() => ({ filterData: payload })),
    setTableData: (payload) => set(() => ({ tableData: payload })),
    setSelectedSubCategory: (checked, row) =>
        set((state) => {
            const prevData = state.selectedSubCategory
            if (checked) {
                return { selectedSubCategory: [...prevData, ...[row]] }
            } else {
                if (
                    prevData.some(
                        (prevSubCategory) => row.id === prevSubCategory.id,
                    )
                ) {
                    return {
                        selectedSubCategory: prevData.filter(
                            (prevSubCategory) => prevSubCategory.id !== row.id,
                        ),
                    }
                }
                return { selectedSubCategory: prevData }
            }
        }),
    setSelectAllSubCategory: (row) => set(() => ({ selectedSubCategory: row })),
}))
