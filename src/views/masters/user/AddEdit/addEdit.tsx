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
import useUserList from '../List/hooks/useList'
import UserForm from '../Form'
import { UserFormSchema } from '@/@types/user'

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

        await saveUserData(payload)
        await sleep(800)
        setIsSubmiting(false)

        toast.push(
            <Notification type="success">
                {isEdit ? 'User updated!' : 'User created!'}
            </Notification>,
            { placement: 'top-center' },
        )

        navigate(`${endpointConfig.master.user.list}`)
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
                        signUpload: '',
                        status: '',
                        userRoles: [
                            {
                                zone_name: '',
                                cluster_name: '',
                                location_name: '',
                                department: [
                                    {
                                        department_name: '',
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
