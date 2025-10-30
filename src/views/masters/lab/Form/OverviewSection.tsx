import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import { FormSectionBaseProps } from '@/@types/lab'
import { Select } from '@/components/ui'
import useZoneList from '../../zone/List/hooks/useList'
import useClusterList from '../../cluster/List/hooks/useList'
import useLocationList from '../../location/List/hooks/useList'
import useDepartmentList from '../../department/List/hooks/useList'

type OverviewSectionProps = FormSectionBaseProps & {
    existingLabCodes?: string[]
}

const OverviewSection = ({
    control,
    errors,
    readOnly = false,
}: OverviewSectionProps) => {
    const { setValue, watch } = useFormContext()
    const { zoneList } = useZoneList()
    const { clusterList } = useClusterList()
    const { locationList } = useLocationList()
    const { departmentList } = useDepartmentList()

    const { fields, append } = useFieldArray({
        control,
        name: 'location',
    })

    return (
        <Card>
            <h4 className="mb-6">Overview</h4>

            {/* LAB DETAILS */}
            <div className="grid md:grid-cols-2 gap-4">
                <FormItem
                    label="Lab Name"
                    invalid={Boolean(errors.name)}
                    errorMessage={errors.name?.message}
                >
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                placeholder="Lab Name"
                                readOnly={readOnly}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Lab Type"
                    invalid={Boolean(errors.labType)}
                    errorMessage={errors.labType?.message}
                >
                    <Controller
                        name="labType"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                placeholder="Lab Type"
                                readOnly={readOnly}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Lab Code"
                    invalid={Boolean(errors.labCode)}
                    errorMessage={errors.labCode?.message}
                >
                    <Controller
                        name="labCode"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                readOnly
                                placeholder="Auto-generated"
                            />
                        )}
                    />
                </FormItem>
            </div>

            {/* LOCATION SECTION */}
            <h4 className="mt-8 mb-4 text-base font-semibold flex items-center justify-between">
                <span>Locations</span>

                {!readOnly && (
                    <button
                        type="button"
                        className="bg-blue-500 text-white text-sm px-3 py-1 rounded-md hover:bg-blue-700 transition"
                        onClick={() =>
                            append({
                                zone_name: '',
                                cluster_name: '',
                                location_name: '',
                                department: '',
                                prefix: `LOC-${fields.length + 1}`,
                                shortName: '',
                            })
                        }
                    >
                        +
                    </button>
                )}
            </h4>

            {fields.length === 0 && (
                <p className="text-sm text-gray-500 italic">
                    No location data available.
                </p>
            )}

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
                    <div
                        key={item.id || index}
                        className="grid md:grid-cols-3 gap-4 border p-3 rounded-md mb-3"
                    >
                        {/* Prefix */}
                        <FormItem label="Prefix">
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
                        {/* Zone */}
                        <FormItem label="Zone">
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
                                                        o.value === field.value,
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

                        {/* Cluster */}
                        <FormItem label="Cluster">
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
                                        options={filteredClusters.map((c) => ({
                                            label: c.cluster_name,
                                            value: c.cluster_name,
                                        }))}
                                        value={
                                            filteredClusters
                                                .map((c) => ({
                                                    label: c.cluster_name,
                                                    value: c.cluster_name,
                                                }))
                                                .find(
                                                    (o) =>
                                                        o.value === field.value,
                                                ) || null
                                        }
                                        isDisabled={readOnly || !selectedZone}
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

                        {/* Location */}
                        <FormItem label="Location">
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
                                        options={filteredLocations.map((l) => ({
                                            label: l.location_name,
                                            value: l.location_name,
                                        }))}
                                        value={
                                            filteredLocations
                                                .map((l) => ({
                                                    label: l.location_name,
                                                    value: l.location_name,
                                                }))
                                                .find(
                                                    (o) =>
                                                        o.value === field.value,
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

                        <FormItem label="Short Name">
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
                                                        o.value === field.value,
                                                ) || null
                                            }
                                            isDisabled={
                                                readOnly || !selectedLocation
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

                        {/* Department */}
                        <FormItem label="Department">
                            <Controller
                                name={`location.${index}.department`}
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        isMulti
                                        placeholder="Select Department"
                                        options={departmentList.map((d) => ({
                                            label: d.name,
                                            value: d.name,
                                        }))}
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
                                                selected?.map((s) => s.value) ||
                                                    [],
                                            )
                                        }
                                    />
                                )}
                            />
                        </FormItem>
                    </div>
                )
            })}

            <h4 className="mt-8 mb-4">Personal Details</h4>
            <div className="grid md:grid-cols-2 gap-4">
                <FormItem label="Email">
                    <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                placeholder="Email"
                                readOnly={readOnly}
                            />
                        )}
                    />
                </FormItem>

                <FormItem label="Phone">
                    <Controller
                        name="phone"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                placeholder="Phone"
                                readOnly={readOnly}
                            />
                        )}
                    />
                </FormItem>

                <FormItem label="Address">
                    <Controller
                        name="address"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                placeholder="Address"
                                readOnly={readOnly}
                            />
                        )}
                    />
                </FormItem>
            </div>
        </Card>
    )
}

export default OverviewSection
