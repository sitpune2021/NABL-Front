import ListLayout from '@/components/layouts/ListLayout'
import { actionButtons } from './actionButtons'
import UnitListTableTools from './components/ListTableTools'
import UnitListSelected from './components/ListSelected'
import UnitListTable from './components/ListTable'

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
