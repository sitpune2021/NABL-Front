import {
    apiUnit,
    apiGetUnitList,
    apiGetUnitById,
    apiUpdateUnit,
} from '@/services/UnitService'
import useSWR from 'swr'
import { useUnitListStore } from '../store/listStore'
import type { TableQueries } from '@/@types/common'
import {
    Fields,
    GetUnitDetailResponse,
    GetUnitListResponse,
} from '@/@types/unit'

export default function useUnitList(unitId?: string) {
    const {
        tableData,
        filterData,
        setTableData,
        selectedUnit,
        setSelectedUnit,
        setSelectAllUnit,
        setFilterData,
    } = useUnitListStore((state) => state)

    const { data, error, isLoading, mutate } = useSWR(
        ['/api/unit', { ...tableData, ...filterData }],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, params]) =>
            apiGetUnitList<GetUnitListResponse, TableQueries>(params),
        {
            revalidateOnFocus: false,
        },
    )

    const {
        data: detailData,
        error: detailError,
        isLoading: isDetailLoading,
        mutate: mutateDetail,
    } = useSWR<GetUnitDetailResponse>(
        unitId ? `/api/unit/${unitId}` : null,
        () => apiGetUnitById(unitId!),
        { revalidateOnFocus: false },
    )

    const saveUnitData = async (unit: Fields) => {
        if (unit.id) {
            await apiUpdateUnit(unit.id, unit)
        } else {
            await apiUnit(unit)
        }
        await mutate() // refresh list
    }

    const unitList = data?.data || []

    const unitListTotal = data?.total || 0

    const unitDetail = detailData?.data || {
        id: '',
        name: '',
    }

    return {
        unitList,
        unitListTotal,
        error,
        isLoading,
        tableData,
        filterData,
        mutate,
        setTableData,
        selectedUnit,
        setSelectedUnit,
        setSelectAllUnit,
        setFilterData,
        saveUnitData,
        unitDetail,
        detailError,
        isDetailLoading,
        mutateDetail,
    }
}
