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
        {
            revalidateOnFocus: false,
        },
    )

    // ⭐ FINAL FIXED FILTER LOGIC
    const filteredList = useMemo(() => {
        const list = data?.list || []
        const selected = filterData.purchaseChannel || []

        if (!selected.length) return list

        // CASE 1: all → entire list
        if (selected.includes('all')) return list

        return list.filter((item) => {
            const type = item.type?.toLowerCase() || ''

            // CASE 2: archived-all → archived-*
            if (selected.includes('archived-all')) {
                if (type.startsWith('archived')) return true
            }

            // CASE 3: draft → draft-*
            if (selected.includes('draft')) {
                if (type.startsWith('draft')) return true
            }

            // CASE 4: exact match
            if (selected.includes(type)) {
                return true
            }

            return false
        })
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
