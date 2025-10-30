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

const validationSchema = z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    labType: z.string().min(1, { message: 'Lab Type is required' }),
    department: z.any(),
    labCode: z.string().min(1, { message: 'Lab Code is required' }),
    email: z
        .string()
        .email({ message: 'Invalid email address' })
        .optional()
        .or(z.literal('')),
    phone: z.string().optional().or(z.literal('')),
    address: z.string().optional().or(z.literal('')),
    location: z.array(z.any()).min(1, { message: 'Location is required' }),
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
        resolver: zodResolver(validationSchema),
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
        </FormProvider>
    )
}

export default LabForm
