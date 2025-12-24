import ListLayout from '@/components/layouts/ListLayout'
import { actionButtons } from './actionButtons'
import StandardListTableTools from './components/ListTableTools'
import StandardListSelected from './components/ListSelected'
import StandardListTable from './components/ListTable'

const StandardList = () => {
    return (
        <ListLayout
            title="Standards"
            ActionTools={actionButtons}
            TableTools={<StandardListTableTools />}
            Table={<StandardListTable />}
            SelectedComponent={<StandardListSelected />}
        />
    )
}

export default StandardList
