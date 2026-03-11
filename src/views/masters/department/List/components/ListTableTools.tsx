import { Search } from '@/components/form'
import useDepartmentList from '../hooks/useList'
import { useCallback } from 'react'
import debounce from 'lodash/debounce'
import DepartmentListTableSync from './ListTableSync'
import useAuth from '@/auth/useAuth'
import DepartmentPendingDrawer from './DepartmentPendingDrawer'

const DepartmentListTableTools = () => {
    const { updateTable } = useDepartmentList()
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
            {can('masters.department.sync') && <DepartmentListTableSync />}
            {can('masters.department.sync') && <DepartmentPendingDrawer />}
        </div>
    )
}

export default DepartmentListTableTools
