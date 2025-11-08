import { useEffect, useMemo, useState } from 'react'
import Tooltip from '@/components/ui/Tooltip'
import DataTable from '@/components/shared/DataTable'
import { useNavigate, useParams } from 'react-router'
import cloneDeep from 'lodash/cloneDeep'
import { TbPencil, TbEye, TbLocationBolt } from 'react-icons/tb'
import type { OnSortParam, ColumnDef, Row } from '@/components/shared/DataTable'
import type { TableQueries } from '@/@types/common'
import useLabList from '../hooks/useList'
import endpointConfig from '@/configs/endpoint.config'
import { Lab, LocationField } from '@/@types/lab'

const ActionColumn = ({
    onEdit,
    onViewDetail,
    onLocation,
}: {
    onEdit: () => void
    onViewDetail: () => void
    onLocation: () => void
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
            <Tooltip title="location">
                <div
                    className={`text-xl cursor-pointer select-none font-semibold`}
                    role="button"
                    onClick={onLocation}
                >
                    <TbLocationBolt />
                </div>
            </Tooltip>
        </div>
    )
}

const LocationLabListTable = () => {
    const navigate = useNavigate()
    const [locations, setLocations] = useState<LocationField[]>()
    const { id: labId } = useParams()

    const {
        labListTotal,
        tableData,
        isLoading,
        setTableData,
        setSelectAllLab,
        setSelectedLab,
        selectedLab,
        getLocationsByLabId,
    } = useLabList()

    useEffect(() => {
        const fetchData = async () => {
            if (!labId) return
            try {
                const response = await getLocationsByLabId(labId)
                const labs = response ?? []
                setLocations(labs)
            } catch (error) {
                console.error('Failed to fetch locations:', error)
                setLocations([])
            }
        }

        fetchData()
    }, [labId, getLocationsByLabId])

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
                header: 'Name',
                accessorKey: 'name',
            },
            {
                header: 'Action',
                id: 'action',
                cell: (props) => (
                    <ActionColumn
                        onEdit={() => handleEdit(props.row.original)}
                        onLocation={() => handleLocation(props.row.original)}
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
            data={locations}
            noData={!isLoading && locations?.length === 0}
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

export default LocationLabListTable
