import { useMemo } from 'react'
import ActionColumn from '@/components/form/ActionColumn'
import DataTable from '@/components/shared/DataTable'
import { useNavigate } from 'react-router'
import cloneDeep from 'lodash/cloneDeep'
import { TbPencil, TbEye } from 'react-icons/tb'
import type { OnSortParam, ColumnDef, Row } from '@/components/shared/DataTable'
import type { TableQueries } from '@/@types/common'
import useSubCategoryList from '../hooks/useList'
import endpointConfig from '@/configs/endpoint.config'
import { SubCategory } from '@/@types/subcategory'

const SubCategoryListTable = () => {
    const navigate = useNavigate()

    const {
        subcategoryList,
        subcategoryListTotal,
        tableData,
        isLoading,
        setTableData,
        setSelectAllSubCategory,
        setSelectedSubCategory,
        selectedSubCategory,
    } = useSubCategoryList()

    const handleEdit = (subcategory: SubCategory) => {
        const path = endpointConfig.master.subcategory.edit.replace(
            ':id',
            String(subcategory.id),
        )
        navigate(path)
    }

    const handleViewDetails = (subcategory: SubCategory) => {
        const path = endpointConfig.master.subcategory.view.replace(
            ':id',
            String(subcategory.id),
        )
        navigate(path)
    }

    const columns: ColumnDef<SubCategory>[] = useMemo(
        () => [
            {
                header: 'Id',
                accessorKey: 'id',
            },
            {
                header: 'Category',
                accessorKey: 'category',
                cell: (props) => {
                    const { name, identifier } = props.row.original.category
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
                header: 'Sub Category',
                accessorKey: 'Sub Category',
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
        if (selectedSubCategory.length > 0) {
            setSelectAllSubCategory([])
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

    const handleRowSelect = (checked: boolean, row: SubCategory) => {
        setSelectedSubCategory(checked, row)
    }

    const handleAllRowSelect = (checked: boolean, rows: Row<SubCategory>[]) => {
        if (checked) {
            const originalRows = rows.map((row) => row.original)
            setSelectAllSubCategory(originalRows)
        } else {
            setSelectAllSubCategory([])
        }
    }

    return (
        <DataTable
            selectable
            columns={columns}
            data={subcategoryList}
            noData={!isLoading && subcategoryList.length === 0}
            skeletonAvatarColumns={[0]}
            skeletonAvatarProps={{ width: 28, height: 28 }}
            loading={isLoading}
            pagingData={{
                total: subcategoryListTotal,
                pageIndex: tableData.pageIndex as number,
                pageSize: tableData.pageSize as number,
            }}
            checkboxChecked={(row) =>
                selectedSubCategory.some((selected) => selected.id === row.id)
            }
            onPaginationChange={handlePaginationChange}
            onSelectChange={handleSelectChange}
            onSort={handleSort}
            onCheckBoxChange={handleRowSelect}
            onIndeterminateCheckBoxChange={handleAllRowSelect}
        />
    )
}

export default SubCategoryListTable
