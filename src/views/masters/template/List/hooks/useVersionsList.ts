import { apiGetTemplateVersionsById } from '@/services/TemplateService'
import useSWR from 'swr'
import type { TableQueries } from '@/@types/common'
import { GetTemplateListResponse } from '@/@types/template'
import { useVersionsTemplateListStore } from '../store/versionListStore'

const LIST_KEY = 'template-versions-list'
export default function useVersionsTemplateList(id: string) {
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
    } = useVersionsTemplateListStore((state) => state)

    const swr = useSWR(
        [LIST_KEY, id, { ...tableData, ...filterData }],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, id, params]) =>
            apiGetTemplateVersionsById<GetTemplateListResponse, TableQueries>(
                id,
                params,
            ),
        {
            revalidateOnFocus: false,
        },
    )

    return {
        templateVersionsList: swr.data?.data ?? [],
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
    }
}
