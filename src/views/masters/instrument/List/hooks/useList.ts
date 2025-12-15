import {
    apiInstrument,
    apiGetInstrumentList,
    apiGetInstrumentById,
    apiUpdateInstrument,
} from '@/services/InstrumentService'
import useSWR from 'swr'
import { useInstrumentListStore } from '../store/listStore'
import type { TableQueries } from '@/@types/common'
import type {
    Fields,
    GetInstrumentListResponse,
    GetInstrumentDetailResponse,
} from '@/@types/instrument'

export default function useInstrumentList(instrumentId?: string) {
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
    const {
        data: detailData,
        error: detailError,
        isLoading: isDetailLoading,
        mutate: mutateDetail,
    } = useSWR<GetInstrumentDetailResponse>(
        instrumentId ? `/api/instrument/${instrumentId}` : null,
        () => apiGetInstrumentById(instrumentId!),
        { revalidateOnFocus: false },
    )

    const saveInstrumentData = async (instrument: Fields) => {
        if (instrument.id) {
            await apiUpdateInstrument(instrument.id, instrument)
        } else {
            await apiInstrument(instrument)
        }
        await mutate() // refresh list
    }

    const instrumentList = data?.data || []

    const instrumentListTotal = data?.total || 0

    const instrumentDetail = detailData?.data || {
        identifier: '',
        name: '',
        short_name: '',
        manufacturer: '',
        serial_no: '',
    }

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
        instrumentDetail,
        detailError,
        isDetailLoading,
        mutateDetail,
    }
}
