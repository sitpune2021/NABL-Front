import { Search } from '@/components/form'
import useClusterList from '../hooks/useList'
import ClusterListTableFilter from './ListTableFilter'
import { useCallback } from 'react'
import debounce from 'lodash/debounce'
import useAuth from '@/auth/useAuth'
import ClusterPendingDrawer from './ClusterPendingDrawer'
import ClusterListTableSync from './ListTableSync'

const ClusterListTableTools = () => {
    const { updateTable } = useClusterList()
    const { can } = useAuth()

    const handleInputChange = useCallback(
        debounce((val: string) => {
            updateTable({
                query: val,
                pageIndex: 1,
            })
        }, 300),
        [updateTable],
    )

    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <Search onInputChange={handleInputChange} />
            <ClusterListTableFilter />
            {can('masters.cluster.sync') && <ClusterListTableSync />}
            {can('masters.cluster.sync') && <ClusterPendingDrawer />}
        </div>
    )
}

export default ClusterListTableTools
