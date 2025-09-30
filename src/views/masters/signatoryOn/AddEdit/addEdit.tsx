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
import useSignatoryOnList from '../List/hooks/useList'
import SignatoryOnForm, { SignatoryOnFormSchema } from '../Form'

const SignatoryOnAddEdit = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { id: signatoryOnId } = useParams()
    const { saveSignatoryOnData, getSignatoryOnById } = useSignatoryOnList()

    const [discardConfirmationOpen, setDiscardConfirmationOpen] =
        useState(false)
    const [isSubmiting, setIsSubmiting] = useState(false)
    const [signatoryOnData, setSignatoryOnData] =
        useState<SignatoryOnFormSchema | null>(null)
    const [loadingData, setLoadingData] = useState(false)

    const isEdit = location.pathname.includes('/edit')
    const isView = location.pathname.includes('/view')
    const isAdd = location.pathname.includes('/create')

    // Load existing signatoryOn data in edit or view mode
    useEffect(() => {
        if (!isAdd && signatoryOnId) {
            setLoadingData(true)
            getSignatoryOnById(signatoryOnId)
                .then((data) => {
                    console.log('Fetched signatoryOn data:', data)

                    setSignatoryOnData(data)
                })
                .finally(() => setLoadingData(false))
        }
    }, [signatoryOnId, isAdd])

    const handleFormSubmit = async (values: SignatoryOnFormSchema) => {
        if (isView) return
        setIsSubmiting(true)
        const payload = isEdit ? { ...values, id: signatoryOnId } : values
        await saveSignatoryOnData(payload)
        await sleep(800)
        setIsSubmiting(false)
        toast.push(
            <Notification type="success">
                {isEdit ? 'SignatoryOn updated!' : 'SignatoryOn created!'}
            </Notification>,
            { placement: 'top-center' },
        )
        navigate(`${endpointConfig.master.signatoryOn.list}`)
    }

    const handleConfirmDiscard = () => {
        setDiscardConfirmationOpen(true)
        toast.push(
            <Notification type="success">Changes discarded!</Notification>,
            { placement: 'top-center' },
        )
        navigate(`${endpointConfig.master.signatoryOn.list}`)
    }

    const handleDiscard = () => setDiscardConfirmationOpen(true)
    const handleCancel = () => setDiscardConfirmationOpen(false)

    if (loadingData && !isAdd) {
        return <p className="p-4">Loading signatoryOn data...</p>
    }

    return (
        <>
            <SignatoryOnForm
                newSignatoryOn={isAdd}
                defaultValues={signatoryOnData ?? { name: '' }}
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
            </SignatoryOnForm>
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

export default SignatoryOnAddEdit
