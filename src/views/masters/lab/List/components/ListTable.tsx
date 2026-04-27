import { useCallback, useMemo } from 'react'
import DataTable from '@/components/shared/DataTable'
import { useNavigate } from 'react-router'
import type { OnSortParam, Row } from '@/components/shared/DataTable'
import useLabList from '../hooks/useList'
import endpointConfig from '@/configs/endpoint.config'
import { Lab } from '@/@types/lab'
import { buildLabColumns } from '@/columns/lab.columns'
import useAuth from '@/auth/useAuth'

const LabListTable = () => {
    const navigate = useNavigate()

    const {
        labList,
        total,
        tableData,
        isLoading,
        updateTable,
        selected,
        toggleRow,
        setAll,
        clearSelection,
    } = useLabList()

    const navigateTo = useCallback((path: string) => navigate(path), [navigate])
    const { can } = useAuth()

    const handleEdit = useCallback(
        (lab: Lab) =>
            navigateTo(
                endpointConfig.client.lab.edit.replace(':id', String(lab.id)),
            ),
        [navigateTo],
    )

    const handleView = useCallback(
        (lab: Lab) =>
            navigateTo(
                endpointConfig.client.lab.view.replace(':id', String(lab.id)),
            ),
        [navigateTo],
    )

    const columns = useMemo(
        () =>
            buildLabColumns({
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

    const handleRowSelect = (checked: boolean, row: Lab) =>
        toggleRow(checked, row)

    const handleAllRowSelect = (checked: boolean, rows: Row<Lab>[]) =>
        setAll(checked ? rows.map((r) => r.original) : [])
    return (
        <DataTable
            selectable={can('clients.lab.delete')}
            columns={columns}
            data={labList}
            loading={isLoading}
            noData={!isLoading && labList.length === 0}
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

export default LabListTable
