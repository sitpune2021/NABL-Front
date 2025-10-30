import useInstrumentList from '../hooks/useList'
import InstrumentListSearch from './ListSearch'
import InstrumentListTableFilter from './ListTableFilter'
import cloneDeep from 'lodash/cloneDeep'

const InstrumentListTableTools = () => {
    const { tableData, setTableData } = useInstrumentList()

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
            <InstrumentListSearch onInputChange={handleInputChange} />
            <InstrumentListTableFilter />
        </div>
    )
}

export default InstrumentListTableTools
