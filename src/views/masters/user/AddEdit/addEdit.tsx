/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import sleep from '@/utils/sleep'
import endpointConfig from '@/configs/endpoint.config'
import useUserList from '../List/hooks/useList'
import UserForm from '../Form'
import { UserFormSchema } from '@/@types/user'

const UserAddEdit = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { id: userId } = useParams()
    const { saveUserData, getUserById } = useUserList()

    const [currentStep, setCurrentStep] = useState(0)
    const [discardConfirmationOpen, setDiscardConfirmationOpen] =
        useState(false)
    const [isSubmiting, setIsSubmiting] = useState(false)
    const [userData, setUserData] = useState<UserFormSchema | null>(null)
    const [loadingData, setLoadingData] = useState(false)
    const [savedUserId, setSavedUserId] = useState<string | undefined>(userId)

    const isEdit = location.pathname.includes('/edit')
    const isView = location.pathname.includes('/view')
    const isAdd = location.pathname.includes('/create')

    useEffect(() => {
        if (!isAdd && userId) {
            setLoadingData(true)
            getUserById(userId)
                .then((data) => {
                    setUserData({
                        ...data,
                        dialCode: data.dialCode || '+91',
                        labAssignments: data.labAssignments || {},
                    })
                })
                .finally(() => setLoadingData(false))
        }
    }, [userId, isAdd, getUserById])

    const handleFormSubmit = async (values: UserFormSchema) => {
        if (isView) return

        console.log(' Form Submit - Current Step:', currentStep)
        console.log(' Form Values:', values)

        setIsSubmiting(true)

        try {
            const payload = {
                ...values,
                dialCode: values.dialCode || '+91',
                id: savedUserId || (isEdit ? userId : undefined),
            }

            console.log(' Payload to save:', payload)

            const result = await saveUserData(payload)
            await sleep(500)

            toast.push(
                <Notification type={result.success ? 'success' : 'danger'}>
                    {result.message}
                </Notification>,
                { placement: 'top-center' },
            )

            if (result.success) {
                if (currentStep === 0) {
                    // Step 0 saved successfully
                    const newUserId = result.data?.id || savedUserId
                    console.log(' Step 0 saved, User ID:', newUserId)

                    setSavedUserId(newUserId)
                    setUserData(values)

                    // Move to next step
                    console.log(' Moving to Step 1')
                    setCurrentStep(1)

                    toast.push(
                        <Notification type="info">
                            User saved! Now assign lab locations
                        </Notification>,
                        { placement: 'top-center' },
                    )
                } else if (currentStep === 1) {
                    // Step 1 saved successfully - redirect to list
                    console.log('Step 1 saved, redirecting to list')
                    navigate(endpointConfig.setting.user.list)
                }
            }
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
                    `Failed to ${isEdit ? 'update' : 'create'} user.`

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
        setDiscardConfirmationOpen(false)
        toast.push(
            <Notification type="success">Changes discarded!</Notification>,
            { placement: 'top-center' },
        )
        navigate(`${endpointConfig.setting.user.list}`)
    }

    const handleDiscard = () => setDiscardConfirmationOpen(true)
    const handleCancel = () => setDiscardConfirmationOpen(false)

    if (loadingData && !isAdd) {
        return <p className="p-4">Loading user data...</p>
    }

    return (
        <>
            <UserForm
                newUser={isAdd}
                currentStep={currentStep}
                isSubmitting={isSubmiting}
                isEdit={isEdit}
                defaultValues={
                    userData ?? {
                        name: '',
                        username: '',
                        email: '',
                        phone: '',
                        dialCode: '+91',
                        address: '',
                        city: '',
                        postcode: '',
                        signature: '',
                        profileImage: '',
                        labAssignments: {},
                        userRoles: [
                            {
                                zone_id: '',
                                cluster_id: '',
                                location_id: '',
                                department: [
                                    {
                                        department_id: '',
                                        roles: [],
                                        permissions: {},
                                    },
                                ],
                            },
                        ],
                    }
                }
                readOnly={isView}
                onStepChange={setCurrentStep}
                onDiscard={handleDiscard}
                onFormSubmit={handleFormSubmit}
            />

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
                    Are you sure you want to discard this? This action cant be
                    undone.
                </p>
            </ConfirmDialog>
        </>
    )
}

export default UserAddEdit
