import {
    apiTemplate,
    apiGetTemplateList,
    apiGetTemplateById,
    apiUpdateTemplate,
} from '@/services/TemplateService'
import useSWR from 'swr'
import { useTemplateListStore } from '../store/listStore'
import { useMemo } from 'react'
import type { TableQueries } from '@/@types/common'
import { Fields, GetTemplateListResponse } from '@/@types/template'

export default function useTemplateList() {
    const {
        tableData,
        filterData,
        setTableData,
        selectedTemplate,
        setSelectedTemplate,
        setSelectAllTemplate,
        setFilterData,
    } = useTemplateListStore((state) => state)

    const { data, error, isLoading, mutate } = useSWR(
        ['/api/template', { ...tableData }],
        ([, params]) =>
            apiGetTemplateList<GetTemplateListResponse, TableQueries>(params),

        { revalidateOnFocus: false },
    )

    // ⭐ FINAL FILTER LOGIC
    const filteredList = useMemo(() => {
        const list = data?.list || []

        const selectedChannels = filterData.purchaseChannel

        // If ALL selected → return whole list
        if (selectedChannels.includes('all')) {
            return list
        }

        // Filter by item.type matching selected filters
        return list.filter((item) => selectedChannels.includes(item.type))
    }, [data, filterData])

    const saveTemplateData = async (template: Fields) => {
        if (template.id) {
            await apiUpdateTemplate(template.id, template)
        } else {
            await apiTemplate(template)
        }
        await mutate()
    }

    const getTemplateById = async (id: string) => {
        return await apiGetTemplateById(id)
    }

    return {
        templateList: filteredList,
        templateListTotal: filteredList.length,
        error,
        isLoading,
        tableData,
        filterData,
        mutate,
        setTableData,
        selectedTemplate,
        setSelectedTemplate,
        setSelectAllTemplate,
        setFilterData,
        saveTemplateData,
        getTemplateById,
    }
}
