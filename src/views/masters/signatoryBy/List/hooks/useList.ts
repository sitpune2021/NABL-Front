import {
    apiSignatoryBy,
    apiGetSignatoryByList,
    apiGetSignatoryByById,
    apiUpdateSignatoryBy,
} from '@/services/SignatoryByService'
import useSWR from 'swr'
import { useSignatoryByListStore } from '../store/listStore'
import type { TableQueries } from '@/@types/common'
import { Fields, GetSignatoryByListResponse } from '@/@types/signatoryBy'

export default function useSignatoryByList() {
    const {
        tableData,
        filterData,
        setTableData,
        selectedSignatoryBy,
        setSelectedSignatoryBy,
        setSelectAllSignatoryBy,
        setFilterData,
    } = useSignatoryByListStore((state) => state)

    const { data, error, isLoading, mutate } = useSWR(
        ['/api/signatoryBy', { ...tableData, ...filterData }],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, params]) =>
            apiGetSignatoryByList<GetSignatoryByListResponse, TableQueries>(
                params,
            ),
        {
            revalidateOnFocus: false,
        },
    )
    const saveSignatoryByData = async (signatoryBy: Fields) => {
        if (signatoryBy.id) {
            await apiUpdateSignatoryBy(signatoryBy.id, signatoryBy)
        } else {
            await apiSignatoryBy(signatoryBy)
        }
        await mutate() // refresh list
    }

    // ✅ Get single signatoryBy by ID (for edit or view)
    const getSignatoryByById = async (id: string) => {
        const signatoryBy = await apiGetSignatoryByById(id)
        return signatoryBy
    }

    const signatoryByList = data?.list || []

    const signatoryByListTotal = data?.total || 0

    return {
        signatoryByList,
        signatoryByListTotal,
        error,
        isLoading,
        tableData,
        filterData,
        mutate,
        setTableData,
        selectedSignatoryBy,
        setSelectedSignatoryBy,
        setSelectAllSignatoryBy,
        setFilterData,
        saveSignatoryByData,
        getSignatoryByById, // ✅ Now defined properly
    }
}
