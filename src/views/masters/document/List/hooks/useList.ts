import {
    apiDocument,
    apiGetDocumentList,
    apiGetDocumentById,
    apiUpdateDocument,
} from '@/services/DocumentService'
import useSWR from 'swr'
import { useDocumentListStore } from '../store/listStore'
import type { TableQueries } from '@/@types/common'
import { Fields, GetDocumentListResponse } from '@/@types/document'

export default function useDocumentList() {
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
    const saveDocumentData = async (document: Fields) => {
        if (document.id) {
            await apiUpdateDocument(document.id, document)
        } else {
            await apiDocument(document)
        }
        await mutate() // refresh list
    }

    // ✅ Get single document by ID (for edit or view)
    const getDocumentById = async (id: string) => {
        const document = await apiGetDocumentById(id)
        return document
    }

    const documentList = data?.list || []

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
        getDocumentById, // ✅ Now defined properly
    }
}
