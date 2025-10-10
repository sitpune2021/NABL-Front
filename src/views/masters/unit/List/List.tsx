import ListLayout from '@/components/layouts/ListLayout'
import UnitListTableTools from './components/ListTableTools'
import UnitListSelected from './components/ListSelected'
import UnitListTable from './components/ListTable'
import { actionButtons } from './actionButtons'

const UnitList = () => {
    return (
        <ListLayout
            title="Unit"
            ActionTools={actionButtons}
            TableTools={<UnitListTableTools />}
            Table={<UnitListTable />}
            SelectedComponent={<UnitListSelected />}
        />
    )
}

export default UnitList
