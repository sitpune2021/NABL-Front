import { useEffect, useState } from 'react'
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
import { DocumentFormSchema } from '@/@types/document'

const DocumentAddEdit = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { id: documentId } = useParams()
    const { saveDocumentData, getDocumentById } = useDocumentList()

    const [discardConfirmationOpen, setDiscardConfirmationOpen] =
        useState(false)
    const [isSubmiting, setIsSubmiting] = useState(false)
    const [documentData, setDocumentData] = useState<DocumentFormSchema | null>(
        null,
    )
    const [loadingData, setLoadingData] = useState(false)

    const isEdit = location.pathname.includes('/edit')
    const isView = location.pathname.includes('/view')
    const isAdd = location.pathname.includes('/create')
    const isEditor = location.pathname.includes('/editor')

    // Load existing document data in edit or view mode
    useEffect(() => {
        if (!isAdd && documentId) {
            setLoadingData(true)
            getDocumentById(documentId)
                .then((data) => {
                    console.log('Fetched document data:', data)

                    setDocumentData(data)
                })
                .finally(() => setLoadingData(false))
        }
    }, [documentId, isAdd])

    const handleFormSubmit = async (values: DocumentFormSchema) => {
        if (isView) return
        setIsSubmiting(true)
        const payload = isEdit ? { ...values, id: documentId } : values
        await saveDocumentData(payload)
        await sleep(800)
        setIsSubmiting(false)
        toast.push(
            <Notification type="success">
                {isEdit ? 'Document updated!' : 'Document created!'}
            </Notification>,
            { placement: 'top-center' },
        )
        navigate(`${endpointConfig.master.document.create}/editor`)
    }

    const handleConfirmDiscard = () => {
        setDiscardConfirmationOpen(true)
        toast.push(
            <Notification type="success">Changes discarded!</Notification>,
            { placement: 'top-center' },
        )
        navigate(`${endpointConfig.master.document.list}`)
    }

    const handleDiscard = () => setDiscardConfirmationOpen(true)
    const handleCancel = () => setDiscardConfirmationOpen(false)

    if (loadingData && !isAdd) {
        return <p className="p-4">Loading document data...</p>
    }

    return (
        <>
            <DocumentForm
                newDocument={isAdd}
                isEditor={isEditor}
                defaultValues={
                    documentData ?? {
                        labName: '',
                        location: '',
                        department: '',
                        category: '',
                        documentName: '',
                        documentNo: '',
                        header: '',
                        footer: '',
                        issuedNo: '',
                        amendmentNo: '',
                        copyNo: '',
                        date: '',
                        preparedByDate: '',
                        time: '',
                        preparedBy: '',
                        quantityPrepared: '',
                        approvedBy: '',
                        issuedBy: '',
                        issueDate: '',
                        amendmentDate: '',
                        effectiveDate: '',
                        frequency: '',
                        duration: '',
                    }
                }
                readOnly={isView}
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
                                    loading={isSubmiting}
                                >
                                    {isEdit ? 'Update' : 'Create'}
                                </Button>
                            </div>
                        )}
                    </div>
                </Container>
            </DocumentForm>
            <ConfirmDialog
                isOpen={discardConfirmationOpen}
                type="danger"
                title="Discard changes"
                onClose={handleCancel}
                onRequestClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleConfirmDiscard}
            >
                <p>
                    Are you sure you want discard this? This action can&apos;t
                    be undo.{' '}
                </p>
            </ConfirmDialog>
        </>
    )
}

export default DocumentAddEdit
