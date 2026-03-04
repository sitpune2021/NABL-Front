/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react'
import {
    Controller,
    useFieldArray,
    useFormContext,
    useWatch,
} from 'react-hook-form'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { Button, Checkbox, Select } from '@/components/ui'
import { HiPlus, HiMinus } from 'react-icons/hi'
import { FormSectionBaseProps } from '@/@types/lab'

export type FormSectionBasePropsTwo = {
    index: number
    item: any
    removeLocation: (index: number) => void
} & FormSectionBaseProps & {
        zoneList: any[]
        clusterList: any[]
        locationList: any[]
        departmentList: any[]
        instrumentList: any[]
    }

const LocationsItems = ({
    control,
    errors,
    readOnly = false,
    index,
    item,
    removeLocation,
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
            const basePrefix = `LOC-${locationMatch.identifier}`
            const allLocations = watch('location') || []

            const similar = allLocations
                .map((loc: any) => loc?.prefix)
                .filter((p: string) => p && p.startsWith(basePrefix))

            const nextNum = (similar.length + 1).toString().padStart(2, '0')
            const finalPrefix = `${basePrefix}-${nextNum}`

            const currentPrefix = watch(`location.${index}.prefix`)
            if (!currentPrefix || !currentPrefix.startsWith(basePrefix)) {
                setValue(`location.${index}.prefix`, finalPrefix)
            }
        } else {
            setValue(`location.${index}.prefix`, '')
        }
    }, [selectedLocationName, selectedCluster, selectedZone])

    const {
        fields: departmentFields,
        append: addDepartment,
        remove: removeDepartment,
    } = useFieldArray({ control, name: `location.${index}.departments` })

    const {
        fields: emailFields,
        append: addEmail,
        remove: removeEmail,
    } = useFieldArray({ control, name: `location.${index}.emails` })

    const {
        fields: phoneFields,
        append: addPhone,
        remove: removePhone,
    } = useFieldArray({ control, name: `location.${index}.phones` })

    const emailsValues =
        useWatch({ control, name: `location.${index}.emails` }) || []
    const phonesValues =
        useWatch({ control, name: `location.${index}.phones` }) || []

    const handlePrimaryChange = (
        isEmail: boolean,
        index: number,
        checked: boolean,
    ) => {
        const fieldName = isEmail ? 'emails' : 'phones'
        const items = isEmail ? emailsValues : phonesValues

        if (!items) return

        const updated = items.map((item: any, i: any) => ({
            ...item,
            is_primary: i === index ? checked : false,
            label:
                i === index ? (checked ? 'primary' : 'alternate') : 'alternate',
        }))

        setValue(fieldName, updated, { shouldValidate: true })
    }

    return (
        <Card
            key={item.id}
            className="mt-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
        >
            <div className="flex justify-between items-center px-4 pt-4">
                <h4 className="text-gray-800 dark:text-gray-100">
                    Location {index + 1}
                </h4>

                {!readOnly && index > 0 && (
                    <Button
                        type="button"
                        size="xs"
                        icon={<HiMinus />}
                        variant="solid"
                        className="bg-red-500 hover:bg-red-600"
                        onClick={() => removeLocation(index)}
                    />
                )}
            </div>
            <div className="grid md:grid-cols-4 gap-4 p-3 mb-3">
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
                                    label: z.name,
                                    value: z.id,
                                }))}
                                value={
                                    zoneList
                                        .map((z) => ({
                                            label: z.name,
                                            value: z.id,
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
                                placeholder="Select Cluster"
                                isDisabled={readOnly || !selectedZone}
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
                                        .find((o) => o.value === field.value) ||
                                    null
                                }
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
                                placeholder="Select Location"
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
                                        .find((o) => o.value === field.value) ||
                                    null
                                }
                                isDisabled={!selectedCluster || readOnly}
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
                        render={({ field }) => <Input {...field} readOnly />}
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
                                    label: i.name,
                                    value: i.id,
                                }))}
                                value={instrumentList
                                    .map((i) => ({
                                        label: i.name,
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

            <div className="mt-4">
                <div className="flex justify-between mb-2">
                    <h5 className="text-gray-800 dark:text-gray-200">
                        Departments
                    </h5>
                    {!readOnly && (
                        <Button
                            type="button"
                            size="xs"
                            onClick={() =>
                                addDepartment({
                                    id: null,
                                    name: '',
                                    instruments: [],
                                })
                            }
                        >
                            + Add
                        </Button>
                    )}
                </div>

                {departmentFields.map((dept, deptIndex) => (
                    <div
                        key={dept.id}
                        className="bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700 p-3 mb-4 rounded-lg"
                    >
                        <div className="flex justify-end mb-2">
                            {!readOnly && departmentFields.length > 1 && (
                                <Button
                                    type="button"
                                    size="xs"
                                    className="mt-2"
                                    onClick={() => removeDepartment(deptIndex)}
                                >
                                    Remove
                                </Button>
                            )}
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
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

                            <FormItem label="Department Instruments">
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
                                                .map((i) => ({
                                                    label: i.name,
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
                    </div>
                ))}
            </div>

            <div className="mt-6">
                <h4 className="mb-6 text-gray-800 dark:text-gray-100">
                    Contact Person
                </h4>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Emails */}
                    <div>
                        <div className="flex justify-between mb-4">
                            <label className="text-gray-700 dark:text-gray-300">
                                Emails
                            </label>
                            {!readOnly && (
                                <Button
                                    type="button"
                                    size="xs"
                                    onClick={() =>
                                        addEmail({
                                            id: null,
                                            user_id: null,
                                            type: 'email',
                                            value: '',
                                        })
                                    }
                                >
                                    <HiPlus />
                                </Button>
                            )}
                        </div>

                        {emailFields.map((email, emailIndex) => (
                            <FormItem key={email.id}>
                                <div className="flex gap-2">
                                    <Controller
                                        name={`location.${index}.emails.${emailIndex}.value`}
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                readOnly={readOnly}
                                            />
                                        )}
                                    />
                                    <Controller
                                        name={`location.${index}.emails.${emailIndex}.is_primary`}
                                        control={control}
                                        render={({ field }) => (
                                            <Checkbox
                                                checked={field.value}
                                                disabled={readOnly}
                                                aria-label="Primary Email"
                                                onChange={(checked) =>
                                                    handlePrimaryChange(
                                                        true,
                                                        emailIndex,
                                                        checked,
                                                    )
                                                }
                                            />
                                        )}
                                    />
                                    <Controller
                                        name={`location.${index}.emails.${emailIndex}.label`}
                                        control={control}
                                        render={({ field }) => (
                                            <Input type="hidden" {...field} />
                                        )}
                                    />
                                    {!readOnly && emailFields.length > 1 && (
                                        <Button
                                            size="xs"
                                            type="button"
                                            onClick={() =>
                                                removeEmail(emailIndex)
                                            }
                                        >
                                            <HiMinus />
                                        </Button>
                                    )}
                                </div>
                            </FormItem>
                        ))}
                    </div>

                    {/* Phones */}
                    <div>
                        <div className="flex justify-between mb-4">
                            <label>Phones</label>
                            {!readOnly && (
                                <Button
                                    type="button"
                                    size="xs"
                                    onClick={() =>
                                        addPhone({
                                            id: null,
                                            user_id: null,
                                            type: 'phone',
                                            value: '',
                                        })
                                    }
                                >
                                    <HiPlus />
                                </Button>
                            )}
                        </div>

                        {phoneFields.map((phone, phoneIndex) => (
                            <FormItem key={phone.id}>
                                <div className="flex gap-2">
                                    <Controller
                                        name={`location.${index}.phones.${phoneIndex}.value`}
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                readOnly={readOnly}
                                            />
                                        )}
                                    />
                                    <Controller
                                        name={`location.${index}.phones.${phoneIndex}.is_primary`}
                                        control={control}
                                        render={({ field }) => (
                                            <Checkbox
                                                checked={field.value}
                                                disabled={readOnly}
                                                aria-label="Primary Phone"
                                                onChange={(checked) =>
                                                    handlePrimaryChange(
                                                        false,
                                                        phoneIndex,
                                                        checked,
                                                    )
                                                }
                                            />
                                        )}
                                    />
                                    <Controller
                                        name={`location.${index}.phones.${phoneIndex}.label`}
                                        control={control}
                                        render={({ field }) => (
                                            <input type="hidden" {...field} />
                                        )}
                                    />
                                    {!readOnly && phoneFields.length > 1 && (
                                        <Button
                                            type="button"
                                            size="xs"
                                            onClick={() =>
                                                removePhone(phoneIndex)
                                            }
                                        >
                                            <HiMinus />
                                        </Button>
                                    )}
                                </div>
                            </FormItem>
                        ))}
                    </div>
                </div>

                {/* Address */}
                <div className="mt-6">
                    <FormItem label="Address">
                        <Controller
                            name={`location.${index}.address`}
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    textArea
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
