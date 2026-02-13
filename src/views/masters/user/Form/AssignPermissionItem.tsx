import { Controller, useFormContext } from 'react-hook-form'
import { Select } from '@/components/ui'
import { FormItem } from '@/components/ui/Form'
import { UserSchemaType } from '@/schemas/user.schema'

type AssignPermissionItemProps = {
    roleOptions: {
        label: string
        value: string | number
    }[]
    readOnly?: boolean
    onRemove?: () => void
}

const AssignPermissionItem = ({
    roleOptions,
    readOnly = false,
}: AssignPermissionItemProps) => {
    const {
        control,
        formState: { errors },
    } = useFormContext<UserSchemaType>()
    return (
        <div className="mb-4 relative">
            <FormItem
                label="Role"
                invalid={!!errors?.role}
                errorMessage={errors?.role?.message as string}
            >
                <Controller
                    name="role"
                    control={control}
                    render={({ field }) => (
                        <Select
                            options={roleOptions}
                            placeholder="Select Role"
                            isDisabled={readOnly}
                            value={roleOptions.find(
                                (opt) => opt.value === field.value,
                            )}
                            onChange={(val) =>
                                field.onChange(val ? val.value : null)
                            }
                        />
                    )}
                />
            </FormItem>
        </div>
    )
}

export default AssignPermissionItem
