import {
    apiZone,
    apiGetZoneList,
    apiGetZoneById,
    apiUpdateZone,
} from '@/services/ZoneService'
import useSWR from 'swr'
import { useZoneListStore } from '../store/listStore'
import type { TableQueries } from '@/@types/common'
import { Fields, GetZoneListResponse } from '@/@types/zone'

export default function useZoneList() {
    const {
        tableData,
        setTableData,
        selectedZone,
        setSelectedZone,
        setSelectAllZone,
    } = useZoneListStore((state) => state)

    const { data, error, isLoading, mutate } = useSWR(
        ['/api/zone', { ...tableData }],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, params]) =>
            apiGetZoneList<GetZoneListResponse, TableQueries>(params),
        {
            revalidateOnFocus: false,
        },
    )
    const saveZoneData = async (zone: Fields) => {
        if (zone.id) {
            await apiUpdateZone(zone.id, zone)
        } else {
            await apiZone(zone)
        }
        await mutate() // refresh list
    }

    // ✅ Get single zone by ID (for edit or view)
    const getZoneById = async (id: string) => {
        const zone = await apiGetZoneById(id)
        return zone
    }

    const zoneList = data?.data || []

    const zoneListTotal = data?.total || 0

    return {
        zoneList,
        zoneListTotal,
        error,
        isLoading,
        tableData,
        mutate,
        setTableData,
        selectedZone,
        setSelectedZone,
        setSelectAllZone,
        saveZoneData,
        getZoneById, // ✅ Now defined properly
    }
}
