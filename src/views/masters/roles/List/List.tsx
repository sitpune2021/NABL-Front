import ListLayout from '@/components/layouts/ListLayout'
import { actionButtons } from './actionButtons'
import RolesListTableTools from './components/ListTableTools'
import RolesListSelected from './components/ListSelected'
import RolesListTable from './components/ListTable'

const RolesList = () => {
    return (
        <ListLayout
            title="Roles"
            ActionTools={actionButtons}
            TableTools={<RolesListTableTools />}
            Table={<RolesListTable />}
            SelectedComponent={<RolesListSelected />}
        />
    )
}

export default RolesList
