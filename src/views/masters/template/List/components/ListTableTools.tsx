import useTemplateList from '../hooks/useList'
import TemplateListSearch from './ListSearch'
import TemplateListTableFilter from './ListTableFilter'
import cloneDeep from 'lodash/cloneDeep'

const TemplateListTableTools = () => {
    const { tableData, setTableData } = useTemplateList()

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
            <TemplateListSearch onInputChange={handleInputChange} />
            <TemplateListTableFilter />
        </div>
    )
}

export default TemplateListTableTools
