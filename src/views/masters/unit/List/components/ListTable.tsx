import { useCallback, useMemo } from 'react'
import DataTable from '@/components/shared/DataTable'
import { useNavigate } from 'react-router'
import type { OnSortParam, Row } from '@/components/shared/DataTable'
import useUnitList from '../hooks/useList'
import endpointConfig from '@/configs/endpoint.config'
import { Unit } from '@/@types/unit'
import { buildUnitColumns } from '@/columns/unit.columns'

const UnitListTable = () => {
    const navigate = useNavigate()

    const {
        unitList,
        total,
        tableData,
        isLoading,
        updateTable,
        selected,
        toggleRow,
        setAll,
        clearSelection,
    } = useUnitList()

    const navigateTo = useCallback((path: string) => navigate(path), [navigate])

    const handleEdit = useCallback(
        (category: Unit) =>
            navigateTo(
                endpointConfig.master.unit.edit.replace(
                    ':id',
                    String(category.id),
                ),
            ),
        [navigateTo],
    )

    const handleView = useCallback(
        (category: Unit) =>
            navigateTo(
                endpointConfig.master.unit.view.replace(
                    ':id',
                    String(category.id),
                ),
            ),
        [navigateTo],
    )

    const columns = useMemo(
        () =>
            buildUnitColumns({
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

    const handleRowSelect = (checked: boolean, row: Unit) =>
        toggleRow(checked, row)

    const handleAllRowSelect = (checked: boolean, rows: Row<Unit>[]) =>
        setAll(checked ? rows.map((r) => r.original) : [])

    return (
        <DataTable
            selectable
            columns={columns}
            data={unitList}
            noData={!isLoading && unitList.length === 0}
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

export default UnitListTable
