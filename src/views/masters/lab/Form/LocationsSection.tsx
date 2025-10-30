import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import { FormSectionBaseProps } from '@/@types/lab'
import { Button, Select } from '@/components/ui'
import useZoneList from '../../zone/List/hooks/useList'
import useClusterList from '../../cluster/List/hooks/useList'
import useLocationList from '../../location/List/hooks/useList'
import useDepartmentList from '../../department/List/hooks/useList'
import { useEffect } from 'react'

const LocationsSection = ({
    control,
    errors,
    readOnly = false,
}: FormSectionBaseProps) => {
    const { setValue, watch } = useFormContext()
    const { zoneList } = useZoneList()
    const { clusterList } = useClusterList()
    const { locationList } = useLocationList()
    const { departmentList } = useDepartmentList()

    const { fields, append } = useFieldArray({
        control,
        name: 'location',
    })
    const labCode = watch('labCode')

    useEffect(() => {
        fields.forEach((_, index) => {
            setValue(`location.${index}.prefix`, `LOC-${index + 1}-${labCode}`)
        })
    }, [labCode, fields, setValue])

    return (
        <>
            <Card>
                <div className="flex items-center justify-between gap-2">
                    <h4>Locations</h4>
                    {!readOnly && (
                        <Button
                            type="button"
                            size="xs"
                            onClick={() =>
                                append({
                                    zone_name: '',
                                    cluster_name: '',
                                    location_name: '',
                                    department: '',
                                    prefix: `LOC-${fields.length + 1}-${labCode}`,
                                    shortName: '',
                                })
                            }
                        >
                            +
                        </Button>
                    )}
                </div>
                {fields.length === 0 && (
                    <p className="text-sm text-gray-500 italic">
                        No location data available.
                    </p>
                )}
            </Card>

            {fields.map((item, index) => {
                const selectedZone = watch(`location.${index}.zone_name`)
                const selectedCluster = watch(`location.${index}.cluster_name`)
                const selectedLocation = watch(
                    `location.${index}.location_name`,
                )

                const filteredClusters = clusterList.filter(
                    (c) => c.zone_name === selectedZone,
                )

                const filteredLocations = locationList.filter(
                    (l) => l.cluster_name === selectedCluster,
                )

                return (
                    <Card key={item.id || index}>
                        <div className="grid md:grid-cols-3 gap-4 p-3 mb-3">
                            <FormItem
                                label="Zone"
                                invalid={Boolean(
                                    errors.location?.[index]?.zone_name,
                                )}
                                errorMessage={
                                    errors.location?.[index]?.zone_name?.message
                                }
                            >
                                <Controller
                                    name={`location.${index}.zone_name`}
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            placeholder="Select Zone"
                                            options={zoneList.map((z) => ({
                                                label: z.zone_name,
                                                value: z.zone_name,
                                            }))}
                                            value={
                                                zoneList
                                                    .map((z) => ({
                                                        label: z.zone_name,
                                                        value: z.zone_name,
                                                    }))
                                                    .find(
                                                        (o) =>
                                                            o.value ===
                                                            field.value,
                                                    ) || null
                                            }
                                            isDisabled={readOnly}
                                            onChange={(selected) => {
                                                field.onChange(
                                                    selected?.value || '',
                                                )
                                                setValue(
                                                    `location.${index}.cluster_name`,
                                                    '',
                                                )
                                                setValue(
                                                    `location.${index}.location_name`,
                                                    '',
                                                )
                                                setValue(
                                                    `location.${index}.shortName`,
                                                    '',
                                                )
                                            }}
                                        />
                                    )}
                                />
                            </FormItem>

                            <FormItem
                                label="Cluster"
                                invalid={Boolean(
                                    errors.location?.[index]?.cluster_name,
                                )}
                                errorMessage={
                                    errors.location?.[index]?.cluster_name
                                        ?.message
                                }
                            >
                                <Controller
                                    name={`location.${index}.cluster_name`}
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            placeholder={
                                                selectedZone
                                                    ? 'Select Cluster'
                                                    : 'Select Zone first'
                                            }
                                            options={filteredClusters.map(
                                                (c) => ({
                                                    label: c.cluster_name,
                                                    value: c.cluster_name,
                                                }),
                                            )}
                                            value={
                                                filteredClusters
                                                    .map((c) => ({
                                                        label: c.cluster_name,
                                                        value: c.cluster_name,
                                                    }))
                                                    .find(
                                                        (o) =>
                                                            o.value ===
                                                            field.value,
                                                    ) || null
                                            }
                                            isDisabled={
                                                readOnly || !selectedZone
                                            }
                                            onChange={(selected) => {
                                                field.onChange(
                                                    selected?.value || '',
                                                )
                                                setValue(
                                                    `location.${index}.location_name`,
                                                    '',
                                                )
                                                setValue(
                                                    `location.${index}.shortName`,
                                                    '',
                                                )
                                            }}
                                        />
                                    )}
                                />
                            </FormItem>

                            <FormItem
                                label="Location"
                                invalid={Boolean(
                                    errors.location?.[index]?.location_name,
                                )}
                                errorMessage={
                                    errors.location?.[index]?.location_name
                                        ?.message
                                }
                            >
                                <Controller
                                    name={`location.${index}.location_name`}
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            placeholder={
                                                selectedCluster
                                                    ? 'Select Location'
                                                    : 'Select Cluster first'
                                            }
                                            options={filteredLocations.map(
                                                (l) => ({
                                                    label: l.location_name,
                                                    value: l.location_name,
                                                }),
                                            )}
                                            value={
                                                filteredLocations
                                                    .map((l) => ({
                                                        label: l.location_name,
                                                        value: l.location_name,
                                                    }))
                                                    .find(
                                                        (o) =>
                                                            o.value ===
                                                            field.value,
                                                    ) || null
                                            }
                                            isDisabled={
                                                readOnly || !selectedCluster
                                            }
                                            onChange={(selected) => {
                                                field.onChange(
                                                    selected?.value || '',
                                                )
                                                setValue(
                                                    `location.${index}.shortName`,
                                                    '',
                                                )
                                            }}
                                        />
                                    )}
                                />
                            </FormItem>

                            <FormItem
                                label="Short Name"
                                invalid={Boolean(
                                    errors.location?.[index]?.shortName,
                                )}
                                errorMessage={
                                    errors.location?.[index]?.shortName?.message
                                }
                            >
                                <Controller
                                    name={`location.${index}.shortName`}
                                    control={control}
                                    render={({ field }) => {
                                        const locationMatch =
                                            filteredLocations.find(
                                                (l) =>
                                                    l.location_name ===
                                                    selectedLocation,
                                            )
                                        const shortOptions = locationMatch
                                            ? [
                                                  {
                                                      label: locationMatch.short_name,
                                                      value: locationMatch.short_name,
                                                  },
                                              ]
                                            : []

                                        return (
                                            <Select
                                                placeholder={
                                                    selectedLocation
                                                        ? 'Select Short Name'
                                                        : 'Select Location first'
                                                }
                                                options={shortOptions}
                                                value={
                                                    shortOptions.find(
                                                        (o) =>
                                                            o.value ===
                                                            field.value,
                                                    ) || null
                                                }
                                                isDisabled={
                                                    readOnly ||
                                                    !selectedLocation
                                                }
                                                onChange={(selected) =>
                                                    field.onChange(
                                                        selected?.value || '',
                                                    )
                                                }
                                            />
                                        )
                                    }}
                                />
                            </FormItem>

                            <FormItem
                                label="Department"
                                invalid={Boolean(
                                    errors.location?.[index]?.department,
                                )}
                                errorMessage={
                                    errors.location?.[index]?.department
                                        ?.message
                                }
                            >
                                <Controller
                                    name={`location.${index}.department`}
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            isMulti
                                            placeholder="Select Department"
                                            options={departmentList.map(
                                                (d) => ({
                                                    label: d.name,
                                                    value: d.name,
                                                }),
                                            )}
                                            value={departmentList
                                                .map((d) => ({
                                                    label: d.name,
                                                    value: d.name,
                                                }))
                                                .filter((opt) =>
                                                    field.value?.includes(
                                                        opt.value,
                                                    ),
                                                )}
                                            isDisabled={readOnly}
                                            onChange={(selected) =>
                                                field.onChange(
                                                    selected?.map(
                                                        (s) => s.value,
                                                    ) || [],
                                                )
                                            }
                                        />
                                    )}
                                />
                            </FormItem>

                            <FormItem
                                label="Prefix"
                                invalid={Boolean(
                                    errors.location?.[index]?.prefix,
                                )}
                                errorMessage={
                                    errors.location?.[index]?.prefix?.message
                                }
                            >
                                <Controller
                                    name={`location.${index}.prefix`}
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            readOnly
                                            placeholder={`LOC-${index + 1}`}
                                        />
                                    )}
                                />
                            </FormItem>
                        </div>
                    </Card>
                )
            })}
        </>
    )
}

export default LocationsSection
