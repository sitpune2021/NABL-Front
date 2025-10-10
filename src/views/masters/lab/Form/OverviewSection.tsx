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
    existingLabCodes = [],
}: OverviewSectionProps) => {
    const { departmentList } = useDepartmentList()

    const departmentOptions = departmentList.map((dept) => ({
        value: dept.name,
        label: dept.name.toUpperCase(),
    }))

    // Lab Code auto-generation function
    const getNextLabCode = () => {
        if (!existingLabCodes || existingLabCodes.length === 0) return 'LAB-1'

        // Extract numbers from existing codes and remove duplicates
        const numbers = Array.from(new Set(existingLabCodes))
            .map((code) => {
                const match = code.match(/^LAB-(\d+)$/)
                return match ? parseInt(match[1], 10) : 0
            })
            .filter(Boolean)

        const nextNumber = numbers.length > 0 ? Math.max(...numbers) + 1 : 1
        return `LAB-${nextNumber}`
    }

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
                    invalid={Boolean(errors.category)}
                    errorMessage={errors.category?.message}
                >
                    <Controller
                        name="category"
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
                        rules={{
                            required: 'Lab Code is required',
                            pattern: {
                                value: /^LAB-\d+$/,
                                message:
                                    'Lab Code must be in format LAB-<number>',
                            },
                            validate: (value) =>
                                !existingLabCodes.includes(value) ||
                                'This Lab Code already exists',
                        }}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                readOnly={readOnly}
                                placeholder="Enter Lab Code"
                                {...field}
                                onFocus={() => {
                                    if (!field.value) {
                                        field.onChange(getNextLabCode())
                                    }
                                }}
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
