import { useCallback, useMemo } from 'react'
import DataTable from '@/components/shared/DataTable'
import { useNavigate } from 'react-router'
import type { OnSortParam, Row } from '@/components/shared/DataTable'
import endpointConfig from '@/configs/endpoint.config'
import { useStandardList } from '../hooks/useList'
import { Standard } from '@/@types/standard'
import { buildStandardColumns } from '@/columns/standard.columns'
import useAuth from '@/auth/useAuth'

const ClausesListTable = () => {
    const navigate = useNavigate()

    const {
        standardList,
        total,
        tableData,
        isLoading,
        updateTable,
        selected,
        toggleRow,
        setAll,
        clearSelection,
    } = useStandardList()

    const navigateTo = useCallback((path: string) => navigate(path), [navigate])
    const { can } = useAuth()

    const handleEdit = useCallback(
        (standard: Standard) =>
            navigateTo(
                endpointConfig.setting.standard.edit.replace(
                    ':id',
                    String(standard.id),
                ),
            ),
        [navigateTo],
    )

    const handleClause = useCallback(
        (standard: Standard) =>
            !standard.is_document_link
                ? navigateTo(
                      endpointConfig.setting.clauses.create.replace(
                          ':id',
                          String(standard.id),
                      ),
                  )
                : navigateTo(
                      endpointConfig.setting.clauses.edit.replace(
                          ':id',
                          String(standard.id),
                      ),
                  ),
        [navigateTo],
    )

    const handleView = useCallback(
        (standard: Standard) =>
            navigateTo(
                endpointConfig.setting.standard.view.replace(
                    ':id',
                    String(standard.id),
                ),
            ),
        [navigateTo],
    )

    const columns = useMemo(
        () =>
            buildStandardColumns({
                onEdit: handleEdit,
                onView: handleView,
                onClause: handleClause,
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

    const handleRowSelect = (checked: boolean, row: Standard) =>
        toggleRow(checked, row)

    const handleAllRowSelect = (checked: boolean, rows: Row<Standard>[]) =>
        setAll(checked ? rows.map((r) => r.original) : [])

    return (
        <DataTable
            selectable={can('settings.standard.delete')}
            columns={columns}
            data={standardList}
            loading={isLoading}
            noData={!isLoading && standardList.length === 0}
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

export default ClausesListTable
