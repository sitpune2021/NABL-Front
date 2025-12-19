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

const CategoryAddEdit = () => {
    const navigate = useNavigate()
    const { id } = useParams<{ id: string }>()
    const location = useLocation()
    const mode = useMemo(() => getMode(location.pathname), [location.pathname])
    const isView = mode === 'view'
    const isEdit = mode === 'edit'

    const { category, isLoading } = useCategoryDetail(id)
    const discard = useDiscardConfirm()

    const defaultValues = useMemo(() => category ?? EMPTY_VALUES, [category])

    const { save } = useEntityMutations<CategoryFormSchema>({
        apiCreate: apiCategory,
        apiUpdate: apiUpdateCategory,
    })

    const { handleSubmit, isSubmitting } = useFormSubmit<CategoryFormSchema>({
        apiCall: (values) =>
            save({ ...values, ...(isEdit && id ? { id } : {}) }),
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

    return (
        <>
            <CategoryForm
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
