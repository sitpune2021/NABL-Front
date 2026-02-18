import { useMemo, useCallback } from 'react'
import DataTable from '@/components/shared/DataTable'
import { useNavigate } from 'react-router'
import type { OnSortParam, Row } from '@/components/shared/DataTable'
import useLocationList from '../hooks/useList'
import endpointConfig from '@/configs/endpoint.config'
import { Location } from '@/@types/location'
import { buildLocationColumns } from '@/columns/location.columns'
import useAuth from '@/auth/useAuth'

const LocationListTable = () => {
    const navigate = useNavigate()

    const {
        locationList,
        total,
        tableData,
        isLoading,
        updateTable,
        selected,
        toggleRow,
        setAll,
        clearSelection,
    } = useLocationList()

    const navigateTo = useCallback((path: string) => navigate(path), [navigate])
    const { can } = useAuth()

    const handleEdit = useCallback(
        (location: Location) =>
            navigateTo(
                endpointConfig.master.location.edit.replace(
                    ':id',
                    String(location.id),
                ),
            ),
        [navigateTo],
    )

    const handleView = useCallback(
        (location: Location) =>
            navigateTo(
                endpointConfig.master.location.view.replace(
                    ':id',
                    String(location.id),
                ),
            ),
        [navigateTo],
    )

    const columns = useMemo(
        () =>
            buildLocationColumns({
                onEdit: handleEdit,
                onView: handleView,
                can,
            }),
        [handleEdit, handleView, can],
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

    const handleRowSelect = (checked: boolean, row: Location) => {
        toggleRow(checked, row)
    }

    const handleAllRowSelect = (checked: boolean, rows: Row<Location>[]) => {
        setAll(checked ? rows.map((r) => r.original) : [])
    }

    return (
        <DataTable
            selectable={can('masters.location.delete')}
            columns={columns}
            data={locationList}
            noData={!isLoading && locationList.length === 0}
            skeletonAvatarColumns={[0]}
            skeletonAvatarProps={{ width: 28, height: 28 }}
            loading={isLoading}
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

export default LocationListTable
