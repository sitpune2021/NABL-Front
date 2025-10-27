import {
    apiLocation,
    apiGetLocationList,
    apiGetLocationById,
    apiUpdateLocation,
} from '@/services/LocationService'
import useSWR from 'swr'
import { useLocationListStore } from '../store/listStore'
import type { TableQueries } from '@/@types/common'
import { Fields, GetLocationListResponse } from '@/@types/location'

export default function useLocationList() {
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
        {
            revalidateOnFocus: false,
        },
    )
    const saveLocationData = async (location: Fields) => {
        if (location.id) {
            await apiUpdateLocation(location.id, location)
        } else {
            await apiLocation(location)
        }
        await mutate() // refresh list
    }

    // ✅ Get single location by ID (for edit or view)
    const getLocationById = async (id: string) => {
        const location = await apiGetLocationById(id)
        return location
    }

    const locationList = data?.list || []

    const locationListTotal = data?.total || 0

    return {
        locationList,
        locationListTotal,
        error,
        isLoading,
        tableData,
        filterData,
        mutate,
        setTableData,
        selectedLocation,
        setSelectedLocation,
        setSelectAllLocation,
        setFilterData,
        saveLocationData,
        getLocationById, // ✅ Now defined properly
    }
}
