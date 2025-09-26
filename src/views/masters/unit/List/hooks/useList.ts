import {
    apiUnit,
    apiGetUnitList,
    apiGetUnitById,
    apiUpdateUnit,
} from '@/services/UnitService'
import useSWR from 'swr'
import { useUnitListStore } from '../store/listStore'
import type { TableQueries } from '@/@types/common'
import { Fields, GetUnitListResponse } from '@/@types/unit'

export default function useUnitList() {
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
    const saveUnitData = async (unit: Fields) => {
        if (unit.id) {
            await apiUpdateUnit(unit.id, unit)
        } else {
            await apiUnit(unit)
        }
        await mutate() // refresh list
    }

    // ✅ Get single unit by ID (for edit or view)
    const getUnitById = async (id: string) => {
        const unit = await apiGetUnitById(id)
        return unit
    }

    const unitList = data?.list || []

    const unitListTotal = data?.total || 0

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
        getUnitById, // ✅ Now defined properly
    }
}
