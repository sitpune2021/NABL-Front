import { memo } from 'react'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { Controller, useFormContext } from 'react-hook-form'
import { Button, Dialog, Select, Checkbox } from '@/components/ui'
import { TemplateFormSchema } from '@/schemas/template.schema'
import { SaveBoxSectionProps } from '@/@types/template'

const changeTypeOptions = [
    { label: 'Minor', value: 'minor' },
    { label: 'Major', value: 'major' },
]

const SaveBoxSection = ({
    readOnly,
    loading,
    isEdit,
    dialogIsOpen,
    onDialogClose,
    onSubmit,
    isSubmiting,
}: SaveBoxSectionProps) => {
    const {
        register,
        formState: { errors },
        control,
        setValue,
        watch,
        handleSubmit,
    } = useFormContext<TemplateFormSchema>()

    const submitWithStatus = (status: 'draft' | 'published') => {
        setValue('status', status, { shouldDirty: true })
        handleSubmit(onSubmit)()
    }

    const changeType = watch('change_type')

    return (
        <Dialog isOpen={dialogIsOpen} closable={false}>
            <h5 className="mb-4">
                {isEdit ? 'Update Template' : 'Create Template'}
            </h5>

            <Input type="hidden" {...register('type')} />
            <Input type="hidden" {...register('status')} />

            <FormItem
                label="Name"
                invalid={!!errors.name}
                errorMessage={errors.name?.message}
            >
                <Input
                    placeholder="Enter Name"
                    disabled={readOnly || loading}
                    {...register('name')}
                />
            </FormItem>

            {isEdit && (
                <>
                    <FormItem
                        label="Change Type"
                        invalid={!!errors.change_type}
                        errorMessage={errors.change_type?.message}
                    >
                        <Controller
                            name="change_type"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    options={changeTypeOptions}
                                    value={changeTypeOptions.find(
                                        (o) => o.value === field.value,
                                    )}
                                    onChange={(option) =>
                                        field.onChange(option?.value)
                                    }
                                />
                            )}
                        />
                    </FormItem>

                    {changeType === 'minor' && (
                        <Controller
                            name="apply_all_documents"
                            control={control}
                            render={({ field }) => (
                                <Checkbox
                                    checked={!!field.value}
                                    onChange={(checked) =>
                                        field.onChange(checked)
                                    }
                                >
                                    Forcefully apply for all documents ?
                                </Checkbox>
                            )}
                        />
                    )}

                    {changeType === 'major' && (
                        <div className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-600">
                            This template will be applied at document level.
                        </div>
                    )}

                    <FormItem
                        label="Message"
                        invalid={!!errors.message}
                        errorMessage={errors.message?.message}
                    >
                        <Input {...register('message')} />
                    </FormItem>
                </>
            )}

            <div className="flex justify-end mt-6 gap-2">
                <Button variant="plain" type="button" onClick={onDialogClose}>
                    Cancel
                </Button>

                {!isEdit && (
                    <>
                        <Button
                            variant="solid"
                            disabled={isSubmiting}
                            onClick={() => submitWithStatus('published')}
                        >
                            Save
                        </Button>

                        <Button
                            variant="solid"
                            disabled={isSubmiting}
                            onClick={() => submitWithStatus('draft')}
                        >
                            Save as Draft
                        </Button>
                    </>
                )}

                {isEdit && (
                    <Button
                        variant="solid"
                        disabled={isSubmiting}
                        onClick={handleSubmit(onSubmit)}
                    >
                        Update
                    </Button>
                )}
            </div>
        </Dialog>
    )
}

export default memo(SaveBoxSection)
