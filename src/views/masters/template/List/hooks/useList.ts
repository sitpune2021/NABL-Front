import {
    apiGetTemplateById,
    apiGetTemplateList,
    apiChangeTemplateStatus,
} from '@/services/TemplateService'
import useSWR from 'swr'
import { useTemplateListStore } from '../store/listStore'
import type { TableQueries } from '@/@types/common'
import { GetTemplateListResponse } from '@/@types/template'

const LIST_KEY = 'template-list'
export default function useTemplateList() {
    const {
        filterData,
        updateFilters,
        resetFilters,
        tableData,
        updateTable,
        selected,
        toggleRow,
        setAll,
        clearSelection,
    } = useTemplateListStore((state) => state)

    const swr = useSWR(
        [LIST_KEY, { ...tableData, ...filterData }],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, params]) =>
            apiGetTemplateList<GetTemplateListResponse, TableQueries>(params),
        {
            revalidateOnFocus: false,
        },
    )

    const getTemplateById = async (id: string) => {
        const { data } = await apiGetTemplateById(id)
        return data
    }
    const handleSubmit = async (data: {
        template_id: string | number
        status: 'published' | 'archived'
    }) => {
        await apiChangeTemplateStatus(data)
        swr.mutate()
    }

    return {
        templateList: swr.data?.data ?? [],
        total: swr.data?.total ?? 0,
        isLoading: swr.isLoading,
        error: swr.error,
        mutate: swr.mutate,

        tableData,
        updateTable,

        filterData,
        updateFilters,
        resetFilters,

        selected,
        toggleRow,
        setAll,
        clearSelection,
        getTemplateById,
        handleSubmit,
    }
}
