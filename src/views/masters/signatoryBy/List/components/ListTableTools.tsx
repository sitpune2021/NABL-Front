import useSignatoryByList from '../hooks/useList'
import SignatoryByListSearch from './ListSearch'
import SignatoryByListTableFilter from './ListTableFilter'
import cloneDeep from 'lodash/cloneDeep'

const SignatoryByListTableTools = () => {
    const { tableData, setTableData } = useSignatoryByList()

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
            <SignatoryByListSearch onInputChange={handleInputChange} />
            <SignatoryByListTableFilter />
        </div>
    )
}

export default SignatoryByListTableTools
