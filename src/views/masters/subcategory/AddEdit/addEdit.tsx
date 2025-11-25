import { useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import sleep from '@/utils/sleep'
import endpointConfig from '@/configs/endpoint.config'
import useSubCategoryList from '../List/hooks/useList'
import SubCategoryForm from '../Form'
import { SubCategoryFormSchema } from '@/@types/subcategory'
import BottomPanel from '@/components/form/bottomPanel'

const SubCategoryAddEdit = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { id } = useParams()
    const {
        saveSubCategoryData,
        subCategoryDetail,
        isLoading,
        isDetailLoading,
    } = useSubCategoryList(id)

    const [discardConfirmationOpen, setDiscardConfirmationOpen] =
        useState(false)
    const [isSubmiting, setIsSubmiting] = useState(false)

    const isEdit = location.pathname.includes('/edit')
    const isView = location.pathname.includes('/view')
    const isAdd = location.pathname.includes('/create')
    const loading = isAdd ? isLoading : isDetailLoading

    const handleFormSubmit = async (values: SubCategoryFormSchema) => {
        if (isView) return
        setIsSubmiting(true)
        const payload = isEdit ? { ...values, id } : values
        await saveSubCategoryData(payload)
        await sleep(800)
        setIsSubmiting(false)
        toast.push(
            <Notification type="success">
                {isEdit ? 'SubCategory updated!' : 'SubCategory created!'}
            </Notification>,
            { placement: 'top-center' },
        )
        navigate(`${endpointConfig.master.subcategory.list}`)
    }

    const handleConfirmDiscard = () => {
        setDiscardConfirmationOpen(true)
        toast.push(
            <Notification type="success">Changes discarded!</Notification>,
            { placement: 'top-center' },
        )
        navigate(endpointConfig.master.subcategory.list)
    }

    const handleDiscard = () => setDiscardConfirmationOpen(true)
    const handleCancel = () => setDiscardConfirmationOpen(false)

    if (loading) {
        return <p className="p-4">Loading sub category data...</p>
    }

    return (
        <>
            <SubCategoryForm
                newSubCategory={isAdd}
                defaultValues={
                    subCategoryDetail ?? {
                        name: '',
                        cat_id: '',
                        identifier: '',
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
            </SubCategoryForm>
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

export default SubCategoryAddEdit
