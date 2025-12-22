import { useEffect, useMemo } from 'react'
import { Form } from '@/components/ui/Form'
import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import OverviewSection from './OverviewSection'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, FormProvider } from 'react-hook-form'
import type { CommonProps } from '@/@types/common'
import { CategoryFormSchema, categorySchema } from '@/schemas/category.schema'
import { EMPTY_VALUES } from '@/constants/category.constant'

type CategoryFormProps = {
    onFormSubmit: (values: CategoryFormSchema) => void
    defaultValues?: CategoryFormSchema
    readOnly?: boolean
    loading?: boolean
} & CommonProps

const CategoryForm = ({
    onFormSubmit,
    defaultValues,
    readOnly = false,
    loading = false,
    children,
}: CategoryFormProps) => {
    const memoizedDefaults = useMemo(
        () => defaultValues ?? EMPTY_VALUES,
        [defaultValues],
    )

    const methods = useForm<CategoryFormSchema>({
        resolver: zodResolver(categorySchema),
        defaultValues: memoizedDefaults,
        mode: 'onSubmit',
        reValidateMode: 'onChange',
    })

    const { handleSubmit, reset } = methods

    useEffect(() => {
        if (defaultValues) {
            reset(defaultValues)
        }
    }, [defaultValues, reset])

    return (
        <FormProvider {...methods}>
            <Form
                className="flex w-full h-full"
                containerClassName="flex flex-col w-full justify-between"
                onSubmit={handleSubmit(onFormSubmit)}
            >
                <Container>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex flex-col gap-4 flex-auto">
                            <OverviewSection
                                readOnly={readOnly}
                                loading={loading}
                            />
                        </div>
                    </div>
                </Container>

                <BottomStickyBar>{children}</BottomStickyBar>
            </Form>
        </FormProvider>
    )
}

export default CategoryForm
