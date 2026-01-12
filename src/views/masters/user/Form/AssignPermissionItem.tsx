/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller } from 'react-hook-form'
import { Select } from '@/components/ui'
import { FormItem } from '@/components/ui/Form'

type AssignPermissionItemProps = {
    name: string
    roleOptions: {
        label: string
        value: string | number
    }[]
    readOnly?: boolean
    onRemove?: () => void
    control: any
    errors: any
}

const AssignPermissionItem = ({
    control,
    name,
    errors,
    roleOptions,
    readOnly = false,
}: AssignPermissionItemProps) => {
    return (
        <div className="mb-4 relative">
            <FormItem
                label="Role"
                invalid={!!errors?.userRoles?.roles}
                errorMessage={errors?.userRoles?.roles?.message}
            >
                <Controller
                    name={name}
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
