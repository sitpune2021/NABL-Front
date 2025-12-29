import { useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router'
import DataTable from '@/components/shared/DataTable'
import type { OnSortParam, Row } from '@/components/shared/DataTable'
import endpointConfig from '@/configs/endpoint.config'
import { Zone } from '@/@types/zone'
import { buildZoneColumns } from '@/columns/zone.columns'
import { useZoneList } from '../hooks/useList'

const ZoneListTable = () => {
    const navigate = useNavigate()

    const {
        zoneList,
        total,
        tableData,
        isLoading,
        updateTable,
        selected,
        toggleRow,
        setAll,
        clearSelection,
    } = useZoneList()

    const navigateTo = useCallback((path: string) => navigate(path), [navigate])

    const handleEdit = useCallback(
        (zone: Zone) =>
            navigateTo(
                endpointConfig.master.zone.edit.replace(':id', String(zone.id)),
            ),
        [navigateTo],
    )

    const handleView = useCallback(
        (zone: Zone) =>
            navigateTo(
                endpointConfig.master.zone.view.replace(':id', String(zone.id)),
            ),
        [navigateTo],
    )

    const columns = useMemo(
        () =>
            buildZoneColumns({
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

    const handleRowSelect = (checked: boolean, row: Zone) =>
        toggleRow(checked, row)

    const handleAllRowSelect = (checked: boolean, rows: Row<Zone>[]) =>
        setAll(checked ? rows.map((r) => r.original) : [])

    return (
        <DataTable
            selectable
            columns={columns}
            data={zoneList}
            loading={isLoading}
            noData={!isLoading && zoneList.length === 0}
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

export default ZoneListTable
