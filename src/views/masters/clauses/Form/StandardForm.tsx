/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form } from '@/components/ui/Form'
import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import StandardSection from './StandardSection'
import StandardSectionTwo from './StandardSectionTwo'
import type { CommonProps } from '@/@types/common'
import type { StandardFormSchema } from '@/@types/standard'

type StandardFormProps = {
    onFormSubmit: (values: StandardFormSchema) => void
    defaultValues?: Partial<StandardFormSchema>
    newStandard?: boolean
    readOnly?: boolean
} & CommonProps

const NoteSchema = z.object({
    content: z.string().min(1, 'Note content is required'),
})

const FieldSchema = z.object({
    category: z.string().min(1, 'Category is required'),
    documentName: z.string().min(1, 'Document name is required'),
    frequency: z.string().min(1, 'Frequency is required'),
    isRequired: z.boolean(),
    timezone: z.boolean(),
})

const ChildSchema: z.ZodTypeAny = z.lazy(
    (): z.ZodTypeAny =>
        z.object({
            title: z.string().min(1, 'Title is required'),
            message: z.string().min(1, 'Message is required'),
            isNote: z.boolean(),
            isChild: z.boolean(),
            count: z.number().min(0),
            children: z.array(ChildSchema).optional(),
            notes: z.array(NoteSchema).optional(),
            fields: z.array(FieldSchema).optional(),
        }),
)

export const validationSchema = z.object({
    uuid: z.string().min(1, { message: 'Unique ID is required' }),
    name: z.string().min(1, 'Name is required'),
    standards: z.array(
        z.object({
            title: z.string().min(1, 'Title is required'),
            message: z.string().min(1, 'Message is required'),
            isNote: z.boolean(),
            isChild: z.boolean(),
            count: z.number().min(0),
            children: z.array(ChildSchema),
            notes: z.array(NoteSchema),
            fields: z.array(FieldSchema),
        }),
    ),
})

type FormValues = z.infer<typeof validationSchema>

const StandardForm = ({
    onFormSubmit,
    defaultValues = {},
    readOnly = false,
    children,
}: StandardFormProps) => {
    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<FormValues>({
        defaultValues: { ...defaultValues },
        resolver: zodResolver(validationSchema),
    })

    const onSubmit = useCallback(
        (values: any) => {
            console.log('Submitted Values:', values)
            //   onFormSubmit?.(values)
        },
        [onFormSubmit],
    )

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
                        <StandardSectionTwo
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
