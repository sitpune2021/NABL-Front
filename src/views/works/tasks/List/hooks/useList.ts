import {
    apiDocument,
    apiGetDocumentList,
    apiGetDocumentById,
    apiUpdateDocument,
} from '@/services/DocumentService'
import useSWR from 'swr'
import { useDocumentListStore } from '../store/listStore'
import type { TableQueries } from '@/@types/common'
import {
    Fields,
    GetDocumentListResponse,
    GetDocumentResponse,
} from '@/@types/document'
import { EMPTY_VALUES } from '@/constants/document.constant'

export default function useDocumentList(documentId?: string) {
    const {
        tableData,
        filterData,
        setTableData,
        selectedDocument,
        setSelectedDocument,
        setSelectAllDocument,
        setFilterData,
    } = useDocumentListStore((state) => state)

    const { data, error, isLoading, mutate } = useSWR(
        ['/api/document', { ...tableData, ...filterData }],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, params]) =>
            apiGetDocumentList<GetDocumentListResponse, TableQueries>(params),
        {
            revalidateOnFocus: false,
        },
    )

    const {
        data: detailData,
        error: detailError,
        isLoading: isDetailLoading,
        mutate: mutateDetail,
    } = useSWR<GetDocumentResponse>(
        documentId ? `/api/document/${documentId}` : null,
        () => apiGetDocumentById(documentId!),
        { revalidateOnFocus: false },
    )

    const saveDocumentData = async (document: Fields) => {
        let response
        if (document.id) {
            response = await apiUpdateDocument(document.id, document)
        } else {
            response = await apiDocument(document)
        }
        await mutate()
        return response
    }

    const documentList = data?.data || []
    const documentDetail = detailData?.data || EMPTY_VALUES

    const documentListTotal = data?.total || 0

    return {
        documentList,
        documentListTotal,
        error,
        isLoading,
        tableData,
        filterData,
        mutate,
        setTableData,
        selectedDocument,
        setSelectedDocument,
        setSelectAllDocument,
        setFilterData,
        saveDocumentData,
        documentDetail,
        detailError,
        isDetailLoading,
        mutateDetail,
    }
}
