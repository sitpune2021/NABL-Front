import ListLayout from '@/components/layouts/ListLayout'
import ZoneListTableTools from './components/ListTableTools'
import ZoneListSelected from './components/ListSelected'
import ZoneListTable from './components/ListTable'
import { actionButtons } from './actionButtons'

const ZoneList = () => {
    return (
        <ListLayout
            title="Zone"
            ActionTools={actionButtons}
            TableTools={<ZoneListTableTools />}
            Table={<ZoneListTable />}
            SelectedComponent={<ZoneListSelected />}
        />
    )
}

export default ZoneList
