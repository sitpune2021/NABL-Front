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
import useDepartmentList from '../List/hooks/useList'
import DepartmentForm, { DepartmentFormSchema } from '../Form'

const DepartmentAddEdit = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { id: departmentId } = useParams()
    const { saveDepartmentData, getDepartmentById } = useDepartmentList()

    const [discardConfirmationOpen, setDiscardConfirmationOpen] =
        useState(false)
    const [isSubmiting, setIsSubmiting] = useState(false)
    const [departmentData, setDepartmentData] =
        useState<DepartmentFormSchema | null>(null)
    const [loadingData, setLoadingData] = useState(false)

    const isEdit = location.pathname.includes('/edit')
    const isView = location.pathname.includes('/view')
    const isAdd = location.pathname.includes('/create')

    useEffect(() => {
        if (!isAdd && departmentId) {
            setLoadingData(true)
            getDepartmentById(departmentId)
                .then((data) => {
                    console.log('Fetched department data:', data)

                    setDepartmentData(data)
                })
                .finally(() => setLoadingData(false))
        }
    }, [departmentId, isAdd])

    const handleFormSubmit = async (values: DepartmentFormSchema) => {
        if (isView) return
        setIsSubmiting(true)
        const payload = isEdit ? { ...values, id: departmentId } : values
        await saveDepartmentData(payload)
        await sleep(800)
        setIsSubmiting(false)
        toast.push(
            <Notification type="success">
                {isEdit ? 'Department updated!' : 'Department created!'}
            </Notification>,
            { placement: 'top-center' },
        )
        navigate(`${endpointConfig.master.department.list}`)
    }

    const handleConfirmDiscard = () => {
        setDiscardConfirmationOpen(true)
        toast.push(
            <Notification type="success">Changes discarded!</Notification>,
            { placement: 'top-center' },
        )
        navigate(`${endpointConfig.master.department.list}`)
    }

    const handleDiscard = () => setDiscardConfirmationOpen(true)
    const handleCancel = () => setDiscardConfirmationOpen(false)

    if (loadingData && !isAdd) {
        return <p className="p-4">Loading department data...</p>
    }

    return (
        <>
            <DepartmentForm
                newDepartment={isAdd}
                defaultValues={
                    departmentData ?? {
                        name: '',
                        prefix: '',
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
            </DepartmentForm>
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

export default DepartmentAddEdit
