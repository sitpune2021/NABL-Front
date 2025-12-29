import { Search } from '@/components/form'
import useClusterList from '../hooks/useList'
import ClusterListTableFilter from './ListTableFilter'
import { useCallback } from 'react'
import debounce from 'lodash/debounce'

const ClusterListTableTools = () => {
    const { updateTable } = useClusterList()

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
        </div>
    )
}

export default ClusterListTableTools
