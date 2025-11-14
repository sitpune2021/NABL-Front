import Card from '@/components/ui/Card'
import { useFieldArray } from 'react-hook-form'
import { FormSectionBaseProps } from '@/@types/user'
import { Button } from '@/components/ui'
import AssignPermissionItem from './AssignPermissionItem'

const AssignPermissionSection = ({
    control,
    errors,
    readOnly = false,
}: FormSectionBaseProps) => {
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'userRoles',
    })
    const canRemove = fields.length > 1

    return (
        <>
            <Card>
                <div className="flex items-center justify-between gap-2">
                    <h4>Role Assignments</h4>
                    {!readOnly && (
                        <Button
                            type="button"
                            size="xs"
                            onClick={() =>
                                append({
                                    zone_name: '',
                                    cluster_name: '',
                                    location_name: '',
                                    department_name: '',
                                    roles: [],
                                })
                            }
                        >
                            +
                        </Button>
                    )}
                </div>
            </Card>

            {fields.map((item, index) => (
                <AssignPermissionItem
                    key={item.id}
                    control={control}
                    errors={errors}
                    readOnly={readOnly}
                    index={index}
                    item={item}
                    onRemove={canRemove ? () => remove(index) : undefined}
                />
            ))}
        </>
    )
}

export default AssignPermissionSection
