/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import endpointConfig from '@/configs/endpoint.config'
import BottomPanel from '@/components/form/bottomPanel'
import { getMode } from '@/utils/getMode'
import {
    apiDepartment,
    apiUpdateDepartment,
} from '@/services/DepartmentService'
import { useEntityMutations } from '@/utils/hooks/useEntityMutations'
import { useFormSubmit } from '@/utils/hoc/useFormSubmit'
import { DepartmentFormSchema } from '@/schemas/department.schema'
import DepartmentForm from '../Form'
import { useDepartmentDetail } from '../List/hooks/useDetail'
import { useDiscardConfirm } from '@/utils/hooks/useDiscardConfirm'
import { EMPTY_VALUES } from '@/constants/department.constant'
import { FormSkeleton } from '@/components/form'

const DepartmentAddEdit = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { id } = useParams<{ id: string }>()
    const mode = useMemo(() => getMode(location.pathname), [location.pathname])
    const isView = mode === 'view'
    const isEdit = mode === 'edit'

    const { department, isLoading, mutate } = useDepartmentDetail(id)
    const discard = useDiscardConfirm()

    const { save } = useEntityMutations<DepartmentFormSchema>({
        apiCreate: apiDepartment,
        apiUpdate: apiUpdateDepartment,
    })

    const { handleSubmit, isSubmitting } = useFormSubmit<DepartmentFormSchema>({
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
        navigateTo: endpointConfig.master.department.list,
    })

    const confirmDiscard = () => {
        toast.push(
            <Notification type="success">Changes discarded</Notification>,
            { placement: 'top-center' },
        )
        discard.close()
        navigate(endpointConfig.master.department.list)
    }

    if ((isEdit || isView) && isLoading) {
        return <FormSkeleton count={2} title={'Department'} />
    }

    return (
        <>
            <DepartmentForm
                key={id || 'new'}
                defaultValues={department || EMPTY_VALUES}
                readOnly={isView}
                onFormSubmit={handleSubmit}
            >
                <BottomPanel
                    isView={isView}
                    isSubmitting={isSubmitting}
                    isEdit={isEdit}
                    onDiscard={discard.show}
                />
            </DepartmentForm>
            <ConfirmDialog
                isOpen={discard.open}
                type="danger"
                title="Discard changes"
                onClose={discard.close}
                onRequestClose={discard.close}
                onCancel={discard.close}
                onConfirm={confirmDiscard}
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
