import Card from '@/components/ui/Card'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { FormSectionBaseProps } from '@/@types/user'
import { Button } from '@/components/ui'
import AssignLabPermissionItem from './AssignLabPermissionItem'
import { UserSchemaType } from '@/schemas/user.schema'

const AssignLabPermissionSection = ({
    readOnly = false,
    loading,
}: FormSectionBaseProps) => {
    const {
        control,
        formState: { errors },
        setValue,
    } = useFormContext<UserSchemaType>()

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'userRoles',
    })

    const canRemove = fields.length > 1

    const addNewRole = () => {
        append({
            zone_id: '',
            cluster_id: '',
            location_id: '',
            department: [
                {
                    department_id: '',
                    roles: [],
                    // permissions: {},
                },
            ],
        })
    }

    return (
        <Card>
            <div className="flex items-center justify-between gap-2 mb-4">
                <h4>Role Assignments</h4>
                {!readOnly && (
                    <Button type="button" size="xs" onClick={addNewRole}>
                        +
                    </Button>
                )}
            </div>

            {fields.map((_, index) => (
                <AssignLabPermissionItem
                    key={index} // use index if no stable id
                    control={control}
                    errors={errors}
                    readOnly={readOnly || loading}
                    index={index}
                    setValue={setValue}
                    onRemove={
                        !readOnly && canRemove ? () => remove(index) : undefined
                    }
                />
            ))}
        </Card>
    )
}

export default AssignLabPermissionSection
