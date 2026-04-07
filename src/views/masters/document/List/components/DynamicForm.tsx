/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { FormItem } from '@/components/ui/Form'
import { Controller, useFormContext } from 'react-hook-form'
import DatePicker from '@/components/ui/DatePicker'
import { FormFieldConfig } from '@/@types/document'
import { Input, Select, Checkbox } from '@/components/ui'
import TimeInput from '@/components/ui/TimeInput'
import { DocumentFormSchema } from '@/schemas/document.schema'
import { wrapWithStyle } from '@/utils/styleWrapper'
import MultiSelect from '@/components/ui/MultiSelect'

interface DynamicFormProps {
    fields: FormFieldConfig[]
    readOnly?: boolean
    extraProps?: any
}

const DynamicForm: React.FC<DynamicFormProps> = ({
    fields,
    readOnly,
    extraProps,
}) => {
    const {
        getValues,
        control,
        formState: { errors },
    }: any = useFormContext<DocumentFormSchema>()

    const values = getValues()
    return fields.map((fieldConfig) => {
        const {
            name,
            label,
            type,
            placeholder,
            options,
            condition,
            customRender,
            onChange,
            minDate,
            defaultValue,
        } = fieldConfig

        if (condition && !condition(values)) return null

        return (
            <FormItem
                key={name}
                label={label}
                invalid={!!errors[name]}
                errorMessage={errors[name]?.message}
            >
                <Controller
                    name={name as any}
                    control={control}
                    defaultValue={defaultValue || ''}
                    render={({ field }) => {
                        if (customRender)
                            return customRender(field, values, extraProps)

                        switch (type) {
                            case 'text':
                            case 'number':
                                return (
                                    <Input
                                        type={type}
                                        placeholder={placeholder}
                                        disabled={
                                            readOnly || fieldConfig.readOnly
                                        }
                                        readOnly={
                                            readOnly || fieldConfig.readOnly
                                        }
                                        onWheel={(e) =>
                                            (
                                                e.target as HTMLInputElement
                                            ).blur()
                                        }
                                        {...field}
                                    />
                                )

                            case 'select':
                                return (
                                    <Select
                                        {...field}
                                        value={
                                            options?.find(
                                                (o) => o.value === field.value,
                                            ) || null
                                        }
                                        options={options}
                                        isDisabled={readOnly}
                                        onChange={(option) => {
                                            field.onChange(option?.value)
                                            onChange?.(option)
                                        }}
                                    />
                                )

                            case 'multiSelect':
                                return (
                                    <MultiSelect
                                        {...field}
                                        value={field.value || []}
                                        options={options || []}
                                        isDisabled={readOnly}
                                        onValueChange={(ids) =>
                                            field.onChange(ids)
                                        }
                                        onChange={(objs) => {
                                            onChange?.(objs)
                                        }}
                                    />
                                )

                            case 'date':
                                return (
                                    <DatePicker
                                        placeholder={placeholder}
                                        value={
                                            field.value
                                                ? new Date(field.value)
                                                : null
                                        }
                                        openPickerOnClear={true}
                                        minDate={minDate}
                                        disabled={readOnly}
                                        onChange={(date) =>
                                            field.onChange(date?.toISOString())
                                        }
                                    />
                                )

                            case 'time':
                                return (
                                    <TimeInput
                                        value={
                                            field.value
                                                ? new Date(field.value)
                                                : null
                                        }
                                        onChange={(date: Date | null) => {
                                            if (!readOnly) {
                                                field.onChange(
                                                    date
                                                        ? date.toISOString()
                                                        : undefined,
                                                )
                                            }
                                        }}
                                    />
                                )
                            case 'header':
                            case 'footer': {
                                const isHeader = type === 'header'
                                const selectedHtmlState = isHeader
                                    ? extraProps?.selectedHeaderHtml
                                    : extraProps?.selectedFooterHtml
                                const setSelectedHtmlState = isHeader
                                    ? extraProps?.setSelectedHeaderHtml
                                    : extraProps?.setSelectedFooterHtml

                                const selectedOption = options?.find(
                                    (o: any) =>
                                        o.value === field.value?.template_id,
                                )

                                return (
                                    <>
                                        <Select
                                            value={selectedOption || null}
                                            options={options}
                                            placeholder={`-- Select ${label} --`}
                                            isDisabled={readOnly}
                                            onChange={(option: any) => {
                                                field.onChange({
                                                    template_id: option?.value,
                                                    type: option?.type,
                                                    current_version:
                                                        option?.current_version,
                                                })

                                                const html = option?.html || ''

                                                const css = option?.css || ''
                                                setSelectedHtmlState?.(
                                                    html
                                                        ? wrapWithStyle(
                                                              html,
                                                              css,
                                                          )
                                                        : '',
                                                )
                                            }}
                                        />
                                        {field.value && selectedHtmlState && (
                                            <iframe
                                                style={{
                                                    width: '100%',
                                                    height: '150px',
                                                    border: '1px solid #ddd',
                                                    marginTop: '8px',
                                                    borderRadius: '6px',
                                                    background: '#fff',
                                                }}
                                                srcDoc={selectedHtmlState}
                                                title={`${label} Preview`}
                                            />
                                        )}
                                    </>
                                )
                            }
                            case 'checkbox':
                                return (
                                    <Checkbox
                                        disabled={readOnly}
                                        checked={!!field.value}
                                        onChange={field.onChange}
                                    />
                                )

                            default:
                                return <div>Unsupported field type</div>
                        }
                    }}
                />
            </FormItem>
        )
    })
}

export default DynamicForm
