import { Form, FormItem } from '@/components/ui/Form'
import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import type { CommonProps } from '@/@types/common'
import { TemplateFormSchema } from '@/@types/template'
import GrapesEditor from './GrapesEditor'
import Dialog from '@/components/ui/Dialog'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
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
    name: z.string().min(1, { message: 'Name required' }),
    type: z.string().min(1, { message: 'type required' }),
    template: z.any(),
    status: z.any().optional(),
    change_type: z.string().optional(),
    message: z.string().optional(),
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
    const { type } = useParams<{ type: string }>()
    const {
        handleSubmit,
        formState: { errors },
        control,
        setValue,
    } = useForm<TemplateFormSchema>({
        defaultValues: {
            ...defaultValues,
        },
        resolver: zodResolver(validationSchema),
    })

    const onSubmit = (values: TemplateFormSchema) => {
        onFormSubmit(values)
        onDialogClose()
    }

    return (
        <>
            <Form
                className="flex w-full h-full px-4 sm:px-8"
                containerClassName="flex flex-col w-full justify-between h-full"
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
                <h5 className="mb-4">
                    {isEdit ? 'Update Template' : 'Create Template'}
                </h5>
                <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                        <input type="hidden" {...field} value={type || ''} />
                    )}
                />
                <Controller
                    name="status"
                    control={control}
                    render={({ field }) => <input type="hidden" {...field} />}
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
                {isEdit && (
                    <>
                        <FormItem
                            label="Change Type"
                            invalid={Boolean(errors.change_type)}
                            errorMessage={errors.change_type?.message}
                        >
                            <Controller
                                name="change_type"
                                control={control}
                                rules={{ required: 'Change type is required' }}
                                render={({ field }) => (
                                    <select
                                        {...field}
                                        className="border rounded-md px-3 py-2 w-full"
                                    >
                                        <option value="">
                                            Select Change Type
                                        </option>
                                        <option value="minor">Minor</option>
                                        <option value="major">Major</option>
                                    </select>
                                )}
                            />
                        </FormItem>

                        <FormItem label="Message">
                            <Controller
                                name="message"
                                control={control}
                                render={({ field }) => (
                                    <Input placeholder="Message" {...field} />
                                )}
                            />
                        </FormItem>
                    </>
                )}

                <div className="flex justify-end mt-6 gap-2">
                    <Button
                        variant="plain"
                        type="button"
                        onClick={onDialogClose}
                    >
                        Cancel
                    </Button>

                    {!isEdit && (
                        <>
                            <Button
                                variant="solid"
                                type="button"
                                loading={isSubmiting}
                                onClick={() => {
                                    setValue('status', 'published')
                                    handleSubmit(onSubmit)()
                                }}
                            >
                                Save
                            </Button>

                            <Button
                                variant="solid"
                                type="button"
                                loading={isSubmiting}
                                onClick={() => {
                                    setValue('status', 'draft')
                                    handleSubmit(onSubmit)()
                                }}
                            >
                                Save as Draft
                            </Button>
                        </>
                    )}

                    {isEdit && (
                        <Button
                            variant="solid"
                            type="button"
                            loading={isSubmiting}
                            onClick={() => {
                                handleSubmit(onSubmit)()
                            }}
                        >
                            Update
                        </Button>
                    )}
                </div>
            </Dialog>
        </>
    )
}

export default TemplateForm
