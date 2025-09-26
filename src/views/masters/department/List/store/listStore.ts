import { create } from 'zustand'
import type { TableQueries } from '@/@types/common'
import { DepartmentListAction, DepartmentListState } from '@/@types/department'

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

const initialState: DepartmentListState = {
    tableData: initialTableData,
    filterData: initialFilterData,
    selectedDepartment: [],
}

export const useDepartmentListStore = create<
    DepartmentListState & DepartmentListAction
>((set) => ({
    ...initialState,
    setFilterData: (payload) => set(() => ({ filterData: payload })),
    setTableData: (payload) => set(() => ({ tableData: payload })),
    setSelectedDepartment: (checked, row) =>
        set((state) => {
            const prevData = state.selectedDepartment
            if (checked) {
                return { selectedDepartment: [...prevData, ...[row]] }
            } else {
                if (
                    prevData.some(
                        (prevDepartment) => row.id === prevDepartment.id,
                    )
                ) {
                    return {
                        selectedDepartment: prevData.filter(
                            (prevDepartment) => prevDepartment.id !== row.id,
                        ),
                    }
                }
                return { selectedDepartment: prevData }
            }
        }),
    setSelectAllDepartment: (row) => set(() => ({ selectedDepartment: row })),
}))
