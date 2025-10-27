import { create } from 'zustand'
import type { TableQueries } from '@/@types/common'
import { ClusterListAction, ClusterListState } from '@/@types/cluster'

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

const initialState: ClusterListState = {
    tableData: initialTableData,
    filterData: initialFilterData,
    selectedCluster: [],
}

export const useClusterListStore = create<ClusterListState & ClusterListAction>(
    (set) => ({
        ...initialState,
        setFilterData: (payload) => set(() => ({ filterData: payload })),
        setTableData: (payload) => set(() => ({ tableData: payload })),
        setSelectedCluster: (checked, row) =>
            set((state) => {
                const prevData = state.selectedCluster
                if (checked) {
                    return { selectedCluster: [...prevData, ...[row]] }
                } else {
                    if (
                        prevData.some(
                            (prevCluster) => row.id === prevCluster.id,
                        )
                    ) {
                        return {
                            selectedCluster: prevData.filter(
                                (prevCluster) => prevCluster.id !== row.id,
                            ),
                        }
                    }
                    return { selectedCluster: prevData }
                }
            }),
        setSelectAllCluster: (row) => set(() => ({ selectedCluster: row })),
    }),
)
