/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo, useCallback, useMemo } from 'react'
import { Controller } from 'react-hook-form'
import { Card, Checkbox, FormItem, Input, Select } from '@/components/ui'
import StandardRecursiveSection from './StandardRecursiveSection'
import { getNumberingValue } from '@/utils/standard'

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
}: StandardCardProps) => {
    const path = `${baseName}.${index}` as const
    const current = watchedStandards?.[index] || {}

    const getError = useCallback(
        (p: string) => p.split('.').reduce((acc, key) => acc?.[key], errors),
        [errors],
    )

    const titleLabel = useMemo(() => {
        if (!standard.depth) return 'Clause Title'
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
        return `${numberingValue} ${title}`.trim()
    }, [numberingValue, current?.title])

    /** SELECT OPTIONS */
    const numberingOptions = useMemo(
        () => [
            { value: 'none', label: 'None' },
            { value: 'numerical', label: '1, 2, 3' },
            { value: 'alphabetical-lower', label: 'a, b, c' },
            { value: 'alphabetical-upper', label: 'A, B, C' },
            { value: 'roman-lower', label: 'i, ii, iii' },
            { value: 'roman-upper', label: 'I, II, III' },
            { value: 'dot', label: '• Bullet / Dot' },
        ],
        [],
    )

    return (
        <Card key={standard.id} className="mt-3">
            {!readOnly && (
                <Controller
                    name={`${path}.numberingValue`}
                    control={control}
                    defaultValue={standard.numberingValue || ''}
                    render={({ field }) => {
                        if (field.value !== numberingValue) {
                            field.onChange(numberingValue)
                        }
                        return null
                    }}
                />
            )}

            <h5>{numberedTitle}</h5>

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
                <div className="flex flex-wrap gap-6 mb-4">
                    <FormItem label="Note">
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

                    <FormItem label="Numbering Type">
                        <Controller
                            name={`${path}.numbering_type`}
                            control={control}
                            defaultValue={standard.numbering_type || 'none'}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    value={numberingOptions.filter(
                                        (op) => op.value === field.value,
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

                    <FormItem label="Has Children">
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

                    <FormItem label="Child Count">
                        <Controller
                            name={`${path}.children_count`}
                            control={control}
                            defaultValue={standard.children_count ?? 0}
                            render={({ field }) => (
                                <Input
                                    type="number"
                                    size="sm"
                                    min={0}
                                    readOnly={readOnly}
                                    value={field.value ?? 0}
                                    onChange={(e) =>
                                        field.onChange(
                                            parseInt(e.target.value) || 0,
                                        )
                                    }
                                />
                            )}
                        />
                    </FormItem>
                </div>
            )}

            {current?.children?.length > 0 && (
                <StandardRecursiveSection
                    name={`${path}.children` as any}
                    readOnly={readOnly}
                    depth={(standard.depth || 0) + 1}
                />
            )}
        </Card>
    )
}

export default memo(StandardCard)
