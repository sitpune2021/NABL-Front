import { useMemo } from 'react'
import ActionColumn from '@/components/form/ActionColumn'
import DataTable from '@/components/shared/DataTable'
import { useNavigate } from 'react-router'
import cloneDeep from 'lodash/cloneDeep'
import {
    TbEye,
    TbEdit,
    TbFileText,
    TbFilePencil,
    TbBrandSentry,
} from 'react-icons/tb'
import type { OnSortParam, ColumnDef, Row } from '@/components/shared/DataTable'
import type { TableQueries } from '@/@types/common'
import useDocumentList from '../hooks/useList'
import endpointConfig from '@/configs/endpoint.config'
import { Document } from '@/@types/document'

const DocumentListTable = () => {
    const navigate = useNavigate()

    const {
        documentList,
        documentListTotal,
        tableData,
        isLoading,
        setTableData,
        setSelectAllDocument,
        setSelectedDocument,
        selectedDocument,
    } = useDocumentList()
    console.log(documentList)

    const handleEdit = (document: Document) => {
        const path = endpointConfig.master.document.edit.replace(
            ':id',
            String(document.id),
        )
        navigate(path)
    }

    const handleViewDetails = (document: Document) => {
        const path = endpointConfig.master.document.view.replace(
            ':id',
            String(document.id),
        )
        navigate(path)
    }

    const handleEditorViewDetails = (document: Document) => {
        const path = endpointConfig.master.document.editorview
            .replace(':docId', String(document.id))
            .replace(':id', String(document.editor?.id))
        navigate(path)
    }

    const handleEditorDetails = (document: Document) => {
        const path = endpointConfig.master.document.editorEdit
            .replace(':docId', String(document.id))
            .replace(':id', String(document.editor?.id))
        navigate(path)
    }

    const handleDataEntryForm = (document: Document) => {
        const path = endpointConfig.master.document.dataEntry
            .replace(':docId', String(document.id))
            .replace(':id', String(document.editor?.id))
        navigate(path)
    }

    const columns: ColumnDef<Document>[] = useMemo(
        () => [
            {
                header: 'Id',
                accessorKey: 'id',
            },
            {
                header: 'Document No',
                accessorKey: 'documentNo',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <span className="font-semibold">{row.documentNo}</span>
                    )
                },
            },
            {
                header: 'Document Name',
                accessorKey: 'documentName',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <span className="font-semibold heading-text">
                            {row.documentName}
                        </span>
                    )
                },
            },
            {
                header: 'Category',
                accessorKey: 'category',
                cell: (props) => {
                    const row = props.row.original
                    return <span className="font-semibold">{row.category}</span>
                },
            },
            {
                header: 'Status',
                accessorKey: 'status',
                cell: ({ row }) => (
                    <span
                        className={`px-2 py-1 rounded-full text-sm ${
                            row.original.status === 'Controlled'
                                ? 'bg-green-100 text-green-700'
                                : row.original.status === 'Uncontrolled'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-gray-100 text-gray-700'
                        }`}
                    >
                        {row.original.status || '—'}
                    </span>
                ),
            },

            {
                header: 'Action',
                accessorKey: 'action',
                id: 'action',
                cell: (props) => (
                    <ActionColumn
                        buttons={[
                            {
                                icon: <TbEdit />,
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
                                icon: <TbFileText />,
                                tooltip: 'Document View',
                                onClick: () =>
                                    handleEditorViewDetails(props.row.original),
                            },
                            {
                                icon: <TbFilePencil />,
                                tooltip: 'Document Edit',
                                onClick: () =>
                                    handleEditorDetails(props.row.original),
                            },
                            {
                                icon: <TbBrandSentry />,
                                tooltip: 'Data Entry Form',
                                onClick: () =>
                                    handleDataEntryForm(props.row.original),
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
        if (selectedDocument.length > 0) {
            setSelectAllDocument([])
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

    const handleRowSelect = (checked: boolean, row: Document) => {
        setSelectedDocument(checked, row)
    }

    const handleAllRowSelect = (checked: boolean, rows: Row<Document>[]) => {
        if (checked) {
            const originalRows = rows.map((row) => row.original)
            setSelectAllDocument(originalRows)
        } else {
            setSelectAllDocument([])
        }
    }

    return (
        <DataTable
            selectable
            columns={columns}
            data={documentList}
            noData={!isLoading && documentList.length === 0}
            skeletonAvatarColumns={[0]}
            skeletonAvatarProps={{ width: 28, height: 28 }}
            loading={isLoading}
            pagingData={{
                total: documentListTotal,
                pageIndex: tableData.pageIndex as number,
                pageSize: tableData.pageSize as number,
            }}
            checkboxChecked={(row) =>
                selectedDocument.some((selected) => selected.id === row.id)
            }
            onPaginationChange={handlePaginationChange}
            onSelectChange={handleSelectChange}
            onSort={handleSort}
            onCheckBoxChange={handleRowSelect}
            onIndeterminateCheckBoxChange={handleAllRowSelect}
        />
    )
}

export default DocumentListTable
