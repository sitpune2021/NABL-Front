import { useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router'
import DataTable from '@/components/shared/DataTable'
import type { OnSortParam, Row } from '@/components/shared/DataTable'
import endpointConfig from '@/configs/endpoint.config'
import { PrefixConfig } from '@/@types/prefixConfig'
import { buildPrefixConfigColumns } from '@/columns/prefixConfig.columns'
import { usePrefixConfigList } from '../hooks/useList'
import useAuth from '@/auth/useAuth'

const PrefixConfigListTable = () => {
    const navigate = useNavigate()

    const {
        prefixConfigList,
        total,
        tableData,
        isLoading,
        updateTable,
        selected,
        toggleRow,
        setAll,
        clearSelection,
    } = usePrefixConfigList()

    const navigateTo = useCallback((path: string) => navigate(path), [navigate])
    const { can } = useAuth()

    const handleEdit = useCallback(
        (prefixConfig: PrefixConfig) =>
            navigateTo(
                endpointConfig.setting.prefixConfig.edit.replace(
                    ':id',
                    String(prefixConfig.id),
                ),
            ),
        [navigateTo],
    )

    const handleView = useCallback(
        (prefixConfig: PrefixConfig) =>
            navigateTo(
                endpointConfig.setting.prefixConfig.view.replace(
                    ':id',
                    String(prefixConfig.id),
                ),
            ),
        [navigateTo],
    )

    const columns = useMemo(
        () =>
            buildPrefixConfigColumns({
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

    const handleRowSelect = (checked: boolean, row: PrefixConfig) =>
        toggleRow(checked, row)

    const handleAllRowSelect = (checked: boolean, rows: Row<PrefixConfig>[]) =>
        setAll(checked ? rows.map((r) => r.original) : [])

    return (
        <DataTable
            selectable={can('settings.prefixConfig.delete')}
            columns={columns}
            data={prefixConfigList}
            loading={isLoading}
            noData={!isLoading && prefixConfigList.length === 0}
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

export default PrefixConfigListTable
