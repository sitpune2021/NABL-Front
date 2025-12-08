import { useEffect, useState, useRef } from 'react'
import { Form, FormItem } from '@/components/ui/Form'
import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import isEmpty from 'lodash/isEmpty'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, Controller, useWatch } from 'react-hook-form'
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
    const { type } = useParams<{ type: string }>()
    const [actionDialogOpen, setActionDialogOpen] = useState(false)
    const draftTimer = useRef<number | null>(null)

    const {
        handleSubmit,
        reset,
        formState: { errors },
        control,
        setValue,
        trigger,
    } = useForm<TemplateFormSchema>({
        defaultValues: {
            ...defaultValues,
        },
        resolver: zodResolver(validationSchema),
    })

    const watchedTemplate = useWatch({ control, name: 'template' })

    useEffect(() => {
        if (!defaultValues) return

        const draft = localStorage.getItem('template-draft')

        if (draft) {
            try {
                const parsed = JSON.parse(draft)
                setValue('template', parsed)
            } catch {
                console.warn('Invalid draft found')
            }
        }
    }, [])

    useEffect(() => {
        if (!isEmpty(defaultValues)) reset(defaultValues)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(defaultValues)])

    useEffect(() => {
        if (!watchedTemplate) return

        if (draftTimer.current) {
            clearTimeout(draftTimer.current)
        }

        draftTimer.current = window.setTimeout(() => {
            localStorage.setItem(
                'template-draft',
                JSON.stringify(watchedTemplate),
            )
        }, 2000)

        return () => {
            if (draftTimer.current) clearTimeout(draftTimer.current)
        }
    }, [watchedTemplate])

    const onSubmit = (values: TemplateFormSchema) => onFormSubmit?.(values)

    const validateAndOpenActionModal = async () => {
        const valid = await trigger('name')
        if (valid) setActionDialogOpen(true)
    }

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
                        onClick={validateAndOpenActionModal}
                    >
                        {isEdit ? 'Update' : 'Create'}
                    </Button>
                </div>
            </Dialog>

            <Dialog
                isOpen={actionDialogOpen}
                className="max-w-[300px]"
                onClose={() => setActionDialogOpen(false)}
            >
                <h5 className="mb-4">Select Action</h5>

                <div className="flex flex-col gap-3">
                    {/* Normal Save*/}
                    <Button
                        variant="default"
                        onClick={() => {
                            localStorage.removeItem('template-draft')
                            document.querySelector('form')?.requestSubmit()
                            setActionDialogOpen(false)
                            onDialogClose()
                        }}
                    >
                        Save
                    </Button>

                    {/* Save as Draft */}
                    <Button
                        variant="default"
                        onClick={() => {
                            let draftType = ''

                            if (type === 'header') draftType = 'draft-header'
                            else if (type === 'footer')
                                draftType = 'draft-footer'
                            else draftType = 'draft-generic'

                            setValue('type', draftType)
                            document.querySelector('form')?.requestSubmit()
                            setActionDialogOpen(false)
                            onDialogClose()
                        }}
                    >
                        Save as Draft
                    </Button>

                    {/* Archive */}
                    <Button
                        variant="default"
                        onClick={() => {
                            let archiveType = ''

                            if (type === 'header')
                                archiveType = 'archived-header'
                            else if (type === 'footer')
                                archiveType = 'archived-footer'
                            else archiveType = 'archived-generic'

                            setValue('type', archiveType)
                            document.querySelector('form')?.requestSubmit()
                            setActionDialogOpen(false)
                            onDialogClose()
                        }}
                    >
                        Archive
                    </Button>

                    <Button
                        variant="default"
                        onClick={() => setActionDialogOpen(false)}
                    >
                        Cancel
                    </Button>
                </div>
            </Dialog>
        </>
    )
}

export default TemplateForm
