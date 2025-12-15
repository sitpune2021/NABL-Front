/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    apiZone,
    apiGetZoneList,
    apiGetZoneById,
    apiUpdateZone,
} from '@/services/ZoneService'
import useSWR from 'swr'
import { useZoneListStore } from '../store/listStore'
import type { TableQueries } from '@/@types/common'
import {
    Fields,
    GetZoneListResponse,
    GetZoneDetailResponse,
} from '@/@types/zone'

export default function useZoneList(zoneId?: string) {
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
    )

    const {
        data: detailData,
        error: detailError,
        isLoading: isDetailLoading,
        mutate: mutateDetail,
    } = useSWR<GetZoneDetailResponse>(
        zoneId ? `/api/zone/${zoneId}` : null,
        () => apiGetZoneById(zoneId!),
        { revalidateOnFocus: false },
    )

    const saveZoneData = async (zone: Fields) => {
        let savedData: any
        if (zone.id) {
            /* eslint-disable @typescript-eslint/no-unused-vars */
            const { id, ...zoneWithoutId } = zone
            savedData = await apiUpdateZone(zone.id, zoneWithoutId)
        } else {
            savedData = await apiZone(zone)
        }
        await mutate()

        if (zone.id && mutateDetail) {
            mutateDetail({ data: savedData }, false)
        }

        return savedData
    }

    const zoneList = data?.data || []
    const zoneListTotal = data?.total || 0

    const zoneDetail = detailData?.data || {
        name: '',
        identifier: '',
    }

    return {
        zoneList,
        zoneListTotal,
        error,
        isLoading,
        zoneDetail,
        isDetailLoading,
        detailError,
        mutateDetail,
        tableData,
        mutate,
        setTableData,
        selectedZone,
        setSelectedZone,
        setSelectAllZone,
        saveZoneData,
    }
}
