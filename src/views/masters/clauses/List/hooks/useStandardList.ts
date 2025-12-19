import {
    apiGetStandardList,
    apiGetStandardById,
    apiUpdateStandard,
    apiCreateStandard,
} from '@/services/StandardService'
import useSWR from 'swr'
import { useStandardListStore } from '../store/listStandardStore'
import type { TableQueries } from '@/@types/common'
import {
    Fields,
    GetStandardListResponse,
    GetStandardResponse,
} from '@/@types/standard'

export default function useStandardList(Id?: string) {
    const {
        tableData,
        filterData,
        setTableData,
        selectedStandard,
        setSelectedStandard,
        setSelectAllStandard,
        setFilterData,
    } = useStandardListStore((state) => state)

    const { data, error, isLoading, mutate } = useSWR(
        ['/standard', { ...tableData, ...filterData }],
        ([, params]) =>
            apiGetStandardList<GetStandardListResponse, TableQueries>(params),
        { revalidateOnFocus: false },
    )

    const {
        data: detailData,
        error: detailError,
        isLoading: isDetailLoading,
        mutate: mutateDetail,
    } = useSWR<GetStandardResponse>(
        Id ? `/standard/${Id}` : null,
        () => apiGetStandardById(Id!),
        { revalidateOnFocus: false },
    )

    const saveStandardData = async (standard: Fields) => {
        let savedStandard: Fields
        if (standard.id) {
            const response = await apiUpdateStandard(standard.id, standard)
            savedStandard = response
        } else {
            const response = await apiCreateStandard(standard)
            savedStandard = response
        }
        await mutate()
        return savedStandard
    }

    const standardList = data || []
    const standardListTotal = data?.total || 0
    const standardDetail = detailData || {
        name: '',
        clauses: [],
    }

    return {
        standardList,
        standardListTotal,
        error,
        isLoading,
        tableData,
        filterData,
        mutate,
        setTableData,
        selectedStandard,
        setSelectedStandard,
        setSelectAllStandard,
        setFilterData,
        saveStandardData,
        standardDetail,
        detailError,
        isDetailLoading,
        mutateDetail,
    }
}
