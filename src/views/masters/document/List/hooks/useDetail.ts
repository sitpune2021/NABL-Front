import useSWR from 'swr'
import { apiGetDocumentById } from '@/services/DocumentService'
import { GetDocumentResponse } from '@/@types/document'
import { DocumentFormSchema } from '@/schemas/document.schema'

export const useDocumentDetail = (id?: string) => {
    const swr = useSWR<GetDocumentResponse>(
        id ? ['document-detail', id] : null,
        () => apiGetDocumentById(id!),
        {
            revalidateOnFocus: false,
        },
    )

    return {
        document: swr.data?.data as DocumentFormSchema | undefined,
        isLoading: swr.isLoading,
        error: swr.error,
        mutate: swr.mutate,
    }
}
