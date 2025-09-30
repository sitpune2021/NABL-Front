import { create } from 'zustand'
import type { TableQueries } from '@/@types/common'
import { DocumentListAction, DocumentListState } from '@/@types/document'

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

const initialState: DocumentListState = {
    tableData: initialTableData,
    filterData: initialFilterData,
    selectedDocument: [],
}

export const useDocumentListStore = create<
    DocumentListState & DocumentListAction
>((set) => ({
    ...initialState,
    setFilterData: (payload) => set(() => ({ filterData: payload })),
    setTableData: (payload) => set(() => ({ tableData: payload })),
    setSelectedDocument: (checked, row) =>
        set((state) => {
            const prevData = state.selectedDocument
            if (checked) {
                return { selectedDocument: [...prevData, ...[row]] }
            } else {
                if (
                    prevData.some((prevDocument) => row.id === prevDocument.id)
                ) {
                    return {
                        selectedDocument: prevData.filter(
                            (prevDocument) => prevDocument.id !== row.id,
                        ),
                    }
                }
                return { selectedDocument: prevData }
            }
        }),
    setSelectAllDocument: (row) => set(() => ({ selectedDocument: row })),
}))
