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
import useLabList from '../List/hooks/useList'
import LabForm from '../Form'
import type { LabFormSchema } from '@/@types/lab'

const LabAddEdit = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { id: labId } = useParams()
    const { saveLabData, getLabById, labList } = useLabList()

    const [discardConfirmationOpen, setDiscardConfirmationOpen] =
        useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [labData, setLabData] = useState<LabFormSchema | null>(null)
    const [loadingData, setLoadingData] = useState(false)

    const isEdit = location.pathname.includes('/edit')
    const isView = location.pathname.includes('/view')
    const isAdd = location.pathname.includes('/create')

    useEffect(() => {
        if (!isAdd && labId) {
            setLoadingData(true)
            getLabById(labId)
                .then((data) => {
                    setLabData(data)
                })
                .finally(() => setLoadingData(false))
        }
    }, [labId, isAdd])

    const handleFormSubmit = async (values: LabFormSchema) => {
        if (isView) return

        setIsSubmitting(true)
        try {
            const payload = isEdit ? { ...values, id: labId } : values
            await saveLabData(payload)
            await sleep(800)

            toast.push(
                <Notification type="success">
                    {isEdit ? 'Lab updated!' : 'Lab created!'}
                </Notification>,
                { placement: 'top-center' },
            )

            navigate(`${endpointConfig.master.lab.list}`)
        } catch {
            toast.push(
                <Notification type="danger">
                    Failed to {isEdit ? 'update' : 'create'} lab
                </Notification>,
                { placement: 'top-center' },
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDiscard = () => setDiscardConfirmationOpen(true)
    const handleCancel = () => setDiscardConfirmationOpen(false)

    const handleConfirmDiscard = () => {
        setDiscardConfirmationOpen(false)
        toast.push(
            <Notification type="success">Changes discarded!</Notification>,
            { placement: 'top-center' },
        )
        navigate(`${endpointConfig.master.lab.list}`)
    }

    if (loadingData && !isAdd) {
        return <p className="p-4">Loading lab data...</p>
    }

    const defaultFormValues: LabFormSchema = labData ?? {
        name: '',
        labType: '',
        department: [],
        labCode: !isSubmitting ? `LAB-${labList.length + 1}` : '',
        email: '',
        phone: '',
        address: '',
        location: [
            {
                prefix: 'LOC-1',
                shortName: '',
                zone_name: null,
                cluster_name: null,
                location_name: null,
                department: null,
            },
        ],
    }
    return (
        <>
            <LabForm
                newLab={isAdd}
                defaultValues={defaultFormValues}
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
                                    loading={isSubmitting}
                                >
                                    {isEdit ? 'Update' : 'Create'}
                                </Button>
                            </div>
                        )}
                    </div>
                </Container>
            </LabForm>

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
                    Are you sure you want to discard this? This action
                    can&apos;t be undone.
                </p>
            </ConfirmDialog>
        </>
    )
}

export default LabAddEdit
