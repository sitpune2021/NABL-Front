import { Search } from '@/components/form'
import useSubCategoryList from '../hooks/useList'
import SubCategoryListTableFilter from './ListTableFilter'
import { useCallback } from 'react'
import debounce from 'lodash/debounce'

const SubCategoryListTableTools = () => {
    const { updateTable } = useSubCategoryList()

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
            <SubCategoryListTableFilter />
        </div>
    )
}

export default SubCategoryListTableTools
