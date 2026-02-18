import { useCallback } from 'react'
import { Search } from '@/components/form'
import { useCategoryList } from '../hooks/useList'
import debounce from 'lodash/debounce'
import CategoryListTableSync from './ListTableSync'
import useAuth from '@/auth/useAuth'

const CategoryListTableTools = () => {
    const { updateTable } = useCategoryList()
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
            {can('masters.category.sync') && <CategoryListTableSync />}
        </div>
    )
}

export default CategoryListTableTools
