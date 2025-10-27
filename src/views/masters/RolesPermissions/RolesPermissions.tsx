import Container from '@/components/shared/Container'
import RolesPermissionsGroups from './components/RolesPermissionsGroups'
import RolesPermissionsGroupsAction from './components/RolesPermissionsGroupsAction'
import RolesPermissionsUserAction from './components/RolesPermissionsUserAction'
import RolesPermissionsUserTable from './components/RolesPermissionsUserTable'
import RolesPermissionsUserSelected from './components/RolesPermissionsUserSelected'
import RolesPermissionsAccessDialog from './components/RolesPermissionsAccessDialog'
import useRolesList from '../roles/List/hooks/useList'
import useUserList from '../user/List/hooks/useList'

const RolesPermissions = () => {
    const { rolesList, mutate: roleMutate } = useRolesList()
    console.log(rolesList)

    const {
        userList,
        userListTotal,
        mutate: userMutate,
        isLoading: userLoading,
    } = useUserList()

    return (
        <>
            <Container>
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3>Roles & Permissions</h3>
                        <RolesPermissionsGroupsAction />
                    </div>
                    <div className="mb-10">
                        <RolesPermissionsGroups roleList={rolesList} />
                    </div>
                </div>
                <div>
                    <div>
                        <div className="mb-6 flex flex-col gap-5">
                            <h3>All accounts</h3>
                            <div className="flex-1">
                                <RolesPermissionsUserAction />
                            </div>
                        </div>
                        <RolesPermissionsUserTable
                            userList={userList}
                            userListTotal={userListTotal}
                            isLoading={userLoading}
                            mutate={userMutate}
                            roleList={rolesList}
                        />
                    </div>
                </div>
            </Container>
            <RolesPermissionsAccessDialog
                roleList={rolesList}
                mutate={roleMutate}
            />
            <RolesPermissionsUserSelected
                userList={userList}
                userListTotal={userListTotal}
                mutate={userMutate}
            />
        </>
    )
}

export default RolesPermissions
