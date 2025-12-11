import { useMemo } from 'react'
import ActionColumn from '@/components/form/ActionColumn'
import DataTable from '@/components/shared/DataTable'
import { useNavigate } from 'react-router'
import cloneDeep from 'lodash/cloneDeep'
import { TbPencil, TbEye } from 'react-icons/tb'
import type { OnSortParam, ColumnDef, Row } from '@/components/shared/DataTable'
import type { TableQueries } from '@/@types/common'
import useInstrumentList from '../hooks/useList'
import endpointConfig from '@/configs/endpoint.config'
import { Instrument } from '@/@types/instrument'

const InstrumentListTable = () => {
    const navigate = useNavigate()

    const {
        instrumentList,
        instrumentListTotal,
        tableData,
        isLoading,
        setTableData,
        setSelectAllInstrument,
        setSelectedInstrument,
        selectedInstrument,
    } = useInstrumentList()

    const handleEdit = (instrument: Instrument) => {
        const path = endpointConfig.master.instrument.edit.replace(
            ':id',
            String(instrument.id),
        )
        navigate(path)
    }

    const handleViewDetails = (instrument: Instrument) => {
        const path = endpointConfig.master.instrument.view.replace(
            ':id',
            String(instrument.id),
        )
        navigate(path)
    }

    const columns: ColumnDef<Instrument>[] = useMemo(
        () => [
            {
                header: 'Id',
                accessorKey: 'id',
            },
            {
                header: 'Name',
                accessorKey: 'name',
                cell: (props) => {
                    const { name, identifier } = props.row.original
                    return (
                        <div className="flex items-center gap-2">
                            <div>
                                <div className="font-bold heading-text">
                                    {name}
                                </div>
                                <div>{identifier}</div>
                            </div>
                        </div>
                    )
                },
            },
            {
                header: 'Short Name',
                accessorKey: 'short_name',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <span className="font-semibold">{row.short_name}</span>
                    )
                },
            },
            {
                header: 'Action',
                accessorKey: 'action',
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
                                tooltip: 'View',
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
        if (selectedInstrument.length > 0) {
            setSelectAllInstrument([])
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

    const handleRowSelect = (checked: boolean, row: Instrument) => {
        setSelectedInstrument(checked, row)
    }

    const handleAllRowSelect = (checked: boolean, rows: Row<Instrument>[]) => {
        if (checked) {
            const originalRows = rows.map((row) => row.original)
            setSelectAllInstrument(originalRows)
        } else {
            setSelectAllInstrument([])
        }
    }

    return (
        <DataTable
            selectable
            columns={columns}
            data={instrumentList}
            noData={!isLoading && instrumentList.length === 0}
            skeletonAvatarColumns={[0]}
            skeletonAvatarProps={{ width: 28, height: 28 }}
            loading={isLoading}
            pagingData={{
                total: instrumentListTotal,
                pageIndex: tableData.pageIndex as number,
                pageSize: tableData.pageSize as number,
            }}
            checkboxChecked={(row) =>
                selectedInstrument.some((selected) => selected.id === row.id)
            }
            onPaginationChange={handlePaginationChange}
            onSelectChange={handleSelectChange}
            onSort={handleSort}
            onCheckBoxChange={handleRowSelect}
            onIndeterminateCheckBoxChange={handleAllRowSelect}
        />
    )
}

export default InstrumentListTable
