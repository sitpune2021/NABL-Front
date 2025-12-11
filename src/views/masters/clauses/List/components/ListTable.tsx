import { useMemo } from 'react'
import ActionColumn from '@/components/form/ActionColumn'
import DataTable from '@/components/shared/DataTable'
import { useNavigate } from 'react-router'
import cloneDeep from 'lodash/cloneDeep'
import { TbPencil, TbEye } from 'react-icons/tb'
import type { OnSortParam, ColumnDef, Row } from '@/components/shared/DataTable'
import type { TableQueries } from '@/@types/common'
import useClausesList from '../hooks/useList'
import endpointConfig from '@/configs/endpoint.config'
import { Clauses } from '@/@types/clauses'
import Tag from '@/components/ui/Tag'

const ClausesListTable = () => {
    const navigate = useNavigate()

    const statusColor: Record<string, string> = {
        active: 'bg-emerald-100 text-emerald-700',
        inactive: 'bg-red-100 text-red-700',
    }

    const {
        clausesList,
        clausesListTotal,
        tableData,
        isLoading,
        setTableData,
        setSelectAllClauses,
        setSelectedClauses,
        selectedClauses,
    } = useClausesList()

    const handleEdit = (clauses: Clauses) => {
        const path = endpointConfig.setting.clauses.edit.replace(
            ':id',
            String(clauses.id),
        )
        navigate(path)
    }

    const handleViewDetails = (clauses: Clauses) => {
        const path = endpointConfig.setting.clauses.view.replace(
            ':id',
            String(clauses.id),
        )
        navigate(path)
    }

    const columns: ColumnDef<Clauses>[] = useMemo(
        () => [
            {
                header: 'Name',
                accessorKey: 'name',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <span className="font-bold">
                            {row.name || 'No Name'}
                        </span>
                    )
                },
            },
            {
                header: 'Created At',
                accessorKey: 'created_at',
                cell: (props) => {
                    const row = props.row.original

                    const formatted = new Date(
                        row.created_at,
                    ).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                    })

                    return <span className="font-semibold">{formatted}</span>
                },
            },
            {
                header: 'Status',
                accessorKey: 'status',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <div className="flex items-center">
                            <Tag className={statusColor[row.status]}>
                                <span className="capitalize">{row.status}</span>
                            </Tag>
                        </div>
                    )
                },
            },
            {
                header: 'Action',
                accessorKey: 'action',
                id: 'action',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <ActionColumn
                            buttons={[
                                {
                                    icon: <TbPencil />,
                                    tooltip: 'Edit',
                                    onClick: () => handleEdit(row),
                                    show: row.status === 'active',
                                },
                                {
                                    icon: <TbEye />,
                                    tooltip: 'View',
                                    onClick: () => handleViewDetails(row),
                                    show: true,
                                },
                            ]}
                        />
                    )
                },
            },
        ],
        [],
    )

    const handleSetTableData = (data: TableQueries) => {
        setTableData(data)
        if (selectedClauses.length > 0) {
            setSelectAllClauses([])
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

    const handleRowSelect = (checked: boolean, row: Clauses) => {
        setSelectedClauses(checked, row)
    }

    const handleAllRowSelect = (checked: boolean, rows: Row<Clauses>[]) => {
        if (checked) {
            const originalRows = rows.map((row) => row.original)
            setSelectAllClauses(originalRows)
        } else {
            setSelectAllClauses([])
        }
    }

    return (
        <DataTable
            selectable
            columns={columns}
            data={clausesList}
            noData={!isLoading && clausesList.length === 0}
            skeletonAvatarColumns={[0]}
            skeletonAvatarProps={{ width: 28, height: 28 }}
            loading={isLoading}
            pagingData={{
                total: clausesListTotal,
                pageIndex: tableData.pageIndex as number,
                pageSize: tableData.pageSize as number,
            }}
            checkboxChecked={(row) =>
                selectedClauses.some((selected) => selected.id === row.id)
            }
            onPaginationChange={handlePaginationChange}
            onSelectChange={handleSelectChange}
            onSort={handleSort}
            onCheckBoxChange={handleRowSelect}
            onIndeterminateCheckBoxChange={handleAllRowSelect}
        />
    )
}

export default ClausesListTable
