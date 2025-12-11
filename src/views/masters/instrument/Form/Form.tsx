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
import { InstrumentFormSchema } from '@/@types/instrument'

type InstrumentFormProps = {
    onFormSubmit: (values: InstrumentFormSchema) => void
    defaultValues?: InstrumentFormSchema
    newInstrument?: boolean
    readOnly?: boolean
} & CommonProps

const validationSchema = z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    short_name: z.string().min(1, { message: 'Short Name is required' }),
    manufacturer: z.string().min(1, { message: 'Manufacturer is required' }),
    serial_no: z.string().min(1, { message: 'Serial Number is required' }),
    identifier: z
        .string()
        .min(1, { message: 'Prefix is required' })
        .max(4, { message: 'Prefix must be at most 4 characters' })
        .regex(/^[A-Z]+$/, {
            message: 'Prefix must contain only uppercase letters',
        })
        .refine((val) => !/\s{2,}/.test(val), {
            message: 'Prefix must not contain double spaces',
        }),
})

const InstrumentForm = (props: InstrumentFormProps) => {
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
    } = useForm<InstrumentFormSchema>({
        defaultValues: {
            ...defaultValues,
        },
        resolver: zodResolver(validationSchema),
    })

    useEffect(() => {
        if (!isEmpty(defaultValues)) {
            reset(defaultValues)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(defaultValues)])

    const onSubmit = (values: InstrumentFormSchema) => {
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
                        />
                    </div>
                </div>
            </Container>
            <BottomStickyBar>{children}</BottomStickyBar>
        </Form>
    )
}

export default InstrumentForm
