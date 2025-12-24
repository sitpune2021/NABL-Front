/* eslint-disable @typescript-eslint/no-explicit-any */
import { Container } from '@/components/shared'
import { Card, Checkbox, Form, FormItem, Input, Select } from '@/components/ui'
import { useForm, Controller } from 'react-hook-form'
import { useEffect, useState } from 'react'
import axios from 'axios'
import BottomPanel from '@/components/form/bottomPanel'
import { useSessionUser } from '@/store/authStore'
import { useParams } from 'react-router'
import { useFormSubmit } from '@/utils/hoc/useFormSubmit'
import { useEntityMutations } from '@/utils/hooks/useEntityMutations'
import { apiDataEntry } from '@/services/ClausesService'
import endpointConfig from '@/configs/endpoint.config'

const useDynamicOptions = (config: any) => {
    const [options, setOptions] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!config?.dynamic || !config?.table || !config?.field) return

        const fetchOptions = async () => {
            setLoading(true)
            try {
                const res = await axios.get(
                    `http://192.168.1.33:8000/api/${config.table}`,
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
    const { id } = useParams()

    const { lab } = useSessionUser((state) => state.user)

    const { save } = useEntityMutations<any>({
        apiCreate: apiDataEntry,
    })

    const { handleSubmit: onsubmit, isSubmitting } = useFormSubmit<any>({
        apiCall: (values) =>
            save({
                document_id: id,
                fields_entry: values, // form values go here
            }),
        navigateTo: endpointConfig.master.document.list,
    })

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
                                        min={config.min}
                                        max={config.max}
                                    />
                                )

                            case 'datetime':
                            case 'date':
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

                            case 'radio':
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

                            case 'upload':
                                return (
                                    <Input
                                        type="file"
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
            onSubmit={handleSubmit(onsubmit)}
        >
            <Container>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex flex-col flex-auto gap-4">
                        <Card>
                            <div className="mb-4">
                                <h4 className="text-xl font-semibold">
                                    Document Name : {documentData.name}
                                </h4>
                                <p className="text-sm text-gray-600">
                                    Document No : {documentData.number}
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {documentData.mode === 'create' ? (
                                    Object.entries(
                                        documentData.form_fields,
                                    ).map(([name, config]) => (
                                        <div key={name}>
                                            {renderField(name, config)}
                                        </div>
                                    ))
                                ) : (
                                    <div key={documentData.name}>
                                        {renderField(documentData.name, {
                                            type: 'upload',
                                        })}
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>
                </div>
            </Container>
            {lab ? (
                <BottomPanel
                    isView={false}
                    isSubmitting={isSubmitting}
                    isEdit={false}
                    onDiscard={() => {}}
                />
            ) : null}
        </Form>
    )
}

export default DynamicFormWrapper
