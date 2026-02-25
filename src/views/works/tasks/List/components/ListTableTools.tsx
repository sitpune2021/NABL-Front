import { Search } from '@/components/form'
import useDocumentList from '../hooks/useList'
import DocumentListTableFilter from './ListTableFilter'
import cloneDeep from 'lodash/cloneDeep'

const DocumentListTableTools = () => {
    const { tableData, setTableData } = useDocumentList()

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
            <DocumentListTableFilter />
        </div>
    )
}

export default DocumentListTableTools
