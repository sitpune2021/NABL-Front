/* eslint-disable @typescript-eslint/no-explicit-any */
import { Container } from '@/components/shared'
import { Card, Checkbox, Form, FormItem, Input, Select } from '@/components/ui'
import { useForm, Controller } from 'react-hook-form'
import { useEffect, useState } from 'react'
import axios from 'axios'

const useDynamicOptions = (config: any) => {
    const [options, setOptions] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!config?.dynamic || !config?.table || !config?.field) return

        const fetchOptions = async () => {
            setLoading(true)
            try {
                const res = await axios.get(
                    `http://192.168.1.3:8000/api/${config.table}`,
                )
                const rows = Array.isArray(res.data?.data) ? res.data.data : []
                const extracted = rows
                    .map((item: any) => item[config.field])
                    .filter((v: any) => v !== null && v !== undefined)

                setOptions(extracted)
            } catch (err) {
                console.error('Dynamic dropdown fetch failed:', err)
                setOptions([])
            } finally {
                setLoading(false)
            }
        }

        fetchOptions()
    }, [config?.dynamic, config?.table, config?.field])

    return { options, loading }
}

const DynamicFormWrapper = ({
    isDataEntry,
    documentData,
    readOnly = false,
}: any) => {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: documentData?.defaultValues || {},
    })

    const onSubmit = (data: any) => console.log('FORM DATA:', data)

    if (!isDataEntry) return null

    const renderField = (name: string, config: any) => {
        const label = config.label || name
        const fieldName = name.replace(/\s+/g, '_')

        const { options: dynamicOptions, loading } = useDynamicOptions(config)

        const finalOptions = config.dynamic
            ? dynamicOptions
            : typeof config.options === 'string'
              ? config.options.split(',').map((o: string) => o.trim())
              : config.options || []

        const patternRules =
            config.validation === 'alphabet'
                ? {
                      pattern: {
                          value: /^[A-Za-z]+$/,
                          message: 'Only alphabets allowed',
                      },
                  }
                : config.type === 'email'
                  ? {
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: 'Invalid email',
                        },
                    }
                  : config.type === 'url'
                    ? {
                          pattern: {
                              value: /^(https?:\/\/)?([\w-]+)\.([a-z]{2,6})(\/[\w-]*)*\/?$/i,
                              message: 'Invalid URL',
                          },
                      }
                    : {}

        return (
            <FormItem label={label} invalid={Boolean(errors[fieldName])}>
                <Controller
                    name={fieldName}
                    control={control}
                    rules={{
                        required: config.required
                            ? `${label} is required`
                            : false,
                        min: config.min,
                        max: config.max,
                        ...patternRules,
                    }}
                    render={({ field }) => {
                        switch (config.type) {
                            case 'text':
                                return (
                                    <Input
                                        {...field}
                                        placeholder={`Enter ${label}`}
                                        readOnly={readOnly}
                                    />
                                )

                            case 'textarea':
                                return (
                                    <Input
                                        {...field}
                                        textArea
                                        rows={config.rows || 4}
                                        placeholder={`Enter ${label}`}
                                        readOnly={readOnly}
                                    />
                                )

                            case 'number':
                                return (
                                    <Input
                                        {...field}
                                        type="number"
                                        placeholder={`Enter ${label}`}
                                        readOnly={readOnly}
                                    />
                                )

                            case 'datetime':
                                return (
                                    <Input
                                        type="datetime-local"
                                        value={field.value || ''}
                                        readOnly={readOnly}
                                        onChange={(e) =>
                                            field.onChange(e.target.value)
                                        }
                                    />
                                )

                            case 'checkbox':
                                return (
                                    <Checkbox.Group
                                        className="flex flex-col gap-2 mt-2"
                                        value={field.value || []}
                                        onChange={field.onChange}
                                    >
                                        {finalOptions.map(
                                            (o: any, i: number) => (
                                                <Checkbox key={i} value={o}>
                                                    {o}
                                                </Checkbox>
                                            ),
                                        )}
                                    </Checkbox.Group>
                                )

                            case 'select':
                                return (
                                    <Select
                                        isDisabled={readOnly || loading}
                                        options={finalOptions.map((o: any) => ({
                                            value: o,
                                            label: o,
                                        }))}
                                        placeholder={`Select ${label}`}
                                        value={
                                            field.value
                                                ? {
                                                      label: field.value,
                                                      value: field.value,
                                                  }
                                                : null
                                        }
                                        onChange={(opt) =>
                                            field.onChange(opt?.value)
                                        }
                                    />
                                )

                            case 'multiselect':
                                return (
                                    <Select
                                        isMulti
                                        isDisabled={readOnly || loading}
                                        options={finalOptions.map((o: any) => ({
                                            value: o,
                                            label: o,
                                        }))}
                                        placeholder={`Select ${label}`}
                                        value={field.value || []}
                                        onChange={field.onChange}
                                    />
                                )

                            case 'email':
                            case 'url':
                                return (
                                    <Input
                                        {...field}
                                        placeholder={`Enter ${label}`}
                                        readOnly={readOnly}
                                    />
                                )

                            default:
                                return null
                        }
                    }}
                />

                {errors[fieldName] && (
                    <p className="text-red-500 text-xs mt-1">
                        {errors[fieldName]?.message as string}
                    </p>
                )}
            </FormItem>
        )
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
                            <div className="mb-4">
                                <h4 className="text-xl font-semibold">
                                    Document Name : {documentData.documentName}
                                </h4>
                                <p className="text-sm text-gray-600">
                                    Document No : {documentData.documentNo}
                                </p>
                                <p className="text-sm text-gray-600">
                                    Lab Name : {documentData.labName}
                                </p>
                                <p className="text-sm text-gray-600">
                                    Location : {documentData.location}
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {Object.entries(documentData.settings).map(
                                    ([name, config]) => (
                                        <div key={name}>
                                            {renderField(name, config)}
                                        </div>
                                    ),
                                )}
                            </div>
                        </Card>
                    </div>
                </div>
            </Container>
        </Form>
    )
}

export default DynamicFormWrapper
