import ListLayout from '@/components/layouts/ListLayout'
import InstrumentListTableTools from './components/ListTableTools'
import InstrumentListSelected from './components/ListSelected'
import InstrumentListTable from './components/ListTable'
import { actionButtons } from './actionButtons'
import { useInstrumentListStore } from './store/listStore'
import { useEffect } from 'react'

const InstrumentList = () => {
    const resetQuery = useInstrumentListStore((state) => state.resetQuery)
    useEffect(() => {
        return () => {
            resetQuery()
        }
    }, [resetQuery])
    return (
        <ListLayout
            title="Instrument"
            ActionTools={actionButtons}
            TableTools={<InstrumentListTableTools />}
            Table={<InstrumentListTable />}
            SelectedComponent={<InstrumentListSelected />}
        />
    )
}

export default InstrumentList
