import { apiGetTemplateVersionDetail } from '@/services/TemplateService'
import useSWR from 'swr'

export const useTemplateVersionDetail = (
    templateId?: string,
    versionId?: string,
) => {
    const { data, isLoading, error, mutate } = useSWR(
        templateId && versionId
            ? ['template-version-detail', templateId, versionId]
            : null,
        () => apiGetTemplateVersionDetail(templateId!, versionId!),
    )

    return {
        template: data?.data,
        isLoading,
        error: error,
        mutate: mutate,
    }
}
