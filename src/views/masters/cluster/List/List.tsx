import ListLayout from '@/components/layouts/ListLayout'
import ClusterListTableTools from './components/ListTableTools'
import ClusterListSelected from './components/ListSelected'
import ClusterListTable from './components/ListTable'
import { actionButtons } from './actionButtons'

const ClusterList = () => {
    return (
        <ListLayout
            title="Cluster"
            ActionTools={actionButtons}
            TableTools={<ClusterListTableTools />}
            Table={<ClusterListTable />}
            SelectedComponent={<ClusterListSelected />}
        />
    )
}

export default ClusterList
