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

const ActionColumn = ({
    onEdit,
    onViewDetail,
}: {
    onEdit: () => void
    onViewDetail: () => void
}) => {
    return (
        <div className="flex items-center gap-3">
            <Tooltip title="Edit">
                <div
                    className={`text-xl cursor-pointer select-none font-semibold`}
                    role="button"
                    onClick={onEdit}
                >
                    <TbPencil />
                </div>
            </Tooltip>
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
                header: 'Id',
                accessorKey: 'id',
            },
            {
                header: 'Name',
                accessorKey: 'name',
            },
            {
                header: '',
                id: 'action',
                cell: (props) => (
                    <ActionColumn
                        onEdit={() => handleEdit(props.row.original)}
                        onViewDetail={() =>
                            handleViewDetails(props.row.original)
                        }
                    />
                ),
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
