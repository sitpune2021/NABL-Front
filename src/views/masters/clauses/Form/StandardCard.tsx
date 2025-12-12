/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo, useCallback, useMemo } from 'react'
import { Controller } from 'react-hook-form'
import { Card, Checkbox, FormItem, Input, Select } from '@/components/ui'
import StandardRecursiveSection from './StandardRecursiveSection'

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
    baseName = 'standards',
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

    const toRoman = (num: number): string => {
        const romans: [number, string][] = [
            [1000, 'M'],
            [900, 'CM'],
            [500, 'D'],
            [400, 'CD'],
            [100, 'C'],
            [90, 'XC'],
            [50, 'L'],
            [40, 'XL'],
            [10, 'X'],
            [9, 'IX'],
            [5, 'V'],
            [4, 'IV'],
            [1, 'I'],
        ]
        let result = ''
        for (const [value, symbol] of romans) {
            while (num >= value) {
                result += symbol
                num -= value
            }
        }
        return result
    }

    const getNumberingValue = (type: string, index: number, watched: any[]) => {
        if (!type || type === 'none') return ''

        const count =
            watched
                ?.slice(0, index)
                ?.filter((x: any) => x?.numberingType === type)?.length ?? 0

        const number = count + 1

        switch (type) {
            case 'numerical':
                return `${number}`

            case 'alphabetical-lower':
                return `${String.fromCharCode(97 + count)}`

            case 'alphabetical-upper':
                return String.fromCharCode(65 + count)

            case 'roman-lower':
                return `${toRoman(number).toLowerCase()}`

            case 'roman-upper':
                return `${toRoman(number)}`

            case 'dot':
                return '•'

            default:
                return ''
        }
    }

    const numberingValue = useMemo(() => {
        return getNumberingValue(
            current?.numberingType,
            index,
            watchedStandards,
        )
    }, [current?.numberingType, watchedStandards, index])

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

            <h5>{numberedTitle}</h5>

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
                        name={`${path}.numberingType`}
                        control={control}
                        defaultValue={standard.numberingType || 'none'}
                        render={({ field }) => (
                            <Select
                                {...field}
                                value={numberingOptions.filter(
                                    (op) => op.value === field.value,
                                )}
                                options={numberingOptions}
                                placeholder="Select Numbering"
                                onChange={(opt) => field.onChange(opt?.value)}
                            />
                        )}
                    />
                </FormItem>

                <FormItem label="Has Children">
                    <Controller
                        name={`${path}.isChild`}
                        control={control}
                        defaultValue={standard.isChild ?? false}
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
                        name={`${path}.count`}
                        control={control}
                        defaultValue={standard.count ?? 0}
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

            {current?.children?.length > 0 && (
                <StandardRecursiveSection
                    control={control}
                    name={`${path}.children` as any}
                    errors={errors}
                    readOnly={readOnly}
                    depth={(standard.depth || 0) + 1}
                />
            )}
        </Card>
    )
}

export default memo(StandardCard)
