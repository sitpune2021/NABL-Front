import {
    apiClauses,
    apiGetClausesList,
    apiGetClausesById,
    apiUpdateClauses,
} from '@/services/ClausesService'
import useSWR from 'swr'
import { useClausesListStore } from '../store/listStore'
import type { TableQueries } from '@/@types/common'
import { Fields, GetClausesListResponse } from '@/@types/clauses'

export default function useClausesList() {
    const {
        tableData,
        filterData,
        setTableData,
        selectedClauses,
        setSelectedClauses,
        setSelectAllClauses,
        setFilterData,
    } = useClausesListStore((state) => state)

    const { data, error, isLoading, mutate } = useSWR(
        ['/api/clauses', { ...tableData, ...filterData }],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, params]) =>
            apiGetClausesList<GetClausesListResponse, TableQueries>(params),
        {
            revalidateOnFocus: false,
        },
    )
    const saveClausesData = async (clauses: Fields) => {
        if (clauses.id) {
            await apiUpdateClauses(clauses.id, clauses)
        } else {
            await apiClauses(clauses)
        }
        await mutate() // refresh list
    }

    // ✅ Get single clauses by ID (for edit or view)
    const getClausesById = async (id: string) => {
        const clauses = await apiGetClausesById(id)
        return clauses
    }

    const clausesList = data?.list || []

    const clausesListTotal = data?.total || 0

    return {
        clausesList,
        clausesListTotal,
        error,
        isLoading,
        tableData,
        filterData,
        mutate,
        setTableData,
        selectedClauses,
        setSelectedClauses,
        setSelectAllClauses,
        setFilterData,
        saveClausesData,
        getClausesById, // ✅ Now defined properly
    }
}
