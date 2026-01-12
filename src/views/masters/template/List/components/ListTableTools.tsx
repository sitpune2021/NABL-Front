import { Search } from '@/components/form'
import useTemplateList from '../hooks/useList'
import TemplateListTableFilter from './ListTableFilter'
import { useCallback } from 'react'
import debounce from 'lodash/debounce'

const TemplateListTableTools = () => {
    const { updateTable } = useTemplateList()

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
            <TemplateListTableFilter />
        </div>
    )
}

export default TemplateListTableTools
