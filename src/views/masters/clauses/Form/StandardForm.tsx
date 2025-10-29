/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form } from '@/components/ui/Form'
import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import StandardSection from './StandardSection'
import type { CommonProps } from '@/@types/common'
import type { StandardFormSchema } from '@/@types/standard'
import StandardRecursiveSection from './StandardRecursiveSection'

type StandardFormProps = {
    onFormSubmit: (values: StandardFormSchema) => void
    defaultValues?: Partial<StandardFormSchema>
    newStandard?: boolean
    readOnly?: boolean
} & CommonProps

const ChildSchema: z.ZodTypeAny = z.lazy(
    (): z.ZodTypeAny =>
        z
            .object({
                title: z.string().min(1, 'Title is required'),
                message: z.string().min(1, 'Message is required'),
                note: z.boolean(),
                isChild: z.boolean(),
                count: z
                    .number()
                    .min(0, { message: 'Count must be 0 or greater' }),
                children: z.array(ChildSchema).optional(),
            })
            .superRefine((data, ctx) => {
                if (
                    data.isChild &&
                    (!data.children || data.children.length === 0)
                ) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'Children are required when isChild is true',
                        path: ['children'],
                    })
                }
            }),
)

export const validationSchema = z.object({
    uuid: z.string().min(1, { message: 'Unique ID is required' }),
    name: z.string().min(1, { message: 'Name is required' }),
    standards: z.array(
        z
            .object({
                title: z.string().min(1, { message: 'Title is required' }),
                message: z.string().min(1, { message: 'Message is required' }),
                note: z.boolean(),
                isChild: z.boolean(),
                count: z
                    .number()
                    .min(0, { message: 'Count must be 0 or greater' }),
                children: z.array(ChildSchema).optional(),
            })
            .superRefine((data, ctx) => {
                if (
                    data.isChild &&
                    (!data.children || data.children.length === 0)
                ) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'Children are required when isChild is true',
                        path: ['children'],
                    })
                }
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
            onFormSubmit?.(values)
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
                        <StandardRecursiveSection
                            control={control}
                            name="standards"
                            errors={errors}
                            readOnly={readOnly}
                            isRoot={true}
                        />
                    </div>
                </div>
            </Container>

            <BottomStickyBar>{children}</BottomStickyBar>
        </Form>
    )
}

export default StandardForm
