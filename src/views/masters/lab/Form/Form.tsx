/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react'
import { Form, FormItem } from '@/components/ui/Form'
import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import OverviewSection from './OverviewSection'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, FormProvider, Controller } from 'react-hook-form'
import type { CommonProps } from '@/@types/common'
import LocationsSection from './LocationsSection'
import ClauseTree from './ClauseTree'
import { labSchema, LabFormSchema } from '@/schemas/lab.schema'
import { Card } from '@/components/ui'
import DocumentSelector from './DocumentSelector'

type LabFormProps = {
    step?: number
    onFormSubmit: (values: any) => void
    defaultValues?: LabFormSchema
    newLab?: boolean
    readOnly?: boolean
    onMethodsReady?: (methods: any) => void
    documentList: any[]
} & CommonProps

const LabForm = ({
    step = 0,
    onFormSubmit,
    defaultValues,
    readOnly = false,
    children,
    documentList,
    onMethodsReady,
}: LabFormProps) => {
    const methods = useForm<LabFormSchema>({
        defaultValues,
        resolver: zodResolver(labSchema),
        shouldUnregister: false,
    })

    const {
        handleSubmit,
        control,
        formState: { errors },
        setValue,
    } = methods

    // expose form methods to step wrapper
    useEffect(() => {
        onMethodsReady?.(methods)
    }, [methods, onMethodsReady])

    const onSubmit = (values: LabFormSchema) => {
        const payload = { ...values }
        onFormSubmit?.(payload)
    }

    return (
        <FormProvider {...methods}>
            <Form
                className="flex w-full h-full"
                containerClassName="flex flex-col w-full justify-between"
                onSubmit={handleSubmit(onSubmit as unknown as any)}
            >
                <Container>
                    <div className="flex flex-col gap-4">
                        {/* Step 0: Overview */}
                        {step === 0 && (
                            <OverviewSection
                                control={control}
                                errors={errors}
                                readOnly={readOnly}
                                setValue={setValue}
                            />
                        )}
                        {/* Step 1: Locations */}
                        {step === 1 && (
                            <LocationsSection
                                control={control}
                                errors={errors}
                                readOnly={readOnly}
                            />
                        )}
                        {/* Step 2: Clauses & Documents */}
                        {step === 2 && (
                            <>
                                <ClauseTree
                                    readOnly={readOnly}
                                    control={control}
                                    errors={errors}
                                />
                                <Card>
                                    <FormItem
                                        label="Documents"
                                        invalid={!!errors.documents}
                                        errorMessage={errors.documents?.message}
                                    >
                                        <Controller
                                            name="documents"
                                            defaultValue={documentList.map(
                                                (i) => i.id,
                                            )}
                                            control={control}
                                            render={({ field }) => (
                                                <DocumentSelector
                                                    documentList={documentList}
                                                    value={field.value ?? []}
                                                    isDisabled={readOnly}
                                                    onChange={field.onChange}
                                                />
                                            )}
                                        />
                                    </FormItem>
                                </Card>
                            </>
                        )}
                    </div>
                </Container>

                <BottomStickyBar>{children}</BottomStickyBar>
            </Form>
        </FormProvider>
    )
}

export default LabForm
