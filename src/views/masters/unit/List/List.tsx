import ListLayout from '@/components/layouts/ListLayout'
import UnitListTableTools from './components/ListTableTools'
import UnitListSelected from './components/ListSelected'
import UnitListTable from './components/ListTable'
import { actionButtons } from './actionButtons'
import { useUnitListStore } from './store/listStore'
import { useEffect } from 'react'

const UnitList = () => {
    const resetQuery = useUnitListStore((state) => state.resetQuery)

    useEffect(() => {
        return () => {
            resetQuery()
        }
    }, [resetQuery])

    return (
        <ListLayout
            title="Unit"
            ActionTools={actionButtons}
            TableTools={<UnitListTableTools />}
            Table={<UnitListTable />}
            SelectedComponent={<UnitListSelected />}
        />
    )
}

export default UnitList
