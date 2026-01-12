/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import Card from '@/components/ui/Card'
import { FormItem } from '@/components/ui/Form'
import { Button, Select } from '@/components/ui'

const SettingsLocationItems = ({
    control,
    readOnly = false,
    index,
    zoneList = [],
    clusterList = [],
    locationList = [],
    departmentList = [],
    rolesList = [],
}: any) => {
    const { watch, setValue } = useFormContext()

    const selectedZone = watch(`userRoles.${index}.zone_id`)
    const selectedCluster = watch(`userRoles.${index}.cluster_id`)

    const filteredClusters = clusterList.filter(
        (c: any) => c.zone_id === selectedZone,
    )
    const filteredLocations = locationList.filter(
        (l: any) => l.cluster_id === selectedCluster,
    )

    const {
        fields: departmentFields = [],
        append,
        remove,
    } = useFieldArray({
        control,
        name: `userRoles.${index}.department`,
    })

    return (
        <Card className="mt-4">
            <div className="grid grid-cols-3 gap-4 p-4">
                <FormItem label="Zone">
                    <Controller
                        name={`userRoles.${index}.zone_id`}
                        control={control}
                        render={({ field }) => (
                            <Select
                                options={zoneList.map((z: any) => ({
                                    label: z.name,
                                    value: z.id,
                                }))}
                                value={zoneList
                                    .map((z: any) => ({
                                        label: z.name,
                                        value: z.id,
                                    }))
                                    .find((o: any) => o.value === field.value)}
                                onChange={(opt) => {
                                    field.onChange(opt?.value || '')
                                    setValue(
                                        `userRoles.${index}.cluster_id`,
                                        '',
                                    )
                                    setValue(
                                        `userRoles.${index}.location_id`,
                                        '',
                                    )
                                }}
                            />
                        )}
                    />
                </FormItem>

                <FormItem label="Cluster">
                    <Controller
                        name={`userRoles.${index}.cluster_id`}
                        control={control}
                        render={({ field }) => (
                            <Select
                                options={filteredClusters.map((c: any) => ({
                                    label: c.name,
                                    value: c.id,
                                }))}
                                value={filteredClusters
                                    .map((c: any) => ({
                                        label: c.name,
                                        value: c.id,
                                    }))
                                    .find((o: any) => o.value === field.value)}
                                onChange={(opt) =>
                                    field.onChange(opt?.value || '')
                                }
                            />
                        )}
                    />
                </FormItem>

                <FormItem label="Location">
                    <Controller
                        name={`userRoles.${index}.location_id`}
                        control={control}
                        render={({ field }) => (
                            <Select
                                options={filteredLocations.map((l: any) => ({
                                    label: l.name,
                                    value: l.id,
                                }))}
                                value={filteredLocations
                                    .map((l: any) => ({
                                        label: l.name,
                                        value: l.id,
                                    }))
                                    .find((o: any) => o.value === field.value)}
                                onChange={(opt) =>
                                    field.onChange(opt?.value || '')
                                }
                            />
                        )}
                    />
                </FormItem>
            </div>

            <div className="p-4 bg-gray-50">
                <div className="flex justify-between mb-3">
                    <h5>Departments</h5>
                    {!readOnly && (
                        <Button
                            size="xs"
                            onClick={() =>
                                append({
                                    department_id: '',
                                    roles: [],
                                })
                            }
                        >
                            + Add Department
                        </Button>
                    )}
                </div>

                {departmentFields.map((_, deptIndex) => (
                    <div key={deptIndex} className="mb-4 border p-3">
                        {!readOnly && (
                            <Button
                                size="xs"
                                variant="plain"
                                onClick={() => remove(deptIndex)}
                            >
                                Remove
                            </Button>
                        )}

                        <div className="grid grid-cols-2 gap-4 mt-3">
                            <FormItem label="Department">
                                <Controller
                                    name={`userRoles.${index}.department.${deptIndex}.department_id`}
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            options={departmentList.map(
                                                (d: any) => ({
                                                    label: d.name,
                                                    value: d.id,
                                                }),
                                            )}
                                            onChange={(opt) =>
                                                field.onChange(opt?.value || '')
                                            }
                                        />
                                    )}
                                />
                            </FormItem>

                            <FormItem label="Roles">
                                <Controller
                                    name={`userRoles.${index}.department.${deptIndex}.roles`}
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            isMulti
                                            options={rolesList.map(
                                                (r: any) => ({
                                                    label: r.name,
                                                    value: r.id,
                                                }),
                                            )}
                                            value={rolesList
                                                .filter((r: any) =>
                                                    field.value?.includes(r.id),
                                                )
                                                .map((r: any) => ({
                                                    label: r.name,
                                                    value: r.id,
                                                }))}
                                            onChange={(opts) =>
                                                field.onChange(
                                                    opts
                                                        ? opts.map(
                                                              (o: any) =>
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
        </Card>
    )
}

export default SettingsLocationItems
