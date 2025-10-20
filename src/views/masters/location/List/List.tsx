import ListLayout from '@/components/layouts/ListLayout'
import LocationListTableTools from './components/ListTableTools'
import LocationListSelected from './components/ListSelected'
import LocationListTable from './components/ListTable'
import { actionButtons } from './actionButtons'

const LocationList = () => {
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
