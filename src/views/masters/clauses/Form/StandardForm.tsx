/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form } from '@/components/ui/Form'
import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import StandardSection from './StandardSection'
import type { CommonProps } from '@/@types/common'
import StandardRecursiveSection from './StandardRecursiveSection'
import { StandardFormSchema } from '@/@types/standard'

type StandardFormProps = {
    onFormSubmit: (values: any) => void
    defaultValues?: Partial<StandardFormSchema>
    newStandard?: boolean
    readOnly?: boolean
} & CommonProps
const createStandardSchema = (): z.ZodType<any> =>
    z
        .object({
            title: z.string().min(1, 'Title is required'),
            message: z.string().min(1, 'Message is required'),
            note: z.boolean(),
            isChild: z.boolean(),
            count: z.number().min(0, { message: 'Count must be 0 or greater' }),
            children: z.array(z.lazy(createStandardSchema)).optional(),
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
        })

export const validationSchema = z.object({
    uuid: z.string().min(1, { message: 'Unique ID is required' }),
    name: z.string().min(1, { message: 'Name is required' }),
    standards: z
        .array(createStandardSchema())
        .min(1, { message: 'At least one standard is required' }),
})

export type FormValues = z.infer<typeof validationSchema>

const StandardForm = ({
    onFormSubmit,
    defaultValues = {},
    readOnly = false,
    children,
}: StandardFormProps) => {
    const mergedDefaults = useMemo<FormValues>(() => {
        const normalizedStandards = Array.isArray(defaultValues.standards)
            ? (defaultValues.standards as any[])
            : defaultValues.standards
              ? [defaultValues.standards as any]
              : [
                    {
                        title: '',
                        message: '',
                        note: true,
                        isChild: false,
                        count: 0,
                        children: [],
                    },
                ]

        return {
            uuid: defaultValues.uuid ?? '',
            name: defaultValues.name ?? '',
            standards: normalizedStandards,
        }
    }, [defaultValues])

    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<FormValues>({
        defaultValues: mergedDefaults,
        resolver: zodResolver(validationSchema),
        mode: 'onBlur',
    })

    const onSubmit = useCallback(
        (values: FormValues) => {
            onFormSubmit(values)
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
                            isRoot
                            control={control}
                            name="standards"
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
