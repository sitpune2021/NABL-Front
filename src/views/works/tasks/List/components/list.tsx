/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { useClauseDetail } from '@/views/masters/clauses/List/hooks/useDetail'
import DataTable from '@/components/shared/DataTable'
import type { ColumnDef } from '@/components/shared/DataTable'
import endpointConfig from '@/configs/endpoint.config'
import { TbDatabase, TbMessageCircle } from 'react-icons/tb'
import ListLayout from '@/components/layouts/ListLayout'
import CommentDrawer from './Commentdrawer'
import { Button } from '@/components/ui'
import getAllDocuments from '@/helpers/getAllDocuments'

const ClauseDocumentListTable = () => {
    const { clause, isLoading } = useClauseDetail('1', { type: 'bysingle' })
    const navigate = useNavigate()
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [selectedDocument, setSelectedDocument] = useState<any>(null)

    // FINAL
    const data = getAllDocuments(clause?.clauses || [])

    const handleEntryDetails = (document: any) => {
        const path = endpointConfig.works.tasks.dataEntryList.replace(
            ':id',
            String(document.id),
        )
        navigate(path)
    }
    const handleOpenComments = (document: any) => {
        setSelectedDocument(document)
        setDrawerOpen(true)
    }

    // ✅ Columns (same style as your main table)
    const columns: ColumnDef<any>[] = useMemo(
        () => [
            {
                header: 'Clause',
                accessorKey: 'clauseTitle',
            },
            {
                header: 'Document Name',
                accessorKey: 'name',
                cell: ({ row }) => (
                    <div>
                        <span className="font-semibold">
                            {row.original.name}
                        </span>
                        <div className="text-xs text-gray-500">
                            {row.original.number}
                        </div>
                    </div>
                ),
            },
            {
                header: 'Status',
                accessorKey: 'status',
            },
            {
                header: 'Version',
                accessorKey: 'current_version.full_version',
                cell: ({ row }) =>
                    row.original.current_version?.full_version || '—',
            },
            {
                header: 'Schedule',
                accessorKey: 'schedule',
                cell: ({ row }) =>
                    row.original.current_version?.schedule?.type || '—',
            },
            {
                header: 'Action',
                id: 'action',
                cell: ({ row }) => (
                    <div className="flex items-center gap-2">
                        <Button
                            size="xs"
                            variant="plain"
                            icon={<TbDatabase />}
                            onClick={() => handleEntryDetails(row.original)}
                        >
                            Records
                        </Button>

                        <Button
                            size="xs"
                            variant="plain"
                            icon={<TbMessageCircle />}
                            onClick={() => handleOpenComments(row.original)}
                        >
                            Comments
                        </Button>
                    </div>
                ),
            },
        ],
        [],
    )

    return (
        <>
            <ListLayout
                title="Document"
                Table={
                    <DataTable
                        columns={columns}
                        data={data}
                        loading={isLoading}
                        noData={!isLoading && data.length === 0}
                    />
                }
            />
            <CommentDrawer
                isOpen={drawerOpen}
                document={selectedDocument}
                onClose={() => setDrawerOpen(false)}
            />
        </>
    )
}

export default ClauseDocumentListTable
