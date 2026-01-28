import { useCallback } from 'react'
import { Search } from '@/components/form'
import { useMenuList } from '../hooks/useList'
import debounce from 'lodash/debounce'

const MenuListTableTools = () => {
    const { updateTable } = useMenuList()

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

export default MenuListTableTools
