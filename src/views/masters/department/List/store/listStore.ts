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

const initialState: DepartmentListState = {
    tableData: initialTableData,
    selectedDepartment: [],
}

export const useDepartmentListStore = create<
    DepartmentListState & DepartmentListAction
>((set) => ({
    ...initialState,
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
