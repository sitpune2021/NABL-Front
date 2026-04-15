/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import endpointConfig from '@/configs/endpoint.config'
import { useDiscardConfirm } from '@/utils/hooks/useDiscardConfirm'
import { EMPTY_VALUES } from '@/constants/user.constants'
import UserForm from '../Form'
import BottomPanel from '@/components/form/bottomPanel'
import { getMode } from '@/utils/getMode'
import { useFormSubmit } from '@/utils/hoc/useFormSubmit'
import { useEntityMutations } from '@/utils/hooks/useEntityMutations'
import { useUserDetail } from '../List/hooks/useUserDetail'
import { apiUpdateUser, apiUser } from '@/services/UserService'
import { UserSchemaType } from '@/schemas/user.schema'

const UserAddEdit = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const location = useLocation()

    const mode = useMemo(() => getMode(location.pathname), [location.pathname])
    const isEdit = mode === 'edit'
    const isView = mode === 'view'

    const discard = useDiscardConfirm()
    const { user, isLoading, mutate } = useUserDetail(id)

    const defaultValues = useMemo(() => user ?? EMPTY_VALUES, [user])

    const { save } = useEntityMutations<UserSchemaType>({
        apiCreate: apiUser,
        apiUpdate: apiUpdateUser,
    })

    const { handleSubmit, isSubmitting } = useFormSubmit<UserSchemaType>({
        apiCall: async (values) => {
            const res = await save({
                ...values,
                ...(isEdit && id ? { id } : {}),
            })
            if (id) {
                mutate(
                    (prev: any) => ({
                        ...prev,
                        data: res.data,
                    }),
                    false,
                )
            }
            return res
        },
        navigateTo: endpointConfig.setting.user.list,
    })

    const confirmDiscard = () => {
        toast.push(
            <Notification type="success">Changes discarded</Notification>,
            { placement: 'top-center' },
        )
        discard.close()
        navigate(`${endpointConfig.master.category.list}`)
    }

    return (
        <>
            <UserForm
                defaultValues={defaultValues}
                readOnly={isView}
                loading={isLoading}
                onFormSubmit={handleSubmit}
            >
                <BottomPanel
                    isView={isView}
                    isSubmitting={isSubmitting}
                    isEdit={isEdit}
                    onDiscard={discard.show}
                />
            </UserForm>

            <ConfirmDialog
                isOpen={discard.open}
                type="danger"
                title="Discard changes"
                onClose={discard.close}
                onCancel={discard.close}
                onConfirm={confirmDiscard}
            >
                <p>Are you sure you want to discard changes?</p>
            </ConfirmDialog>
        </>
    )
}

export default UserAddEdit
