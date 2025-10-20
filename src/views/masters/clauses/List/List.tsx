import ListLayout from '@/components/layouts/ListLayout'
import { actionButtons } from './actionButtons'
import ClausesListTableTools from './components/ListTableTools'
import ClausesListSelected from './components/ListSelected'
import ClausesListTable from './components/ListTable'

const ClausesList = () => {
    return (
        <ListLayout
            title="Clauses"
            ActionTools={actionButtons}
            TableTools={<ClausesListTableTools />}
            Table={<ClausesListTable />}
            SelectedComponent={<ClausesListSelected />}
        />
    )
}

export default ClausesList
