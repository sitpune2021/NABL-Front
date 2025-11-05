import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { Controller, useFieldArray } from 'react-hook-form'
import { Button } from '@/components/ui/Button'
import { FormSectionBaseProps } from '@/@types/lab'
import { useEffect } from 'react'
import { HiMinus, HiPlus } from 'react-icons/hi'

const ContactPersonalSection = ({
    control,
    errors,
    readOnly = false,
}: FormSectionBaseProps) => {
    const {
        fields: emailFields,
        append: appendEmail,
        remove: removeEmail,
    } = useFieldArray({
        control,
        name: 'emails',
    })

    const {
        fields: phoneFields,
        append: appendPhone,
        remove: removePhone,
    } = useFieldArray({
        control,
        name: 'phones',
    })

    // ✅ Ensure at least one email and one phone field exist on mount
    useEffect(() => {
        if (emailFields.length === 0) appendEmail({ value: '' })
        if (phoneFields.length === 0) appendPhone({ value: '' })
    }, [emailFields.length, phoneFields.length, appendEmail, appendPhone])

    return (
        <>
            <h4 className="mb-6">Contact Person</h4>
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                        <label className="form-label">Emails</label>
                        {!readOnly && (
                            <Button
                                type="button"
                                size="xs"
                                icon={<HiPlus />}
                                onClick={() => appendEmail({ value: '' })}
                            />
                        )}
                    </div>
                    <div className="space-y-4">
                        {emailFields.map((field, index) => (
                            <FormItem
                                key={field.id}
                                invalid={Boolean(errors.emails?.[index]?.value)}
                                errorMessage={
                                    errors.emails?.[index]?.value?.message
                                }
                            >
                                <div className="flex items-center gap-2">
                                    <Controller
                                        name={`emails.${index}.value`}
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                placeholder={`Email ${index + 1}`}
                                                readOnly={readOnly}
                                                className="flex-1"
                                            />
                                        )}
                                    />
                                    {!readOnly && emailFields.length > 1 && (
                                        <Button
                                            size="xs"
                                            type="button"
                                            icon={<HiMinus />}
                                            onClick={() => removeEmail(index)}
                                        />
                                    )}
                                </div>
                            </FormItem>
                        ))}
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                        <label className="form-label">Phones</label>
                        {!readOnly && (
                            <Button
                                type="button"
                                size="xs"
                                icon={<HiPlus />}
                                onClick={() => appendPhone({ value: '' })}
                            />
                        )}
                    </div>
                    <div className="space-y-4">
                        {phoneFields.map((field, index) => (
                            <FormItem
                                key={field.id}
                                invalid={Boolean(errors.phones?.[index]?.value)}
                                errorMessage={
                                    errors.phones?.[index]?.value?.message
                                }
                            >
                                <div className="flex items-center gap-2">
                                    <Controller
                                        name={`phones.${index}.value`}
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                placeholder={`Phone ${index + 1}`}
                                                readOnly={readOnly}
                                                className="flex-1"
                                            />
                                        )}
                                    />
                                    {!readOnly && phoneFields.length > 1 && (
                                        <Button
                                            size="xs"
                                            type="button"
                                            icon={<HiMinus />}
                                            onClick={() => removePhone(index)}
                                        />
                                    )}
                                </div>
                            </FormItem>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-6">
                <FormItem
                    label="Address"
                    invalid={Boolean(errors.address)}
                    errorMessage={errors.address?.message}
                >
                    <Controller
                        name="address"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                textArea
                                placeholder="Address"
                                readOnly={readOnly}
                            />
                        )}
                    />
                </FormItem>
            </div>
        </>
    )
}

export default ContactPersonalSection
