import { useEffect, useState } from 'react'
import { Form } from '@/components/ui/Form'
import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import OverviewSection from './OverviewSection'
import isEmpty from 'lodash/isEmpty'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import type { CommonProps } from '@/@types/common'
import { UnitFormSchema } from '@/@types/unit'
import ConfirmDialog from '@/components/shared/ConfirmDialog' // Import ConfirmDialog

type UnitFormProps = {
    onFormSubmit: (values: UnitFormSchema) => void
    defaultValues?: UnitFormSchema
    newUnit?: boolean
    readOnly?: boolean
    existingUnits?: string[] // Existing unit names for duplicate check
} & CommonProps

const validationSchema = z.object({
    name: z.string().min(1, { message: 'Name is required' }),
})

const UnitForm = (props: UnitFormProps) => {
    const {
        onFormSubmit,
        defaultValues = {},
        readOnly = false,
        children,
        existingUnits = [], // Pass existing unit names
    } = props

    const {
        handleSubmit,
        reset,
        formState: { errors },
        control,
        watch,
        trigger,
    } = useForm<UnitFormSchema>({
        defaultValues: {
            ...defaultValues,
        },
        resolver: zodResolver(validationSchema),
    })

    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
    const [pendingSubmitData, setPendingSubmitData] =
        useState<UnitFormSchema | null>(null)

    // Watch name field for real-time validation
    const nameValue = watch('name')

    // Check for case-insensitive duplicates
    const checkDuplicate = (name: string): boolean => {
        if (!name) return false
        return existingUnits.some(
            (existingName) => existingName.toLowerCase() === name.toLowerCase(),
        )
    }

    const hasDuplicate = checkDuplicate(nameValue)

    useEffect(() => {
        if (!isEmpty(defaultValues)) {
            reset(defaultValues)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(defaultValues)])

    const handleConfirmSubmit = () => {
        if (pendingSubmitData) {
            setConfirmDialogOpen(false)
            onFormSubmit?.(pendingSubmitData)
            setPendingSubmitData(null)
        }
    }

    const handleCancelSubmit = () => {
        setConfirmDialogOpen(false)
        setPendingSubmitData(null)
    }

    const onSubmit = async (values: UnitFormSchema) => {
        // Check if form is valid
        const isValid = await trigger()
        if (!isValid) return

        // Check for case-insensitive duplicate
        if (checkDuplicate(values.name)) {
            // Show confirmation dialog for duplicate
            setPendingSubmitData(values)
            setConfirmDialogOpen(true)
        } else {
            // No duplicate, submit directly
            onFormSubmit?.(values)
        }
    }

    return (
        <>
            <Form
                className="flex w-full h-full"
                containerClassName="flex flex-col w-full justify-between"
                onSubmit={handleSubmit(onSubmit)}
            >
                <Container>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="gap-4 flex flex-col flex-auto">
                            <OverviewSection
                                control={control}
                                errors={errors}
                                readOnly={readOnly}
                                hasDuplicate={
                                    hasDuplicate &&
                                    nameValue !== defaultValues.name
                                }
                            />
                        </div>
                    </div>
                </Container>
                <BottomStickyBar>{children}</BottomStickyBar>
            </Form>

            {/* Confirmation Dialog for Duplicate */}
            <ConfirmDialog
                isOpen={confirmDialogOpen}
                type="warning"
                title="Duplicate Unit Name"
                onClose={handleCancelSubmit}
                onRequestClose={handleCancelSubmit}
                onCancel={handleCancelSubmit}
                onConfirm={handleConfirmSubmit}
            >
                <p>
                    This unit name already exists in the system with different
                    case. Are you sure you want to add it anyway?
                </p>
            </ConfirmDialog>
        </>
    )
}

export default UnitForm
