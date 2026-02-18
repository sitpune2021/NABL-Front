import { useMemo } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import endpointConfig from '@/configs/endpoint.config'
import SubCategoryForm from '../Form'
import BottomPanel from '@/components/form/bottomPanel'
import { getMode } from '@/utils/getMode'
import { useSubCategoryDetail } from '../List/hooks/useSubCategoryDetail'
import { useDiscardConfirm } from '@/utils/hooks/useDiscardConfirm'
import { useEntityMutations } from '@/utils/hooks/useEntityMutations'
import {
    apiSubCategory,
    apiUpdateSubCategory,
} from '@/services/SubCategoryService'
import { useFormSubmit } from '@/utils/hoc/useFormSubmit'
import { SubCategoryFormSchema } from '@/schemas/sub_category.schema'
import { EMPTY_VALUES } from '@/constants/sub_category.constant'
import { FormSkeleton } from '@/components/form'

const SubCategoryAddEdit = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { id } = useParams<{ id: string }>()

    const mode = useMemo(() => getMode(location.pathname), [location.pathname])
    const isView = mode === 'view'
    const isEdit = mode === 'edit'

    const { subCategory, isLoading } = useSubCategoryDetail(id)
    const discard = useDiscardConfirm()

    const { save } = useEntityMutations<SubCategoryFormSchema>({
        apiCreate: apiSubCategory,
        apiUpdate: apiUpdateSubCategory,
    })

    const { handleSubmit, isSubmitting } = useFormSubmit<SubCategoryFormSchema>(
        {
            apiCall: (values) =>
                save({ ...values, ...(isEdit && id ? { id } : {}) }),
            navigateTo: endpointConfig.master.subcategory.list,
        },
    )

    const confirmDiscard = () => {
        toast.push(
            <Notification type="success">Changes discarded</Notification>,
            { placement: 'top-center' },
        )
        discard.close()
        navigate(`${endpointConfig.master.subcategory.list}`)
    }

    if ((isEdit || isView) && isLoading) {
        return <FormSkeleton count={3} title="Sub Category" />
    }

    return (
        <>
            <SubCategoryForm
                key={id || 'new'}
                defaultValues={subCategory ?? EMPTY_VALUES}
                readOnly={isView}
                onFormSubmit={handleSubmit}
            >
                <BottomPanel
                    isView={isView}
                    isEdit={isEdit}
                    isSubmitting={isSubmitting}
                    onDiscard={discard.show}
                />
            </SubCategoryForm>
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
                    be undo.{' '}
                </p>
            </ConfirmDialog>
        </>
    )
}

export default SubCategoryAddEdit
