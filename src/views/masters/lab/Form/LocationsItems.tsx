/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { Button, Select } from '@/components/ui'
import { HiPlus, HiMinus } from 'react-icons/hi'
import { FormSectionBaseProps } from '@/@types/lab'
import useZoneList from '../../zone/List/hooks/useList'
import useClusterList from '../../cluster/List/hooks/useList'
import useLocationList from '../../location/List/hooks/useList'
import useDepartmentList from '../../department/List/hooks/useList'
import useInstrumentList from '../../instrument/List/hooks/useList'

export type FormSectionBasePropsTwo = {
    index: number
    item: any
} & FormSectionBaseProps

const LocationsItems = ({
    control,
    errors,
    readOnly = false,
    index,
    item,
}: FormSectionBasePropsTwo) => {
    const { setValue, watch } = useFormContext()
    const { zoneList } = useZoneList()
    const { clusterList } = useClusterList()
    const { locationList } = useLocationList()
    const { departmentList } = useDepartmentList()
    const { instrumentList } = useInstrumentList()

    const selectedZone = watch(`location.${index}.zone_name`)
    const selectedCluster = watch(`location.${index}.cluster_name`)
    const selectedLocationName = watch(`location.${index}.location_name`)

    const filteredClusters = clusterList.filter(
        (c) => c.zone_name === selectedZone,
    )
    const filteredLocations = locationList.filter(
        (l) => l.cluster_name === selectedCluster,
    )

    // --- Auto prefix numbering logic ---
    useEffect(() => {
        const locationMatch = filteredLocations.find(
            (l) => l.location_name === selectedLocationName,
        )

        if (locationMatch) {
            const basePrefix = `LOC-${locationMatch.prefix}` // e.g., LOC-ES-GS-ST
            const allLocations = watch('location') || []

            // Collect all prefixes that start with the same base
            const similar = allLocations
                .map((loc: any) => loc?.prefix)
                .filter((p: string) => p && p.startsWith(basePrefix))

            // Generate next number (NN)
            const nextNum = (similar.length + 1).toString().padStart(2, '0')
            const finalPrefix = `${basePrefix}-${nextNum}`

            // Set prefix only if it’s empty or doesn’t match pattern
            const currentPrefix = watch(`location.${index}.prefix`)
            if (!currentPrefix || !currentPrefix.startsWith(basePrefix)) {
                setValue(`location.${index}.prefix`, finalPrefix)
            }
        } else {
            // Clear prefix if location is cleared
            setValue(`location.${index}.prefix`, '')
        }
    }, [selectedLocationName, selectedCluster, selectedZone, filteredLocations])

    // --- Departments ---
    const {
        fields: departmentFields,
        append: appendDepartment,
        remove: removeDepartment,
    } = useFieldArray({
        control,
        name: `location.${index}.departments`,
    })

    // --- Emails ---
    const {
        fields: emailFields,
        append: appendEmail,
        remove: removeEmail,
    } = useFieldArray({
        control,
        name: `location.${index}.emails`,
    })

    // --- Phones ---
    const {
        fields: phoneFields,
        append: appendPhone,
        remove: removePhone,
    } = useFieldArray({
        control,
        name: `location.${index}.phones`,
    })

    return (
        <Card key={item.id} className="mt-4">
            {/* --- Zone / Cluster / Location / Prefix --- */}
            <div className="grid md:grid-cols-4 gap-4 p-3 mb-3">
                {/* Zone */}
                <FormItem
                    label="Zone"
                    invalid={!!errors.location?.[index]?.zone_name}
                    errorMessage={errors.location?.[index]?.zone_name?.message}
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
                                        .find((o) => o.value === field.value) ||
                                    null
                                }
                                isDisabled={readOnly}
                                onChange={(selected) => {
                                    field.onChange(selected?.value || '')
                                    setValue(
                                        `location.${index}.cluster_name`,
                                        '',
                                    )
                                    setValue(
                                        `location.${index}.location_name`,
                                        '',
                                    )
                                    setValue(`location.${index}.shortName`, '')
                                    setValue(`location.${index}.prefix`, '')
                                }}
                            />
                        )}
                    />
                </FormItem>

                {/* Cluster */}
                <FormItem
                    label="Cluster"
                    invalid={!!errors.location?.[index]?.cluster_name}
                    errorMessage={
                        errors.location?.[index]?.cluster_name?.message
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
                                        .find((o) => o.value === field.value) ||
                                    null
                                }
                                isDisabled={readOnly || !selectedZone}
                                onChange={(selected) => {
                                    field.onChange(selected?.value || '')
                                    setValue(
                                        `location.${index}.location_name`,
                                        '',
                                    )
                                    setValue(`location.${index}.shortName`, '')
                                    setValue(`location.${index}.prefix`, '')
                                }}
                            />
                        )}
                    />
                </FormItem>

                {/* Location */}
                <FormItem
                    label="Location"
                    invalid={!!errors.location?.[index]?.location_name}
                    errorMessage={
                        errors.location?.[index]?.location_name?.message
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
                                        .find((o) => o.value === field.value) ||
                                    null
                                }
                                isDisabled={readOnly || !selectedCluster}
                                onChange={(selected) => {
                                    field.onChange(selected?.value || '')
                                    const locationMatch =
                                        filteredLocations.find(
                                            (l) =>
                                                l.location_name ===
                                                selected?.value,
                                        )
                                    if (locationMatch) {
                                        setValue(
                                            `location.${index}.shortName`,
                                            locationMatch.short_name,
                                        )
                                        setValue(
                                            `location.${index}.prefix`,
                                            `LOC-${locationMatch.prefix}`,
                                        )
                                    } else {
                                        setValue(
                                            `location.${index}.shortName`,
                                            '',
                                        )
                                        setValue(`location.${index}.prefix`, '')
                                    }
                                }}
                            />
                        )}
                    />
                </FormItem>

                {/* Short Name */}
                <FormItem
                    label="Short Name"
                    invalid={!!errors.location?.[index]?.shortName}
                    errorMessage={errors.location?.[index]?.shortName?.message}
                >
                    <Controller
                        name={`location.${index}.shortName`}
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                placeholder="Enter Short Name"
                                readOnly={readOnly}
                            />
                        )}
                    />
                </FormItem>

                {/* Prefix */}
                <FormItem
                    label="Prefix"
                    invalid={!!errors.location?.[index]?.prefix}
                    errorMessage={errors.location?.[index]?.prefix?.message}
                >
                    <Controller
                        name={`location.${index}.prefix`}
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                placeholder="LOC-"
                                readOnly={true}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Location Level Instruments"
                    invalid={!!errors.location?.[index]?.instruments}
                    errorMessage={
                        errors.location?.[index]?.instruments?.message
                    }
                >
                    <Controller
                        name={`location.${index}.instruments`}
                        control={control}
                        render={({ field }) => (
                            <Select
                                isMulti
                                placeholder="Select Instruments"
                                options={instrumentList.map((i) => ({
                                    label: i.full_name,
                                    value: i.id,
                                }))}
                                value={instrumentList
                                    .map((i) => ({
                                        label: i.full_name,
                                        value: i.id,
                                    }))
                                    .filter((opt) =>
                                        field.value?.includes(opt.value),
                                    )}
                                isDisabled={readOnly}
                                onChange={(selected) =>
                                    field.onChange(
                                        selected?.map((s) => s.value) || [],
                                    )
                                }
                            />
                        )}
                    />
                </FormItem>
            </div>

            {/* --- Departments --- */}
            <div className="mt-4">
                <div className="flex items-center justify-between gap-2 mb-2">
                    <h5>Departments</h5>
                    {!readOnly && (
                        <Button
                            type="button"
                            size="xs"
                            onClick={() =>
                                appendDepartment({ name: '', instruments: [] })
                            }
                        >
                            + Add Department
                        </Button>
                    )}
                </div>

                {departmentFields.map((deptItem, deptIndex) => (
                    <div
                        key={deptItem.id}
                        className="border border-blue-200  shadow-sm p-3 mb-2 rounded"
                    >
                        <div className="grid md:grid-cols-2 gap-4">
                            {/* Department */}
                            <FormItem
                                label="Department"
                                invalid={
                                    !!errors.location?.[index]?.departments?.[
                                        deptIndex
                                    ]?.name
                                }
                                errorMessage={
                                    errors.location?.[index]?.departments?.[
                                        deptIndex
                                    ]?.name?.message
                                }
                            >
                                <Controller
                                    name={`location.${index}.departments.${deptIndex}.name`}
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            placeholder="Select Department"
                                            options={departmentList.map(
                                                (d) => ({
                                                    label: d.name,
                                                    value: d.name,
                                                }),
                                            )}
                                            value={
                                                departmentList
                                                    .map((d) => ({
                                                        label: d.name,
                                                        value: d.name,
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
                                                    `location.${index}.departments.${deptIndex}.instruments`,
                                                    [],
                                                )
                                            }}
                                        />
                                    )}
                                />
                            </FormItem>

                            <FormItem
                                label="Department Level Instruments"
                                invalid={
                                    !!errors.location?.[index]?.departments?.[
                                        deptIndex
                                    ]?.instruments
                                }
                                errorMessage={
                                    errors.location?.[index]?.departments?.[
                                        deptIndex
                                    ]?.instruments?.message
                                }
                            >
                                <Controller
                                    name={`location.${index}.departments.${deptIndex}.instruments`}
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            isMulti
                                            placeholder="Select Instruments"
                                            options={instrumentList.map(
                                                (i) => ({
                                                    label: i.full_name,
                                                    value: i.id,
                                                }),
                                            )}
                                            value={instrumentList
                                                .map((i) => ({
                                                    label: i.full_name,
                                                    value: i.id,
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
                        </div>

                        {!readOnly && (
                            <Button
                                type="button"
                                size="xs"
                                className="mt-2"
                                onClick={() => removeDepartment(deptIndex)}
                            >
                                -
                            </Button>
                        )}
                    </div>
                ))}
            </div>

            {/* --- Contact Person --- */}
            <div className="mt-6">
                <h4 className="mb-6">Contact Person</h4>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Emails */}
                    <div>
                        <div className="flex items-center justify-between gap-2 mb-4">
                            <label className="form-label">Emails</label>
                            {!readOnly && (
                                <Button
                                    type="button"
                                    size="xs"
                                    icon={<HiPlus />}
                                    onClick={() => appendEmail({ value: '' })}
                                />
                            )}
                        </div>

                        <div className="space-y-4">
                            {emailFields.map((field, emailIndex) => (
                                <FormItem
                                    key={field.id}
                                    invalid={
                                        !!errors.location?.[index]?.emails?.[
                                            emailIndex
                                        ]?.value
                                    }
                                    errorMessage={
                                        errors.location?.[index]?.emails?.[
                                            emailIndex
                                        ]?.value?.message
                                    }
                                >
                                    <div className="flex items-center gap-2">
                                        <Controller
                                            name={`location.${index}.emails.${emailIndex}.value`}
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    placeholder={`Email ${emailIndex + 1}`}
                                                    readOnly={readOnly}
                                                    className="flex-1"
                                                />
                                            )}
                                        />
                                        {!readOnly &&
                                            emailFields.length > 1 && (
                                                <Button
                                                    size="xs"
                                                    type="button"
                                                    icon={<HiMinus />}
                                                    onClick={() =>
                                                        removeEmail(emailIndex)
                                                    }
                                                />
                                            )}
                                    </div>
                                </FormItem>
                            ))}
                        </div>
                    </div>

                    {/* Phones */}
                    <div>
                        <div className="flex items-center justify-between gap-2 mb-4">
                            <label className="form-label">Phones</label>
                            {!readOnly && (
                                <Button
                                    type="button"
                                    size="xs"
                                    icon={<HiPlus />}
                                    onClick={() => appendPhone({ value: '' })}
                                />
                            )}
                        </div>

                        <div className="space-y-4">
                            {phoneFields.map((field, phoneIndex) => (
                                <FormItem
                                    key={field.id}
                                    invalid={
                                        !!errors.location?.[index]?.phones?.[
                                            phoneIndex
                                        ]?.value
                                    }
                                    errorMessage={
                                        errors.location?.[index]?.phones?.[
                                            phoneIndex
                                        ]?.value?.message
                                    }
                                >
                                    <div className="flex items-center gap-2">
                                        <Controller
                                            name={`location.${index}.phones.${phoneIndex}.value`}
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    placeholder={`Phone ${phoneIndex + 1}`}
                                                    readOnly={readOnly}
                                                    className="flex-1"
                                                />
                                            )}
                                        />
                                        {!readOnly &&
                                            phoneFields.length > 1 && (
                                                <Button
                                                    size="xs"
                                                    type="button"
                                                    icon={<HiMinus />}
                                                    onClick={() =>
                                                        removePhone(phoneIndex)
                                                    }
                                                />
                                            )}
                                    </div>
                                </FormItem>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Address */}
                <div className="mt-6">
                    <FormItem
                        label="Address"
                        invalid={!!errors.location?.[index]?.address}
                        errorMessage={
                            errors.location?.[index]?.address?.message
                        }
                    >
                        <Controller
                            name={`location.${index}.address`}
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    textArea
                                    placeholder="Address"
                                    readOnly={readOnly}
                                />
                            )}
                        />
                    </FormItem>
                </div>
            </div>
        </Card>
    )
}

export default LocationsItems
