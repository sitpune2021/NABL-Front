import { useEffect } from 'react'
import { Form } from '@/components/ui/Form'
import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import StandardSection from './StandardSection'
import isEmpty from 'lodash/isEmpty'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import type { CommonProps } from '@/@types/common'
import { StandardFormSchema } from '@/@types/standard'

type StandardFormProps = {
    onFormSubmit: (values: StandardFormSchema) => void
    defaultValues?: StandardFormSchema
    newStandard?: boolean
    readOnly?: boolean
} & CommonProps

// Updated validation schema for all fields
const validationSchema = z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    id: z.string().min(1, { message: 'Unique ID is required' }),
    title: z.string().min(1, { message: 'Title is required' }),
    message: z.string().optional(),
    isNote: z.boolean(),
    isChild: z.boolean(),
    count: z.number().min(0),
    children: z.array(z.any()), // Recursive validation
    notes: z.array(
        z.object({
            content: z.string().min(1, { message: 'Note content is required' }),
        }),
    ),
    fields: z.array(
        z.object({
            category: z.string().min(1, { message: 'Category is required' }),
            documentName: z
                .string()
                .min(1, { message: 'Document name is required' }),
            frequency: z.string().min(1, { message: 'Frequency is required' }),
            isRequired: z.boolean(),
            timezone: z.boolean(),
        }),
    ),
})

// In StandardForm.tsx - Replace the entire form setup
const StandardForm = (props: StandardFormProps) => {
    const {
        onFormSubmit,
        defaultValues = {},
        readOnly = false,
        children,
    } = props

    const {
        handleSubmit,
        reset,
        formState: { errors },
        control,
    } = useForm<StandardFormSchema>({
        defaultValues: {
            name: '',
            id: '',
            title: '',
            message: '',
            isNote: false,
            isChild: false,
            count: 0,
            children: [],
            notes: [],
            fields: [],
            ...defaultValues,
        },
        resolver: zodResolver(validationSchema),
    })

    useEffect(() => {
        if (!isEmpty(defaultValues)) {
            reset(defaultValues)
        }
    }, [defaultValues, reset])

    const onSubmit = (values: StandardFormSchema) => {
        onFormSubmit?.(values)
    }

    return (
        <Form
            className="flex w-full h-full"
            containerClassName="flex flex-col w-full justify-between"
            onSubmit={handleSubmit(onSubmit)}
        >
            <Container>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="gap-4 flex flex-col flex-auto">
                        <StandardSection
                            control={control}
                            errors={errors}
                            readOnly={readOnly}
                        />
                    </div>
                </div>
            </Container>
            <BottomStickyBar>{children}</BottomStickyBar>
        </Form>
    )
}
export default StandardForm
