import useRolesList from '../hooks/useList'
import RolesListSearch from './ListSearch'
import RolesListTableFilter from './ListTableFilter'
import cloneDeep from 'lodash/cloneDeep'

const RolesListTableTools = () => {
    const { tableData, setTableData } = useRolesList()

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
            <RolesListSearch onInputChange={handleInputChange} />
            <RolesListTableFilter />
        </div>
    )
}

export default RolesListTableTools
