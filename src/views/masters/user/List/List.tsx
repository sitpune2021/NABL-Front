import ListLayout from '@/components/layouts/ListLayout'
import { actionButtons } from './actionButtons'
import UserListTableTools from './components/ListTableTools'
import UserListSelected from './components/ListSelected'
import UserListTable from './components/ListTable'

const UserList = () => {
    return (
        <ListLayout
            title="User"
            ActionTools={actionButtons}
            TableTools={<UserListTableTools />}
            Table={<UserListTable />}
            SelectedComponent={<UserListSelected />}
        />
    )
}

export default UserList
