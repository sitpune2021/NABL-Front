/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useMemo } from 'react'
import DataTable from '@/components/shared/DataTable'
import { useNavigate, useParams } from 'react-router'
import type { OnSortParam, Row } from '@/components/shared/DataTable'
import endpointConfig from '@/configs/endpoint.config'
import { Template } from '@/@types/template'
import useVersionsTemplateList from '../hooks/useVersionsList'
import { buildVersionTemplateColumns } from '@/columns/version_template.columns'
import { apiChangeCurrentTemplateVersion } from '@/services/TemplateService'
import { useEntityMutations } from '@/utils/hooks/useEntityMutations'
import { useFormSubmit } from '@/utils/hoc/useFormSubmit'
import useAuth from '@/auth/useAuth'

const VersionListTable = () => {
    const navigate = useNavigate()
    const { id } = useParams()

    const {
        templateVersionsList,
        total,
        tableData,
        isLoading,
        updateTable,
        selected,
        toggleRow,
        setAll,
        clearSelection,
    } = useVersionsTemplateList(id ? id : '')

    const navigateTo = useCallback((path: string) => navigate(path), [navigate])
    const { can } = useAuth()

    const handleView = useCallback(
        (template: any) =>
            navigateTo(
                endpointConfig.master.template.versions.view
                    .replace(':id', String(template.temp_id))
                    .replace(':version_id', String(template.id)),
            ),
        [navigateTo],
    )

    const { save } = useEntityMutations({
        apiUpdate: apiChangeCurrentTemplateVersion,
    })

    const { handleSubmit } = useFormSubmit<any>({
        apiCall: (values) => {
            return save({ version_id: values, id })
        },
        navigateTo: endpointConfig.master.template.versions.list.replace(
            ':id',
            String(id),
        ),
    })

    const columns = useMemo(
        () =>
            buildVersionTemplateColumns({
                onView: handleView,
                handleSubmit,
                can,
            }),
        [handleView, can],
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
            selectable={can('masters.template.version.delete')}
            columns={columns}
            data={templateVersionsList}
            noData={!isLoading && templateVersionsList.length === 0}
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

export default VersionListTable
