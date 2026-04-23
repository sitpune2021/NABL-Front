import Button from '@/components/ui/Button'
import { useRolePermissionsStore } from '../store/rolePermissionsStore'
import { TbPlaylistAdd } from 'react-icons/tb'

const RolesPermissionsGroupsAction = () => {
    const { setRoleDialog } = useRolePermissionsStore()

    return (
        <div>
            <Button
                variant="solid"
                icon={<TbPlaylistAdd className="text-xl" />}
                onClick={() =>
                    setRoleDialog({
                        type: 'new',
                        open: true,
                    })
                }
            >
                New
            </Button>
        </div>
    )
}

export default RolesPermissionsGroupsAction
