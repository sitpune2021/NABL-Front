/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useCallback, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import sleep from '@/utils/sleep'
import endpointConfig from '@/configs/endpoint.config'
import useStandardList from '../List/hooks/useStandardList'
import StandardForm from '../Form/StandardForm'
import { StandardFormSchema } from '@/@types/standard'
import BottomPanel from '@/components/form/bottomPanel'

export interface StandardNode {
    title: string
    message: string
    note: boolean
    isChild: boolean
    count: number
    numberingValue: string | number
    numberingType: string | number
    children?: StandardNode[]
}

const StandardAddEdit = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { id } = useParams()
    const { saveStandardData } = useStandardList()

    const [discardConfirmationOpen, setDiscardConfirmationOpen] =
        useState(false)
    const [isSubmiting, setIsSubmiting] = useState(false)

    const isEdit = location.pathname.includes('/edit')
    const isView = location.pathname.includes('/view')
    const isAdd = location.pathname.includes('/create')

    const defaultStandardData = useMemo<StandardFormSchema>(
        () => ({
            uuid: '',
            name: '',
            data: {} as any,
            standards: {
                title: '',
                message: '',
                note: true,
                isChild: false,
                count: 0,
                children: [],
                numberingValue: '',
                numberingType: 'none',
            },
        }),
        [],
    )

    const handleFormSubmit = useCallback(
        async (values: StandardFormSchema) => {
            if (isView) return
            setIsSubmiting(true)
            try {
                const payload: any = {
                    ...values,
                    ...(isEdit ? { id } : {}),
                }

                const result = await saveStandardData(payload)
                await sleep(300)

                toast.push(
                    <Notification type="success">
                        {isEdit ? 'Standard updated!' : 'Standard created!'}
                    </Notification>,
                    { placement: 'top-center' },
                )

                navigate(
                    `${endpointConfig.setting.clauses.create}/${
                        isEdit ? id : result.id
                    }`,
                )
            } catch (error) {
                console.error(error)
                toast.push(
                    <Notification type="danger">
                        Failed to save standard
                    </Notification>,
                    { placement: 'top-center' },
                )
            } finally {
                setIsSubmiting(false)
            }
        },
        [isEdit, isView, id, saveStandardData, navigate],
    )

    const handleDiscard = () => setDiscardConfirmationOpen(true)
    const handleCancel = () => setDiscardConfirmationOpen(false)

    const handleConfirmDiscard = () => {
        setDiscardConfirmationOpen(false)
        toast.push(
            <Notification type="success">Changes discarded!</Notification>,
            { placement: 'top-center' },
        )
        navigate(`${endpointConfig.setting.clauses.list}`)
    }

    return (
        <>
            <StandardForm
                newStandard={isAdd}
                defaultValues={defaultStandardData}
                readOnly={isView}
                onFormSubmit={handleFormSubmit}
            >
                <BottomPanel
                    isView={isView}
                    isSubmitting={isSubmiting}
                    isEdit={isEdit}
                    onDiscard={handleDiscard}
                />
            </StandardForm>

            <ConfirmDialog
                isOpen={discardConfirmationOpen}
                type="danger"
                title="Discard changes"
                onClose={handleCancel}
                onRequestClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleConfirmDiscard}
            >
                <p>Are you sure you want to discard your changes?</p>
            </ConfirmDialog>
        </>
    )
}

export default StandardAddEdit
