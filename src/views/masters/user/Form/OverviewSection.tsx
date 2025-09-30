import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { Controller } from 'react-hook-form'
import useRoleList from '../../roles/List/hooks/useList'
import { FormSectionBaseProps } from '@/@types/user'
import { Select } from '@/components/ui'

type OverviewSectionProps = FormSectionBaseProps

const OverviewSection = ({
    control,
    errors,
    readOnly,
}: OverviewSectionProps) => {
    const { rolesList } = useRoleList()

    const options = rolesList.map((role) => ({
        value: role.name,
        label: role.name.toUpperCase(),
    }))

    return (
        <Card>
            <h4 className="mb-6">User Overview</h4>
            <div className="grid md:grid-cols-2 gap-4">
                {/* Name */}
                <FormItem
                    label="Name"
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
                                placeholder="Full Name"
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                {/* Username */}
                <FormItem
                    label="Username"
                    invalid={Boolean(errors.username)}
                    errorMessage={errors.username?.message}
                >
                    <Controller
                        name="username"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                readOnly={readOnly}
                                placeholder="Enter Username"
                                {...field}
                            />
                        )}
                    />
                </FormItem>

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

                <FormItem
                    label="Role"
                    invalid={Boolean(errors.role)}
                    errorMessage={errors.role?.message}
                >
                    <Controller
                        name="role"
                        control={control}
                        render={({ field }) => (
                            <Select
                                {...field}
                                value={options.filter(
                                    (option) => option.value === field.value,
                                )}
                                options={options}
                                placeholder="Select Role"
                                isDisabled={readOnly}
                                onChange={(option) =>
                                    field.onChange(option?.value)
                                }
                            />
                        )}
                    />
                </FormItem>

                {/* Profile Image */}
                <FormItem
                    label="Profile Image"
                    invalid={Boolean(errors.profileImage)}
                    errorMessage={errors.profileImage?.message}
                >
                    <Controller
                        name="profileImage"
                        control={control}
                        render={({ field }) => (
                            <Input
                                ref={field.ref}
                                type="file"
                                accept="image/*"
                                readOnly={readOnly}
                                onChange={(e) =>
                                    field.onChange(
                                        (e.target as HTMLInputElement)
                                            .files?.[0],
                                    )
                                }
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
