/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react'
import { Form } from '@/components/ui/Form'
import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import OverviewSection from './OverviewSection'
import LocationsSection from './LocationsSection'
import ClausesSection from './ClausesSection'
import isEmpty from 'lodash/isEmpty'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, FormProvider } from 'react-hook-form'
import { z } from 'zod'
import type { LabFormSchema } from '@/@types/lab'
import Steps from '@/components/ui/Steps'
import Button from '@/components/ui/Button'

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
                instruments: z.array(z.union([z.string(), z.number()])).min(1, {
                    message:
                        'At least one instrument is required per department',
                }),
            }),
        )
        .min(1, { message: 'At least one location is required' }),
})

type LabFormProps = {
    onFormSubmit: (values: LabFormSchema) => void
    defaultValues?: LabFormSchema
    readOnly?: boolean
}

const LabForm = ({
    onFormSubmit,
    defaultValues,
    readOnly = false,
}: LabFormProps) => {
    const methods = useForm<LabFormSchema>({
        defaultValues,
        resolver: zodResolver(validationSchema) as any,
    })

    const {
        reset,
        control,
        formState: { errors },
        handleSubmit,
    } = methods

    const [step, setStep] = useState(0)

    useEffect(() => {
        if (!isEmpty(defaultValues)) reset(defaultValues)
    }, [defaultValues, reset])

    const nextStep = () => {
        setStep((s) => (s < 2 ? s + 1 : s))
    }

    const prevStep = () => {
        setStep((s) => (s > 0 ? s - 1 : s))
    }

    const onSubmit = (values: LabFormSchema) => {
        if (step === 2) {
            onFormSubmit(values)
        }
    }

    const renderStep = () => {
        switch (step) {
            case 0:
                return (
                    <OverviewSection
                        control={control}
                        errors={errors}
                        readOnly={readOnly}
                    />
                )

            case 1:
                return (
                    <LocationsSection
                        control={control}
                        errors={errors}
                        readOnly={readOnly}
                    />
                )

            case 2:
                return (
                    <ClausesSection
                        control={control}
                        errors={errors}
                        readOnly={readOnly}
                    />
                )

            default:
                return null
        }
    }

    return (
        <FormProvider {...methods}>
            <Form
                className="flex w-full h-full"
                containerClassName="flex flex-col w-full justify-between"
                onSubmit={handleSubmit(onSubmit)}
            >
                <Container>
                    <div className="space-y-6">
                        <Steps current={step}>
                            <Steps.Item title="Overview & Contact" />
                            <Steps.Item title="Locations" />
                            <Steps.Item title="Clauses" />
                        </Steps>

                        <div className="w-full">{renderStep()}</div>
                    </div>
                </Container>

                <BottomStickyBar>
                    <div className="flex justify-end w-full space-x-2">
                        <Button
                            type="button"
                            disabled={step === 0}
                            onClick={prevStep}
                        >
                            Previous
                        </Button>

                        {step === 2 ? (
                            <Button type="submit" variant="solid">
                                Submit
                            </Button>
                        ) : (
                            <Button
                                type="button"
                                variant="solid"
                                onClick={nextStep}
                            >
                                Next
                            </Button>
                        )}
                    </div>
                </BottomStickyBar>
            </Form>
        </FormProvider>
    )
}

export default LabForm
