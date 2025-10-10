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
import { SubCategoryFormSchema } from '@/@types/subcategory'

type SubCategoryFormProps = {
    onFormSubmit: (values: SubCategoryFormSchema) => void
    defaultValues?: SubCategoryFormSchema
    newSubCategory?: boolean
    readOnly?: boolean
} & CommonProps

const validationSchema = z.object({
    name: z.string().min(1, { message: ' name required' }),
    subcategory: z.string().min(1, { message: 'sub category required' }),
    required: z.boolean(),
    initialtimezone: z.boolean(),
    prefix: z
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

const SubCategoryForm = (props: SubCategoryFormProps) => {
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
    } = useForm<SubCategoryFormSchema>({
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

    const onSubmit = (values: SubCategoryFormSchema) => {
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

export default SubCategoryForm
