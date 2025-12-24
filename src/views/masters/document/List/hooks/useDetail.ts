import useSWR from 'swr'
import { apiGetDocumentById } from '@/services/DocumentService'
import { Document, GetDocumentResponse } from '@/@types/document'

export const useDocumentDetail = (id?: string) => {
    const swr = useSWR<GetDocumentResponse>(
        id ? ['document-detail', id] : null,
        () => apiGetDocumentById(id!),
        {
            revalidateOnFocus: false,
        },
    )

    return {
        document: swr.data?.data as Document | undefined,
        isLoading: swr.isLoading,
        error: swr.error,
        mutate: swr.mutate,
    }
}
