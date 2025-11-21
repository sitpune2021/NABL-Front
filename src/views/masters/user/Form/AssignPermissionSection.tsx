import Card from '@/components/ui/Card'
import { useFieldArray } from 'react-hook-form'
import { FormSectionBaseProps } from '@/@types/user'
import { Button } from '@/components/ui'
import AssignPermissionItem from './AssignPermissionItem'

const AssignPermissionSection = ({
    control,
    errors,
    readOnly = false,
    setValue,
}: FormSectionBaseProps) => {
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'userRoles',
    })

    const canRemove = fields.length > 1

    const addNewRole = () => {
        append({
            zone_name: '',
            cluster_name: '',
            location_name: '',
            department: [
                {
                    department_name: '',
                    roles: [],
                    permissions: {},
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
                <AssignPermissionItem
                    key={index} // use index if no stable id
                    control={control}
                    errors={errors}
                    readOnly={readOnly}
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

export default AssignPermissionSection
