import ListLayout from '@/components/layouts/ListLayout'
import DepartmentListTableTools from './components/ListTableTools'
import DepartmentListSelected from './components/ListSelected'
import DepartmentListTable from './components/ListTable'
import { actionButtons } from './actionButtons'
import { useDepartmentListStore } from './store/listStore'
import { useEffect } from 'react'

const DepartmentList = () => {
    const resetQuery = useDepartmentListStore((state) => state.resetQuery)

    useEffect(() => {
        return () => {
            resetQuery()
        }
    }, [resetQuery])

    return (
        <ListLayout
            title="Department"
            ActionTools={actionButtons}
            TableTools={<DepartmentListTableTools />}
            Table={<DepartmentListTable />}
            SelectedComponent={<DepartmentListSelected />}
        />
    )
}

export default DepartmentList
