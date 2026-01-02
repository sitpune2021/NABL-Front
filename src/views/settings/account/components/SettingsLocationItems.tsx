/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { Button, Select } from '@/components/ui'
import { FormSectionBaseProps } from '@/@types/lab'

export type FormSectionBasePropsTwo = {
    index: number
    item: any
} & FormSectionBaseProps & {
        zoneList: any[]
        clusterList: any[]
        locationList: any[]
        departmentList: any[]
        instrumentList: any[]
    }

const SettingsLocationItems = ({
    control,
    errors,
    readOnly = false,
    index,
    zoneList,
    clusterList,
    locationList,
    departmentList,
    instrumentList,
}: FormSectionBasePropsTwo) => {
    const { setValue, watch } = useFormContext()

    const selectedZone = watch(`location.${index}.zone_name`)
    const selectedCluster = watch(`location.${index}.cluster_name`)
    const selectedLocationName = watch(`location.${index}.location_name`)
    const allLocations = watch('location') || []

    const filteredClusters = clusterList.filter(
        (c) => c.zone_id === selectedZone,
    )
    const filteredLocations = locationList.filter(
        (l) => l.cluster_id === selectedCluster,
    )

    useEffect(() => {
        const locationMatch = filteredLocations.find(
            (l) => l.id === selectedLocationName,
        )

        if (locationMatch) {
            const basePrefix = `LOC-${locationMatch.identifier || locationMatch.prefix}`
            const currentPrefix = watch(`location.${index}.prefix`)

            if (!currentPrefix || !currentPrefix.startsWith(basePrefix)) {
                const similar = allLocations
                    .map((loc: any) => loc?.prefix)
                    .filter((p: string) => p && p.startsWith(basePrefix))

                const nextNum = (similar.length + 1).toString().padStart(2, '0')
                setValue(`location.${index}.prefix`, `${basePrefix}-${nextNum}`)
            }
        } else if (!selectedLocationName) {
            setValue(`location.${index}.prefix`, '')
        }
    }, [selectedLocationName, filteredLocations, setValue, index])

    const {
        fields: departmentFields,
        append: addDepartment,
        remove: removeDepartment,
    } = useFieldArray({ control, name: `location.${index}.departments` })

    return (
        <>
            <Card className="mt-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between p-3 border-b border-gray-100">
                    <div>
                        <h5 className="font-semibold">Location</h5>
                    </div>
                </div>

                <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormItem
                        label="Zone"
                        invalid={!!errors.location?.[index]?.zone_name}
                    >
                        <Controller
                            name={`location.${index}.zone_name`}
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    options={zoneList.map((z) => ({
                                        label: z.name,
                                        value: z.id,
                                    }))}
                                    value={
                                        zoneList
                                            .map((z) => ({
                                                label: z.name,
                                                value: z.id,
                                            }))
                                            .find(
                                                (o) => o.value === field.value,
                                            ) || null
                                    }
                                    isDisabled={readOnly}
                                    onChange={(option) => {
                                        field.onChange(option?.value || '')
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
                                        setValue(`location.${index}.prefix`, '')
                                    }}
                                />
                            )}
                        />
                    </FormItem>

                    <FormItem
                        label="Cluster"
                        invalid={!!errors.location?.[index]?.cluster_name}
                    >
                        <Controller
                            name={`location.${index}.cluster_name`}
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    options={filteredClusters.map((c) => ({
                                        label: c.name,
                                        value: c.id,
                                    }))}
                                    value={
                                        filteredClusters
                                            .map((c) => ({
                                                label: c.name,
                                                value: c.id,
                                            }))
                                            .find(
                                                (o) => o.value === field.value,
                                            ) || null
                                    }
                                    isDisabled={readOnly || !selectedZone}
                                    onChange={(option) => {
                                        field.onChange(option?.value || '')
                                        setValue(
                                            `location.${index}.location_name`,
                                            '',
                                        )
                                        setValue(
                                            `location.${index}.shortName`,
                                            '',
                                        )
                                        setValue(`location.${index}.prefix`, '')
                                    }}
                                />
                            )}
                        />
                    </FormItem>

                    <FormItem
                        label="Location"
                        invalid={!!errors.location?.[index]?.location_name}
                    >
                        <Controller
                            name={`location.${index}.location_name`}
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    options={filteredLocations.map((l) => ({
                                        label: l.name,
                                        value: l.id,
                                    }))}
                                    value={
                                        filteredLocations
                                            .map((l) => ({
                                                label: l.name,
                                                value: l.id,
                                            }))
                                            .find(
                                                (o) => o.value === field.value,
                                            ) || null
                                    }
                                    isDisabled={readOnly || !selectedCluster}
                                    onChange={(option) => {
                                        field.onChange(option?.value || '')
                                        const match = filteredLocations.find(
                                            (l) => l.id === option?.value,
                                        )
                                        setValue(
                                            `location.${index}.shortName`,
                                            match?.short_name || '',
                                        )
                                    }}
                                />
                            )}
                        />
                    </FormItem>

                    <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormItem label="Short Name">
                            <Input
                                readOnly
                                value={
                                    watch(`location.${index}.shortName`) || ''
                                }
                            />
                        </FormItem>
                        <FormItem label="Prefix">
                            <Input
                                readOnly
                                value={watch(`location.${index}.prefix`) || ''}
                            />
                        </FormItem>
                    </div>
                </div>

                <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b">
                    <div className="flex items-center justify-between mb-3">
                        <h6 className="font-semibold">Departments</h6>
                        {!readOnly && (
                            <Button
                                size="xs"
                                onClick={() =>
                                    addDepartment({ name: '', instruments: [] })
                                }
                            >
                                + Add Department
                            </Button>
                        )}
                    </div>

                    <div className="space-y-3">
                        {departmentFields.map((dept, deptIndex) => (
                            <div
                                key={dept.id}
                                className="bg-white rounded-lg border border-gray-100 p-4"
                            >
                                <div className="flex justify-between items-center mb-4">
                                    {!readOnly && (
                                        <Button
                                            variant="plain"
                                            size="xs"
                                            className="text-red-600"
                                            onClick={() =>
                                                removeDepartment(deptIndex)
                                            }
                                        >
                                            Remove
                                        </Button>
                                    )}
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <FormItem label="Select Department">
                                        <Controller
                                            name={`location.${index}.departments.${deptIndex}.name`}
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    {...field}
                                                    options={departmentList.map(
                                                        (d) => ({
                                                            label: d.name,
                                                            value: d.id,
                                                        }),
                                                    )}
                                                    value={
                                                        departmentList
                                                            .map((d) => ({
                                                                label: d.name,
                                                                value: d.id,
                                                            }))
                                                            .find(
                                                                (o) =>
                                                                    o.value ===
                                                                    field.value,
                                                            ) || null
                                                    }
                                                    isDisabled={readOnly}
                                                    onChange={(opt) =>
                                                        field.onChange(
                                                            opt?.value || '',
                                                        )
                                                    }
                                                />
                                            )}
                                        />
                                    </FormItem>
                                    <FormItem label="Instruments">
                                        <Controller
                                            name={`location.${index}.departments.${deptIndex}.instruments`}
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    isMulti
                                                    options={instrumentList.map(
                                                        (i) => ({
                                                            label: i.name,
                                                            value: i.id,
                                                        }),
                                                    )}
                                                    value={instrumentList
                                                        .filter((i) =>
                                                            field.value?.includes(
                                                                i.id,
                                                            ),
                                                        )
                                                        .map((i) => ({
                                                            label: i.name,
                                                            value: i.id,
                                                        }))}
                                                    isDisabled={readOnly}
                                                    onChange={(opts) =>
                                                        field.onChange(
                                                            opts
                                                                ? opts.map(
                                                                      (o) =>
                                                                          o.value,
                                                                  )
                                                                : [],
                                                        )
                                                    }
                                                />
                                            )}
                                        />
                                    </FormItem>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>
        </>
    )
}

export default SettingsLocationItems
