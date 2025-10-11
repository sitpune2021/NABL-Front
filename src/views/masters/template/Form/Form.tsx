import { MouseEvent, useEffect } from 'react'
import { Form } from '@/components/ui/Form'
import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import isEmpty from 'lodash/isEmpty'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import type { CommonProps } from '@/@types/common'
import { TemplateFormSchema } from '@/@types/template'
import GrapesEditor from './GrapesEditor'

type TemplateFormProps = {
    onFormSubmit: (values: TemplateFormSchema) => void
    defaultValues?: TemplateFormSchema
    newTemplate?: boolean
    readOnly?: boolean
    dialogIsOpen: boolean
    onDialogClose: (e: MouseEvent) => void
    isSubmiting: boolean
    isEdit: boolean
} & CommonProps

const validationSchema = z.object({
    name: z.string().min(1, { message: ' name required' }),
    type: z.string().min(1, { message: ' type required' }),
    template: z.any(),
})

const TemplateForm = (props: TemplateFormProps) => {
    const {
        onFormSubmit,
        defaultValues = {},
        readOnly = false,
        children,
        dialogIsOpen,
        onDialogClose,
        isSubmiting,
        isEdit,
    } = props

    const {
        handleSubmit,
        reset,
        formState: { errors },
        control,
        setValue,
    } = useForm<TemplateFormSchema>({
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

    const onSubmit = (values: TemplateFormSchema) => {
        onFormSubmit?.(values)
    }

    return (
        <Form
            className="flex w-full h-full  px-4 sm:px-8"
            containerClassName="flex flex-col w-full justify-between"
            onSubmit={handleSubmit(onSubmit)}
        >
            <Container>
                <div className="flex flex-col md:flex-row">
                    <div className="flex flex-col flex-auto -mx-4 sm:-mx-8">
                        <GrapesEditor
                            control={control}
                            errors={errors}
                            readOnly={readOnly}
                            dialogIsOpen={dialogIsOpen}
                            isSubmiting={isSubmiting}
                            isEdit={isEdit}
                            setValue={setValue}
                            docData={defaultValues}
                            onDialogClose={onDialogClose}
                            onSubmit={onSubmit}
                        />
                    </div>
                </div>
            </Container>
            <BottomStickyBar>{children}</BottomStickyBar>
        </Form>
    )
}

export default TemplateForm
