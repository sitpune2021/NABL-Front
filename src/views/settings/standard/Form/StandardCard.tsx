/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo, useCallback, useMemo, useState, useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Card, Checkbox, FormItem, Input, Select } from '@/components/ui'
import StandardRecursiveSection from './StandardRecursiveSection'
import { getNumberingValue } from '@/utils/standard'
import { HiChevronDown, HiChevronRight } from 'react-icons/hi'
import { numberingOptions } from '@/constants/standard.constant'

interface StandardCardProps {
    index: number
    standard: any
    errors: any
    readOnly: boolean
    control: any
    watchedStandards: any
    baseName?: string
    depth?: number
}

const StandardCard = ({
    index,
    standard,
    errors,
    readOnly,
    control,
    watchedStandards,
    baseName = 'clauses',
    depth = 0,
}: StandardCardProps) => {
    const { setValue } = useFormContext()
    const [isExpanded, setIsExpanded] = useState(true)
    const path = `${baseName}.${index}` as const
    const current = watchedStandards?.[index] || {}

    const getError = useCallback(
        (p: string) => p.split('.').reduce((acc, key) => acc?.[key], errors),
        [errors],
    )

    const titleLabel = useMemo(() => {
        if (!depth) return 'Clause Title'
        return `${'Sub '.repeat(standard.depth)}Clause Title`
    }, [standard.depth])

    const numberingValue = useMemo(() => {
        return getNumberingValue(
            current?.numbering_type,
            index,
            watchedStandards,
        )
    }, [current?.numbering_type, watchedStandards, index])

    const numberedTitle = useMemo(() => {
        const title = current?.title || ''
        const val = `${numberingValue} ${title}`.trim()
        return val || `Clause ${index + 1}`
    }, [numberingValue, current?.title, index])

    useEffect(() => {
        if (!readOnly) {
            setValue(`${path}.numbering_value`, numberingValue, {
                shouldDirty: false,
                shouldValidate: false,
            })
        }
    }, [numberingValue, path, readOnly, setValue])

    return (
        <Card
            key={standard.id}
            className={`mt-3 ${
                depth > 0 ? '!border-0 !shadow-none !bg-transparent' : ''
            }`}
        >
            <div
                className={`flex items-center justify-between p-3 select-none 
                ${!readOnly ? 'cursor-pointer' : ''} bg-gray-50 dark:bg-gray-800 
                rounded-t-lg`}
                onClick={() => {
                    if (!readOnly) setIsExpanded(!isExpanded)
                }}
            >
                <div className="flex items-center gap-2 overflow-hidden">
                    {!readOnly && (
                        <span className="text-xl text-gray-500">
                            {isExpanded ? (
                                <HiChevronDown />
                            ) : (
                                <HiChevronRight />
                            )}
                        </span>
                    )}
                    <h5 className="m-0 truncate text-sm md:text-base font-semibold">
                        {numberedTitle}
                    </h5>
                </div>

                <div className="flex items-center gap-3">
                    {current?.children?.length > 0 && (
                        <span
                            className="text-xs bg-blue-100 text-blue-700 
                          dark:bg-blue-900 dark:text-blue-300 px-2 py-0.5 rounded-full font-medium"
                        >
                            {current.children.length} Children
                        </span>
                    )}
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 font-mono">
                        LEVEL {depth}
                    </span>
                </div>
            </div>

            <div
                className={`p-4 ${!isExpanded && !readOnly ? 'hidden' : 'block'}`}
            >
                {!readOnly && (
                    <FormItem
                        label={titleLabel}
                        invalid={!!getError(`${path}.title`)}
                        errorMessage={getError(`${path}.title`)?.message}
                    >
                        <Controller
                            name={`${path}.title`}
                            control={control}
                            defaultValue={standard.title || ''}
                            render={({ field }) => (
                                <Input
                                    placeholder="Enter Title"
                                    readOnly={readOnly}
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                )}

                {!readOnly && (
                    <FormItem
                        label="Clause Message"
                        invalid={!!getError(`${path}.message`)}
                        errorMessage={getError(`${path}.message`)?.message}
                    >
                        <Controller
                            name={`${path}.message`}
                            control={control}
                            defaultValue={standard.message || ''}
                            render={({ field }) => (
                                <Input
                                    textArea
                                    rows={3}
                                    placeholder="Write your message..."
                                    readOnly={readOnly}
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                )}
                {readOnly && standard.message}

                {!readOnly && (
                    <div className="mt-4 p-4 bg-gray-50/80 dark:bg-gray-800/60 rounded-lg border border-gray-100 dark:border-gray-700 grid grid-cols-12 gap-4 items-end">
                        <div className="col-span-12 md:col-span-5">
                            <FormItem label="Numbering Type" className="mb-0">
                                <Controller
                                    name={`${path}.numbering_type`}
                                    control={control}
                                    defaultValue={
                                        standard.numbering_type || 'none'
                                    }
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            value={numberingOptions.filter(
                                                (op) =>
                                                    op.value === field.value,
                                            )}
                                            options={numberingOptions}
                                            placeholder="Select Numbering"
                                            onChange={(opt) =>
                                                field.onChange(opt?.value)
                                            }
                                        />
                                    )}
                                />
                            </FormItem>
                        </div>

                        <div className="col-span-12 md:col-span-3 flex items-center gap-6 h-10 px-2">
                            <FormItem
                                label="Note"
                                className="flex flex-row-reverse items-center gap-2 mb-0"
                            >
                                <Controller
                                    name={`${path}.note`}
                                    control={control}
                                    defaultValue={standard.note ?? true}
                                    render={({ field }) => (
                                        <Checkbox
                                            checked={!!field.value}
                                            disabled={readOnly}
                                            onChange={field.onChange}
                                        />
                                    )}
                                />
                            </FormItem>

                            <FormItem
                                label="Has Children"
                                className="flex flex-row-reverse items-center gap-2 mb-0"
                            >
                                <Controller
                                    name={`${path}.is_child`}
                                    control={control}
                                    defaultValue={standard.is_child ?? false}
                                    render={({ field }) => (
                                        <Checkbox
                                            checked={!!field.value}
                                            disabled={readOnly}
                                            onChange={field.onChange}
                                        />
                                    )}
                                />
                            </FormItem>
                        </div>

                        <div className="col-span-12 md:col-span-4">
                            <FormItem label="Child Count" className="mb-0">
                                <Controller
                                    name={`${path}.children_count`}
                                    control={control}
                                    defaultValue={standard.children_count ?? 0}
                                    render={({ field }) => (
                                        <Input
                                            type="number"
                                            min={0}
                                            readOnly={readOnly}
                                            value={field.value ?? 0}
                                            onWheel={(e) =>
                                                (e.target as HTMLElement).blur()
                                            }
                                            onChange={(e) =>
                                                field.onChange(
                                                    parseInt(e.target.value) ||
                                                        0,
                                                )
                                            }
                                        />
                                    )}
                                />
                            </FormItem>
                        </div>
                    </div>
                )}

                {current?.children?.length > 0 && (
                    <StandardRecursiveSection
                        name={`${path}.children` as any}
                        readOnly={readOnly}
                        depth={depth + 1}
                    />
                )}
            </div>
        </Card>
    )
}

export default memo(StandardCard)
