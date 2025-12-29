import ListLayout from '@/components/layouts/ListLayout'
import LocationListTableTools from './components/ListTableTools'
import LocationListSelected from './components/ListSelected'
import LocationListTable from './components/ListTable'
import { actionButtons } from './actionButtons'
import { useLocationListStore } from './store/listStore'
import { useEffect } from 'react'

const LocationList = () => {
    const resetQuery = useLocationListStore((state) => state.resetQuery)
    useEffect(() => {
        return () => {
            resetQuery()
        }
    }, [resetQuery])

    return (
        <ListLayout
            title="Location"
            ActionTools={actionButtons}
            TableTools={<LocationListTableTools />}
            Table={<LocationListTable />}
            SelectedComponent={<LocationListSelected />}
        />
    )
}

export default LocationList
