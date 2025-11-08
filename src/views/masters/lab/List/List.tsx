import ListLayout from '@/components/layouts/ListLayout'
import { actionButtons } from './actionButtons'
import LabListTableTools from './components/ListTableTools'
import LabListSelected from './components/ListSelected'
import LabListTable from './components/ListTable'
import { useParams } from 'react-router'
import LocationLabListTable from './components/LocationListTable'

const LabList = () => {
    const { id: labId } = useParams()
    console.log(labId ? 'lab' : 'loc')

    return (
        <ListLayout
            title={!labId ? 'Labs' : 'Location'}
            ActionTools={actionButtons}
            TableTools={<LabListTableTools />}
            Table={!labId ? <LabListTable /> : <LocationLabListTable />}
            SelectedComponent={<LabListSelected />}
        />
    )
}

export default LabList
