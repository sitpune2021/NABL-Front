import { create } from 'zustand'
import type { TableQueries } from '@/@types/common'
import { TemplateListAction, TemplateListState } from '@/@types/template'

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
        // 'all',
        // 'header',
        // 'footer',
        // 'generic',
        // 'draft',
        // 'draft-header',
        // 'draft-footer',
        // 'draft-generic',
        // 'archived-all',
        // 'archived-header',
        // 'archived-footer',
        // 'archived-generic',
    ],
}

const initialState: TemplateListState = {
    tableData: initialTableData,
    filterData: initialFilterData,
    selectedTemplate: [],
}

export const useTemplateListStore = create<
    TemplateListState & TemplateListAction
>((set) => ({
    ...initialState,
    setFilterData: (payload) => set(() => ({ filterData: payload })),
    setTableData: (payload) => set(() => ({ tableData: payload })),
    setSelectedTemplate: (checked, row) =>
        set((state) => {
            const prevData = state.selectedTemplate
            if (checked) {
                return { selectedTemplate: [...prevData, row] }
            } else {
                return {
                    selectedTemplate: prevData.filter(
                        (prev) => prev.id !== row.id,
                    ),
                }
            }
        }),
    setSelectAllTemplate: (rows) => set(() => ({ selectedTemplate: rows })),
}))
