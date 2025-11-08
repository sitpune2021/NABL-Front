import { useEffect } from 'react'
import { Form, FormItem } from '@/components/ui/Form'
import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import isEmpty from 'lodash/isEmpty'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import type { CommonProps } from '@/@types/common'
import { TemplateFormSchema } from '@/@types/template'
import GrapesEditor from './GrapesEditor'
import Dialog from '@/components/ui/Dialog' // Assuming Dialog is imported from your UI components
import Input from '@/components/ui/Input' // Assuming Input is imported
import Button from '@/components/ui/Button' // Assuming Button is imported
import { useParams } from 'react-router'

type TemplateFormProps = {
    onFormSubmit: (values: TemplateFormSchema) => void
    defaultValues?: TemplateFormSchema
    newTemplate?: boolean
    readOnly?: boolean
    dialogIsOpen: boolean
    onDialogClose: () => void
    isSubmiting: boolean
    isEdit: boolean
} & CommonProps

const validationSchema = z.object({
    name: z.string().min(1, { message: 'name required' }),
    type: z.string().min(1, { message: 'type required' }),
    template: z.any(),
})

const TemplateForm = ({
    onFormSubmit,
    defaultValues,
    readOnly = false,
    children,
    dialogIsOpen,
    onDialogClose,
    isSubmiting,
    isEdit,
}: TemplateFormProps) => {
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
    const { type } = useParams<{ type: string }>()

    useEffect(() => {
        if (!isEmpty(defaultValues)) reset(defaultValues)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(defaultValues)])

    const onSubmit = (values: TemplateFormSchema) => onFormSubmit?.(values)

    return (
        <>
            <Form
                className="flex w-full h-full  px-4 sm:px-8"
                containerClassName="flex flex-col w-full justify-between  w-full h-full"
                onSubmit={handleSubmit(onSubmit)}
            >
                <Container>
                    <div className="flex flex-col md:flex-row">
                        <div className="flex flex-col flex-auto -mx-4 sm:-mx-8">
                            <GrapesEditor
                                control={control}
                                readOnly={readOnly}
                                setValue={setValue}
                            />
                        </div>
                    </div>
                </Container>
                <BottomStickyBar>{children}</BottomStickyBar>
            </Form>
            <Dialog isOpen={dialogIsOpen} closable={false}>
                <h5 className="mb-4">Template Name</h5>
                <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                        <input type="hidden" {...field} value={type || ''} />
                    )}
                />
                <FormItem
                    label="Name"
                    invalid={Boolean(errors.name)}
                    errorMessage={errors.name?.message}
                >
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                readOnly={readOnly}
                                placeholder="Template Name"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <div className="text-right mt-6">
                    <Button
                        className="ltr:mr-2 rtl:ml-2"
                        variant="plain"
                        onClick={onDialogClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="solid"
                        type="button"
                        loading={isSubmiting}
                        onClick={() => {
                            const form = document.querySelector('form')
                            if (form) form.requestSubmit()
                        }}
                    >
                        {isEdit ? 'Update' : 'Create'}
                    </Button>
                </div>
            </Dialog>
        </>
    )
}

export default TemplateForm
