import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { Controller } from 'react-hook-form'
import { FormSectionBaseProps } from '@/@types/lab'
import useDepartmentList from '../../department/List/hooks/useList'
import { Select } from '@/components/ui'

type OverviewSectionProps = FormSectionBaseProps & {
    existingLabCodes?: string[] // Existing Lab codes list for auto-generation
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

    return (
        <Card>
            <h4 className="mb-6">Overview</h4>
            <div className="grid md:grid-cols-2 gap-4">
                {/* Lab Name */}
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

                {/* Lab Type */}
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

                {/* Department Name */}
                <FormItem
                    label="Department Name"
                    invalid={Boolean(errors.department)}
                    errorMessage={errors.department?.message}
                >
                    <Controller
                        name="department"
                        control={control}
                        render={({ field }) => (
                            <Select
                                {...field}
                                value={departmentOptions.filter(
                                    (option) => option.value === field.value,
                                )}
                                options={departmentOptions}
                                placeholder="Select Department"
                                isDisabled={readOnly}
                                onChange={(option) =>
                                    field.onChange(option?.value)
                                }
                            />
                        )}
                    />
                </FormItem>

                {/* Locations */}
                <FormItem
                    label="Locations"
                    invalid={Boolean(errors.location)}
                    errorMessage={errors.location?.message}
                >
                    <Controller
                        name="location"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                readOnly={readOnly}
                                placeholder="Enter Locations"
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                {/* Lab Code */}
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
