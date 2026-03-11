import { useCallback } from 'react'
import { Search } from '@/components/form'
import { useInstrumentList } from '../hooks/useList'
import debounce from 'lodash/debounce'
import InstrumentListTableSync from './ListTableSync'
import { useAuth } from '@/auth'
import InstrumentPendingDrawer from './InstrumentPendingDrawer'

const InstrumentListTableTools = () => {
    const { updateTable } = useInstrumentList()
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
            {can('masters.instrument.sync') && <InstrumentListTableSync />}
            {can('masters.instrument.sync') && <InstrumentPendingDrawer />}
        </div>
    )
}

export default InstrumentListTableTools
