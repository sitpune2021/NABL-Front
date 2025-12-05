/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import sleep from '@/utils/sleep'
import endpointConfig from '@/configs/endpoint.config'
import useCategoryList from '../List/hooks/useList'
import CategoryForm, { CategoryFormSchema } from '../Form'
import BottomPanel from '@/components/form/bottomPanel'

const CategoryAddEdit = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { id: categoryId } = useParams()
    const { saveCategoryData, getCategoryById } = useCategoryList()

    const [discardConfirmationOpen, setDiscardConfirmationOpen] =
        useState(false)
    const [isSubmiting, setIsSubmiting] = useState(false)
    const [categoryData, setCategoryData] = useState<CategoryFormSchema>()
    const [loadingData, setLoadingData] = useState(false)

    const isEdit = location.pathname.includes('/edit')
    const isView = location.pathname.includes('/view')
    const isAdd = location.pathname.includes('/create')

    useEffect(() => {
        if (!isAdd && categoryId) {
            setLoadingData(true)
            getCategoryById(categoryId)
                .then((data) => {
                    setCategoryData(data)
                })
                .finally(() => setLoadingData(false))
        }
    }, [categoryId, isAdd])

    const handleFormSubmit = async (values: CategoryFormSchema) => {
        if (isView) return
        setIsSubmiting(true)
        try {
            const payload = isEdit ? { ...values, id: categoryId } : values
            await saveCategoryData(payload)
            await sleep(800)
            toast.push(
                <Notification type="success">
                    {isEdit ? 'Category updated!' : 'Category created!'}
                </Notification>,
                { placement: 'top-center' },
            )
            navigate(`${endpointConfig.master.category.list}`)
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
                    `Failed to ${isEdit ? 'update' : 'create'} category`

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
        setDiscardConfirmationOpen(true)
        toast.push(
            <Notification type="success">Changes discarded!</Notification>,
            { placement: 'top-center' },
        )
        navigate(`${endpointConfig.master.category.list}`)
    }

    const handleDiscard = () => setDiscardConfirmationOpen(true)
    const handleCancel = () => setDiscardConfirmationOpen(false)

    if (loadingData && !isAdd) {
        return <p className="p-4">Loading category data...</p>
    }

    return (
        <>
            <CategoryForm
                newCategory={isAdd}
                defaultValues={
                    categoryData ?? {
                        name: '',
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
            </CategoryForm>
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
                    be undo.
                </p>
            </ConfirmDialog>
        </>
    )
}

export default CategoryAddEdit
