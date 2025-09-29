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
import { LabFormSchema } from '@/@types/lab'

const LabAddEdit = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { id: labId } = useParams()
    const { saveLabData, getLabById } = useLabList()

    const [discardConfirmationOpen, setDiscardConfirmationOpen] =
        useState(false)
    const [isSubmiting, setIsSubmiting] = useState(false)
    const [labData, setLabData] = useState<LabFormSchema | null>(null)
    const [loadingData, setLoadingData] = useState(false)

    const isEdit = location.pathname.includes('/edit')
    const isView = location.pathname.includes('/view')
    const isAdd = location.pathname.includes('/create')

    // Load existing lab data in edit or view mode
    useEffect(() => {
        if (!isAdd && labId) {
            setLoadingData(true)
            getLabById(labId)
                .then((data) => {
                    console.log('Fetched lab data:', data)

                    setLabData(data)
                })
                .finally(() => setLoadingData(false))
        }
    }, [labId, isAdd])

    const handleFormSubmit = async (values: LabFormSchema) => {
        if (isView) return
        setIsSubmiting(true)
        const payload = isEdit ? { ...values, id: labId } : values
        await saveLabData(payload)
        await sleep(800)
        setIsSubmiting(false)
        toast.push(
            <Notification type="success">
                {isEdit ? 'Lab updated!' : 'Lab created!'}
            </Notification>,
            { placement: 'top-center' },
        )
        navigate(`${endpointConfig.master.lab.list}`)
    }

    const handleConfirmDiscard = () => {
        setDiscardConfirmationOpen(true)
        toast.push(
            <Notification type="success">Changes discarded!</Notification>,
            { placement: 'top-center' },
        )
        navigate(`${endpointConfig.master.lab.list}`)
    }

    const handleDiscard = () => setDiscardConfirmationOpen(true)
    const handleCancel = () => setDiscardConfirmationOpen(false)

    if (loadingData && !isAdd) {
        return <p className="p-4">Loading lab data...</p>
    }

    return (
        <>
            <LabForm
                newLab={isAdd}
                defaultValues={
                    labData ?? {
                        name: '',
                        labType: '',
                        department: '',
                        category: '',
                        labCode: '',
                        email: '',
                        phone: '',
                        address: '',
                    }
                }
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
                    Are you sure you want discard this? This action can&apos;t
                    be undo.{' '}
                </p>
            </ConfirmDialog>
        </>
    )
}

export default LabAddEdit
