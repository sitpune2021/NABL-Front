import { Search } from '@/components/form'
import useUnitList from '../hooks/useList'
import { useCallback } from 'react'
import debounce from 'lodash/debounce'
import UnitListTableSync from './ListTableSync'

const UnitListTableTools = () => {
    const { updateTable } = useUnitList()

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
            <UnitListTableSync />
        </div>
    )
}

export default UnitListTableTools
