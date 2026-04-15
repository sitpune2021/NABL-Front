/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router'

import CategoryForm from '../Form'
import BottomPanel from '@/components/form/bottomPanel'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'

import endpointConfig from '@/configs/endpoint.config'
import { useDiscardConfirm } from '@/utils/hooks/useDiscardConfirm'
import { useCategoryDetail } from '../List/hooks/useCategoryDetail'
import { useFormSubmit } from '@/utils/hoc/useFormSubmit'
import { getMode } from '@/utils/getMode'
import { useEntityMutations } from '@/utils/hooks/useEntityMutations'
import { apiCategory, apiUpdateCategory } from '@/services/CategoriesService'
import { CategoryFormSchema } from '@/schemas/category.schema'
import { EMPTY_VALUES } from '@/constants/category.constant'
import { FormSkeleton } from '@/components/form'

const CategoryAddEdit = () => {
    const navigate = useNavigate()
    const { id } = useParams<{ id: string }>()
    const location = useLocation()
    const mode = useMemo(() => getMode(location.pathname), [location.pathname])
    const isView = mode === 'view'
    const isEdit = mode === 'edit'

    const { category, isLoading, mutate } = useCategoryDetail(id)
    const discard = useDiscardConfirm()

    const { save } = useEntityMutations<CategoryFormSchema>({
        apiCreate: apiCategory,
        apiUpdate: apiUpdateCategory,
    })

    const { handleSubmit, isSubmitting } = useFormSubmit<CategoryFormSchema>({
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
        navigateTo: endpointConfig.master.category.list,
    })

    const confirmDiscard = () => {
        toast.push(
            <Notification type="success">Changes discarded</Notification>,
            { placement: 'top-center' },
        )
        discard.close()
        navigate(`${endpointConfig.master.category.list}`)
    }

    if ((isEdit || isView) && isLoading) {
        return <FormSkeleton count={2} title={'Category'} />
    }

    return (
        <>
            <CategoryForm
                key={id || 'new'}
                defaultValues={category || EMPTY_VALUES}
                readOnly={isView}
                onFormSubmit={handleSubmit}
            >
                <BottomPanel
                    isView={isView}
                    isSubmitting={isSubmitting}
                    isEdit={isEdit}
                    onDiscard={discard.show}
                />
            </CategoryForm>

            <ConfirmDialog
                isOpen={discard.open}
                type="danger"
                title="Discard changes"
                onClose={discard.close}
                onCancel={discard.close}
                onConfirm={confirmDiscard}
            >
                <p>
                    Are you sure you want discard this? This action can&apos;t
                    be undo.
                </p>
            </ConfirmDialog>
        </>
    )
}

export default CategoryAddEdit
