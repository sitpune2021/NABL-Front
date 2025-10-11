import { useEffect } from 'react'
import { Form } from '@/components/ui/Form'
import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import OverviewSection from './OverviewSection'
import isEmpty from 'lodash/isEmpty'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import type { CommonProps } from '@/@types/common'
import { ClausesFormSchema } from '@/@types/clauses'

type ClausesFormProps = {
    onFormSubmit: (values: ClausesFormSchema) => void
    defaultValues?: Partial<ClausesFormSchema>
    newClauses?: boolean
    readOnly?: boolean
} & CommonProps

const validationSchema = z.object({
    notes: z
        .array(z.string().min(1, { message: 'Note text required' }))
        .min(1, { message: 'At least one note required' }),
    clauses: z
        .array(
            z.object({
                category: z.string().min(1, { message: 'Category required' }),
                documentName: z
                    .string()
                    .min(1, { message: 'Document required' }),
                frequency: z.string().min(1, { message: 'Frequency required' }),
                required: z.boolean(),
                timezone: z.boolean(),
            }),
        )
        .min(1, { message: 'At least one clause required' }),
})

const ClausesForm = (props: ClausesFormProps) => {
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
        setValue,
        getValues,
    } = useForm<ClausesFormSchema>({
        defaultValues: {
            notes: [''],
            clauses: [
                {
                    category: '',
                    documentName: '',
                    frequency: '',
                    required: false,
                    timezone: false,
                },
            ],
        },
        resolver: zodResolver(validationSchema),
    })

    useEffect(() => {
        if (!isEmpty(defaultValues)) {
            const transformedValues: ClausesFormSchema = {
                notes: Array.isArray(defaultValues.notes)
                    ? defaultValues.notes
                    : [defaultValues.notes || ''],
                clauses: Array.isArray(defaultValues.clauses)
                    ? defaultValues.clauses
                    : [
                          {
                              category: defaultValues.category || '',
                              documentName: defaultValues.documentName || '',
                              frequency: defaultValues.frequency || '',
                              required: defaultValues.required || false,
                              timezone: defaultValues.timezone || false,
                          },
                      ],
            }
            reset(transformedValues)
        }
    }, [JSON.stringify(defaultValues), reset])

    const onSubmit = (values: ClausesFormSchema) => {
        console.log('Form submitted:', values)
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
                        <OverviewSection
                            control={control}
                            errors={errors}
                            readOnly={readOnly}
                            setValue={setValue}
                            getValues={getValues}
                        />
                    </div>
                </div>
            </Container>
            <BottomStickyBar>{children}</BottomStickyBar>
        </Form>
    )
}

export default ClausesForm
