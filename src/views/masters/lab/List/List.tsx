import ListLayout from '@/components/layouts/ListLayout'
import { actionButtons } from './actionButtons'
import LabListTableTools from './components/ListTableTools'
import LabListSelected from './components/ListSelected'
import LabListTable from './components/ListTable'

const LabList = () => {
    return (
        <ListLayout
            title="Lab"
            ActionTools={actionButtons}
            TableTools={<LabListTableTools />}
            Table={<LabListTable />}
            SelectedComponent={<LabListSelected />}
        />
    )
}

export default LabList
