import {
    apiTemplate,
    apiGetTemplateList,
    apiGetTemplateById,
    apiUpdateTemplate,
} from '@/services/TemplateService'
import useSWR from 'swr'
import { useTemplateListStore } from '../store/listStore'
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
        ['/api/template', { ...tableData, ...filterData }],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, params]) =>
            apiGetTemplateList<GetTemplateListResponse, TableQueries>(params),
        {
            revalidateOnFocus: false,
        },
    )
    const saveTemplateData = async (template: Fields) => {
        if (template.id) {
            console.log(template)

            await apiUpdateTemplate(template.id, template)
        } else {
            await apiTemplate(template)
        }
        await mutate() // refresh list
    }

    // ✅ Get single template by ID (for edit or view)
    const getTemplateById = async (id: string) => {
        const template = await apiGetTemplateById(id)
        return template
    }

    const templateList = data?.list || []

    const templateListTotal = data?.total || 0

    return {
        templateList,
        templateListTotal,
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
        getTemplateById, // ✅ Now defined properly
    }
}
