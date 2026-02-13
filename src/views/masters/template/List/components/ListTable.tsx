import { useCallback, useMemo } from 'react'
import DataTable from '@/components/shared/DataTable'
import { useNavigate } from 'react-router'
import type { OnSortParam, Row } from '@/components/shared/DataTable'
import useTemplateList from '../hooks/useList'
import endpointConfig from '@/configs/endpoint.config'
import { Template } from '@/@types/template'
import { buildTemplateColumns } from '@/columns/template.columns'

const TemplateListTable = () => {
    const navigate = useNavigate()

    const {
        templateList,
        total,
        tableData,
        isLoading,
        updateTable,
        selected,
        toggleRow,
        setAll,
        clearSelection,
    } = useTemplateList()

    const navigateTo = useCallback((path: string) => navigate(path), [navigate])

    const handleEdit = useCallback(
        (template: Template) =>
            navigateTo(
                endpointConfig.master.template.edit.replace(
                    ':id',
                    String(template.id),
                ),
            ),
        [navigateTo],
    )

    const handleView = useCallback(
        (template: Template) =>
            navigateTo(
                endpointConfig.master.template.view.replace(
                    ':id',
                    String(template.id),
                ),
            ),
        [navigateTo],
    )

    const handleVersionsList = useCallback(
        (template: Template) =>
            navigateTo(
                endpointConfig.master.template.versions.list.replace(
                    ':id',
                    String(template.id),
                ),
            ),
        [navigateTo],
    )
    const handleSubmit = useCallback(
        async (data: {
            template_id: string | number
            status: 'published' | 'archived'
        }) => {
            console.log('handleSubmit called with:', data)
        },
        [],
    )

    const columns = useMemo(
        () =>
            buildTemplateColumns({
                onEdit: handleEdit,
                onView: handleView,
                onVersionsList: handleVersionsList,
                handleSubmit: handleSubmit,
            }),
        [handleEdit, handleView, handleSubmit],
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

    const handleRowSelect = (checked: boolean, row: Template) =>
        toggleRow(checked, row)

    const handleAllRowSelect = (checked: boolean, rows: Row<Template>[]) =>
        setAll(checked ? rows.map((r) => r.original) : [])

    return (
        <DataTable
            selectable
            columns={columns}
            data={templateList}
            noData={!isLoading && templateList.length === 0}
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

export default TemplateListTable
