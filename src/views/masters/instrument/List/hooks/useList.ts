/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    apiInstrument,
    apiGetInstrumentList,
    apiGetInstrumentById,
    apiUpdateInstrument,
    apiGetClauseDocumentsList,
} from '@/services/InstrumentService'
import useSWR from 'swr'
import { useInstrumentListStore } from '../store/listStore'
import type { TableQueries } from '@/@types/common'
import type { Fields, GetInstrumentListResponse } from '@/@types/instrument'

export default function useInstrumentList() {
    const {
        tableData,
        filterData,
        setTableData,
        selectedInstrument,
        setSelectedInstrument,
        setSelectAllInstrument,
        setFilterData,
    } = useInstrumentListStore((state) => state)

    const { data, error, isLoading, mutate } = useSWR(
        ['/api/instrument', { ...tableData, ...filterData }],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, params]) =>
            apiGetInstrumentList<GetInstrumentListResponse, TableQueries>(
                params,
            ),
        {
            revalidateOnFocus: false,
        },
    )

    const { data: clauseList, isLoading: clauseLoadfing } = useSWR(
        ['/api/standards/current', { ...tableData, ...filterData }],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, params]) => apiGetClauseDocumentsList<any, TableQueries>(params),
        {
            revalidateOnFocus: false,
        },
    )

    const saveInstrumentData = async (instrument: Fields) => {
        if (instrument.id) {
            await apiUpdateInstrument(instrument.id, instrument)
        } else {
            await apiInstrument(instrument)
        }
        await mutate() // refresh list
    }

    // ✅ Get single instrument by ID (for edit or view)
    const getInstrumentById = async (id: string) => {
        const instrument = await apiGetInstrumentById(id)
        return instrument.data
    }

    const instrumentList = data?.data || []
    const clauseLIst = clauseList?.data || {}

    const instrumentListTotal = data?.total || 0

    return {
        instrumentList,
        instrumentListTotal,
        error,
        isLoading,
        tableData,
        filterData,
        mutate,
        setTableData,
        selectedInstrument,
        setSelectedInstrument,
        setSelectAllInstrument,
        setFilterData,
        saveInstrumentData,
        getInstrumentById, // ✅ Now defined properly
        clauseLIst,
        clauseLoadfing,
    }
}
