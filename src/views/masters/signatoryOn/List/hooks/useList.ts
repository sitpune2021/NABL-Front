import {
    apiSignatoryOn,
    apiGetSignatoryOnList,
    apiGetSignatoryOnById,
    apiUpdateSignatoryOn,
} from '@/services/SignatoryOnService'
import useSWR from 'swr'
import { useSignatoryOnListStore } from '../store/listStore'
import type { TableQueries } from '@/@types/common'
import { Fields, GetSignatoryOnListResponse } from '@/@types/signatoryOn'

export default function useSignatoryOnList() {
    const {
        tableData,
        filterData,
        setTableData,
        selectedSignatoryOn,
        setSelectedSignatoryOn,
        setSelectAllSignatoryOn,
        setFilterData,
    } = useSignatoryOnListStore((state) => state)

    const { data, error, isLoading, mutate } = useSWR(
        ['/api/signatoryOn', { ...tableData, ...filterData }],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, params]) =>
            apiGetSignatoryOnList<GetSignatoryOnListResponse, TableQueries>(
                params,
            ),
        {
            revalidateOnFocus: false,
        },
    )
    const saveSignatoryOnData = async (signatoryOn: Fields) => {
        if (signatoryOn.id) {
            await apiUpdateSignatoryOn(signatoryOn.id, signatoryOn)
        } else {
            await apiSignatoryOn(signatoryOn)
        }
        await mutate() // refresh list
    }

    // ✅ Get single signatoryOn by ID (for edit or view)
    const getSignatoryOnById = async (id: string) => {
        const signatoryOn = await apiGetSignatoryOnById(id)
        return signatoryOn
    }

    const signatoryOnList = data?.list || []

    const signatoryOnListTotal = data?.total || 0

    return {
        signatoryOnList,
        signatoryOnListTotal,
        error,
        isLoading,
        tableData,
        filterData,
        mutate,
        setTableData,
        selectedSignatoryOn,
        setSelectedSignatoryOn,
        setSelectAllSignatoryOn,
        setFilterData,
        saveSignatoryOnData,
        getSignatoryOnById, // ✅ Now defined properly
    }
}
