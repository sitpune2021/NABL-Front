import { useMemo } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import endpointConfig from '@/configs/endpoint.config'
import UnitForm from '../Form'
import BottomPanel from '@/components/form/bottomPanel'
import { getMode } from '@/utils/getMode'
import { useDiscardConfirm } from '@/utils/hooks/useDiscardConfirm'
import { EMPTY_VALUES } from '@/constants/unit.constant'
import { useEntityMutations } from '@/utils/hooks/useEntityMutations'
import { UnitFormSchema } from '@/schemas/unit.schema'
import { apiUnit, apiUpdateUnit } from '@/services/UnitService'
import { useFormSubmit } from '@/utils/hoc/useFormSubmit'
import { useUnitDetail } from '../List/hooks/useDetail'

const UnitAddEdit = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { id } = useParams<{ id: string }>()
    const mode = useMemo(() => getMode(location.pathname), [location.pathname])
    const isView = mode === 'view'
    const isEdit = mode === 'edit'

    const { unit, isLoading } = useUnitDetail(id)
    const discard = useDiscardConfirm()

    const defaultValues = useMemo(() => unit ?? EMPTY_VALUES, [unit])

    const { save } = useEntityMutations<UnitFormSchema>({
        apiCreate: apiUnit,
        apiUpdate: apiUpdateUnit,
    })

    const { handleSubmit, isSubmitting } = useFormSubmit<UnitFormSchema>({
        apiCall: (values) =>
            save({ ...values, ...(isEdit && id ? { id } : {}) }),
        navigateTo: endpointConfig.master.unit.list,
    })

    const confirmDiscard = () => {
        toast.push(
            <Notification type="success">Changes discarded!</Notification>,
            { placement: 'top-center' },
        )
        discard.close()
        navigate(endpointConfig.master.unit.list)
    }

    return (
        <>
            <UnitForm
                defaultValues={defaultValues}
                readOnly={isView}
                loading={isLoading}
                onFormSubmit={handleSubmit}
            >
                <BottomPanel
                    isView={isView}
                    isSubmitting={isSubmitting}
                    isEdit={isEdit}
                    onDiscard={discard.show}
                />
            </UnitForm>
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

export default UnitAddEdit
