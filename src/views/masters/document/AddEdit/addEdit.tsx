import { useState, useCallback, useMemo } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import sleep from '@/utils/sleep'
import endpointConfig from '@/configs/endpoint.config'
import useDocumentList from '../List/hooks/useList'
import DocumentForm from '../Form'
import DynamicFormWrapper from '../Form/DynamicWrapper'
import type { DocumentFormSchema } from '@/@types/document'
import { defaultDocumentValues } from '@/constants/intial-doc.constant'
import { useDocumentDetail } from '../List/hooks/useDetail'

const DocumentAddEdit = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { id } = useParams()
    const { saveDocumentData } = useDocumentList(id)
    const { document, isLoading } = useDocumentDetail(id)

    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const pathParts = useMemo(
        () => location.pathname.split('/'),
        [location.pathname],
    )
    const isEdit = pathParts.includes('edit')
    const isView = location.pathname.includes('/view')
    const isAdd = pathParts.includes('create')
    const isForEditor = pathParts.includes('editor')
    const isDataEntry = pathParts.includes('data-entry')

    const defaultValues = useMemo(
        () => document ?? defaultDocumentValues,
        [document],
    )

    const handleFormSubmit = useCallback(
        async (values: DocumentFormSchema) => {
            if (isView) return
            try {
                const payload = isEdit ? { ...values, id: id } : values
                await saveDocumentData(payload)
                await sleep(800)
                toast.push(
                    <Notification type="success">
                        {isEdit ? 'Document updated!' : 'Document created!'}
                    </Notification>,
                    { placement: 'top-center' },
                )
                navigate(endpointConfig.master.document.list)
            } catch (err) {
                console.error('Save failed:', err)
                toast.push(
                    <Notification type="danger">
                        Failed to save document. Please try again.
                    </Notification>,
                    { placement: 'top-center' },
                )
            }
        },
        [isEdit, isView, id, saveDocumentData, navigate],
    )

    const handleCancel = () => setIsDialogOpen(false)
    const handleConfirmDiscard = () => {
        toast.push(
            <Notification type="success">Changes discarded!</Notification>,
            { placement: 'top-center' },
        )
        setIsDialogOpen(false)
        navigate(endpointConfig.master.document.list)
    }

    if (isLoading && !isAdd)
        return <p className="p-4 text-gray-600">Loading document data...</p>

    if (isDataEntry && document) {
        return <DynamicFormWrapper isDataEntry documentData={document} />
    }

    return (
        <>
            <DocumentForm
                defaultValues={defaultValues}
                readOnly={isView}
                isEdit={isEdit}
                isForEditor={isForEditor}
                onFormSubmit={handleFormSubmit}
            />

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
