import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import type { CommonProps } from '@/@types/common'
import {
    PrefixConfigFormSchema,
    prefixConfigSchema,
} from '@/schemas/prefixConfig.schema'
import MasterForm from '@/components/form/MasterForm'
import FormSectionLayout from '@/components/layouts/FormSectionLayout'
import TextField from '@/components/form/fields/TextField'
import { Button, FormItem, Input, Select } from '@/components/ui'
import {
    Controller,
    useFieldArray,
    useFormContext,
    useWatch,
} from 'react-hook-form'
import { TbPlus, TbTrash } from 'react-icons/tb'
import { useEffect, useMemo, useState } from 'react'
import { apiGetPrefixConfigMasters } from '@/services/prefixConfigService'
import type {
    PrefixConfigMaster,
    PrefixConfigSegmentRule,
} from '@/@types/prefixConfig'
import type { FieldErrors } from 'react-hook-form'

type Option = {
    label: string
    value: string
}

const typeOptions: Option[] = [
    { label: 'Any', value: 'any' },
    { label: 'Letters only', value: 'letters' },
    { label: 'Numbers only', value: 'numbers' },
    { label: 'Letters and numbers', value: 'alphanumeric' },
]

const caseOptions: Option[] = [
    { label: 'Any case', value: 'any' },
    { label: 'Uppercase', value: 'upper' },
    { label: 'Lowercase', value: 'lower' },
    { label: 'Title case', value: 'title' },
]

const startsWithOptions: Option[] = [
    { label: 'Any', value: 'any' },
    { label: 'Letter first', value: 'letter' },
    { label: 'Number first', value: 'number' },
]

const defaultSegment: PrefixConfigSegmentRule = {
    type: 'letters',
    case: 'any',
    min_length: 1,
    max_length: 3,
    starts_with: 'letter',
}

const getSegmentSample = (segment?: PrefixConfigSegmentRule) => {
    if (!segment) {
        return 'Part'
    }

    const length = Math.max(1, Math.min(segment.max_length || 3, 3))

    if (segment.type === 'numbers') {
        return '123'.slice(0, length)
    }

    if (segment.type === 'alphanumeric') {
        return 'A12'.slice(0, length)
    }

    if (segment.case === 'lower') {
        return 'abc'.slice(0, length)
    }

    if (segment.case === 'title') {
        return 'Abc'.slice(0, length)
    }

    return 'ABC'.slice(0, length)
}

const MasterSelectField = ({ readOnly }: { readOnly: boolean }) => {
    const { control, setValue } = useFormContext<PrefixConfigFormSchema>()
    const [masters, setMasters] = useState<PrefixConfigMaster[]>([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        let mounted = true

        const loadMasters = async () => {
            setIsLoading(true)
            try {
                const response = await apiGetPrefixConfigMasters()

                if (mounted) {
                    setMasters(response.data ?? [])
                }
            } finally {
                if (mounted) {
                    setIsLoading(false)
                }
            }
        }

        loadMasters()

        return () => {
            mounted = false
        }
    }, [])

    const options = useMemo(
        () =>
            masters.map((master) => ({
                label: master.master_name,
                value: master.master_key,
                masterName: master.master_name,
            })),
        [masters],
    )

    return (
        <Controller
            control={control}
            name="master_key"
            render={({ field, fieldState }) => (
                <FormItem
                    label="Master"
                    invalid={!!fieldState.error}
                    errorMessage={fieldState.error?.message}
                >
                    <Select
                        options={options}
                        isDisabled={readOnly}
                        isLoading={isLoading}
                        value={
                            options.find(
                                (option) => option.value === field.value,
                            ) || null
                        }
                        placeholder="Select master"
                        onChange={(option) => {
                            field.onChange(option?.value ?? '')
                            setValue('master_name', option?.masterName ?? '', {
                                shouldDirty: true,
                            })
                        }}
                    />
                </FormItem>
            )}
        />
    )
}

const SelectRuleField = ({
    name,
    label,
    options,
    readOnly,
}: {
    name: string
    label: string
    options: Option[]
    readOnly: boolean
}) => {
    const { control } = useFormContext<PrefixConfigFormSchema>()

    return (
        <Controller
            control={control}
            name={name as never}
            render={({ field, fieldState }) => (
                <FormItem
                    label={label}
                    invalid={!!fieldState.error}
                    errorMessage={fieldState.error?.message}
                >
                    <Select
                        options={options}
                        isDisabled={readOnly}
                        value={
                            options.find(
                                (option) => option.value === field.value,
                            ) || null
                        }
                        onChange={(option) => field.onChange(option?.value)}
                    />
                </FormItem>
            )}
        />
    )
}

const NumberRuleField = ({
    name,
    label,
    readOnly,
}: {
    name: string
    label: string
    readOnly: boolean
}) => {
    const { register, formState } = useFormContext<PrefixConfigFormSchema>()
    const path = name.split('.')
    const error = path.reduce(
        (carry: unknown, key) =>
            carry && typeof carry === 'object'
                ? (carry as Record<string, unknown>)[key]
                : undefined,
        formState.errors as FieldErrors<PrefixConfigFormSchema>,
    ) as { message?: string } | undefined

    return (
        <FormItem label={label} invalid={!!error} errorMessage={error?.message}>
            <Input
                type="number"
                min={1}
                disabled={readOnly}
                {...register(name as never)}
            />
        </FormItem>
    )
}

const SegmentRulesField = ({ readOnly }: { readOnly: boolean }) => {
    const { control, setValue } = useFormContext<PrefixConfigFormSchema>()
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'segments',
    })
    const separator = useWatch({ control, name: 'separator' }) || '-'
    const segments = useWatch({ control, name: 'segments' }) || []

    useEffect(() => {
        setValue('segment_count', fields.length, {
            shouldDirty: false,
            shouldValidate: true,
        })
    }, [fields.length, setValue])

    const patternParts = fields.map((_, index) => ({
        label: `Part ${index + 1}`,
        sample: getSegmentSample(segments[index]),
    }))

    return (
        <div className="md:col-span-2 flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
                <div className="font-semibold heading-text">Segment Rules</div>
                {!readOnly && (
                    <Button
                        type="button"
                        size="sm"
                        icon={<TbPlus />}
                        onClick={() => append(defaultSegment)}
                    >
                        Add part
                    </Button>
                )}
            </div>

            <div className="rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40 p-3">
                <div className="mb-2 text-sm font-medium">Pattern</div>
                <div className="flex flex-wrap items-center gap-2">
                    {patternParts.map((part, index) => (
                        <div
                            key={part.label}
                            className="flex items-center gap-2"
                        >
                            {index > 0 && (
                                <span className="rounded border border-gray-300 dark:border-gray-600 px-2 py-1 font-mono text-xs">
                                    {separator}
                                </span>
                            )}
                            <div className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2">
                                <div className="text-xs text-gray-500">
                                    {part.label}
                                </div>
                                <div className="font-mono font-semibold">
                                    {part.sample}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-3">
                {fields.map((field, index) => (
                    <div
                        key={field.id}
                        className="grid grid-cols-1 md:grid-cols-12 gap-3 rounded-md border border-gray-200 dark:border-gray-700 p-3"
                    >
                        <div className="md:col-span-12 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white text-sm font-semibold">
                                    {index + 1}
                                </span>
                                <span className="font-medium">
                                    Part {index + 1}
                                </span>
                                {index > 0 && (
                                    <span className="text-sm text-gray-500">
                                        after {separator}
                                    </span>
                                )}
                            </div>
                            {!readOnly && fields.length > 1 && (
                                <Button
                                    type="button"
                                    size="xs"
                                    icon={<TbTrash />}
                                    onClick={() => remove(index)}
                                />
                            )}
                        </div>

                        <div className="md:col-span-3">
                            <SelectRuleField
                                name={`segments.${index}.type`}
                                label="Allowed"
                                options={typeOptions}
                                readOnly={readOnly}
                            />
                        </div>

                        <div className="md:col-span-3">
                            <SelectRuleField
                                name={`segments.${index}.case`}
                                label="Case"
                                options={caseOptions}
                                readOnly={readOnly}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <NumberRuleField
                                name={`segments.${index}.min_length`}
                                label="Min"
                                readOnly={readOnly}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <NumberRuleField
                                name={`segments.${index}.max_length`}
                                label="Max"
                                readOnly={readOnly}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <SelectRuleField
                                name={`segments.${index}.starts_with`}
                                label="First"
                                options={startsWithOptions}
                                readOnly={readOnly}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

type PrefixConfigFormProps = {
    onFormSubmit: (values: PrefixConfigFormSchema) => void
    defaultValues: PrefixConfigFormSchema
    readOnly: boolean
} & CommonProps

const PrefixConfigForm = ({
    onFormSubmit,
    defaultValues,
    readOnly = false,
    children,
}: PrefixConfigFormProps) => {
    return (
        <MasterForm
            schema={prefixConfigSchema}
            defaultValues={defaultValues}
            onSubmit={onFormSubmit}
        >
            <Container>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex flex-col gap-4 flex-auto">
                        <FormSectionLayout title="Prefix Config">
                            <MasterSelectField readOnly={readOnly} />

                            <TextField
                                name="separator"
                                label="Separator"
                                placeholder="-"
                                readOnly={readOnly}
                            />

                            <TextField
                                name="value_min_length"
                                label="Value min length"
                                placeholder="1"
                                readOnly={readOnly}
                            />

                            <TextField
                                name="value_max_length"
                                label="Value max length"
                                placeholder="11"
                                readOnly={readOnly}
                            />

                            <TextField
                                name="characters_min_length"
                                label="Characters min length"
                                placeholder="1"
                                readOnly={readOnly}
                            />

                            <TextField
                                name="characters_max_length"
                                label="Characters max length"
                                placeholder="9"
                                readOnly={readOnly}
                            />

                            <SegmentRulesField readOnly={readOnly} />
                        </FormSectionLayout>
                    </div>
                </div>
            </Container>

            <BottomStickyBar>{children}</BottomStickyBar>
        </MasterForm>
    )
}

export default PrefixConfigForm
