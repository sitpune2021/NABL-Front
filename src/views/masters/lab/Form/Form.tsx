/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react'
import { Form } from '@/components/ui/Form'
import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import OverviewSection from './OverviewSection'
import isEmpty from 'lodash/isEmpty'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, FormProvider } from 'react-hook-form'
import { z } from 'zod'
import type { CommonProps } from '@/@types/common'
import type { LabFormSchema } from '@/@types/lab'
import LocationsSection from './LocationsSection'

const validationSchema = z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    labType: z.string().min(1, { message: 'Lab Type is required' }),
    department: z.any().refine((val) => val !== '' && val !== null, {
        message: 'Department is required',
    }),
    labCode: z.string().min(1, { message: 'Lab Code is required' }),
    emails: z
        .array(
            z.object({
                value: z
                    .string()
                    .nonempty({ message: 'Email is required' })
                    .email({ message: 'Invalid email address' }),
            }),
        )
        .min(1, { message: 'At least one email is required' }),
    phones: z
        .array(
            z.object({
                value: z.string().nonempty({ message: 'Phone is required' }),
            }),
        )
        .min(1, { message: 'At least one phone is required' }),
    address: z.string().optional(),
    location: z
        .array(
            z.object({
                zone_name: z.string().nonempty({ message: 'Zone is required' }),
                cluster_name: z
                    .string()
                    .nonempty({ message: 'Cluster is required' }),
                location_name: z
                    .string()
                    .nonempty({ message: 'Location is required' }),
                departments: z
                    .array(
                        z.object({
                            name: z.string().nonempty({
                                message: 'Department name is required',
                            }),
                            instruments: z
                                .array(z.union([z.string(), z.number()]))
                                .min(1, {
                                    message:
                                        'At least one instrument is required per department',
                                }),
                        }),
                    )
                    .min(1, { message: 'At least one department is required' }),
                prefix: z.string().nonempty(),
                shortName: z.string(),
                emails: z
                    .array(
                        z.object({
                            value: z
                                .string()
                                .nonempty({ message: 'Email is required' })
                                .email({ message: 'Invalid email address' }),
                        }),
                    )
                    .min(1, { message: 'At least one email is required' }),
                phones: z
                    .array(
                        z.object({
                            value: z
                                .string()
                                .nonempty({ message: 'Phone is required' }),
                        }),
                    )
                    .min(1, { message: 'At least one phone is required' }),
                address: z.string().optional(),
            }),
        )
        .min(1, { message: 'At least one location is required' }),
})

type LabFormProps = {
    onFormSubmit: (values: LabFormSchema) => void
    defaultValues?: LabFormSchema
    newLab?: boolean
    readOnly?: boolean
} & CommonProps

const LabForm = ({
    onFormSubmit,
    defaultValues,
    readOnly = false,
    children,
}: LabFormProps) => {
    const methods = useForm<LabFormSchema>({
        defaultValues,
        resolver: zodResolver(validationSchema) as any,
    })

    const {
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = methods

    useEffect(() => {
        if (!isEmpty(defaultValues)) {
            reset(defaultValues)
        }
    }, [defaultValues, reset])

    const onSubmit = (values: LabFormSchema) => {
        onFormSubmit?.(values)
    }

    return (
        <FormProvider {...methods}>
            <Form
                className="flex w-full h-full"
                containerClassName="flex flex-col w-full justify-between"
                onSubmit={handleSubmit(onSubmit as unknown as any)}
            >
                <Container>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="gap-4 flex flex-col flex-auto">
                            <OverviewSection
                                control={control}
                                errors={errors}
                                readOnly={readOnly}
                            />
                            <LocationsSection
                                control={control}
                                errors={errors}
                                readOnly={readOnly}
                            />
                        </div>
                    </div>
                </Container>

                <BottomStickyBar>{children}</BottomStickyBar>
            </Form>
        </FormProvider>
    )
}

export default LabForm
