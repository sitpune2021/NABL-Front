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
import BottomPanel from '@/components/form/bottomPanel'

const UserAddEdit = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { id: userId } = useParams()
    const { saveUserData, getUserById } = useUserList()

    const [discardConfirmationOpen, setDiscardConfirmationOpen] =
        useState(false)
    const [isSubmiting, setIsSubmiting] = useState(false)
    const [userData, setUserData] = useState<UserFormSchema | null>(null)
    const [loadingData, setLoadingData] = useState(false)

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
                    })
                })
                .finally(() => setLoadingData(false))
        }
    }, [userId, isAdd])

    const handleFormSubmit = async (values: UserFormSchema) => {
        if (isView) return
        setIsSubmiting(true)

        const payload = {
            ...values,
            dialCode: values.dialCode || '+91',
            id: isEdit ? userId : undefined,
        }

        const result = await saveUserData(payload)
        await sleep(800)
        setIsSubmiting(false)

        toast.push(
            <Notification type={result.success ? 'success' : 'danger'}>
                {result.message}
            </Notification>,
            { placement: 'top-center' },
        )

        if (result.success) {
            navigate(endpointConfig.master.user.list)
        }
    }

    const handleConfirmDiscard = () => {
        setDiscardConfirmationOpen(false)
        toast.push(
            <Notification type="success">Changes discarded!</Notification>,
            { placement: 'top-center' },
        )
        navigate(`${endpointConfig.master.user.list}`)
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
                        preparedBy: true,
                        issuedBy: true,
                        approvedBy: true,
                        signature: '',
                        profileImage: '',
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
                onFormSubmit={handleFormSubmit}
            >
                <BottomPanel
                    isView={isView}
                    isSubmitting={isSubmiting}
                    isEdit={isEdit}
                    onDiscard={handleDiscard}
                />
            </UserForm>

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
                    Are you sure you want to discard this? This action can’t be
                    undone.
                </p>
            </ConfirmDialog>
        </>
    )
}

export default UserAddEdit
