import { useMemo } from 'react'
import Tooltip from '@/components/ui/Tooltip'
import DataTable from '@/components/shared/DataTable'
import { useNavigate } from 'react-router'
import cloneDeep from 'lodash/cloneDeep'
import { TbPencil, TbEye } from 'react-icons/tb'
import type { OnSortParam, ColumnDef, Row } from '@/components/shared/DataTable'
import type { TableQueries } from '@/@types/common'
import useCategoryList from '../hooks/useList'
import endpointConfig from '@/configs/endpoint.config'
import { Category } from '@/@types/category'
import { ActionButtonTable } from '@/@types/auth'

const ActionColumn = ({ onEdit, onViewDetail }: ActionButtonTable) => {
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

const CategoryListTable = () => {
    const navigate = useNavigate()

    const {
        categoryList,
        categoryListTotal,
        tableData,
        isLoading,
        setTableData,
        setSelectAllCategory,
        setSelectedCategory,
        selectedCategory,
    } = useCategoryList()

    const handleEdit = (category: Category) => {
        const path = endpointConfig.master.category.edit.replace(
            ':id',
            String(category.id),
        )
        navigate(path)
    }

    const handleViewDetails = (category: Category) => {
        const path = endpointConfig.master.category.view.replace(
            ':id',
            String(category.id),
        )
        navigate(path)
    }

    const columns: ColumnDef<Category>[] = useMemo(
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
                header: 'Action',
                accessorKey: 'action',
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
        if (selectedCategory.length > 0) {
            setSelectAllCategory([])
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

    const handleRowSelect = (checked: boolean, row: Category) => {
        setSelectedCategory(checked, row)
    }

    const handleAllRowSelect = (checked: boolean, rows: Row<Category>[]) => {
        if (checked) {
            const originalRows = rows.map((row) => row.original)
            setSelectAllCategory(originalRows)
        } else {
            setSelectAllCategory([])
        }
    }

    return (
        <DataTable
            selectable
            columns={columns}
            data={categoryList}
            noData={!isLoading && categoryList.length === 0}
            skeletonAvatarColumns={[0]}
            skeletonAvatarProps={{ width: 28, height: 28 }}
            loading={isLoading}
            pagingData={{
                total: categoryListTotal,
                pageIndex: tableData.pageIndex as number,
                pageSize: tableData.pageSize as number,
            }}
            checkboxChecked={(row) =>
                selectedCategory.some((selected) => selected.id === row.id)
            }
            onPaginationChange={handlePaginationChange}
            onSelectChange={handleSelectChange}
            onSort={handleSort}
            onCheckBoxChange={handleRowSelect}
            onIndeterminateCheckBoxChange={handleAllRowSelect}
        />
    )
}

export default CategoryListTable
