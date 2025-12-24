import { useMemo } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import endpointConfig from '@/configs/endpoint.config'
import BottomPanel from '@/components/form/bottomPanel'
import StandardForm from '../Form'
import { EMPTY_VALUES } from '@/constants/standard.constant'
import { StandardFormSchema } from '@/schemas/standard.schema'
import { getMode } from '@/utils/getMode'
import { useDiscardConfirm } from '@/utils/hooks/useDiscardConfirm'
import { useFormSubmit } from '@/utils/hoc/useFormSubmit'
import { useEntityMutations } from '@/utils/hooks/useEntityMutations'
import {
    apiCreateStandard,
    apiUpdateStandard,
} from '@/services/StandardService'
import { useStandardDetail } from '../List/hooks/useDetail'

const AddEdit = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { id } = useParams<{ id: string }>()

    const mode = useMemo(() => getMode(location.pathname), [location.pathname])
    const isView = mode === 'view'
    const isEdit = mode === 'edit'
    const { standard, isLoading } = useStandardDetail(id)

    const discard = useDiscardConfirm()
    const defaultValues = useMemo(() => standard ?? EMPTY_VALUES, [standard])

    const { save } = useEntityMutations<StandardFormSchema>({
        apiCreate: apiCreateStandard,
        apiUpdate: apiUpdateStandard,
    })

    const { handleSubmit, isSubmitting } = useFormSubmit<StandardFormSchema>({
        apiCall: (values) =>
            save({ ...values, ...(isEdit && id ? { id } : {}) }),
        onSuccess: (response) => {
            navigate(
                `${endpointConfig.setting.clauses.create}/${
                    isEdit ? id : response.data.id
                }`,
            )
        },
    })

    const confirmDiscard = () => {
        toast.push(
            <Notification type="success">Changes discarded</Notification>,
            { placement: 'top-center' },
        )
        discard.close()
        navigate(`${endpointConfig.master.subcategory.list}`)
    }

    return (
        <>
            <StandardForm
                defaultValues={defaultValues}
                readOnly={isView}
                loading={isLoading}
                onFormSubmit={handleSubmit}
            >
                <BottomPanel
                    isView={isView}
                    isEdit={isEdit}
                    isSubmitting={isSubmitting}
                    onDiscard={discard.show}
                />
            </StandardForm>

            <ConfirmDialog
                isOpen={discard.open}
                type="danger"
                title="Discard changes"
                onClose={discard.close}
                onCancel={discard.close}
                onConfirm={confirmDiscard}
            >
                <p>Are you sure you want to discard your changes?</p>
            </ConfirmDialog>
        </>
    )
}

export default AddEdit
