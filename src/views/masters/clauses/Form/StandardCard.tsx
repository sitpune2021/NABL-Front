/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller } from 'react-hook-form'
import { Card, Checkbox, FormItem, Input } from '@/components/ui'
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
    const path = `${baseName}.${index}`
    const current = watchedStandards?.[index]

    // Helper function to safely access nested errors via dot-path
    const getError = (fieldPath: string) => {
        return fieldPath
            .split('.')
            .reduce((acc: any, key) => acc?.[key], errors)
    }

    return (
        <Card key={standard.id} className="mt-3">
            <FormItem
                label="Clause Title"
                invalid={Boolean(getError(`${path}.title`))}
                errorMessage={getError(`${path}.title`)?.message}
            >
                <Controller
                    name={`${path}.title`}
                    control={control}
                    defaultValue=""
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
                invalid={Boolean(getError(`${path}.message`))}
                errorMessage={getError(`${path}.message`)?.message}
            >
                <Controller
                    name={`${path}.message`}
                    control={control}
                    defaultValue=""
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

            <div className="flex gap-6 mb-4">
                <FormItem label="Note">
                    <Controller
                        name={`${path}.note`}
                        control={control}
                        defaultValue={false}
                        render={({ field }) => (
                            <Checkbox
                                checked={field.value || false}
                                disabled={readOnly}
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                <FormItem label="Child">
                    <Controller
                        name={`${path}.isChild`}
                        control={control}
                        defaultValue={false}
                        render={({ field }) => (
                            <Checkbox
                                checked={field.value || false}
                                disabled={readOnly}
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                <FormItem label="Count">
                    <Controller
                        name={`${path}.count`}
                        control={control}
                        render={({ field }) => (
                            <Input
                                size="sm"
                                readOnly={readOnly}
                                value={field.value}
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
                    name={`${path}.children`}
                    errors={errors}
                    readOnly={readOnly}
                />
            )}
        </Card>
    )
}

export default StandardCard
