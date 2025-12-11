/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import sleep from '@/utils/sleep'
import endpointConfig from '@/configs/endpoint.config'
import useZoneList from '../List/hooks/useList'
import ZoneForm from '../Form'
import { ZoneFormSchema } from '@/@types/zone'
import BottomPanel from '@/components/form/bottomPanel'

const ZoneAddEdit = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { id: zoneId } = useParams()
    const { saveZoneData, getZoneById } = useZoneList()

    const [discardConfirmationOpen, setDiscardConfirmationOpen] =
        useState(false)
    const [isSubmiting, setIsSubmiting] = useState(false)
    const [zoneData, setZoneData] = useState<ZoneFormSchema | null>(null)
    const [loadingData, setLoadingData] = useState(false)

    const isEdit = location.pathname.includes('/edit')
    const isView = location.pathname.includes('/view')
    const isAdd = location.pathname.includes('/create')

    // Load existing zone data in edit or view mode
    useEffect(() => {
        if (!isAdd && zoneId) {
            setLoadingData(true)
            getZoneById(zoneId)
                .then((data) => {
                    console.log('Fetched zone data:', data)

                    setZoneData(data)
                })
                .finally(() => setLoadingData(false))
        }
    }, [zoneId, isAdd])

    const handleFormSubmit = async (values: ZoneFormSchema) => {
        if (isView) return
        setIsSubmiting(true)
        try {
            const payload = isEdit ? { ...values, id: zoneId } : values
            await saveZoneData(payload)
            await sleep(800)
            setIsSubmiting(false)
            toast.push(
                <Notification type="success">
                    {isEdit ? 'Zone updated!' : 'Zone created!'}
                </Notification>,
                { placement: 'top-center' },
            )
            navigate(`${endpointConfig.master.zone.list}`)
        } catch (error: any) {
            const backendErrors = error?.response?.data?.errors

            if (backendErrors) {
                Object.entries(backendErrors).forEach(([messages]) => {
                    const message = Array.isArray(messages)
                        ? messages[0]
                        : messages
                    toast.push(
                        <Notification type="danger">{message}</Notification>,
                        { placement: 'top-center' },
                    )
                })
            } else {
                const errorMessage =
                    error?.response?.data?.message ||
                    `Failed to ${isEdit ? 'update' : 'create'} zone.`

                toast.push(
                    <Notification type="danger">{errorMessage}</Notification>,
                    { placement: 'top-center' },
                )
            }
        } finally {
            setIsSubmiting(false)
        }
    }

    const handleConfirmDiscard = () => {
        setDiscardConfirmationOpen(true)
        toast.push(
            <Notification type="success">Changes discarded!</Notification>,
            { placement: 'top-center' },
        )
        navigate(`${endpointConfig.master.zone.list}`)
    }

    const handleDiscard = () => setDiscardConfirmationOpen(true)
    const handleCancel = () => setDiscardConfirmationOpen(false)

    if (loadingData && !isAdd) {
        return <p className="p-4">Loading zone data...</p>
    }

    return (
        <>
            <ZoneForm
                newZone={isAdd}
                defaultValues={zoneData ?? { name: '', identifier: '' }}
                readOnly={isView}
                onFormSubmit={handleFormSubmit}
            >
                <BottomPanel
                    isView={isView}
                    isSubmitting={isSubmiting}
                    isEdit={isEdit}
                    onDiscard={handleDiscard}
                />
            </ZoneForm>
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

export default ZoneAddEdit
