import { useMemo } from 'react'
import ActionColumn from '@/components/form/ActionColumn'
import DataTable from '@/components/shared/DataTable'
import { useNavigate } from 'react-router'
import cloneDeep from 'lodash/cloneDeep'
import { TbPencil, TbEye } from 'react-icons/tb'
import type { OnSortParam, ColumnDef, Row } from '@/components/shared/DataTable'
import type { TableQueries } from '@/@types/common'
import useSignatoryByList from '../hooks/useList'
import endpointConfig from '@/configs/endpoint.config'
import { SignatoryBy } from '@/@types/signatoryBy'

const SignatoryByListTable = () => {
    const navigate = useNavigate()

    const {
        signatoryByList,
        signatoryByListTotal,
        tableData,
        isLoading,
        setTableData,
        setSelectAllSignatoryBy,
        setSelectedSignatoryBy,
        selectedSignatoryBy,
    } = useSignatoryByList()

    const handleEdit = (signatoryBy: SignatoryBy) => {
        const path = endpointConfig.master.signatoryBy.edit.replace(
            ':id',
            String(signatoryBy.id),
        )
        navigate(path)
    }

    const handleViewDetails = (signatoryBy: SignatoryBy) => {
        const path = endpointConfig.master.signatoryBy.view.replace(
            ':id',
            String(signatoryBy.id),
        )
        navigate(path)
    }

    const columns: ColumnDef<SignatoryBy>[] = useMemo(
        () => [
            {
                header: 'Name',
                accessorKey: 'name',
            },
            {
                header: 'Action',
                id: 'action',
                cell: (props) => (
                    <ActionColumn
                        buttons={[
                            {
                                icon: <TbPencil />,
                                tooltip: 'Edit',
                                onClick: () => handleEdit(props.row.original),
                            },
                            {
                                icon: <TbEye />,
                                tooltip: 'View Details',
                                onClick: () =>
                                    handleViewDetails(props.row.original),
                            },
                        ]}
                    />
                ),
            },
        ],

        [],
    )

    const handleSetTableData = (data: TableQueries) => {
        setTableData(data)
        if (selectedSignatoryBy.length > 0) {
            setSelectAllSignatoryBy([])
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

    const handleRowSelect = (checked: boolean, row: SignatoryBy) => {
        setSelectedSignatoryBy(checked, row)
    }

    const handleAllRowSelect = (checked: boolean, rows: Row<SignatoryBy>[]) => {
        if (checked) {
            const originalRows = rows.map((row) => row.original)
            setSelectAllSignatoryBy(originalRows)
        } else {
            setSelectAllSignatoryBy([])
        }
    }

    return (
        <DataTable
            selectable
            columns={columns}
            data={signatoryByList}
            noData={!isLoading && signatoryByList.length === 0}
            skeletonAvatarColumns={[0]}
            skeletonAvatarProps={{ width: 28, height: 28 }}
            loading={isLoading}
            pagingData={{
                total: signatoryByListTotal,
                pageIndex: tableData.pageIndex as number,
                pageSize: tableData.pageSize as number,
            }}
            checkboxChecked={(row) =>
                selectedSignatoryBy.some((selected) => selected.id === row.id)
            }
            onPaginationChange={handlePaginationChange}
            onSelectChange={handleSelectChange}
            onSort={handleSort}
            onCheckBoxChange={handleRowSelect}
            onIndeterminateCheckBoxChange={handleAllRowSelect}
        />
    )
}

export default SignatoryByListTable
