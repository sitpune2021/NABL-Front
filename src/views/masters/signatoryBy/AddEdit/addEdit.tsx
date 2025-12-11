/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import sleep from '@/utils/sleep'
import endpointConfig from '@/configs/endpoint.config'
import useSignatoryByList from '../List/hooks/useList'
import SignatoryByForm from '../Form'
import { SignatoryByFormSchema } from '@/@types/signatoryBy'
import BottomPanel from '@/components/form/bottomPanel'

const SignatoryByAddEdit = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { id: signatoryById } = useParams()
    const { saveSignatoryByData, getSignatoryByById } = useSignatoryByList()

    const [discardConfirmationOpen, setDiscardConfirmationOpen] =
        useState(false)
    const [isSubmiting, setIsSubmiting] = useState(false)
    const [signatoryByData, setSignatoryByData] =
        useState<SignatoryByFormSchema | null>(null)
    const [loadingData, setLoadingData] = useState(false)

    const isEdit = location.pathname.includes('/edit')
    const isView = location.pathname.includes('/view')
    const isAdd = location.pathname.includes('/create')

    // Load existing signatoryBy data in edit or view mode
    useEffect(() => {
        if (!isAdd && signatoryById) {
            setLoadingData(true)
            getSignatoryByById(signatoryById)
                .then((data) => {
                    setSignatoryByData(data)
                })
                .finally(() => setLoadingData(false))
        }
    }, [signatoryById, isAdd])

    const handleFormSubmit = async (values: SignatoryByFormSchema) => {
        if (isView) return
        setIsSubmiting(true)
        try {
            const payload = isEdit ? { ...values, id: signatoryById } : values
            await saveSignatoryByData(payload)
            await sleep(800)
            setIsSubmiting(false)
            toast.push(
                <Notification type="success">
                    {isEdit ? 'SignatoryBy updated!' : 'SignatoryBy created!'}
                </Notification>,
                { placement: 'top-center' },
            )
            navigate(`${endpointConfig.master.signatoryBy.list}`)
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
                    `Failed to ${isEdit ? 'update' : 'create'} signatoryBy`

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
        navigate(`${endpointConfig.master.signatoryBy.list}`)
    }

    const handleDiscard = () => setDiscardConfirmationOpen(true)
    const handleCancel = () => setDiscardConfirmationOpen(false)

    if (loadingData && !isAdd) {
        return <p className="p-4">Loading signatoryBy data...</p>
    }

    return (
        <>
            <SignatoryByForm
                newSignatoryBy={isAdd}
                defaultValues={signatoryByData ?? { name: '' }}
                readOnly={isView}
                onFormSubmit={handleFormSubmit}
            >
                <BottomPanel
                    isView={isView}
                    isSubmitting={isSubmiting}
                    isEdit={isEdit}
                    onDiscard={handleDiscard}
                />
            </SignatoryByForm>
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

export default SignatoryByAddEdit
