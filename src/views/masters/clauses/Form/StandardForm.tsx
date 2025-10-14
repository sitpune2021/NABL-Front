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

const validationSchema = z.object({
    name: z.string().min(1, { message: 'Name is required' }),
})

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
