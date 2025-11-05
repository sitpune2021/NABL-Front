import { Search } from '@/components/form'
import useSubCategoryList from '../hooks/useList'
import SubCategoryListTableFilter from './ListTableFilter'
import cloneDeep from 'lodash/cloneDeep'

const SubCategoryListTableTools = () => {
    const { tableData, setTableData } = useSubCategoryList()

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
            <Search onInputChange={handleInputChange} />
            <SubCategoryListTableFilter />
        </div>
    )
}

export default SubCategoryListTableTools
