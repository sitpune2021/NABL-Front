/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo, useCallback } from 'react'
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

const StandardCard: React.FC<StandardCardProps> = ({
    index,
    standard,
    errors,
    readOnly,
    control,
    watchedStandards,
    baseName = 'standards',
}) => {
    const path = `${baseName}.${index}` as const
    const current = watchedStandards?.[index]

    const getError = useCallback(
        (fieldPath: string) =>
            fieldPath
                .split('.')
                .reduce<
                    Record<string, any> | undefined
                >((acc, key) => acc?.[key], errors),
        [errors],
    )

    const getTitleLabel = (depth: number) => {
        if (depth === 0) return 'Clause Title'
        const repeatSub = 'Sub '.repeat(depth)
        return `${repeatSub}Clause Title`.trim()
    }

    const getNumberedTitle = () => {
        const title = current?.title || 'Untitled'
        const numberingType = current?.numberingType
        if (!numberingType || numberingType === 'none') {
            return title
        }
        // Count previous items with the same numbering type
        const count =
            watchedStandards
                ?.slice(0, index)
                .filter((item: any) => item?.numberingType === numberingType)
                .length || 0
        let prefix = ''
        if (numberingType === 'numerical') {
            prefix = `${count + 1}. `
        } else if (numberingType === 'alphabetical') {
            prefix = `${String.fromCharCode(97 + count)}. ` // a, b, c, ...
        }
        return `${prefix}${title}`
    }

    const options = [
        {
            value: 'none',
            label: 'None',
        },
        {
            value: 'numerical',
            label: 'Numerical',
        },
        {
            value: 'alphabetical',
            label: 'Alphabetical',
        },
    ]

    return (
        <Card key={standard.id} className="mt-3">
            <h5>{getNumberedTitle()}</h5>

            <FormItem
                label={getTitleLabel(standard.depth ?? 0)}
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
                label="Clause Statement"
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
                <FormItem label="Number">
                    <Controller
                        name={`${path}.number`}
                        control={control}
                        defaultValue={standard.number ?? false}
                        render={({ field }) => (
                            <Checkbox
                                checked={!!field.value}
                                disabled={readOnly}
                                onChange={field.onChange}
                            />
                        )}
                    />
                </FormItem>

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
                        defaultValue={standard.numberingType || 'none'} // Changed default to 'none' so numbering starts only when selected
                        render={({ field }) => (
                            <Select
                                {...field}
                                value={options.filter(
                                    (option) => option.value === field.value,
                                )}
                                options={options}
                                placeholder="Select Numbering"
                                onChange={(option) =>
                                    field.onChange(option?.value)
                                }
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
                    name={`${path}.children` as `standards.${number}.children`}
                    errors={errors}
                    readOnly={readOnly}
                />
            )}
        </Card>
    )
}

export default memo(StandardCard)
