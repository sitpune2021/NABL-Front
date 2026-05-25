import { useCallback } from 'react'
import { Search } from '@/components/form'
import debounce from 'lodash/debounce'
import { usePrefixListStore } from '../store/listStore'

const PrefixListTableTools = () => {
    const { updateTable } = usePrefixListStore()

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

export default PrefixListTableTools
