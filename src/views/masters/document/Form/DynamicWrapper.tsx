/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-case-declarations */
import { Container, DoubleSidedImage } from '@/components/shared'
import {
    Avatar,
    Button,
    Card,
    Checkbox,
    Form,
    FormItem,
    Input,
    Select,
    Upload,
} from '@/components/ui'
import { useForm, Controller } from 'react-hook-form'
import BottomPanel from '@/components/form/bottomPanel'
import { useSessionUser } from '@/store/authStore'
import { useParams } from 'react-router'
import { useFormSubmit } from '@/utils/hoc/useFormSubmit'
import { useEntityMutations } from '@/utils/hooks/useEntityMutations'
import { apiDataEntry } from '@/services/ClausesService'
import endpointConfig from '@/configs/endpoint.config'
import { useDocumentDetail } from '../List/hooks/useDetail'

// const useDynamicOptions = (config: any) => {
//     const [options, setOptions] = useState<any[]>([])
//     const [isLoading, setLoading] = useState(false)

//     useEffect(() => {
//         if (!config?.dynamic || !config?.table || !config?.field) return

//         const fetchOptions = async () => {
//             setLoading(true)
//             try {
//                 const res = await axios.get(
//                     `${import.meta.env.VITE_API_URL}/api/${config.table}`,
//                 )
//                 const rows = Array.isArray(res.data?.data) ? res.data.data : []
//                 const extracted = rows
//                     .map((item: any) => item[config.field])
//                     .filter((v: any) => v !== null && v !== undefined)

//                 setOptions(extracted)
//             } catch (err) {
//                 console.error('Dynamic dropdown fetch failed:', err)
//                 setOptions([])
//             } finally {
//                 setLoading(false)
//             }
//         }

//         fetchOptions()
//     }, [config?.dynamic, config?.table, config?.field])

//     return { options, isLoading }
// }

const DynamicFormWrapper = () => {
    const readOnly = false
    const { id } = useParams<{ id: string }>()

    const { document, isLoading } = useDocumentDetail(id)

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {},
    })

    const { lab } = useSessionUser((state) => state.user)

    const { save } = useEntityMutations<any>({
        apiCreate: apiDataEntry,
    })

    const { handleSubmit: onsubmit, isSubmitting } = useFormSubmit<any>({
        apiCall: (values) => {
            const formData = new FormData()

            formData.append('document_id', id as string)

            Object.entries(values).forEach(([key, value]: any) => {
                if (value instanceof File) {
                    formData.append(`fields_entry[${key}]`, value)
                } else if (Array.isArray(value)) {
                    value.forEach((v) =>
                        formData.append(`fields_entry[${key}][]`, v),
                    )
                } else {
                    formData.append(`fields_entry[${key}]`, value)
                }
            })

            return save(formData)
        },
        navigateTo: endpointConfig.master.document.list,
    })

    const beforeUpload = (files: FileList | null) => {
        let valid: string | boolean = true

        const maxSizeMB = 10

        if (files) {
            for (const file of files) {
                if (file.size > maxSizeMB * 1024 * 1024) {
                    valid = `File size must be under ${maxSizeMB}MB`
                }
            }
        }

        return valid
    }
    const isImage = (file: File) => file.type.startsWith('image/')

    const renderField = (name: string, config: any) => {
        const label = config.label || name
        const fieldName = name.replace(/\s+/g, '_')

        const finalOptions =
            typeof config.options === 'string'
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
                                        isDisabled={readOnly || isLoading}
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
                                        isDisabled={readOnly || isLoading}
                                        options={finalOptions.map((o: any) => ({
                                            value: o,
                                            label: o,
                                        }))}
                                        placeholder={`Select ${label}`}
                                        value={(field.value || []).map(
                                            (v: any) =>
                                                typeof v === 'string'
                                                    ? { value: v, label: v }
                                                    : v,
                                        )}
                                        onChange={(selected: any) => {
                                            // selected is an array of {value, label}
                                            const values =
                                                selected?.map(
                                                    (item: any) => item.value,
                                                ) || []
                                            field.onChange(values)
                                        }}
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
                                const file = field.value as File | undefined
                                const previewUrl =
                                    file && isImage(file)
                                        ? URL.createObjectURL(file)
                                        : null

                                return (
                                    <>
                                        <div className="flex items-center justify-center">
                                            {file ? (
                                                isImage(file) ? (
                                                    <Avatar
                                                        size={100}
                                                        src={
                                                            previewUrl as string
                                                        }
                                                        className="border-4 border-white shadow-lg"
                                                    />
                                                ) : (
                                                    <div className="flex flex-col items-center text-gray-500">
                                                        <span className="text-sm font-medium">
                                                            {file.name}
                                                        </span>
                                                        <span className="text-xs">
                                                            {file.type ||
                                                                'Unknown type'}
                                                        </span>
                                                    </div>
                                                )
                                            ) : (
                                                <DoubleSidedImage
                                                    src="/img/others/upload.png"
                                                    darkModeSrc="/img/others/upload-dark.png"
                                                    alt="Upload document"
                                                />
                                            )}
                                        </div>

                                        <Upload
                                            showList={false}
                                            uploadLimit={1}
                                            beforeUpload={beforeUpload}
                                            onChange={(files) => {
                                                if (files.length > 0) {
                                                    field.onChange(files[0]) // ✅ File object
                                                }
                                            }}
                                        >
                                            <Button
                                                variant="solid"
                                                className="mt-4"
                                                type="button"
                                            >
                                                Upload Document
                                            </Button>
                                        </Upload>
                                    </>
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
                                    Document Name : {document?.name}
                                </h4>
                                <p className="text-sm text-gray-600">
                                    Document No : {document?.number}
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {document?.mode === 'create' ? (
                                    Object.entries(document?.form_fields).map(
                                        ([name, config]) => (
                                            <div key={name}>
                                                {renderField(name, config)}
                                            </div>
                                        ),
                                    )
                                ) : (
                                    <div key={document?.name}>
                                        {renderField('document', {
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
