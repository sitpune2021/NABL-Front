import { useMemo, useState, useCallback } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import BottomPanel from '@/components/form/bottomPanel'
import { getMode } from '@/utils/getMode'
import { useDiscardConfirm } from '@/utils/hooks/useDiscardConfirm'
import { useEntityMutations } from '@/utils/hooks/useEntityMutations'
import { useFormSubmit } from '@/utils/hoc/useFormSubmit'
import endpointConfig from '@/configs/endpoint.config'
import { useTemplateDetail } from '../List/hooks/useTemplateDetail'
import TemplateForm from '../Form'
import { TemplateFormSchema } from '@/schemas/template.schema'
import { apiTemplate, apiUpdateTemplate } from '@/services/TemplateService'

type RouteParams = {
    id?: string
    type?: 'header' | 'footer'
}

const TemplateAddEdit = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { id, type } = useParams<RouteParams>()

    const EMPTY_VALUES = useMemo<TemplateFormSchema>(
        () => ({
            name: '',
            type: type ?? '',
            template: {
                html: '',
                css: '',
                json: '',
            },
            status: 'draft',
        }),
        [type],
    )

    const mode = useMemo(() => getMode(location.pathname), [location.pathname])
    const isView = mode === 'view'
    const isEdit = mode === 'edit'

    const { template, isLoading } = useTemplateDetail(id)
    const discard = useDiscardConfirm()

    const defaultValues = useMemo(
        () => template ?? EMPTY_VALUES,
        [template, EMPTY_VALUES],
    )

    const { save } = useEntityMutations<TemplateFormSchema>({
        apiCreate: apiTemplate,
        apiUpdate: apiUpdateTemplate,
    })

    const { handleSubmit, isSubmitting } = useFormSubmit<TemplateFormSchema>({
        apiCall: (values) =>
            save({ ...values, ...(isEdit && id ? { id } : {}) }),
        navigateTo: endpointConfig.master.template.list,
    })

    const confirmDiscard = useCallback(() => {
        toast.push(
            <Notification type="success">Changes discarded</Notification>,
            { placement: 'top-center' },
        )
        discard.close()
        navigate(endpointConfig.master.template.list)
    }, [discard, navigate])

    const [submitDialogOpen, setSubmitDialogOpen] = useState(false)

    const closeSubmitDialog = () => setSubmitDialogOpen(false)

    return (
        <>
            <TemplateForm
                defaultValues={defaultValues}
                readOnly={isView}
                dialogIsOpen={submitDialogOpen}
                isSubmiting={isSubmitting}
                isEdit={isEdit}
                EMPTY_VALUES={EMPTY_VALUES}
                loading={isLoading}
                onFormSubmit={handleSubmit}
                onDialogClose={closeSubmitDialog}
            >
                <BottomPanel
                    isView={isView}
                    isEdit={isEdit}
                    isSubmitting={isSubmitting}
                    type="button"
                    onDiscard={discard.show}
                    onPrimaryClick={() => setSubmitDialogOpen(true)}
                />
            </TemplateForm>

            <ConfirmDialog
                isOpen={discard.open}
                type="danger"
                title="Discard changes"
                onClose={discard.close}
                onRequestClose={discard.close}
                onCancel={discard.close}
                onConfirm={confirmDiscard}
            >
                <p>
                    Are you sure you want discard this? This action can&apos;t
                    be undo.{' '}
                </p>
            </ConfirmDialog>
        </>
    )
}

export default TemplateAddEdit
