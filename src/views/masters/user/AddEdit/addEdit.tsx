import { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import endpointConfig from '@/configs/endpoint.config'
import useUserList from '../List/hooks/useList'
import { useDiscardConfirm } from '@/utils/hooks/useDiscardConfirm'
import UserFormStepsWrapper from '../Form/UserFormStepsWrapper'
import { UserFormSchema } from '@/@types/user'
import { USER_EMPTY_VALUES } from '@/constants/user.constants'

const UserAddEdit = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const location = useLocation()

    const isEdit = location.pathname.includes('edit')
    const isView = location.pathname.includes('view')

    const discard = useDiscardConfirm()
    const { saveUserData, getUserById } = useUserList()

    const [user, setUser] = useState<UserFormSchema | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if ((isEdit || isView) && id) {
            setLoading(true)
            getUserById(id)
                .then((data) => {
                    setUser({
                        ...data,
                        dialCode: data.dialCode || '+91',
                        labAssignments: data.labAssignments || {},
                        userRoles: data.userRoles || [],
                    })
                })
                .finally(() => setLoading(false))
        }
    }, [id, isEdit, isView])

    const defaultValues = useMemo<UserFormSchema>(() => {
        if (user) return user
        return USER_EMPTY_VALUES
    }, [user])

    const handleSubmit = async (values: UserFormSchema) => {
        const res = await saveUserData({
            ...values,
            ...(isEdit && id ? { id } : {}),
        })

        toast.push(
            <Notification type={res.success ? 'success' : 'danger'}>
                {res.message}
            </Notification>,
            { placement: 'top-center' },
        )

        if (res.success) {
            navigate(endpointConfig.setting.user.list)
        }
    }
    if (loading) {
        return <p className="p-4">Loading user data...</p>
    }

    return (
        <>
            <UserFormStepsWrapper
                userFormProps={{
                    defaultValues,
                    readOnly: isView,
                    isSubmitting: false,
                    onFormSubmit: handleSubmit,
                }}
            />

            <ConfirmDialog
                isOpen={discard.open}
                type="danger"
                title="Discard changes"
                onClose={discard.close}
                onConfirm={() => navigate(endpointConfig.setting.user.list)}
            >
                <p>Are you sure you want to discard changes?</p>
            </ConfirmDialog>
        </>
    )
}

export default UserAddEdit
