import { Search } from '@/components/form'
import useLocationList from '../hooks/useList'
import LocationListTableFilter from './ListTableFilter'
import { useCallback } from 'react'
import debounce from 'lodash/debounce'
import { useAuth } from '@/auth'
import LocationPendingDrawer from './LocationPendingDrawer'
import LocationListTableSync from './ListTableSync'

const LocationListTableTools = () => {
    const { updateTable } = useLocationList()
    const { can } = useAuth()

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
            <LocationListTableFilter />
            {can('masters.location.sync') && <LocationListTableSync />}
            {can('masters.location.sync') && <LocationPendingDrawer />}
        </div>
    )
}

export default LocationListTableTools
