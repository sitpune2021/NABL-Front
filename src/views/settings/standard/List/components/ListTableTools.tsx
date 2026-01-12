import { Search } from '@/components/form'
import { useCallback } from 'react'
import debounce from 'lodash/debounce'
import { useStandardList } from '../hooks/useList'

const StandardListTableTools = () => {
    const { updateTable } = useStandardList()

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
        </div>
    )
}

export default StandardListTableTools
