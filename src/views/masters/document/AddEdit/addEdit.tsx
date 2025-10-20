import { useEffect, useState, useMemo, useCallback } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router'
import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import sleep from '@/utils/sleep'
import { TbTrash } from 'react-icons/tb'
import endpointConfig from '@/configs/endpoint.config'
import useDocumentList from '../List/hooks/useList'
import DocumentForm from '../Form'
import type { DocumentFormSchema } from '@/@types/document'
import { defaultDocumentValues } from '@/constants/intial-doc.constant'
import { apiGetDocumentEditortById } from '@/services/DocumentService'

function buildPath(path: string, params: Record<string, string | number>) {
    return Object.entries(params).reduce(
        (acc, [key, value]) => acc.replace(`:${key}`, value.toString()),
        path,
    )
}

const DocumentAddEdit = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { id: documentId } = useParams()
    const { saveDocumentData, getDocumentById, saveDocumentEditorData } =
        useDocumentList()

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [documentData, setDocumentData] = useState<DocumentFormSchema | null>(
        null,
    )
    const [loadingData, setLoadingData] = useState(false)

    const pathParts = location.pathname.split('/')
    const isEdit = pathParts.includes('edit')
    const isView = location.pathname.includes('/view')
    const isAdd = location.pathname.includes('/create')
    const isEditor = pathParts.includes('editor')

    useEffect(() => {
        if (documentId) {
            const fetchData = async () => {
                try {
                    setLoadingData(true)
                    const data = isEditor
                        ? isEdit
                            ? await apiGetDocumentEditortById(documentId)
                            : isView
                              ? await apiGetDocumentEditortById(documentId)
                              : await getDocumentById(documentId)
                        : await getDocumentById(documentId)
                    setDocumentData(data)
                } catch (err) {
                    console.error('Failed to load document:', err)
                    toast.push(
                        <Notification type="danger">
                            Failed to load document data.
                        </Notification>,
                        { placement: 'top-center' },
                    )
                } finally {
                    setLoadingData(false)
                }
            }
            fetchData()
        }
    }, [documentId])

    const defaultValues = useMemo(
        () => documentData ?? defaultDocumentValues,
        [documentData],
    )

    const handleFormSubmit = useCallback(
        async (values: DocumentFormSchema) => {
            if (isView) return

            try {
                setIsSubmitting(true)
                if (isEditor) {
                    const payload = isEdit
                        ? { ...values, id: documentId }
                        : values
                    await saveDocumentEditorData(payload)
                    await sleep(800)
                    setIsSubmitting(false)
                    toast.push(
                        <Notification type="success">
                            {isEdit ? 'Editor updated!' : 'Editor created!'}
                        </Notification>,
                        { placement: 'top-center' },
                    )
                    navigate(`${endpointConfig.master.document.list}`)
                } else {
                    const payload = isEdit
                        ? { ...values, id: documentId }
                        : values
                    const response = await saveDocumentData(payload)
                    const savedDoc = response?.data

                    await sleep(800)
                    setIsSubmitting(false)
                    toast.push(
                        <Notification type="success">
                            {isEdit ? 'Document updated!' : 'Document created!'}
                        </Notification>,
                        { placement: 'top-center' },
                    )
                    const path = isEdit
                        ? buildPath(endpointConfig.master.document.editorEdit, {
                              docId: documentId ?? '',
                              id: savedDoc.id ?? '',
                          })
                        : `${endpointConfig.master.document.editor}/${savedDoc.id}`
                    navigate(path)
                }
            } catch (error) {
                console.error('Save failed:', error)
                toast.push(
                    <Notification type="danger">
                        Failed to save document. Please try again.
                    </Notification>,
                    { placement: 'top-center' },
                )
            } finally {
                setIsSubmitting(false)
            }
        },
        [isEdit, isView, documentId, navigate, saveDocumentData],
    )

    const handleDiscard = useCallback(() => setIsDialogOpen(true), [])
    const handleCancel = useCallback(() => setIsDialogOpen(false), [])

    const handleConfirmDiscard = useCallback(() => {
        toast.push(
            <Notification type="success">Changes discarded!</Notification>,
            { placement: 'top-center' },
        )
        setIsDialogOpen(false)
        navigate(endpointConfig.master.document.list)
    }, [navigate])

    if (loadingData && !isAdd) {
        return <p className="p-4 text-gray-600">Loading document data...</p>
    }

    return (
        <>
            <DocumentForm
                newDocument={isAdd}
                isEditor={isEditor}
                defaultValues={defaultValues}
                readOnly={isView}
                documentData={documentData} // Pass the documentData prop here
                isEdit={isEdit}
                onFormSubmit={handleFormSubmit}
            >
                <Container>
                    <div className="flex items-center justify-between px-8">
                        <span></span>
                        {!isView && (
                            <div className="flex items-center">
                                <Button
                                    className="ltr:mr-3 rtl:ml-3"
                                    type="button"
                                    customColorClass={() =>
                                        'border-error ring-1 ring-error text-error hover:border-error hover:ring-error hover:text-error bg-transparent'
                                    }
                                    icon={<TbTrash />}
                                    onClick={handleDiscard}
                                >
                                    Discard
                                </Button>
                                <Button
                                    variant="solid"
                                    type="submit"
                                    loading={isSubmitting}
                                >
                                    {isEditor
                                        ? isEdit
                                            ? 'Update'
                                            : 'Create'
                                        : isEdit
                                          ? 'Update'
                                          : 'Create'}
                                </Button>
                            </div>
                        )}
                    </div>
                </Container>
            </DocumentForm>
            <ConfirmDialog
                isOpen={isDialogOpen}
                type="danger"
                title="Discard changes"
                onClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleConfirmDiscard}
            >
                <p>
                    Are you sure you want to discard this? This action can’t be
                    undone.
                </p>
            </ConfirmDialog>
        </>
    )
}

export default DocumentAddEdit
