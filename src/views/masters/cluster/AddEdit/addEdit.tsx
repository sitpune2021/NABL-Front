/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import sleep from '@/utils/sleep'
import endpointConfig from '@/configs/endpoint.config'
import useClusterList from '../List/hooks/useList'
import ClusterForm from '../Form'
import { ClusterFormSchema } from '@/@types/cluster'
import BottomPanel from '@/components/form/bottomPanel'

const ClusterAddEdit = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { id: clusterId } = useParams()
    const { saveClusterData, getClusterById } = useClusterList()

    const [discardConfirmationOpen, setDiscardConfirmationOpen] =
        useState(false)
    const [isSubmiting, setIsSubmiting] = useState(false)
    const [clusterData, setClusterData] = useState<ClusterFormSchema | null>(
        null,
    )
    const [loadingData, setLoadingData] = useState(false)

    const isEdit = location.pathname.includes('/edit')
    const isView = location.pathname.includes('/view')
    const isAdd = location.pathname.includes('/create')

    // Load existing cluster data in edit or view mode
    useEffect(() => {
        if (!isAdd && clusterId) {
            setLoadingData(true)
            getClusterById(clusterId)
                .then((data) => {
                    setClusterData(data)
                })
                .finally(() => setLoadingData(false))
        }
    }, [clusterId, isAdd])

    const handleFormSubmit = async (values: ClusterFormSchema) => {
        if (isView) return
        setIsSubmiting(true)
        try {
            const payload = isEdit ? { ...values, id: clusterId } : values
            await saveClusterData(payload)
            await sleep(800)
            setIsSubmiting(false)
            toast.push(
                <Notification type="success">
                    {isEdit ? 'Cluster updated!' : 'Cluster created!'}
                </Notification>,
                { placement: 'top-center' },
            )
            navigate(`${endpointConfig.master.cluster.list}`)
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
                    `Failed to ${isEdit ? 'update' : 'create'}cluster`

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
        navigate(`${endpointConfig.master.cluster.list}`)
    }

    const handleDiscard = () => setDiscardConfirmationOpen(true)
    const handleCancel = () => setDiscardConfirmationOpen(false)

    if (loadingData && !isAdd) {
        return <p className="p-4">Loading cluster data...</p>
    }

    return (
        <>
            <ClusterForm
                newCluster={isAdd}
                defaultValues={
                    clusterData ?? {
                        zone_id: '',
                        name: '',
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
            </ClusterForm>
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

export default ClusterAddEdit
