/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useMemo, useCallback } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router'
import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import sleep from '@/utils/sleep'
import { TbTrash } from 'react-icons/tb'
import endpointConfig from '@/configs/endpoint.config'
import useStandardList from '../List/hooks/useStandardList'
import StandardForm from '../Form/StandardForm'
import { StandardFormSchema } from '@/@types/standard'

export interface StandardNode {
    title: string
    message: string
    note: boolean
    isChild: boolean
    count: number
    children?: StandardNode[]
    number?: string // generated hierarchical number
}

export const assignNumbering = (
    nodes: StandardNode[],
    prefix = '',
): StandardNode[] => {
    return nodes.map((node, index) => {
        const currentNumber = prefix ? `${prefix}.${index + 1}` : `${index + 1}`
        return {
            ...node,
            number: currentNumber,
            children:
                node.children && node.children.length > 0
                    ? assignNumbering(node.children, currentNumber)
                    : [],
        }
    })
}

const StandardAddEdit = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { id: standardId } = useParams()
    const { saveStandardData, getStandardById } = useStandardList()

    const [discardConfirmationOpen, setDiscardConfirmationOpen] =
        useState(false)
    const [isSubmiting, setIsSubmiting] = useState(false)
    const [standardData, setStandardData] = useState<StandardFormSchema | null>(
        null,
    )
    const [loadingData, setLoadingData] = useState(false)

    const isEdit = location.pathname.includes('/edit')
    const isView = location.pathname.includes('/view')
    const isAdd = location.pathname.includes('/create')

    const defaultStandardData = useMemo<StandardFormSchema>(
        () => ({
            name: '',
            data: {} as any,
            uuid: '',
            standards: {
                title: '',
                message: '',
                note: true,
                isChild: false,
                count: 0,
                children: [],
            },
        }),
        [],
    )

    useEffect(() => {
        if (isAdd || !standardId) return
        let isMounted = true
        const fetchData = async () => {
            try {
                setLoadingData(true)
                const data = await getStandardById(standardId)
                if (isMounted && data) setStandardData(data)
            } catch (error) {
                console.log(error, 'error')

                toast.push(
                    <Notification type="danger">
                        Failed to load standard data
                    </Notification>,
                    { placement: 'top-center' },
                )
            } finally {
                if (isMounted) setLoadingData(false)
            }
        }

        fetchData()
        return () => {
            isMounted = false
        }
    }, [standardId, isAdd, getStandardById])

    const handleFormSubmit = useCallback(
        async (values: StandardFormSchema) => {
            if (isView) return
            setIsSubmiting(true)
            try {
                const numberedStandards = values.standards?.length
                    ? assignNumbering(values.standards)
                    : []
                const payload: StandardFormSchema & { id?: string } = isEdit
                    ? {
                          ...values,
                          id: standardId,
                          standards: numberedStandards,
                      }
                    : { ...values, standards: numberedStandards }
                console.log('Saving payload:', payload)
                const savedStandard = await saveStandardData(payload)
                await sleep(800)
                console.log('Save successful', savedStandard)

                toast.push(
                    <Notification type="success">
                        {isEdit
                            ? 'Standard updated successfully!'
                            : 'Standard created successfully!'}
                    </Notification>,
                    { placement: 'top-center' },
                )

                const newStandardId = isEdit
                    ? standardId
                    : savedStandard.data.id
                navigate(
                    `${endpointConfig.master.clauses.create}/${newStandardId}`,
                )
            } catch (error) {
                console.error('Error saving standard:', error)
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
        [isEdit, isView, standardId, saveStandardData, navigate],
    )

    const handleDiscard = () => setDiscardConfirmationOpen(true)
    const handleCancel = () => setDiscardConfirmationOpen(false)

    const handleConfirmDiscard = () => {
        setDiscardConfirmationOpen(false)
        toast.push(
            <Notification type="success">Changes discarded!</Notification>,
            { placement: 'top-center' },
        )
        navigate(`${endpointConfig.master.clauses.list}`)
    }

    if (loadingData && !isAdd) {
        return (
            <Container>
                <div className="flex justify-center items-center p-8">
                    <p>Loading standard data...</p>
                </div>
            </Container>
        )
    }

    return (
        <>
            <StandardForm
                newStandard={isAdd}
                defaultValues={standardData || defaultStandardData}
                readOnly={isView}
                onFormSubmit={handleFormSubmit}
            >
                <Container>
                    <div className="flex items-center justify-between px-8">
                        <span />
                        {!isView && (
                            <div className="flex items-center gap-3">
                                <Button
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
                                    type="submit"
                                    loading={isSubmiting}
                                >
                                    {isEdit
                                        ? 'Update Standard'
                                        : 'Create Standard'}
                                </Button>
                            </div>
                        )}
                    </div>
                </Container>
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
                <p>
                    Are you sure you want to discard your changes? This action
                    cannot be undone.
                </p>
            </ConfirmDialog>
        </>
    )
}

export default StandardAddEdit
