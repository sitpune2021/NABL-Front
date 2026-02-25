import { useCallback, useMemo } from 'react'
import DataTable from '@/components/shared/DataTable'
import { useNavigate } from 'react-router'
import cloneDeep from 'lodash/cloneDeep'
import type { OnSortParam, Row } from '@/components/shared/DataTable'
import type { TableQueries } from '@/@types/common'
import useLabList from '../hooks/useList'
import endpointConfig from '@/configs/endpoint.config'
import { Lab } from '@/@types/lab'
import { buildLabColumns } from '@/columns/lab.columns'
import useAuth from '@/auth/useAuth'

const LabListTable = () => {
    const navigate = useNavigate()

    const {
        labList,
        labListTotal,
        tableData,
        isLoading,
        setTableData,
        setSelectAllLab,
        setSelectedLab,
        selectedLab,
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

    const handleLocation = useCallback(
        (lab: Lab) =>
            navigateTo(
                endpointConfig.client.lab.location.replace(
                    ':id',
                    String(lab.id),
                ),
            ),
        [navigateTo],
    )

    const columns = useMemo(
        () =>
            buildLabColumns({
                onEdit: handleEdit,
                onView: handleView,
                onLocation: handleLocation,
                can,
            }),
        [handleEdit, handleView, can],
    )

    const handleSetTableData = (data: TableQueries) => {
        setTableData(data)
        if (selectedLab.length > 0) {
            setSelectAllLab([])
        }
    }

    const handlePaginationChange = (page: number) => {
        const newTableData = cloneDeep(tableData)
        newTableData.pageIndex = page
        handleSetTableData(newTableData)
    }

    const handleSelectChange = (value: number) => {
        const newTableData = cloneDeep(tableData)
        newTableData.pageSize = Number(value)
        newTableData.pageIndex = 1
        handleSetTableData(newTableData)
    }

    const handleSort = (sort: OnSortParam) => {
        const newTableData = cloneDeep(tableData)
        newTableData.sort = sort
        handleSetTableData(newTableData)
    }

    const handleRowSelect = (checked: boolean, row: Lab) => {
        setSelectedLab(checked, row)
    }

    const handleAllRowSelect = (checked: boolean, rows: Row<Lab>[]) => {
        if (checked) {
            const originalRows = rows.map((row) => row.original)
            setSelectAllLab(originalRows)
        } else {
            setSelectAllLab([])
        }
    }

    return (
        <DataTable
            selectable={can('clients.lab.delete')}
            columns={columns}
            data={labList}
            noData={!isLoading && labList.length === 0}
            skeletonAvatarColumns={[0]}
            skeletonAvatarProps={{ width: 28, height: 28 }}
            loading={isLoading}
            pagingData={{
                total: labListTotal,
                pageIndex: tableData.pageIndex as number,
                pageSize: tableData.pageSize as number,
            }}
            checkboxChecked={(row) =>
                selectedLab.some((selected) => selected.id === row.id)
            }
            onPaginationChange={handlePaginationChange}
            onSelectChange={handleSelectChange}
            onSort={handleSort}
            onCheckBoxChange={handleRowSelect}
            onIndeterminateCheckBoxChange={handleAllRowSelect}
        />
    )
}

export default LabListTable
