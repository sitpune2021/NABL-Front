import ListLayout from '@/components/layouts/ListLayout'
import { actionButtons } from './actionButtons'
import DepartmentListTableTools from './components/ListTableTools'
import DepartmentListSelected from './components/ListSelected'
import DepartmentListTable from './components/ListTable'

const DepartmentList = () => {
    return (
        <ListLayout
            title="Department"
            ActionTools={actionButtons}
            TableTools={<DepartmentListTableTools />}
            Table={<DepartmentListTable />}
            SelectedComponent={<DepartmentListSelected />}
        />
    )
}

export default DepartmentList
