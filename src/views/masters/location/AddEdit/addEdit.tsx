import { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import sleep from '@/utils/sleep'
import endpointConfig from '@/configs/endpoint.config'
import useLocationList from '../List/hooks/useList'
import LocationForm from '../Form'
import { LocationFormSchema } from '@/@types/location'
import BottomPanel from '@/components/form/bottomPanel'

const LocationAddEdit = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { id: locationId } = useParams()
    const { saveLocationData, getLocationById } = useLocationList()

    const [discardConfirmationOpen, setDiscardConfirmationOpen] =
        useState(false)
    const [isSubmiting, setIsSubmiting] = useState(false)
    const [locationData, setLocationData] = useState<LocationFormSchema | null>(
        null,
    )
    const [loadingData, setLoadingData] = useState(false)

    const isEdit = location.pathname.includes('/edit')
    const isView = location.pathname.includes('/view')
    const isAdd = location.pathname.includes('/create')

    // Load existing location data in edit or view mode
    useEffect(() => {
        if (!isAdd && locationId) {
            setLoadingData(true)
            getLocationById(locationId)
                .then((data) => {
                    setLocationData(data)
                })
                .finally(() => setLoadingData(false))
        }
    }, [locationId, isAdd])

    const handleFormSubmit = async (values: LocationFormSchema) => {
        if (isView) return
        setIsSubmiting(true)
        const payload = isEdit ? { ...values, id: locationId } : values
        await saveLocationData(payload)
        await sleep(800)
        setIsSubmiting(false)
        toast.push(
            <Notification type="success">
                {isEdit ? 'Location updated!' : 'Location created!'}
            </Notification>,
            { placement: 'top-center' },
        )
        navigate(`${endpointConfig.master.location.list}`)
    }

    const handleConfirmDiscard = () => {
        setDiscardConfirmationOpen(true)
        toast.push(
            <Notification type="success">Changes discarded!</Notification>,
            { placement: 'top-center' },
        )
        navigate(`${endpointConfig.master.location.list}`)
    }

    const handleDiscard = () => setDiscardConfirmationOpen(true)
    const handleCancel = () => setDiscardConfirmationOpen(false)

    if (loadingData && !isAdd) {
        return <p className="p-4">Loading location data...</p>
    }

    return (
        <>
            <LocationForm
                newLocation={isAdd}
                defaultValues={
                    locationData ?? {
                        name: '',
                        zone_id: '',
                        cluster_id: '',
                        short_name: '',
                        identifier: '',
                    }
                }
                readOnly={isView}
                onFormSubmit={handleFormSubmit}
            >
                <BottomPanel
                    isView={isView}
                    isSubmitting={isSubmiting}
                    isEdit={isEdit}
                    onDiscard={handleDiscard}
                />
            </LocationForm>
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

export default LocationAddEdit
