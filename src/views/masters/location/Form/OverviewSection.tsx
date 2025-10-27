import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { Controller } from 'react-hook-form'
import { FormSectionBaseProps } from '@/@types/location'
import { Select } from '@/components/ui'
import { useState, useMemo } from 'react'
import useZoneList from '../../zone/List/hooks/useList'
import useClusterList from '../../cluster/List/hooks/useList'

type OverviewSectionProps = FormSectionBaseProps

const OverviewSection = ({
    control,
    errors,
    readOnly,
}: OverviewSectionProps) => {
    const { zoneList } = useZoneList()
    const [selectedZone, setSelectedZone] = useState<string>('')
    const { clusterList } = useClusterList(selectedZone)

    // zone list
    const zoneOptions = zoneList.map((zone) => ({
        label: zone.zone_name,
        value: zone.zone_name,
    }))

    const filteredClusters = useMemo(() => {
        if (!selectedZone) return []
        return clusterList.filter(
            (cluster) => cluster.zone_name === selectedZone,
        )
    }, [selectedZone, clusterList])

    // cluster options based on selected zone
    const clusterOptions = filteredClusters.map((cluster) => ({
        label: cluster.cluster_name,
        value: cluster.cluster_name,
    }))

    return (
        <Card>
            <h4 className="mb-6">Overview</h4>
            <div className="grid md:grid-cols-2 gap-4">
                {/* Zone Select */}
                <FormItem
                    label="Zone"
                    invalid={Boolean(errors.zone_name)}
                    errorMessage={errors.zone_name?.message}
                >
                    <Controller
                        name="zone_name"
                        control={control}
                        render={({ field }) => (
                            <Select
                                placeholder="Select Zone"
                                options={zoneOptions}
                                value={
                                    zoneOptions.find(
                                        (o) => o.value === field.value,
                                    ) || null
                                }
                                isDisabled={readOnly}
                                onChange={(selected) => {
                                    const value = selected ? selected.value : ''
                                    field.onChange(value)
                                    setSelectedZone(value)
                                }}
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label="Cluster"
                    invalid={Boolean(errors.cluster_name)}
                    errorMessage={errors.cluster_name?.message}
                >
                    <Controller
                        name="cluster_name"
                        control={control}
                        render={({ field }) => (
                            <Select
                                placeholder={
                                    selectedZone
                                        ? 'Select Cluster'
                                        : 'Select Zone first'
                                }
                                options={clusterOptions}
                                value={
                                    clusterOptions.find(
                                        (o) => o.value === field.value,
                                    ) || null
                                }
                                isDisabled={readOnly || !selectedZone}
                                onChange={(selected) =>
                                    field.onChange(
                                        selected ? selected.value : '',
                                    )
                                }
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Name"
                    invalid={Boolean(errors.location_name)}
                    errorMessage={errors.location_name?.message}
                >
                    <Controller
                        name="location_name"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                readOnly={readOnly}
                                placeholder="First Name"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
            </div>
        </Card>
    )
}

export default OverviewSection
