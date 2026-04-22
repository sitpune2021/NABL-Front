/* eslint-disable @typescript-eslint/no-explicit-any */
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
import WorkflowStateCell from './WorkflowStateCell'
import { useEntityMutations } from '@/utils/hooks/useEntityMutations'
import { apiDocumentWorkFlow } from '@/services/DocumentService'
import { useFormSubmit } from '@/utils/hoc/useFormSubmit'
import { useAuth } from '@/auth'

const DocumentListTable = () => {
    const navigate = useNavigate()
    const { can } = useAuth()

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

    const { save } = useEntityMutations<any>({
        apiCreate: apiDocumentWorkFlow,
    })

    const { handleSubmit } = useFormSubmit<any>({
        apiCall: (values) => save({ ...values }),
        navigateTo: endpointConfig.master.document.list,
    })

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
        const path = endpointConfig.master.document.editorview.replace(
            ':id',
            String(document?.id),
        )
        navigate(path)
    }

    const handleEntryDetails = (document: Document) => {
        const path = endpointConfig.master.document.dataEntryList.replace(
            ':id',
            String(document.id),
        )
        navigate(path)
    }

    const handleDataEntryForm = (document: Document) => {
        const path = endpointConfig.master.document.dataEntry.replace(
            ':id',
            String(document.id),
        )
        navigate(path)
    }

    const columns: ColumnDef<Document>[] = useMemo(
        () => [
            {
                header: 'Id',
                accessorKey: 'id',
            },
            {
                header: 'Document Name',
                accessorKey: 'name',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <>
                            <span className="font-semibold heading-text">
                                {row.name}
                            </span>
                            ({row?.category?.name})
                        </>
                    )
                },
            },
            {
                header: 'Version',
                accessorKey: 'current_vrsn',
            },
            {
                header: 'Version Count',
                accessorKey: 'versions_count',
            },
            {
                header: 'Mode',
                accessorKey: 'mode',
            },
            {
                header: 'Workflow State',
                accessorKey: 'workflow_state',
                cell: ({ row }) => (
                    <span>
                        {row.original.mode == 'upload'
                            ? '—'
                            : row.original.current_version.workflow_state ||
                              '—'}
                    </span>
                ),
            },
            {
                header: 'Workflow State action',
                accessorKey: 'workflow_state_action',
                cell: ({ row }) => (
                    <WorkflowStateCell
                        document={row.original}
                        show={can('masters.document.workflow-logs.action')}
                        onSave={(id, value) => {
                            handleSubmit({
                                document_version_id: id,
                                action: value,
                            })
                        }}
                    />
                ),
            },
            {
                header: '',
                accessorKey: 'action',
                id: 'action',
                cell: (props) => (
                    <ActionColumn
                        buttons={[
                            {
                                icon: <TbEdit />,
                                tooltip: 'Edit',
                                onClick: () => handleEdit(props.row.original),
                                show: can('masters.document.write'),
                            },

                            {
                                icon: <TbEye />,
                                tooltip: 'View',
                                onClick: () =>
                                    handleViewDetails(props.row.original),
                                show: can('masters.document.list'),
                            },
                            {
                                icon: <TbFileText />,
                                tooltip: 'Document View',
                                onClick: () =>
                                    handleEditorViewDetails(props.row.original),
                                show:
                                    can('masters.document.write') &&
                                    props.row.original.mode == 'create',
                            },
                            {
                                icon: <TbFilePencil />,
                                tooltip: 'Data Entry List',
                                onClick: () =>
                                    handleEntryDetails(props.row.original),
                                show: can(
                                    'masters.document.workflow-logs.action',
                                ),
                            },
                            {
                                icon: <TbBrandSentry />,
                                tooltip: 'Data Entry Form',
                                onClick: () =>
                                    handleDataEntryForm(props.row.original),
                                show: can('masters.document.write'),
                            },
                        ].filter(Boolean)} // remove null entries
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
