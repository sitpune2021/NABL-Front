/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    apiLocation,
    apiGetLocationList,
    apiGetLocationById,
    apiUpdateLocation,
} from '@/services/LocationService'
import useSWR from 'swr'
import { useLocationListStore } from '../store/listStore'
import type { TableQueries } from '@/@types/common'
import {
    Fields,
    GetLocationListResponse,
    GetLocationDetailResponse,
} from '@/@types/location'

export default function useLocationList(locationId?: string) {
    const {
        tableData,
        filterData,
        setTableData,
        selectedLocation,
        setSelectedLocation,
        setSelectAllLocation,
        setFilterData,
    } = useLocationListStore((state) => state)

    const { data, error, isLoading, mutate } = useSWR(
        ['/api/location', { ...tableData, ...filterData }],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, params]) =>
            apiGetLocationList<GetLocationListResponse, TableQueries>(params),
        { revalidateOnFocus: false },
    )

    const {
        data: detailData,
        error: detailError,
        isLoading: isDetailLoading,
        mutate: mutateDetail,
    } = useSWR<GetLocationDetailResponse>(
        locationId ? `/api/location/${locationId}` : null,
        () => apiGetLocationById(locationId!),
        { revalidateOnFocus: false },
    )

    const saveLocationData = async (location: Fields) => {
        let savedData: any

        if (location.id) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { id, ...withoutId } = location
            savedData = await apiUpdateLocation(location.id, withoutId)
        } else {
            savedData = await apiLocation(location)
        }

        await mutate()
        if (location.id && mutateDetail) {
            mutateDetail({ data: savedData }, false)
        }

        return savedData
    }

    const locationList = data?.data || []
    const locationListTotal = data?.total || 0

    const locationDetail = detailData?.data
    return {
        locationList,
        locationListTotal,
        error,
        isLoading,
        locationDetail,
        isDetailLoading,
        detailError,
        mutateDetail,
        tableData,
        filterData,
        mutate,
        setTableData,
        selectedLocation,
        setSelectedLocation,
        setSelectAllLocation,
        setFilterData,
        saveLocationData,
    }
}
