import { apiGetTemplateVersionDetail } from '@/services/TemplateService'
import useSWR from 'swr'

export const useTemplateVersionDetail = (
    templateId?: string,
    versionId?: string,
) => {
    const { data, isLoading } = useSWR(
        templateId && versionId
            ? ['template-version-detail', templateId, versionId]
            : null,
        () => apiGetTemplateVersionDetail(templateId!, versionId!),
    )

    return {
        template: data?.data,
        isLoading,
    }
}
