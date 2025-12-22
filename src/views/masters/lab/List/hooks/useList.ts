import {
    apiLab,
    apiGetLabList,
    apiGetLabById,
    apiUpdateLab,
} from '@/services/LabService'
import useSWR from 'swr'
import { useLabListStore } from '../store/listStore'
import type { TableQueries } from '@/@types/common'
import { GetLabListResponse, Lab } from '@/@types/lab'

export default function useLabList() {
    const {
        tableData,
        filterData,
        setTableData,
        selectedLab,
        setSelectedLab,
        setSelectAllLab,
        setFilterData,
    } = useLabListStore((state) => state)

    const { data, error, isLoading, mutate } = useSWR(
        ['/api/lab', { ...tableData, ...filterData }],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, params]) =>
            apiGetLabList<GetLabListResponse, TableQueries>(params),
        {
            revalidateOnFocus: false,
        },
    )
    const saveLabData = async (lab: Lab) => {
        if (lab.id) {
            await apiUpdateLab(lab.id, lab)
        } else {
            await apiLab(lab)
        }
        await mutate() // refresh list
    }

    // ✅ Get single lab by ID (for edit or view)
    const getLabById = async (id: string) => {
        const lab = await apiGetLabById(id)
        return lab.data
    }

    const getLocationsByLabId = async (id: string) => {
        const lab = await apiGetLabById(id)
        return lab.data.location
    }

    const labList = data?.data || []

    const labListTotal = data?.total || 0

    return {
        labList,
        labListTotal,
        error,
        isLoading,
        tableData,
        filterData,
        mutate,
        setTableData,
        selectedLab,
        setSelectedLab,
        setSelectAllLab,
        setFilterData,
        saveLabData,
        getLabById, // ✅ Now defined properly
        getLocationsByLabId,
    }
}
