import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { Controller, useFormContext } from 'react-hook-form'
import { Select } from '@/components/ui'
import { useZoneList } from '../../zone/List/hooks/useList'
import useClusterList from '../../cluster/List/hooks/useList'
import { useMemo } from 'react'
import { LocationFormSchema } from '@/schemas/location.schema'

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
        clearErrors,
        formState: { errors },
    } = useFormContext<LocationFormSchema>()

    const { zoneList } = useZoneList()
    const { clusterList } = useClusterList()

    const zoneOptions = useMemo(
        () =>
            zoneList.map((zone) => ({
                value: zone.id,
                label: zone.name.toUpperCase(),
                identifier: zone.identifier,
            })),
        [zoneList],
    )

    const selectedZoneId = getValues('zone_id')
    const filteredClusterOptions = useMemo(
        () =>
            clusterList
                .filter((cluster) => cluster.zone_id === selectedZoneId)
                .map((cluster) => ({
                    value: cluster.id,
                    label: cluster.name.toUpperCase(),
                    identifier: cluster.identifier,
                })),
        [clusterList, selectedZoneId],
    )

    return (
        <Card>
            <h4 className="mb-6">Location</h4>
            <div className="grid md:grid-cols-2 gap-4">
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
                                options={zoneOptions}
                                placeholder="Select Zone"
                                value={zoneOptions.find(
                                    (opt) => opt.value === field.value,
                                )}
                                isDisabled={readOnly || loading}
                                onChange={(option) => {
                                    field.onChange(option?.value)
                                    setValue('cluster_id', '', {
                                        shouldDirty: true,
                                        shouldValidate: false,
                                    })
                                    clearErrors('cluster_id')
                                    if (!option) return
                                    setValue(
                                        'identifier',
                                        `${option.identifier}-`,
                                        {
                                            shouldDirty: true,
                                            shouldValidate: false,
                                        },
                                    )
                                }}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Cluster"
                    invalid={!!errors.cluster_id}
                    errorMessage={errors.cluster_id?.message}
                >
                    <Controller
                        name="cluster_id"
                        control={control}
                        render={({ field }) => (
                            <Select
                                options={filteredClusterOptions}
                                placeholder="Select Cluster"
                                value={filteredClusterOptions.find(
                                    (opt) => opt.value === field.value,
                                )}
                                isDisabled={
                                    readOnly || loading || !selectedZoneId
                                }
                                onChange={(option) => {
                                    field.onChange(option?.value)
                                    if (!option) return

                                    const currentIdentifier =
                                        getValues('identifier') || ''

                                    const suffix = currentIdentifier
                                        .split('-')
                                        .slice(2)
                                        .join('-')

                                    setValue(
                                        'identifier',
                                        suffix
                                            ? `${option.identifier}-${suffix}`
                                            : `${option.identifier}-`,
                                        {
                                            shouldDirty: true,
                                            shouldValidate: false,
                                        },
                                    )
                                }}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Name"
                    invalid={!!errors.name}
                    errorMessage={errors.name?.message}
                >
                    <Input
                        type="text"
                        placeholder="Name"
                        disabled={readOnly || loading}
                        {...register('name')}
                    />
                </FormItem>

                <FormItem
                    label="Short Name"
                    invalid={!!errors.short_name}
                    errorMessage={
                        errors.short_name?.message as string | undefined
                    }
                >
                    <Input
                        type="text"
                        placeholder="Short Name"
                        disabled={readOnly || loading}
                        {...register('short_name')}
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
