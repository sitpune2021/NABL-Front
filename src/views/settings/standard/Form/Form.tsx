import { useEffect, useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '@/components/ui/Form'
import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import StandardSection from './StandardSection'
import type { CommonProps } from '@/@types/common'
import StandardRecursiveSection from './StandardRecursiveSection'
import { StandardFormSchema, standardSchema } from '@/schemas/standard.schema'
import { EMPTY_VALUES } from '@/constants/standard.constant'

type StandardFormProps = {
    onFormSubmit: (values: StandardFormSchema) => void
    defaultValues?: StandardFormSchema
    readOnly?: boolean
    loading?: boolean
} & CommonProps

const StandardForm = ({
    onFormSubmit,
    defaultValues,
    readOnly = false,
    loading = false,
    children,
}: StandardFormProps) => {
    const memoizedDefaults = useMemo(
        () => defaultValues ?? EMPTY_VALUES,
        [defaultValues],
    )

    const methods = useForm<StandardFormSchema>({
        resolver: zodResolver(standardSchema),
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
                        <div className="flex flex-col flex-auto gap-6">
                            <StandardSection
                                readOnly={readOnly}
                                loading={loading}
                            />
                            <StandardRecursiveSection
                                isRoot
                                name="clauses"
                                readOnly={readOnly}
                                depth={0}
                            />
                        </div>
                    </div>
                </Container>

                <BottomStickyBar>{children}</BottomStickyBar>
            </Form>
        </FormProvider>
    )
}

export default StandardForm
