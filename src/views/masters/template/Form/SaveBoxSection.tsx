import { memo } from 'react'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { Controller, useFormContext } from 'react-hook-form'
import { Button, Dialog } from '@/components/ui'
import { TemplateFormSchema } from '@/schemas/template.schema'

type SaveBoxSectionProps = {
    readOnly?: boolean
    loading?: boolean
    isEdit: boolean
    dialogIsOpen: boolean
    onDialogClose: () => void
    onSubmit: () => void
    isSubmiting: boolean
}

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
    } = useFormContext<TemplateFormSchema>()

    const submitWithStatus = (status: 'draft' | 'published') => {
        setValue('status', status, { shouldDirty: true })
        onSubmit()
    }

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
                                <select
                                    {...field}
                                    className="border rounded-md px-3 py-2 w-full"
                                >
                                    <option value="">Select</option>
                                    <option value="minor">Minor</option>
                                    <option value="major">Major</option>
                                </select>
                            )}
                        />
                    </FormItem>

                    <FormItem
                        label="Message"
                        invalid={!!errors.message}
                        errorMessage={errors.message?.message}
                    >
                        <Input
                            placeholder="Enter Message"
                            disabled={readOnly || loading}
                            {...register('message')}
                        />
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
                            loading={isSubmiting}
                            onClick={() => submitWithStatus('published')}
                        >
                            Save
                        </Button>

                        <Button
                            variant="solid"
                            loading={isSubmiting}
                            onClick={() => submitWithStatus('draft')}
                        >
                            Save as Draft
                        </Button>
                    </>
                )}

                {isEdit && (
                    <Button
                        variant="solid"
                        loading={isSubmiting}
                        onClick={onSubmit}
                    >
                        Update
                    </Button>
                )}
            </div>
        </Dialog>
    )
}

export default memo(SaveBoxSection)
