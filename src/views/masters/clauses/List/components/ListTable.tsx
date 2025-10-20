import { useMemo } from 'react'
import Tooltip from '@/components/ui/Tooltip'
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

const ActionColumn = ({
    onEdit,
    onViewDetail,
    status,
}: {
    onEdit: () => void
    onViewDetail: () => void
    status: string
}) => {
    return (
        <div className="flex items-center gap-3">
            {/* Edit button - only for active clauses */}
            {status === 'active' && (
                <Tooltip title="Edit">
                    <div
                        className={`text-xl cursor-pointer select-none font-semibold`}
                        role="button"
                        onClick={onEdit}
                    >
                        <TbPencil />
                    </div>
                </Tooltip>
            )}

            {/*  View button - always visible */}
            <Tooltip title="View">
                <div
                    className={`text-xl cursor-pointer select-none font-semibold`}
                    role="button"
                    onClick={onViewDetail}
                >
                    <TbEye />
                </div>
            </Tooltip>
        </div>
    )
}
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
        const path = endpointConfig.master.clauses.edit.replace(
            ':id',
            String(clauses.id),
        )
        navigate(path)
    }

    const handleViewDetails = (clauses: Clauses) => {
        const path = endpointConfig.master.clauses.view.replace(
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
                    return row.name || 'No Name'
                },
            },
            {
                header: 'Created At',
                accessorKey: 'created_at',
                cell: (props) => {
                    const row = props.row.original
                    return new Date(row.created_at).toLocaleDateString(
                        'en-IN',
                        {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                        },
                    )
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
                header: '',
                id: 'action',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <ActionColumn
                            status={row.status}
                            onEdit={() => handleEdit(row)}
                            onViewDetail={() => handleViewDetails(row)}
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
