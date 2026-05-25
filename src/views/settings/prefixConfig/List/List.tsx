import ListLayout from '@/components/layouts/ListLayout'
import PrefixListTable from './components/ListTable'
import PrefixListTableTools from './components/ListTableTools'
import PrefixListSelected from './components/ListSelected'
import { actionButtons } from './actionButtons'

const PrefixList = () => {
    return (
        <ListLayout
            title="Prefix"
            ActionTools={actionButtons}
            TableTools={<PrefixListTableTools />}
            Table={<PrefixListTable />}
            SelectedComponent={<PrefixListSelected />}
        />
    )
}

export default PrefixList
