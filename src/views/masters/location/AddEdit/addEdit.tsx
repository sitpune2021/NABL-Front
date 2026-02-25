import { useMemo } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import endpointConfig from '@/configs/endpoint.config'
import LocationForm from '../Form'
import { LocationFormSchema } from '@/schemas/location.schema'
import BottomPanel from '@/components/form/bottomPanel'
import { getMode } from '@/utils/getMode'
import { useLocationDetail } from '../List/hooks/useLocationDetail'
import { useDiscardConfirm } from '@/utils/hooks/useDiscardConfirm'
import { useEntityMutations } from '@/utils/hooks/useEntityMutations'
import { apiLocation, apiUpdateLocation } from '@/services/LocationService'
import { useFormSubmit } from '@/utils/hoc/useFormSubmit'
import { EMPTY_VALUES } from '@/constants/location.constant'
import { FormSkeleton } from '@/components/form'

const LocationAddEdit = () => {
    const navigate = useNavigate()
    const routerLocation = useLocation()

    const { id } = useParams<{ id: string }>()

    const mode = useMemo(
        () => getMode(routerLocation.pathname),
        [routerLocation.pathname],
    )
    const isView = mode === 'view'
    const isEdit = mode === 'edit'

    const { location, isLoading } = useLocationDetail(id)
    const discard = useDiscardConfirm()

    const { save } = useEntityMutations<LocationFormSchema>({
        apiCreate: apiLocation,
        apiUpdate: apiUpdateLocation,
    })
    const { handleSubmit, isSubmitting } = useFormSubmit<LocationFormSchema>({
        apiCall: (values) =>
            save({ ...values, ...(isEdit && id ? { id } : {}) }),
        navigateTo: endpointConfig.master.location.list,
    })

    const confirmDiscard = () => {
        toast.push(
            <Notification type="success">Changes discarded</Notification>,
            { placement: 'top-center' },
        )
        discard.close()
        navigate(`${endpointConfig.master.location.list}`)
    }
    if ((isEdit || isView) && isLoading) {
        return <FormSkeleton count={5} title={'Location'} />
    }
    return (
        <>
            <LocationForm
                key={id || 'new'}
                defaultValues={location ?? EMPTY_VALUES}
                readOnly={isView}
                onFormSubmit={handleSubmit}
            >
                <BottomPanel
                    isView={isView}
                    isSubmitting={isSubmitting}
                    isEdit={isEdit}
                    onDiscard={discard.show}
                />
            </LocationForm>
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
                    be undo.{' '}
                </p>
            </ConfirmDialog>
        </>
    )
}

export default LocationAddEdit
