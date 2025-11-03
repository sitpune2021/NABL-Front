import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import { useEffect } from 'react' // Added useEffect import
import { FormSectionBaseProps } from '@/@types/lab'
import { Button, Select } from '@/components/ui'
import { HiPlus, HiMinus } from 'react-icons/hi'
import useZoneList from '../../zone/List/hooks/useList'
import useClusterList from '../../cluster/List/hooks/useList'
import useLocationList from '../../location/List/hooks/useList'
import useDepartmentList from '../../department/List/hooks/useList'
import useInstrumentList from '../../instrument/List/hooks/useList'

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
    const { instrumentList } = useInstrumentList()

    const { fields, append } = useFieldArray({
        control,
        name: 'location',
    })

    console.log(errors)

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
                                    departments: [
                                        { name: '', instruments: [] },
                                    ], // Default one department
                                    prefix: '',
                                    shortName: '',
                                    emails: [{ value: '' }], // Default one email
                                    phones: [{ value: '' }], // Default one phone
                                    address: '',
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
                const filteredClusters = clusterList.filter(
                    (c) => c.zone_name === selectedZone,
                )

                const filteredLocations = locationList.filter(
                    (l) => l.cluster_name === selectedCluster,
                )

                // useFieldArray for departments within each location
                const {
                    fields: departmentFields,
                    append: appendDepartment,
                    remove: removeDepartment,
                } = useFieldArray({
                    control,
                    name: `location.${index}.departments`,
                })

                // Ensure at least one department
                useEffect(() => {
                    if (departmentFields.length === 0) {
                        appendDepartment({ name: '', instruments: [] })
                    }
                }, [departmentFields.length, appendDepartment])

                // Added useFieldArray for emails and phones within each location
                const {
                    fields: emailFields,
                    append: appendEmail,
                    remove: removeEmail,
                } = useFieldArray({
                    control,
                    name: `location.${index}.emails`,
                })

                const {
                    fields: phoneFields,
                    append: appendPhone,
                    remove: removePhone,
                } = useFieldArray({
                    control,
                    name: `location.${index}.phones`,
                })

                // Ensure at least one email
                useEffect(() => {
                    if (emailFields.length === 0) {
                        appendEmail({ value: '' })
                    }
                }, [emailFields.length, appendEmail])

                // Ensure at least one phone
                useEffect(() => {
                    if (phoneFields.length === 0) {
                        appendPhone({ value: '' })
                    }
                }, [phoneFields.length, appendPhone])

                return (
                    <Card key={item.id}>
                        <div className="grid md:grid-cols-4 gap-4 p-3 mb-3">
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
                                                setValue(
                                                    `location.${index}.prefix`,
                                                    '',
                                                )
                                                setValue(
                                                    `location.${index}.departments`,
                                                    [
                                                        {
                                                            name: '',
                                                            instruments: [],
                                                        },
                                                    ], // Reset to default one department
                                                )
                                                // Added clearing for contact person
                                                setValue(
                                                    `location.${index}.emails`,
                                                    [{ value: '' }], // Reset to default one email
                                                )
                                                setValue(
                                                    `location.${index}.phones`,
                                                    [{ value: '' }], // Reset to default one phone
                                                )
                                                setValue(
                                                    `location.${index}.address`,
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
                                                setValue(
                                                    `location.${index}.prefix`,
                                                    '',
                                                )
                                                setValue(
                                                    `location.${index}.departments`,
                                                    [
                                                        {
                                                            name: '',
                                                            instruments: [],
                                                        },
                                                    ], // Reset to default one department
                                                )
                                                // Added clearing for contact person
                                                setValue(
                                                    `location.${index}.emails`,
                                                    [{ value: '' }], // Reset to default one email
                                                )
                                                setValue(
                                                    `location.${index}.phones`,
                                                    [{ value: '' }], // Reset to default one phone
                                                )
                                                setValue(
                                                    `location.${index}.address`,
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
                                                    setValue(
                                                        `location.${index}.prefix`,
                                                        '',
                                                    )
                                                }
                                                setValue(
                                                    `location.${index}.departments`,
                                                    [
                                                        {
                                                            name: '',
                                                            instruments: [],
                                                        },
                                                    ], // Reset to default one department
                                                )
                                                // Added clearing for contact person
                                                setValue(
                                                    `location.${index}.emails`,
                                                    [{ value: '' }], // Reset to default one email
                                                )
                                                setValue(
                                                    `location.${index}.phones`,
                                                    [{ value: '' }], // Reset to default one phone
                                                )
                                                setValue(
                                                    `location.${index}.address`,
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
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder="Enter Short Name"
                                            readOnly={readOnly}
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
                                            placeholder="LOC-"
                                            readOnly={readOnly}
                                        />
                                    )}
                                />
                            </FormItem>
                        </div>

                        {/* Departments Section */}
                        <div className="mt-4">
                            <div className="flex items-center justify-between gap-2 mb-2">
                                <h5>Departments</h5>
                                {!readOnly && (
                                    <Button
                                        type="button"
                                        size="xs"
                                        onClick={() =>
                                            appendDepartment({
                                                name: '',
                                                instruments: [],
                                            })
                                        }
                                    >
                                        + Add Department
                                    </Button>
                                )}
                            </div>
                            {departmentFields.map((deptItem, deptIndex) => (
                                <div
                                    key={deptItem.id}
                                    className="border p-3 mb-2 rounded"
                                >
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <FormItem
                                            label="Department"
                                            invalid={Boolean(
                                                errors.location?.[index]
                                                    ?.departments?.[deptIndex]
                                                    ?.name,
                                            )}
                                            errorMessage={
                                                errors.location?.[index]
                                                    ?.departments?.[deptIndex]
                                                    ?.name?.message
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
                                                        onChange={(
                                                            selected,
                                                        ) => {
                                                            field.onChange(
                                                                selected?.value ||
                                                                    '',
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
                                            label="Instruments"
                                            invalid={Boolean(
                                                errors.location?.[index]
                                                    ?.departments?.[deptIndex]
                                                    ?.instruments,
                                            )}
                                            errorMessage={
                                                errors.location?.[index]
                                                    ?.departments?.[deptIndex]
                                                    ?.instruments?.message
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
                                                                    (s) =>
                                                                        s.value,
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
                                            onClick={() =>
                                                removeDepartment(deptIndex)
                                            }
                                        >
                                            Remove Department
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Contact Person Section */}
                        <div className="mt-6">
                            <h4 className="mb-6">Contact Person</h4>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <div className="flex items-center justify-between gap-2 mb-4">
                                        <label className="form-label">
                                            Emails
                                        </label>
                                        {!readOnly && (
                                            <Button
                                                type="button"
                                                size="xs"
                                                icon={<HiPlus />}
                                                onClick={() =>
                                                    appendEmail({ value: '' })
                                                }
                                            />
                                        )}
                                    </div>
                                    <div className="space-y-4">
                                        {emailFields.map(
                                            (field, emailIndex) => (
                                                <FormItem
                                                    key={field.id}
                                                    invalid={Boolean(
                                                        errors.location?.[index]
                                                            ?.emails?.[
                                                            emailIndex
                                                        ]?.value,
                                                    )}
                                                    errorMessage={
                                                        errors.location?.[index]
                                                            ?.emails?.[
                                                            emailIndex
                                                        ]?.value?.message
                                                    }
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <Controller
                                                            name={`location.${index}.emails.${emailIndex}.value`}
                                                            control={control}
                                                            render={({
                                                                field,
                                                            }) => (
                                                                <Input
                                                                    {...field}
                                                                    placeholder={`Email ${emailIndex + 1}`}
                                                                    readOnly={
                                                                        readOnly
                                                                    }
                                                                    className="flex-1"
                                                                />
                                                            )}
                                                        />
                                                        {!readOnly &&
                                                            emailFields.length >
                                                                1 && (
                                                                <Button
                                                                    size="xs"
                                                                    type="button"
                                                                    icon={
                                                                        <HiMinus />
                                                                    }
                                                                    onClick={() =>
                                                                        removeEmail(
                                                                            emailIndex,
                                                                        )
                                                                    }
                                                                />
                                                            )}
                                                    </div>
                                                </FormItem>
                                            ),
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between gap-2 mb-4">
                                        <label className="form-label">
                                            Phones
                                        </label>
                                        {!readOnly && (
                                            <Button
                                                type="button"
                                                size="xs"
                                                icon={<HiPlus />}
                                                onClick={() =>
                                                    appendPhone({ value: '' })
                                                }
                                            />
                                        )}
                                    </div>
                                    <div className="space-y-4">
                                        {phoneFields.map(
                                            (field, phoneIndex) => (
                                                <FormItem
                                                    key={field.id}
                                                    invalid={Boolean(
                                                        errors.location?.[index]
                                                            ?.phones?.[
                                                            phoneIndex
                                                        ]?.value,
                                                    )}
                                                    errorMessage={
                                                        errors.location?.[index]
                                                            ?.phones?.[
                                                            phoneIndex
                                                        ]?.value?.message
                                                    }
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <Controller
                                                            name={`location.${index}.phones.${phoneIndex}.value`}
                                                            control={control}
                                                            render={({
                                                                field,
                                                            }) => (
                                                                <Input
                                                                    {...field}
                                                                    placeholder={`Phone ${phoneIndex + 1}`}
                                                                    readOnly={
                                                                        readOnly
                                                                    }
                                                                    className="flex-1"
                                                                />
                                                            )}
                                                        />
                                                        {!readOnly &&
                                                            phoneFields.length >
                                                                1 && (
                                                                <Button
                                                                    size="xs"
                                                                    type="button"
                                                                    icon={
                                                                        <HiMinus />
                                                                    }
                                                                    onClick={() =>
                                                                        removePhone(
                                                                            phoneIndex,
                                                                        )
                                                                    }
                                                                />
                                                            )}
                                                    </div>
                                                </FormItem>
                                            ),
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6">
                                <FormItem
                                    label="Address"
                                    invalid={Boolean(
                                        errors.location?.[index]?.address,
                                    )}
                                    errorMessage={
                                        errors.location?.[index]?.address
                                            ?.message
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
            })}
        </>
    )
}

export default LocationsSection
