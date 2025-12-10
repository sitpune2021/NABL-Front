import { useMemo } from 'react'
import Tooltip from '@/components/ui/Tooltip'
import Tag from '@/components/ui/Tag'
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

    const typeColor: Record<string, string> = {
        header: 'bg-blue-300 dark:bg-blue-300 text-blue-800 dark:text-blue-800',

        footer: 'bg-green-300 dark:bg-green-300 text-green-800 dark:text-green-800',

        draft: 'bg-yellow-300 dark:bg-yellow-300 text-yellow-800 dark:text-yellow-800',

        'draft-header':
            'bg-amber-300 dark:bg-amber-300 text-amber-800 dark:text-amber-800',

        'draft-footer':
            'bg-purple-300 dark:bg-purple-300 text-purple-800 dark:text-purple-800',

        archived:
            'bg-gray-300 dark:bg-gray-300 text-gray-800 dark:text-gray-800',

        'archived-header':
            'bg-gray-300 dark:bg-gray-300 text-gray-800 dark:text-gray-800',

        'archived-footer':
            'bg-gray-300 dark:bg-gray-300 text-gray-800 dark:text-gray-800',
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
                cell: (props) => {
                    const { name } = props.row.original
                    return (
                        <div className="flex items-center gap-2">
                            <div>
                                <div className="font-bold heading-text">
                                    {name}
                                </div>
                            </div>
                        </div>
                    )
                },
            },
            {
                header: 'Type',
                accessorKey: 'type',
                cell: ({ row }) => {
                    const type = row.original.type

                    return (
                        <Tag className={typeColor[type]}>
                            <span className="capitalize">{type}</span>
                        </Tag>
                    )
                },
            },
            {
                header: 'Version',
                accessorKey: 'current_version',
            },
            {
                header: 'Version Count',
                accessorKey: 'versions_count',
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
