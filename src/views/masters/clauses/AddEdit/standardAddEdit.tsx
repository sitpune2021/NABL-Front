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
import useStandardList from '../List/hooks/useStandardList'
import StandardForm from '../Form/StandardForm'
import { StandardFormSchema } from '@/@types/standard'

const StandardAddEdit = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { id: standardId } = useParams()
    const { saveStandardData, getStandardById } = useStandardList()

    const [discardConfirmationOpen, setDiscardConfirmationOpen] =
        useState(false)
    const [isSubmiting, setIsSubmiting] = useState(false)
    const [standardData, setStandardData] = useState<StandardFormSchema | null>(
        null,
    )
    const [loadingData, setLoadingData] = useState(false)

    const isEdit = location.pathname.includes('/edit')
    const isView = location.pathname.includes('/view')
    const isAdd = location.pathname.includes('/create')

    // Default values for new standard
    const defaultStandardData: StandardFormSchema = {
        name: '',
        uuid: '',
        standred: {
            title: '',
            message: '',
            isNote: false,
            isChild: false,
            count: 0,
            children: [],
            notes: [],
            fields: [],
        },
    }

    // Load existing standard data in edit or view mode
    useEffect(() => {
        if (!isAdd && standardId) {
            setLoadingData(true)
            getStandardById(standardId)
                .then((data) => {
                    if (data) {
                        // Transform API data to form structure
                        // const formData: StandardFormSchema = {
                        //     // name: data.name || '',
                        //     // uuid: data.uuid || '',
                        //     // standred.title: data.standred.title || '',
                        //     // message: data.message || '',
                        //     // isNote: data.isNote || false,
                        //     // isChild: data.isChild || false,
                        //     // count: data.count || 0,
                        //     // children: data.children || [],
                        //     // notes: data.notes || [],
                        //     // fields: data.fields || [],
                        // }
                        setStandardData({ ...data })
                    }
                })
                .catch((error) => {
                    console.error('Error loading standard:', error)
                    toast.push(
                        <Notification type="danger">
                            Failed to load standard data
                        </Notification>,
                        { placement: 'top-center' },
                    )
                })
                .finally(() => setLoadingData(false))
        }
    }, [standardId, isAdd, getStandardById])

    const handleFormSubmit = async (values: StandardFormSchema) => {
        if (isView) return
        console.log('handleFormSubmit called with:', values)
        setIsSubmiting(true)
        try {
            const payload = isEdit ? { ...values, id: standardId } : values
            console.log('Saving payload:', payload)
            await saveStandardData(payload)
            await sleep(800)
            console.log('Save successful')

            toast.push(
                <Notification type="success">
                    {isEdit
                        ? 'Standard updated successfully!'
                        : 'Standard created successfully!'}
                </Notification>,
                { placement: 'top-center' },
            )

            // Navigate to standards list
            navigate(`${endpointConfig.master.clauses.create}`)
        } catch (error) {
            console.error('Error saving standard:', error)
            toast.push(
                <Notification type="danger">
                    Failed to save standard
                </Notification>,
                { placement: 'top-center' },
            )
        } finally {
            setIsSubmiting(false)
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
        navigate(`${endpointConfig.master.clauses.list}`)
    }

    if (loadingData && !isAdd) {
        return (
            <Container>
                <div className="flex justify-center items-center p-8">
                    <p>Loading standard data...</p>
                </div>
            </Container>
        )
    }

    return (
        <>
            <StandardForm
                newStandard={isAdd}
                defaultValues={standardData || defaultStandardData}
                readOnly={isView}
                onFormSubmit={handleFormSubmit}
            >
                <Container>
                    <div className="flex items-center justify-between px-8">
                        <span></span>
                        {!isView && (
                            <div className="flex items-center gap-3">
                                <Button
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
                                    {isEdit
                                        ? 'Update Standard'
                                        : 'Create Standard'}
                                </Button>
                            </div>
                        )}
                    </div>
                </Container>
            </StandardForm>

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
                    Are you sure you want to discard your changes? This action
                    cannot be undone.
                </p>
            </ConfirmDialog>
        </>
    )
}

export default StandardAddEdit
