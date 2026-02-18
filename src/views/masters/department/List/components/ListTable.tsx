import { useCallback, useMemo } from 'react'
import DataTable from '@/components/shared/DataTable'
import { useNavigate } from 'react-router'
import type { OnSortParam, Row } from '@/components/shared/DataTable'
import useDepartmentList from '../hooks/useList'
import endpointConfig from '@/configs/endpoint.config'
import { Department } from '@/@types/department'
import { buildDepartmentColumns } from '@/columns/department.columns'
import useLabList from '@/views/masters/lab/List/hooks/useList'
import useAuth from '@/auth/useAuth'

const DepartmentListTable = () => {
    const navigate = useNavigate()
    const { labList = [] } = useLabList()

    const {
        departmentList,
        total,
        tableData,
        isLoading,
        updateTable,
        selected,
        toggleRow,
        setAll,
        clearSelection,
    } = useDepartmentList()

    const navigateTo = useCallback((path: string) => navigate(path), [navigate])
    const { can } = useAuth()

    const handleEdit = useCallback(
        (category: Department) =>
            navigateTo(
                endpointConfig.master.department.edit.replace(
                    ':id',
                    String(category.id),
                ),
            ),
        [navigateTo],
    )

    const handleView = useCallback(
        (category: Department) =>
            navigateTo(
                endpointConfig.master.department.view.replace(
                    ':id',
                    String(category.id),
                ),
            ),
        [navigateTo],
    )

    const columns = useMemo(
        () =>
            buildDepartmentColumns({
                onEdit: handleEdit,
                onView: handleView,
                labList,
                can,
            }),
        [handleEdit, handleView, labList],
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

    const handleRowSelect = (checked: boolean, row: Department) =>
        toggleRow(checked, row)

    const handleAllRowSelect = (checked: boolean, rows: Row<Department>[]) =>
        setAll(checked ? rows.map((r) => r.original) : [])

    return (
        <DataTable
            selectable={can('masters.department.delete')}
            columns={columns}
            data={departmentList}
            noData={!isLoading && departmentList.length === 0}
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

export default DepartmentListTable
