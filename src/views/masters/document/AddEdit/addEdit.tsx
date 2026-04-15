/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import endpointConfig from '@/configs/endpoint.config'
import DocumentForm from '../Form'
import { DocumentFormSchema } from '@/schemas/document.schema'
import { useDocumentDetail } from '../List/hooks/useDetail'
import { getMode } from '@/utils/getMode'
import { useDiscardConfirm } from '@/utils/hooks/useDiscardConfirm'
import { EMPTY_VALUES } from '@/constants/document.constant'
import { apiDocument, apiUpdateDocument } from '@/services/DocumentService'
import { useEntityMutations } from '@/utils/hooks/useEntityMutations'
import { useFormSubmit } from '@/utils/hoc/useFormSubmit'
import { FormSkeleton } from '@/components/form'

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

    const { document, isLoading, mutate } = useDocumentDetail(id)

    const defaultValues = useMemo(() => document ?? EMPTY_VALUES, [document])

    const { save } = useEntityMutations<DocumentFormSchema>({
        apiCreate: apiDocument,
        apiUpdate: apiUpdateDocument,
    })

    const { handleSubmit, isSubmitting } = useFormSubmit<DocumentFormSchema>({
        apiCall: async (values) => {
            const res = await save({
                ...values,
                ...(isEdit && id ? { id } : {}),
            })
            if (id) {
                mutate(
                    (prev: any) => ({
                        ...prev,
                        data: res.data,
                    }),
                    false,
                )
            }
            return res
        },
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

    if ((isEdit || isView) && isLoading) {
        return (
            <div className="flex flex-col md:flex-row gap-4">
                <div className="gap-4 flex flex-col flex-auto">
                    <FormSkeleton count={5} title={'Document Information'} />
                    <FormSkeleton count={2} title={'Template Configuration'} />
                </div>
                <div className="md:w-[370px] gap-4 flex flex-col">
                    <FormSkeleton
                        count={6}
                        title={'Review Schedule'}
                        cols={1}
                    />
                    <FormSkeleton
                        count={3}
                        title={'Preparation Details'}
                        cols={1}
                    />
                </div>
            </div>
        )
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
