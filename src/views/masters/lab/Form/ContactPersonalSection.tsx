import Card from '@/components/ui/Card'
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
    }, [emailFields.length, phoneFields.length])

    return (
        <Card>
            <h4 className="mb-6">Contact Person</h4>
            <div className="grid md:grid-cols-1 gap-4">
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
                {/* Emails */}
                <div className="flex items-center justify-between gap-2">
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

                {emailFields.map((field, index) => (
                    <FormItem
                        key={field.id}
                        invalid={Boolean(errors.emails?.[index]?.value)}
                        errorMessage={errors.emails?.[index]?.value?.message}
                    >
                        <Controller
                            name={`emails.${index}.value`}
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    placeholder={`Email ${index + 1}`}
                                    readOnly={readOnly}
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
                    </FormItem>
                ))}

                {/* Phones */}
                <div className="flex items-center justify-between gap-2">
                    <label className="form-label">Phones</label>
                    {!readOnly && (
                        <Button
                            size="xs"
                            type="button"
                            icon={<HiPlus />}
                            onClick={() => appendPhone({ value: '' })}
                        />
                    )}
                </div>

                {phoneFields.map((field, index) => (
                    <FormItem
                        key={field.id}
                        invalid={Boolean(errors.phones?.[index]?.value)}
                        errorMessage={errors.phones?.[index]?.value?.message}
                    >
                        <Controller
                            name={`phones.${index}.value`}
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    placeholder={`Phone ${index + 1}`}
                                    readOnly={readOnly}
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
                    </FormItem>
                ))}
            </div>
        </Card>
    )
}

export default ContactPersonalSection
