import { useMemo } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import endpointConfig from '@/configs/endpoint.config'
import ClusterForm from '../Form'
import { ClusterFormSchema } from '@/schemas/cluster.schema'
import BottomPanel from '@/components/form/bottomPanel'
import { getMode } from '@/utils/getMode'
import { useClusterDetail } from '../List/hooks/useClusterDetail'
import { useDiscardConfirm } from '@/utils/hooks/useDiscardConfirm'
import { useEntityMutations } from '@/utils/hooks/useEntityMutations'
import { apiCluster, apiUpdateCluster } from '@/services/ClusterService'
import { useFormSubmit } from '@/utils/hoc/useFormSubmit'
import { EMPTY_VALUES } from '@/constants/cluster.constant'

const ClusterAddEdit = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { id } = useParams<{ id: string }>()

    const mode = useMemo(() => getMode(location.pathname), [location.pathname])
    const isView = mode === 'view'
    const isEdit = mode === 'edit'

    const { cluster, isLoading } = useClusterDetail(id)
    const discard = useDiscardConfirm()
    const defaultValues = useMemo(() => cluster ?? EMPTY_VALUES, [cluster])

    const { save } = useEntityMutations<ClusterFormSchema>({
        apiCreate: apiCluster,
        apiUpdate: apiUpdateCluster,
    })

    const { handleSubmit, isSubmitting } = useFormSubmit<ClusterFormSchema>({
        apiCall: (values) =>
            save({ ...values, ...(isEdit && id ? { id } : {}) }),
        navigateTo: endpointConfig.master.cluster.list,
    })
    const confirmDiscard = () => {
        toast.push(
            <Notification type="success">Changes discarded!</Notification>,
            { placement: 'top-center' },
        )
        discard.close()
        navigate(endpointConfig.master.cluster.list)
    }

    return (
        <>
            <ClusterForm
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
            </ClusterForm>
            <ConfirmDialog
                isOpen={discard.open}
                type="danger"
                title="Discard Changes?"
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

export default ClusterAddEdit
