import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { Controller, useFormContext } from 'react-hook-form'

import { useZoneList } from '../../zone/List/hooks/useList'
import { Select } from '@/components/ui'
import { ClusterFormSchema } from '@/schemas/cluster.schema'
import { useMemo } from 'react'

type OverviewSectionProps = {
    readOnly?: boolean
    loading?: boolean
}

const OverviewSection = ({ readOnly, loading }: OverviewSectionProps) => {
    const {
        register,
        control,
        setValue,
        getValues,
        formState: { errors },
    } = useFormContext<ClusterFormSchema>()

    const { zoneList } = useZoneList()

    const options = useMemo(
        () =>
            zoneList.map((zone) => ({
                value: zone.id,
                label: zone.name.toUpperCase(),
                identifier: zone.identifier,
            })),
        [zoneList],
    )

    return (
        <Card>
            <h4 className="mb-6">Cluster</h4>

            <div className="grid md:grid-cols-2 gap-4">
                {/* Zone Field */}
                <FormItem
                    label="Zone"
                    invalid={!!errors.zone_id}
                    errorMessage={errors.zone_id?.message}
                >
                    <Controller
                        name="zone_id"
                        control={control}
                        render={({ field }) => (
                            <Select
                                options={options}
                                placeholder="Select Zone"
                                value={options.find(
                                    (opt) => opt.value === field.value,
                                )}
                                isDisabled={readOnly || loading}
                                onChange={(option) => {
                                    field.onChange(option?.value)

                                    if (!option) return

                                    const currentIdentifier =
                                        getValues('identifier') || ''
                                    const suffix = currentIdentifier
                                        .split('-')
                                        .slice(1)
                                        .join('-')

                                    setValue(
                                        'identifier',
                                        suffix
                                            ? `${option.identifier}-${suffix}`
                                            : `${option.identifier}-`,
                                        {
                                            shouldDirty: true,
                                            shouldValidate: true,
                                        },
                                    )
                                }}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Name"
                    invalid={Boolean(errors.name)}
                    errorMessage={errors.name?.message}
                >
                    <Input
                        type="text"
                        placeholder="Cluster Name"
                        disabled={readOnly || loading}
                        {...register('name')}
                    />
                </FormItem>

                <FormItem
                    label="Prefix"
                    invalid={!!errors.identifier}
                    errorMessage={errors.identifier?.message}
                >
                    <Input
                        type="text"
                        placeholder="Prefix"
                        disabled={readOnly || loading}
                        {...register('identifier')}
                    />
                </FormItem>
            </div>
        </Card>
    )
}

export default OverviewSection
