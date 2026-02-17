import { useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router'
import DataTable from '@/components/shared/DataTable'
import type { OnSortParam, Row } from '@/components/shared/DataTable'
import endpointConfig from '@/configs/endpoint.config'
import { Category } from '@/@types/category'
import { buildCategoryColumns } from '@/columns/category.columns'
import { useCategoryList } from '../hooks/useList'
import useLabList from '@/views/masters/lab/List/hooks/useList'
import useAuth from '@/auth/useAuth'

const CategoryListTable = () => {
    const navigate = useNavigate()
    const { labList = [] } = useLabList()

    const {
        categoryList,
        total,
        tableData,
        isLoading,
        updateTable,
        selected,
        toggleRow,
        setAll,
        clearSelection,
    } = useCategoryList()

    const navigateTo = useCallback((path: string) => navigate(path), [navigate])
    const { can } = useAuth()

    const handleEdit = useCallback(
        (category: Category) =>
            navigateTo(
                endpointConfig.master.category.edit.replace(
                    ':id',
                    String(category.id),
                ),
            ),
        [navigateTo],
    )

    const handleView = useCallback(
        (category: Category) =>
            navigateTo(
                endpointConfig.master.category.view.replace(
                    ':id',
                    String(category.id),
                ),
            ),
        [navigateTo],
    )

    const columns = useMemo(
        () =>
            buildCategoryColumns({
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

    const handleRowSelect = (checked: boolean, row: Category) =>
        toggleRow(checked, row)

    const handleAllRowSelect = (checked: boolean, rows: Row<Category>[]) =>
        setAll(checked ? rows.map((r) => r.original) : [])

    return (
        <DataTable
            selectable={can('masters.category.delete')}
            columns={columns}
            data={categoryList}
            loading={isLoading}
            noData={!isLoading && categoryList.length === 0}
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

export default CategoryListTable
