import {
    apiGetStandardList,
    apiGetStandardById,
    apiUpdateStandard,
    apiCreateStandard,
} from '@/services/StandardService'
import useSWR from 'swr'
import { useStandardListStore } from '../store/listStandardStore'
import type { TableQueries } from '@/@types/common'
import { Fields, GetStandardListResponse } from '@/@types/standard'

export default function useStandardList() {
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

    const getStandardById = async (id: string) => {
        const standard = await apiGetStandardById(id)
        return standard
    }

    const standardList = data?.list || []
    const standardListTotal = data?.total || 0

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
        getStandardById,
    }
}
