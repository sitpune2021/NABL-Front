import ListLayout from '@/components/layouts/ListLayout'
import ClusterListTableTools from './components/ListTableTools'
import ClusterListSelected from './components/ListSelected'
import ClusterListTable from './components/ListTable'
import { actionButtons } from './actionButtons'
import { useClusterListStore } from './store/listStore'
import { useEffect } from 'react'

const ClusterList = () => {
    const resetQuery = useClusterListStore((state) => state.resetQuery)
    useEffect(() => {
        return () => {
            resetQuery()
        }
    }, [resetQuery])
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
