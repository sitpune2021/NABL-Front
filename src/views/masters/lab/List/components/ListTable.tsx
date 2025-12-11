import { useMemo } from 'react'
import ActionColumn from '@/components/form/ActionColumn'
import DataTable from '@/components/shared/DataTable'
import { useNavigate } from 'react-router'
import cloneDeep from 'lodash/cloneDeep'
import { TbPencil, TbEye, TbLocationBolt } from 'react-icons/tb'
import type { OnSortParam, ColumnDef, Row } from '@/components/shared/DataTable'
import type { TableQueries } from '@/@types/common'
import useLabList from '../hooks/useList'
import endpointConfig from '@/configs/endpoint.config'
import { Lab } from '@/@types/lab'

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

    const handleEdit = (lab: Lab) => {
        const path = endpointConfig.master.lab.edit.replace(
            ':id',
            String(lab.id),
        )
        navigate(path)
    }

    const handleLocation = (lab: Lab) => {
        const path = endpointConfig.master.lab.location.replace(
            ':id',
            String(lab.id),
        )
        navigate(path)
    }

    const handleViewDetails = (lab: Lab) => {
        const path = endpointConfig.master.lab.view.replace(
            ':id',
            String(lab.id),
        )
        navigate(path)
    }

    const columns: ColumnDef<Lab>[] = useMemo(
        () => [
            {
                header: 'Id',
                accessorKey: 'id',
            },
            {
                header: 'Name',
                accessorKey: 'name',
                cell: (props) => {
                    const { name, labType } = props.row.original
                    return (
                        <div className="flex items-center gap-2">
                            <div>
                                <div className="font-bold heading-text">
                                    {name}
                                </div>
                                <div>{labType}</div>
                            </div>
                        </div>
                    )
                },
            },
            {
                header: 'Lab Code',
                accessorKey: 'labCode',
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
                            {
                                icon: <TbLocationBolt />,
                                tooltip: 'Location',
                                onClick: () =>
                                    handleLocation(props.row.original),
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
            selectable
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
