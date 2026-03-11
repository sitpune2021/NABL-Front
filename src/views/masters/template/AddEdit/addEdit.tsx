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
import { useTemplateVersionDetail } from '../List/hooks/useTemplateVersionDetail'
import TemplateForm from '../Form'
import { TemplateFormSchema } from '@/schemas/template.schema'
import { apiTemplate, apiUpdateTemplate } from '@/services/TemplateService'
import { EMPTY_VALUES } from '@/constants/template.constants'
import { FormSkeleton } from '@/components/form'

type RouteParams = {
    id?: string
    version_id?: string
    type?: 'header' | 'footer'
}

const TemplateAddEdit = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { id, version_id, type } = useParams<RouteParams>()

    const mode = useMemo(() => getMode(location.pathname), [location.pathname])
    const [submitDialogOpen, setSubmitDialogOpen] = useState(false)

    const isVersionView = Boolean(version_id)
    const isView = mode === 'view' || isVersionView
    const isEdit = mode === 'edit' && !isVersionView

    const { template: templateDetail, isLoading: templateLoading } =
        useTemplateDetail(id)

    const { template: versionDetail, isLoading: versionLoading } =
        useTemplateVersionDetail(id, version_id)

    const template = isVersionView ? versionDetail : templateDetail
    const isLoading = isVersionView ? versionLoading : templateLoading
    const canSubmit = !isView && !isVersionView

    const { save } = useEntityMutations<TemplateFormSchema>({
        apiCreate: apiTemplate,
        apiUpdate: apiUpdateTemplate,
    })

    const { handleSubmit, isSubmitting } = useFormSubmit<TemplateFormSchema>({
        apiCall: (values) => {
            if (isVersionView) return Promise.resolve()
            return save({ ...values, ...(isEdit && id ? { id } : {}) })
        },
        navigateTo: endpointConfig.master.template.list,
    })
    const discard = useDiscardConfirm()

    const handlePrimaryClick = useCallback(() => setSubmitDialogOpen(true), [])
    const handleDiscardClick = useCallback(() => discard.show(), [discard])

    const confirmDiscard = useCallback(() => {
        toast.push(
            <Notification type="success">Changes discarded</Notification>,
            { placement: 'top-center' },
        )
        discard.close()
        navigate(endpointConfig.master.template.list)
    }, [discard, navigate])

    if ((isEdit || isView) && isLoading) {
        return <FormSkeleton count={1} title="Template" />
    }

    return (
        <>
            <TemplateForm
                key={id || 'new'}
                defaultValues={
                    template ?? { ...EMPTY_VALUES, type: type ?? '' }
                }
                readOnly={isView}
                dialogIsOpen={submitDialogOpen}
                isSubmiting={isSubmitting}
                isEdit={isEdit}
                loading={isLoading}
                onFormSubmit={handleSubmit}
                onDialogClose={() => setSubmitDialogOpen(false)}
            >
                <BottomPanel
                    isView={isView}
                    isEdit={isEdit}
                    isSubmitting={isSubmitting}
                    type="button"
                    onDiscard={!isVersionView ? handleDiscardClick : undefined}
                    onPrimaryClick={canSubmit ? handlePrimaryClick : undefined}
                />
            </TemplateForm>

            {!isVersionView && (
                <ConfirmDialog
                    isOpen={discard.open}
                    type="danger"
                    title="Discard changes"
                    onClose={discard.close}
                    onCancel={discard.close}
                    onConfirm={confirmDiscard}
                >
                    <p>
                        Are you sure you want to discard this? This action
                        can&apos;t be undone.
                    </p>
                </ConfirmDialog>
            )}
        </>
    )
}

export default TemplateAddEdit
