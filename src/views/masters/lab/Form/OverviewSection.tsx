import { useEffect } from 'react'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { Controller, useFieldArray } from 'react-hook-form'
import { FormSectionBaseProps } from '@/@types/lab'
import useDepartmentList from '../../department/List/hooks/useList'
import { Select, Button } from '@/components/ui'

type OverviewSectionProps = FormSectionBaseProps & {
    existingLabCodes?: string[]
}

const OverviewSection = ({
    control,
    errors,
    readOnly = false,
}: OverviewSectionProps) => {
    const { departmentList } = useDepartmentList()

    const departmentOptions = departmentList.map((dept) => ({
        value: dept.name,
        label: dept.name.toUpperCase(),
    }))

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'location',
    })

    useEffect(() => {
        if (fields.length === 0 && !readOnly) {
            ;(append({ prefix: 'LOC-1', locationName: '', shortName: '' }),
                { shouldFocus: false, shouldValidate: false })
        }
    }, [])

    const addLocation = () => {
        const nextIndex = fields.length + 1
        append({ prefix: `LOC-${nextIndex}`, locationName: '', shortName: '' })
    }

    return (
        <Card>
            <h4 className="mb-6">Overview</h4>
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
                                type="text"
                                autoComplete="off"
                                readOnly={readOnly}
                                placeholder="Lab Name"
                                {...field}
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
                                type="text"
                                autoComplete="off"
                                readOnly={readOnly}
                                placeholder="Enter Lab Type"
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Departments"
                    invalid={Boolean(errors.department)}
                    errorMessage={errors.department?.message}
                >
                    <Controller
                        name="department"
                        control={control}
                        render={({ field }) => (
                            <Select
                                {...field}
                                isMulti
                                options={departmentOptions}
                                value={departmentOptions.filter((opt) =>
                                    field.value?.includes(opt.value),
                                )}
                                placeholder="Select Departments"
                                isDisabled={readOnly}
                                onChange={(options) =>
                                    field.onChange(
                                        options
                                            ? options.map((o) => o.value)
                                            : [],
                                    )
                                }
                            />
                        )}
                    />
                </FormItem>

                {/* Lab Code*/}
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
                                type="text"
                                autoComplete="off"
                                readOnly={true}
                                placeholder="Enter Lab Code"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
            </div>

            <h4 className="mt-8 mb-4">Locations</h4>
            {fields.map((item, index) => (
                <div
                    key={item.id}
                    className="grid md:grid-cols-3 gap-4 border p-3 rounded-md mb-3"
                >
                    <FormItem label="Prefix">
                        <Controller
                            name={`locations.${index}.prefix`}
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    readOnly
                                    placeholder="LOC-1"
                                />
                            )}
                        />
                    </FormItem>

                    <FormItem label="Location Name">
                        <Controller
                            name={`locations.${index}.locationName`}
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    readOnly={readOnly}
                                    placeholder="Full Location Name"
                                />
                            )}
                        />
                    </FormItem>

                    <FormItem label="Short Name">
                        <Controller
                            name={`locations.${index}.shortName`}
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    readOnly={readOnly}
                                    placeholder="Short Name"
                                />
                            )}
                        />
                    </FormItem>

                    {!readOnly && (
                        <div className="col-span-3 flex justify-end">
                            <Button
                                variant="plain"
                                color="red"
                                onClick={() => remove(index)}
                            >
                                Remove Location
                            </Button>
                        </div>
                    )}
                </div>
            ))}

            {!readOnly && (
                <div className="mt-2">
                    <Button variant="solid" onClick={addLocation}>
                        ➕ Add Location
                    </Button>
                </div>
            )}

            {/* Personal Details Section */}
            <h4 className="mt-8 mb-4">Personal Details</h4>
            <div className="grid md:grid-cols-2 gap-4">
                {/* Email */}
                <FormItem
                    label="Email"
                    invalid={Boolean(errors.email)}
                    errorMessage={errors.email?.message}
                >
                    <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="email"
                                autoComplete="off"
                                readOnly={readOnly}
                                placeholder="Enter Email"
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                {/* Phone */}
                <FormItem
                    label="Phone"
                    invalid={Boolean(errors.phone)}
                    errorMessage={errors.phone?.message}
                >
                    <Controller
                        name="phone"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="tel"
                                autoComplete="off"
                                readOnly={readOnly}
                                placeholder="Enter Phone Number"
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                {/* Address */}
                <FormItem
                    label="Address"
                    invalid={Boolean(errors.address)}
                    errorMessage={errors.address?.message}
                >
                    <Controller
                        name="address"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                readOnly={readOnly}
                                placeholder="Enter Address"
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
