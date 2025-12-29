import { useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router'
import DataTable from '@/components/shared/DataTable'
import type { OnSortParam, Row } from '@/components/shared/DataTable'
import endpointConfig from '@/configs/endpoint.config'
import { Instrument } from '@/@types/instrument'
import { buildInstrumentColumns } from '@/columns/instrument.columns'
import { useInstrumentList } from '../hooks/useList'

const InstrumentListTable = () => {
    const navigate = useNavigate()

    const {
        instrumentList,
        total,
        tableData,
        isLoading,

        updateTable,
        selected,
        toggleRow,
        setAll,
        clearSelection,
    } = useInstrumentList()

    const navigateTo = useCallback((path: string) => navigate(path), [navigate])

    const handleEdit = useCallback(
        (instrument: Instrument) =>
            navigateTo(
                endpointConfig.master.instrument.edit.replace(
                    ':id',
                    String(instrument.id),
                ),
            ),
        [navigateTo],
    )

    const handleView = useCallback(
        (instrument: Instrument) =>
            navigateTo(
                endpointConfig.master.instrument.view.replace(
                    ':id',
                    String(instrument.id),
                ),
            ),
        [navigateTo],
    )

    const columns = useMemo(
        () =>
            buildInstrumentColumns({
                onEdit: handleEdit,
                onView: handleView,
            }),
        [handleEdit, handleView],
    )

    const handlePaginationChange = (page: number) => {
        updateTable({ pageIndex: page })
        clearSelection()
    }

    const handlePageSizeChange = (pageSize: number) => {
        updateTable({ pageSize, pageIndex: 1 })
        clearSelection()
    }

    const handleSort = (sort: OnSortParam) => {
        updateTable({ sort })
        clearSelection()
    }

    const handleRowSelect = (checked: boolean, row: Instrument) =>
        toggleRow(checked, row)

    const handleAllRowSelect = (checked: boolean, rows: Row<Instrument>[]) =>
        setAll(checked ? rows.map((r) => r.original) : [])

    return (
        <DataTable
            selectable
            columns={columns}
            data={instrumentList}
            loading={isLoading}
            noData={!isLoading && instrumentList.length === 0}
            skeletonAvatarColumns={[0]}
            skeletonAvatarProps={{ width: 28, height: 28 }}
            pagingData={{
                total: total,
                pageIndex: tableData.pageIndex!,
                pageSize: tableData.pageSize!,
            }}
            checkboxChecked={(row) => selected.some((c) => c.id === row.id)}
            onPaginationChange={handlePaginationChange}
            onSelectChange={handlePageSizeChange}
            onSort={handleSort}
            onCheckBoxChange={handleRowSelect}
            onIndeterminateCheckBoxChange={handleAllRowSelect}
        />
    )
}

export default InstrumentListTable
