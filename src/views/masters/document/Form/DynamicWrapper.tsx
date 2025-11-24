/* eslint-disable @typescript-eslint/no-explicit-any */
import { Container } from '@/components/shared'
import { Card, Checkbox, Form, FormItem, Input, Select } from '@/components/ui'
import { useForm, Controller } from 'react-hook-form'

const DynamicFormWrapper = ({
    isDataEntry,
    documentData,
    readOnly = false,
}: any) => {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm()

    const onSubmit = (data: any) => {
        console.log(data)
    }

    if (!isDataEntry) return null

    const renderField = (label: string, config: any) => {
        switch (config.type) {
            // Text input
            case 'text':
                return (
                    <FormItem label={label} invalid={Boolean(errors[label])}>
                        <Controller
                            name={label}
                            control={control}
                            rules={{
                                pattern:
                                    config.validation === 'alphabet'
                                        ? /^[A-Za-z]+$/
                                        : undefined,
                            }}
                            render={({ field }) => (
                                <Input
                                    placeholder={`Enter ${label}`}
                                    readOnly={readOnly}
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                )

            // Textarea
            case 'textarea':
                return (
                    <FormItem label={label} invalid={Boolean(errors[label])}>
                        <Controller
                            name={label}
                            control={control}
                            render={({ field }) => (
                                <Input
                                    textArea
                                    placeholder={`Enter ${label}`}
                                    rows={config.rows || 4}
                                    readOnly={readOnly}
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                )

            // Number input
            case 'number':
                return (
                    <FormItem label={label} invalid={Boolean(errors[label])}>
                        <Controller
                            name={label}
                            control={control}
                            rules={{ min: config.min, max: config.max }}
                            render={({ field }) => (
                                <Input
                                    type="number"
                                    placeholder={`Enter ${label}`}
                                    readOnly={readOnly}
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                )

            // Checkbox group
            case 'checkbox':
                return (
                    <FormItem label={label} invalid={Boolean(errors[label])}>
                        <Controller
                            name={label}
                            control={control}
                            render={({ field }) => (
                                <Checkbox.Group
                                    className="flex mt-4"
                                    value={field.value || []}
                                    onChange={field.onChange}
                                >
                                    {(config.options || []).map(
                                        (option: any, idx: number) => (
                                            <Checkbox
                                                key={option + idx}
                                                name={field.name}
                                                value={option}
                                                className="justify-between flex-row-reverse heading-text"
                                            >
                                                {option}
                                            </Checkbox>
                                        ),
                                    )}
                                </Checkbox.Group>
                            )}
                        />
                    </FormItem>
                )

            // Radio buttons
            case 'radio':
                return (
                    <FormItem label={label} invalid={Boolean(errors[label])}>
                        {/* <Controller
                            name={label}
                            control={control}
                            render={({ field }) => (
                                <Radio.Group
                                    value={field.value}
                                    onChange={(e) => field.onChange(e.target.value)}
                                >
                                    {(config.options || []).map((option: any, idx: number) => (
                                        <Radio key={option + idx} value={option}>
                                            {option}
                                        </Radio>
                                    ))}
                                </Radio.Group>
                            )}
                        /> */}
                    </FormItem>
                )

            // Single select dropdown
            case 'select':
                return (
                    <FormItem label={label} invalid={Boolean(errors[label])}>
                        <Controller
                            name={label}
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    options={(config.options || []).map(
                                        (o: any) => ({
                                            value: o,
                                            label: o,
                                        }),
                                    )}
                                    placeholder={`Select ${label}`}
                                    isDisabled={readOnly}
                                    value={
                                        field.value
                                            ? {
                                                  value: field.value,
                                                  label: field.value,
                                              }
                                            : null
                                    }
                                    onChange={(option) =>
                                        field.onChange(option?.value)
                                    }
                                />
                            )}
                        />
                    </FormItem>
                )

            // Multi-select
            case 'multiselect':
                return (
                    <FormItem label={label} invalid={Boolean(errors[label])}>
                        <Controller
                            name={label}
                            control={control}
                            render={({ field }) => (
                                <Select
                                    isMulti
                                    placeholder={`Select ${label}`}
                                    options={(config.options || []).map(
                                        (o: any) => ({
                                            value: o,
                                            label: o,
                                        }),
                                    )}
                                    value={field.value || []}
                                    isDisabled={readOnly}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                    </FormItem>
                )

            // Date picker
            case 'date':
                return (
                    <FormItem label={label} invalid={Boolean(errors[label])}>
                        {/* <Controller
                            name={label}
                            control={control}
                            render={({ field }) => (
                                <DatePicker
                                    onChange={(date, dateString) => field.onChange(dateString)}
                                    value={field.value ? moment(field.value) : null}
                                    disabled={readOnly}
                                    style={{ width: '100%' }}
                                />
                            )}
                        /> */}
                    </FormItem>
                )

            // Time picker
            case 'time':
                return (
                    <FormItem label={label} invalid={Boolean(errors[label])}>
                        {/* <Controller
                            name={label}
                            control={control}
                            render={({ field }) => (
                                <TimePicker
                                    onChange={(time, timeString) => field.onChange(timeString)}
                                    value={field.value ? moment(field.value, 'HH:mm') : null}
                                    disabled={readOnly}
                                    style={{ width: '100%' }}
                                />
                            )}
                        /> */}
                    </FormItem>
                )

            // DateTime picker
            case 'datetime':
                return (
                    <FormItem label={label} invalid={Boolean(errors[label])}>
                        {/* <Controller
                            name={label}
                            control={control}
                            render={({ field }) => (
                                <DatePicker
                                    showTime
                                    onChange={(date, dateString) => field.onChange(dateString)}
                                    value={field.value ? moment(field.value) : null}
                                    disabled={readOnly}
                                    style={{ width: '100%' }}
                                />
                            )}
                        /> */}
                    </FormItem>
                )

            // Email input
            case 'email':
                return (
                    <FormItem label={label} invalid={Boolean(errors[label])}>
                        <Controller
                            name={label}
                            control={control}
                            rules={{
                                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            }}
                            render={({ field }) => (
                                <Input
                                    placeholder={`Enter ${label}`}
                                    readOnly={readOnly}
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                )

            // URL input
            case 'url':
                return (
                    <FormItem label={label} invalid={Boolean(errors[label])}>
                        <Controller
                            name={label}
                            control={control}
                            rules={{
                                pattern:
                                    /^(https?:\/\/)?([\w-]+)\.([a-z]{2,6})(\/[\w-]*)*\/?$/i,
                            }}
                            render={({ field }) => (
                                <Input
                                    placeholder={`Enter ${label}`}
                                    readOnly={readOnly}
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                )

            // Range / Slider
            case 'range':
                return (
                    <FormItem label={label} invalid={Boolean(errors[label])}>
                        {/* <Controller
                            name={label}
                            control={control}
                            render={({ field }) => (
                                <Slider
                                    min={config.min || 0}
                                    max={config.max || 100}
                                    step={config.step || 1}
                                    value={field.value || 0}
                                    onChange={field.onChange}
                                    disabled={readOnly}
                                />
                            )}
                        /> */}
                    </FormItem>
                )

            default:
                return null
        }
    }

    return (
        <Form
            className="flex w-full h-full"
            containerClassName="flex flex-col w-full justify-between"
            onSubmit={handleSubmit(onSubmit)}
        >
            <Container>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex flex-col flex-auto gap-4">
                        <Card>
                            <h4 className="mb-6">Document Creation</h4>
                            <div className="grid md:grid-cols-2 gap-4">
                                {Object.entries(documentData.settings).map(
                                    ([label, config]) => (
                                        <div
                                            key={label}
                                            style={{ marginBottom: '15px' }}
                                        >
                                            {renderField(label, config)}
                                        </div>
                                    ),
                                )}
                            </div>
                        </Card>
                    </div>
                </div>
            </Container>
            {/* <BottomStickyBar>{children}</BottomStickyBar> */}
        </Form>
    )
}

export default DynamicFormWrapper
