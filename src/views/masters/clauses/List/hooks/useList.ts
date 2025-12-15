import {
    apiGetClausesList,
    apiGetClausesById,
    apiUpdateClauses,
    apiCreateClauses,
} from '@/services/ClausesService'
import useSWR from 'swr'
import { useClausesListStore } from '../store/listStore'
import type { TableQueries } from '@/@types/common'
import {
    Fields,
    GetClausesListResponse,
    GetClausesDetailResponse,
} from '@/@types/clauses'

export default function useClausesList(clausesId?: string) {
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
        ['/clauses', { ...tableData, ...filterData }],
        ([, params]) =>
            apiGetClausesList<GetClausesListResponse, TableQueries>(params),
        { revalidateOnFocus: false },
    )
    const {
        data: detailData,
        error: detailError,
        isLoading: isDetailLoading,
        mutate: mutateDetail,
    } = useSWR<GetClausesDetailResponse>(
        clausesId ? `/api/clauses/${clausesId}` : null,
        () => apiGetClausesById(clausesId!),
        { revalidateOnFocus: false },
    )

    const saveClausesData = async (clauses: Fields) => {
        if (clauses.id) {
            await apiUpdateClauses(clauses.id, clauses)
        } else {
            await apiCreateClauses(clauses)
        }
        await mutate()
    }

    const clausesList = data?.data || []
    const clausesListTotal = data?.total || 0
    const clausesDetail = detailData?.data || {}

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
        clausesDetail,
        detailError,
        isDetailLoading,
        mutateDetail,
    }
}
