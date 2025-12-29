import ListLayout from '@/components/layouts/ListLayout'
import ZoneListTableTools from './components/ListTableTools'
import ZoneListSelected from './components/ListSelected'
import ZoneListTable from './components/ListTable'
import { actionButtons } from './actionButtons'
import { useZoneListStore } from './store/listStore'
import { useEffect } from 'react'

const ZoneList = () => {
    const resetQuery = useZoneListStore((state) => state.resetQuery)
    useEffect(() => {
        return () => {
            resetQuery()
        }
    }, [resetQuery])

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
