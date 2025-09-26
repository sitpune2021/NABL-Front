import useCategoryList from '../hooks/useList'
import CategoryListSearch from './ListSearch'
import CategoryListTableFilter from './ListTableFilter'
import cloneDeep from 'lodash/cloneDeep'

const CategoryListTableTools = () => {
    const { tableData, setTableData } = useCategoryList()

    const handleInputChange = (val: string) => {
        const newTableData = cloneDeep(tableData)
        newTableData.query = val
        newTableData.pageIndex = 1
        if (typeof val === 'string' && val.length > 1) {
            setTableData(newTableData)
        }

        if (typeof val === 'string' && val.length === 0) {
            setTableData(newTableData)
        }
    }

    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <CategoryListSearch onInputChange={handleInputChange} />
            <CategoryListTableFilter />
        </div>
    )
}

export default CategoryListTableTools
