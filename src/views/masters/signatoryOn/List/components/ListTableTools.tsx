import useSignatoryOnList from '../hooks/useList'
import SignatoryOnListSearch from './ListSearch'
import SignatoryOnListTableFilter from './ListTableFilter'
import cloneDeep from 'lodash/cloneDeep'

const SignatoryOnListTableTools = () => {
    const { tableData, setTableData } = useSignatoryOnList()

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
            <SignatoryOnListSearch onInputChange={handleInputChange} />
            <SignatoryOnListTableFilter />
        </div>
    )
}

export default SignatoryOnListTableTools
