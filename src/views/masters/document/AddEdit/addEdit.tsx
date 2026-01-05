import { useMemo } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import endpointConfig from '@/configs/endpoint.config'
import DocumentForm from '../Form'
import type { DocumentFormSchema } from '@/@types/document'
import { useDocumentDetail } from '../List/hooks/useDetail'
import { getMode } from '@/utils/getMode'
import { useDiscardConfirm } from '@/utils/hooks/useDiscardConfirm'
import { EMPTY_VALUES } from '@/constants/document.constant'
import { apiDocument, apiUpdateDocument } from '@/services/DocumentService'
import { useEntityMutations } from '@/utils/hooks/useEntityMutations'
import { useFormSubmit } from '@/utils/hoc/useFormSubmit'

const DocumentAddEdit = () => {
    const navigate = useNavigate()
    const { id } = useParams<{ id: string }>()
    const location = useLocation()
    const mode = useMemo(() => getMode(location.pathname), [location.pathname])
    const isView = mode === 'view'
    const isEdit = mode === 'edit'
    const isForEditor = mode === 'editor'
    const isForEditorView = mode === 'editor-view'

    const discard = useDiscardConfirm()

    const { document, isLoading } = useDocumentDetail(id)

    const defaultValues = useMemo(() => document ?? EMPTY_VALUES, [document])

    const { save } = useEntityMutations<DocumentFormSchema>({
        apiCreate: apiDocument,
        apiUpdate: apiUpdateDocument,
    })

    const { handleSubmit, isSubmitting } = useFormSubmit<DocumentFormSchema>({
        apiCall: (values) =>
            save({ ...values, ...(isEdit && id ? { id } : {}) }),
        navigateTo: endpointConfig.master.document.list,
    })

    const confirmDiscard = () => {
        toast.push(
            <Notification type="success">Changes discarded</Notification>,
            { placement: 'top-center' },
        )
        discard.close()
        navigate(`${endpointConfig.master.document.list}`)
    }

    return (
        <>
            <DocumentForm
                defaultValues={defaultValues}
                readOnly={isView}
                loading={isLoading}
                isEdit={isEdit}
                isForEditor={isForEditor}
                isForEditorView={isForEditorView}
                isSubmitting={isSubmitting}
                onFormSubmit={handleSubmit}
            />

            <ConfirmDialog
                isOpen={discard.open}
                type="danger"
                title="Discard changes"
                onClose={discard.close}
                onCancel={discard.close}
                onConfirm={confirmDiscard}
            >
                <p>
                    Are you sure you want discard this? This action can&apos;t
                    be undo.
                </p>
            </ConfirmDialog>
        </>
    )
}

export default DocumentAddEdit
