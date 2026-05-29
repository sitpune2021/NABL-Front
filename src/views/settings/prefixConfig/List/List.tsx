import ListLayout from '@/components/layouts/ListLayout'
import PrefixConfigListTableTools from './components/ListTableTools'
import PrefixConfigListSelected from './components/ListSelected'
import PrefixConfigListTable from './components/ListTable'
import { actionButtons } from './actionButtons'
import { usePrefixConfigListStore } from './store/listStore'
import { useEffect } from 'react'

const PrefixConfigList = () => {
    const resetQuery = usePrefixConfigListStore((state) => state.resetQuery)
    useEffect(() => {
        return () => {
            resetQuery()
        }
    }, [resetQuery])

    return (
        <ListLayout
            title="Prefix Config"
            ActionTools={actionButtons}
            TableTools={<PrefixConfigListTableTools />}
            Table={<PrefixConfigListTable />}
            SelectedComponent={<PrefixConfigListSelected />}
        />
    )
}

export default PrefixConfigList
