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

    const renderField = (label: any, config: any) => {
        switch (config.type) {
            case 'text':
                return (
                    <FormItem
                        label={label}
                        invalid={Boolean(errors[label])}
                        // errorMessage={errors[label]?.message}
                    >
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

            case 'number':
                return (
                    <FormItem
                        label={label}
                        invalid={Boolean(errors[label])}
                        // errorMessage={errors[label]?.message}
                    >
                        <Controller
                            name={label}
                            control={control}
                            rules={{
                                min: config.min,
                                max: config.max,
                            }}
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

            case 'checkbox':
                return (
                    <FormItem
                        label={label}
                        invalid={Boolean(errors[label])}
                        // errorMessage={errors[label]?.message}
                    >
                        <Controller
                            name={label}
                            control={control}
                            render={({ field }) => (
                                <Checkbox.Group
                                    className="flex mt-4"
                                    value={field.value || []} // current selected values
                                    onChange={field.onChange} // updates RHF state automatically
                                >
                                    {config.options.map(
                                        (option: any, index: any) => (
                                            <Checkbox
                                                key={option + index}
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

            case 'select':
                return (
                    <FormItem
                        label={label}
                        invalid={Boolean(errors[label])}
                        // errorMessage={errors[label]?.message}
                    >
                        <Controller
                            name={label}
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    options={config.options.map((o: any) => ({
                                        value: o,
                                        label: o,
                                    }))}
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
