import { useMemo } from 'react'
import Tooltip from '@/components/ui/Tooltip'
import DataTable from '@/components/shared/DataTable'
import { useNavigate } from 'react-router'
import cloneDeep from 'lodash/cloneDeep'
import { TbPencil, TbEye } from 'react-icons/tb'
import type { OnSortParam, ColumnDef, Row } from '@/components/shared/DataTable'
import type { TableQueries } from '@/@types/common'
import useTemplateList from '../hooks/useList'
import endpointConfig from '@/configs/endpoint.config'
import { Template } from '@/@types/template'

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
                    className="text-xl cursor-pointer select-none font-semibold"
                    role="button"
                    onClick={onEdit}
                >
                    <TbPencil />
                </div>
            </Tooltip>
            <Tooltip title="View">
                <div
                    className="text-xl cursor-pointer select-none font-semibold"
                    role="button"
                    onClick={onViewDetail}
                >
                    <TbEye />
                </div>
            </Tooltip>
        </div>
    )
}

const TemplateListTable = () => {
    const navigate = useNavigate()

    const {
        templateList,
        tableData,
        isLoading,
        setTableData,
        setSelectAllTemplate,
        setSelectedTemplate,
        selectedTemplate,
        filterData,
    } = useTemplateList()

    const filteredList = useMemo(() => {
        const list = templateList || []
        const selected = filterData?.purchaseChannel || []

        if (!selected.length) return list

        if (selected.includes('all')) return list

        return list.filter((item) => {
            const type = (item.type || '').toLowerCase()

            if (selected.includes('archived-all')) {
                if (type.startsWith('archived')) return true
            }
            if (
                selected.includes('archived-header') &&
                type === 'archived-header'
            ) {
                return true
            }

            if (selected.includes('header') && type === 'header') {
                return true
            }

            if (selected.includes('footer') && type === 'footer') {
                return true
            }

            if (selected.includes('generic') && type === 'generic') {
                return true
            }

            if (
                selected.includes('archived-footer') &&
                type === 'archived-footer'
            ) {
                return true
            }
            if (
                selected.includes('archived-generic') &&
                type === 'archived-generic'
            ) {
                return true
            }

            if (selected.includes('draft')) {
                if (type.startsWith('draft')) return true
            }

            if (selected.includes(type)) return true

            return false
        })
    }, [templateList, filterData])

    const handleEdit = (template: Template) => {
        const path = endpointConfig.master.template.edit.replace(
            ':id',
            String(template.id),
        )
        navigate(path)
    }

    const handleViewDetails = (template: Template) => {
        const path = endpointConfig.master.template.view.replace(
            ':id',
            String(template.id),
        )
        navigate(path)
    }

    const columns: ColumnDef<Template>[] = useMemo(
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
                header: 'Type',
                accessorKey: 'type',
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
        if (selectedTemplate.length > 0) {
            setSelectAllTemplate([])
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

    const handleRowSelect = (checked: boolean, row: Template) => {
        setSelectedTemplate(checked, row)
    }

    const handleAllRowSelect = (checked: boolean, rows: Row<Template>[]) => {
        if (checked) {
            const originalRows = rows.map((row) => row.original)
            setSelectAllTemplate(originalRows)
        } else {
            setSelectAllTemplate([])
        }
    }

    return (
        <DataTable
            selectable
            columns={columns}
            data={filteredList}
            noData={!isLoading && filteredList.length === 0}
            skeletonAvatarColumns={[0]}
            skeletonAvatarProps={{ width: 28, height: 28 }}
            loading={isLoading}
            pagingData={{
                total: filteredList.length,
                pageIndex: tableData.pageIndex as number,
                pageSize: tableData.pageSize as number,
            }}
            checkboxChecked={(row) =>
                selectedTemplate.some((selected) => selected.id === row.id)
            }
            onPaginationChange={handlePaginationChange}
            onSelectChange={handleSelectChange}
            onSort={handleSort}
            onCheckBoxChange={handleRowSelect}
            onIndeterminateCheckBoxChange={handleAllRowSelect}
        />
    )
}

export default TemplateListTable
