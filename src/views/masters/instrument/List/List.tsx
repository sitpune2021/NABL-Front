import ListLayout from '@/components/layouts/ListLayout'
import InstrumentListTableTools from './components/ListTableTools'
import InstrumentListSelected from './components/ListSelected'
import InstrumentListTable from './components/ListTable'
import { actionButtons } from './actionButtons'

const InstrumentList = () => {
    return (
        <ListLayout
            title="Instrument"
            ActionTools={actionButtons}
            TableTools={<InstrumentListTableTools />}
            Table={<InstrumentListTable />}
            SelectedComponent={<InstrumentListSelected />}
        />
    )
}

export default InstrumentList
