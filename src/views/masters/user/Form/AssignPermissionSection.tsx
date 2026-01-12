/* eslint-disable @typescript-eslint/no-explicit-any */
import Card from '@/components/ui/Card'
import { FormSectionBaseProps } from '@/@types/user'
import AssignPermissionItem from './AssignPermissionItem'
import useRolesList from '../../RolesPermissions/hooks/useList'

const AssignPermissionSection = ({
    control,
    errors,
    readOnly = false,
}: FormSectionBaseProps) => {
    const { rolesList } = useRolesList()

    const roleOptions = rolesList.map((r: any) => ({
        label: r.name,
        value: r.id,
    }))

    return (
        <Card>
            <div className="mb-4">
                <h4>Role Assignment</h4>
            </div>

            <AssignPermissionItem
                control={control}
                errors={errors}
                readOnly={readOnly}
                name="userRoles.roles"
                roleOptions={roleOptions}
            />
        </Card>
    )
}

export default AssignPermissionSection
