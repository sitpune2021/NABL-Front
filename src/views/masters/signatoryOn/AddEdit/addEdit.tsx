/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import sleep from '@/utils/sleep'
import endpointConfig from '@/configs/endpoint.config'
import useSignatoryOnList from '../List/hooks/useList'
import SignatoryOnForm, { SignatoryOnFormSchema } from '../Form'
import BottomPanel from '@/components/form/bottomPanel'

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
                    setSignatoryOnData(data)
                })
                .finally(() => setLoadingData(false))
        }
    }, [signatoryOnId, isAdd])

    const handleFormSubmit = async (values: SignatoryOnFormSchema) => {
        if (isView) return
        setIsSubmiting(true)
        try {
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
                    `Failed to ${isEdit ? 'update' : 'create'} signatoryOn`

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
                <BottomPanel
                    isView={isView}
                    isSubmitting={isSubmiting}
                    isEdit={isEdit}
                    onDiscard={handleDiscard}
                />
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
