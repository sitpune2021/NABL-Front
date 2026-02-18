import { useCallback, useMemo } from 'react'
import DataTable from '@/components/shared/DataTable'
import { useNavigate } from 'react-router'
import type { OnSortParam, Row } from '@/components/shared/DataTable'
import useSubCategoryList from '../hooks/useList'
import endpointConfig from '@/configs/endpoint.config'
import { SubCategory } from '@/@types/subcategory'
import { buildSubCategoryColumns } from '@/columns/sub_category.columns'
import useLabList from '@/views/masters/lab/List/hooks/useList'
import useAuth from '@/auth/useAuth'

const SubCategoryListTable = () => {
    const navigate = useNavigate()
    const { labList = [] } = useLabList()

    const {
        subcategoryList,
        total,
        tableData,
        isLoading,
        updateTable,
        selected,
        toggleRow,
        setAll,
        clearSelection,
    } = useSubCategoryList()

    const navigateTo = useCallback((path: string) => navigate(path), [navigate])
    const { can } = useAuth()

    const handleEdit = useCallback(
        (subcategory: SubCategory) =>
            navigateTo(
                endpointConfig.master.subcategory.edit.replace(
                    ':id',
                    String(subcategory.id),
                ),
            ),
        [navigateTo],
    )

    const handleView = useCallback(
        (subcategory: SubCategory) =>
            navigateTo(
                endpointConfig.master.subcategory.view.replace(
                    ':id',
                    String(subcategory.id),
                ),
            ),
        [navigateTo],
    )

    const columns = useMemo(
        () =>
            buildSubCategoryColumns({
                onEdit: handleEdit,
                onView: handleView,
                labList,
                can,
            }),
        [handleEdit, handleView, labList, can],
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

    const handleRowSelect = (checked: boolean, row: SubCategory) =>
        toggleRow(checked, row)

    const handleAllRowSelect = (checked: boolean, rows: Row<SubCategory>[]) =>
        setAll(checked ? rows.map((r) => r.original) : [])

    return (
        <DataTable
            selectable={can('masters.subcategory.delete')}
            columns={columns}
            data={subcategoryList}
            noData={!isLoading && subcategoryList.length === 0}
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

export default SubCategoryListTable
