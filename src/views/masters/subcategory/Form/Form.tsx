import { useEffect, useMemo } from 'react'
import { Form } from '@/components/ui/Form'
import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import OverviewSection from './OverviewSection'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import type { CommonProps } from '@/@types/common'
import {
    SubCategoryFormSchema,
    subCategorySchema,
} from '@/schemas/sub_category.schema'
import { EMPTY_VALUES } from '@/constants/sub_category.constant'

type SubCategoryFormProps = {
    onFormSubmit: (values: SubCategoryFormSchema) => void
    defaultValues?: SubCategoryFormSchema
    readOnly?: boolean
    loading?: boolean
} & CommonProps

const SubCategoryForm = ({
    onFormSubmit,
    defaultValues,
    readOnly = false,
    loading = false,
    children,
}: SubCategoryFormProps) => {
    const memoizedDefaults = useMemo(
        () => defaultValues ?? EMPTY_VALUES,
        [defaultValues],
    )
    const methods = useForm<SubCategoryFormSchema>({
        resolver: zodResolver(subCategorySchema),
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
                        <div className="gap-4 flex flex-col flex-auto">
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

export default SubCategoryForm
