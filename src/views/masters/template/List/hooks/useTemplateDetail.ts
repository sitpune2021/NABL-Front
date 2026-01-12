import { Fields, GetTemplateDetailResponse } from '@/@types/template'
import { apiGetTemplateById } from '@/services/TemplateService'
import useSWR from 'swr'

export const useTemplateDetail = (id?: string) => {
    const swr = useSWR<GetTemplateDetailResponse>(
        id ? ['template-detail', id] : null,
        () => apiGetTemplateById(id!),
        {
            revalidateOnFocus: false,
        },
    )

    return {
        template: swr.data?.data as Fields | undefined,
        isLoading: swr.isLoading,
        error: swr.error,
        mutate: swr.mutate,
    }
}
