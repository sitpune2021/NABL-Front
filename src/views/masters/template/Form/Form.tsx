import { useEffect, useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '@/components/ui/Form'
import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import GrapesEditor from './GrapesEditor'
import SaveBoxSection from './SaveBoxSection'

import type { CommonProps } from '@/@types/common'
import { TemplateFormSchema, templateSchema } from '@/schemas/template.schema'

type TemplateFormProps = {
    onFormSubmit: (values: TemplateFormSchema) => void
    defaultValues?: TemplateFormSchema
    readOnly?: boolean
    dialogIsOpen: boolean
    onDialogClose: () => void
    isSubmiting: boolean
    isEdit: boolean
    EMPTY_VALUES: TemplateFormSchema
    loading: boolean
} & CommonProps

const TemplateForm = ({
    onFormSubmit,
    defaultValues,
    readOnly = false,
    children,
    dialogIsOpen,
    onDialogClose,
    isSubmiting,
    isEdit,
    EMPTY_VALUES,
    loading,
}: TemplateFormProps) => {
    const memoizedDefaults = useMemo(
        () => defaultValues ?? EMPTY_VALUES,
        [defaultValues, EMPTY_VALUES],
    )

    const methods = useForm<TemplateFormSchema>({
        defaultValues: memoizedDefaults,
        resolver: zodResolver(templateSchema),
        shouldUnregister: false,
    })

    const { handleSubmit, reset } = methods
    useEffect(() => {
        if (defaultValues && !loading) {
            reset(defaultValues)
        }
    }, [defaultValues, loading, reset])

    const submitHandler = handleSubmit((values) => {
        if (!readOnly) {
            onFormSubmit(values)
            onDialogClose()
        }
    })

    return (
        <FormProvider {...methods}>
            <Form
                className="flex w-full h-full px-4 sm:px-8"
                containerClassName="flex flex-col justify-between w-full h-full"
                onSubmit={submitHandler}
            >
                <Container>
                    <div className="flex flex-col md:flex-row">
                        <div className="flex flex-col flex-auto -mx-4 sm:-mx-8">
                            <GrapesEditor
                                readOnly={readOnly}
                                loading={loading}
                            />
                        </div>
                    </div>
                </Container>

                <BottomStickyBar>{children}</BottomStickyBar>
            </Form>

            {!readOnly && (
                <SaveBoxSection
                    readOnly={readOnly}
                    loading={loading}
                    isEdit={isEdit}
                    dialogIsOpen={dialogIsOpen}
                    isSubmiting={isSubmiting}
                    onDialogClose={onDialogClose}
                    onSubmit={submitHandler}
                />
            )}
        </FormProvider>
    )
}

export default TemplateForm
