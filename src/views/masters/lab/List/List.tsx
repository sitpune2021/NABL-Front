import ListLayout from '@/components/layouts/ListLayout'
import { actionButtons } from './actionButtons'
import LabListTableTools from './components/ListTableTools'
import LabListSelected from './components/ListSelected'
import LabListTable from './components/ListTable'
import { useLabListStore } from './store/listStore'
import { useEffect } from 'react'

const LabList = () => {
    const resetQuery = useLabListStore((state) => state.resetQuery)

    useEffect(() => {
        return () => {
            resetQuery()
        }
    }, [resetQuery])

    return (
        <ListLayout
            title={'Labs'}
            ActionTools={actionButtons}
            TableTools={<LabListTableTools />}
            Table={<LabListTable />}
            SelectedComponent={<LabListSelected />}
        />
    )
}

export default LabList
