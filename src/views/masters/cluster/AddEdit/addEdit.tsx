import { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router'
import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import sleep from '@/utils/sleep'
import { TbTrash } from 'react-icons/tb'
import endpointConfig from '@/configs/endpoint.config'
import useClusterList from '../List/hooks/useList'
import ClusterForm from '../Form'
import { ClusterFormSchema } from '@/@types/cluster'

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
                    console.log('Fetched cluster data:', data)

                    setClusterData(data)
                })
                .finally(() => setLoadingData(false))
        }
    }, [clusterId, isAdd])

    const handleFormSubmit = async (values: ClusterFormSchema) => {
        if (isView) return
        setIsSubmiting(true)
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
                defaultValues={clusterData ?? { name: '' }}
                readOnly={isView}
                onFormSubmit={handleFormSubmit}
            >
                <Container>
                    <div className="flex items-center justify-between px-8">
                        <span></span>
                        {!isView && (
                            <div className="flex items-center">
                                <Button
                                    className="ltr:mr-3 rtl:ml-3"
                                    type="button"
                                    customColorClass={() =>
                                        'border-error ring-1 ring-error text-error hover:border-error hover:ring-error hover:text-error bg-transparent'
                                    }
                                    icon={<TbTrash />}
                                    onClick={handleDiscard}
                                >
                                    Discard
                                </Button>
                                <Button
                                    variant="solid"
                                    type="submit"
                                    loading={isSubmiting}
                                >
                                    {isEdit ? 'Update' : 'Create'}
                                </Button>
                            </div>
                        )}
                    </div>
                </Container>
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
