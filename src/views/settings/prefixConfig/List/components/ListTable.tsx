import { useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router'
import DataTable from '@/components/shared/DataTable'
import type { OnSortParam, Row } from '@/components/shared/DataTable'
import endpointConfig from '@/configs/endpoint.config'
import { Prefix } from '@/@types/prefix'
import { buildPrefixColumns } from '@/columns/prefix.columns'
import useAuth from '@/auth/useAuth'
import { usePrefixList } from '../hooks/useList'

const PrefixListTable = () => {
    const navigate = useNavigate()

    const {
        prefixList,
        total,
        tableData,
        isLoading,
        updateTable,
        selected,
        toggleRow,
        setAll,
        clearSelection,
    } = usePrefixList()

    const navigateTo = useCallback((path: string) => navigate(path), [navigate])
    const { can } = useAuth()

    const handleEdit = useCallback(
        (Prefix: Prefix) =>
            navigateTo(
                endpointConfig.setting.prefixConfig.edit.replace(
                    ':id',
                    String(Prefix.id),
                ),
            ),
        [navigateTo],
    )

    const handleView = useCallback(
        (Prefix: Prefix) =>
            navigateTo(
                endpointConfig.setting.prefixConfig.view.replace(
                    ':id',
                    String(Prefix.id),
                ),
            ),
        [navigateTo],
    )

    const columns = useMemo(
        () =>
            buildPrefixColumns({
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

    const handleRowSelect = (checked: boolean, row: Prefix) =>
        toggleRow(checked, row)

    const handleAllRowSelect = (checked: boolean, rows: Row<Prefix>[]) =>
        setAll(checked ? rows.map((r) => r.original) : [])
    console.log('prefixList 👉', prefixList)

    return (
        <DataTable
            data={prefixList || []}
            selectable={can('settings.prefix.delete')}
            columns={columns}
            loading={isLoading}
            noData={!isLoading && prefixList.length === 0}
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

export default PrefixListTable
