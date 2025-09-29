import { MouseEvent, useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router'
import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import sleep from '@/utils/sleep'
import { TbTrash } from 'react-icons/tb'
import endpointConfig from '@/configs/endpoint.config'
import useTemplateList from '../List/hooks/useList'
import TemplateForm from '../Form'
import { TemplateFormSchema } from '@/@types/template'

const TemplateAddEdit = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { id: templateId } = useParams()
    const { saveTemplateData, getTemplateById } = useTemplateList()

    const [discardConfirmationOpen, setDiscardConfirmationOpen] =
        useState(false)
    const [isSubmiting, setIsSubmiting] = useState(false)
    const [templateData, setTemplateData] = useState<TemplateFormSchema | null>(
        null,
    )
    const [loadingData, setLoadingData] = useState(false)

    const [dialogIsOpen, setIsOpen] = useState(false)

    const openDialog = () => {
        setIsOpen(true)
    }

    const onDialogClose = (e: MouseEvent) => {
        console.log('onDialogClose', e)
        setIsOpen(false)
    }

    const isEdit = location.pathname.includes('/edit')
    const isView = location.pathname.includes('/view')
    const isAdd = location.pathname.includes('/create')

    // Load existing template data in edit or view mode
    useEffect(() => {
        if (!isAdd && templateId) {
            setLoadingData(true)
            getTemplateById(templateId)
                .then((data) => {
                    console.log('Fetched template data:', data)

                    setTemplateData(data)
                })
                .finally(() => setLoadingData(false))
        }
    }, [templateId, isAdd])

    const handleFormSubmit = async (values: TemplateFormSchema) => {
        if (isView) return
        setIsSubmiting(true)
        const payload = isEdit ? { ...values, id: templateId } : values
        await saveTemplateData(payload)
        await sleep(800)
        setIsSubmiting(false)
        toast.push(
            <Notification type="success">
                {isEdit ? 'Template updated!' : 'Template created!'}
            </Notification>,
            { placement: 'top-center' },
        )
        navigate(`${endpointConfig.master.template.list}`)
    }

    const handleConfirmDiscard = () => {
        setDiscardConfirmationOpen(true)
        toast.push(
            <Notification type="success">Changes discarded!</Notification>,
            { placement: 'top-center' },
        )
        navigate(`${endpointConfig.master.template.list}`)
    }

    const handleDiscard = () => setDiscardConfirmationOpen(true)
    const handleCancel = () => setDiscardConfirmationOpen(false)

    if (loadingData && !isAdd) {
        return <p className="p-4">Loading template data...</p>
    }

    return (
        <>
            <TemplateForm
                newTemplate={isAdd}
                defaultValues={templateData ?? { name: '' }}
                readOnly={isView}
                dialogIsOpen={dialogIsOpen}
                isSubmiting={isSubmiting}
                isEdit={isEdit}
                onFormSubmit={handleFormSubmit}
                onDialogClose={onDialogClose}
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
                                    onClick={() => openDialog()}
                                >
                                    {isEdit ? 'Update' : 'Create'}
                                </Button>
                            </div>
                        )}
                    </div>
                </Container>
            </TemplateForm>
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

export default TemplateAddEdit
