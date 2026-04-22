/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { useClauseDetail } from '@/views/masters/clauses/List/hooks/useDetail'
import DataTable from '@/components/shared/DataTable'
import type { ColumnDef } from '@/components/shared/DataTable'
import endpointConfig from '@/configs/endpoint.config'
import { TbDatabase, TbMessageCircle } from 'react-icons/tb'
import ListLayout from '@/components/layouts/ListLayout'
import CommentDrawer from '@/views/works/tasks/List/components/Commentdrawer'
import ActionColumn from '@/components/form/ActionColumn'
import { useAuth } from '@/auth'
import getAllDocuments from '@/helpers/getAllDocuments'
import { useSessionUser } from '@/store/authStore'

const ClauseDocumentListTable = () => {
    const activeLab = useSessionUser((state) => state.activeLab)
    const { clause, isLoading } = useClauseDetail(activeLab?.standard_id)
    const navigate = useNavigate()
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [selectedDocument, setSelectedDocument] = useState<any>(null)
    const { can } = useAuth()

    // ✅ Flatten data (same logic)
    const data = getAllDocuments(clause?.clauses || [])

    const handleEntryDetails = (document: any) => {
        const path = endpointConfig.review.review.dataEntryList.replace(
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
                            {row.original.document.name}
                        </span>
                        <div className="text-xs text-gray-500">
                            {row.original.document.number}
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
                    row.original.document.current_version?.full_version || '—',
            },
            {
                header: 'Schedule',
                accessorKey: 'schedule',
                cell: ({ row }) =>
                    row.original.document.current_version?.schedule?.type ||
                    '—',
            },
            {
                header: '',
                id: 'action',
                cell: ({ row }) => (
                    <ActionColumn
                        buttons={[
                            {
                                icon: <TbDatabase />,
                                tooltip: 'Records',
                                onClick: () =>
                                    handleEntryDetails(row.original.document),
                                // show: can('review.review.record.show'),
                            },
                            {
                                icon: <TbMessageCircle />,
                                tooltip: 'Comments',
                                onClick: () =>
                                    handleOpenComments(row.original.document),
                                show: can('review.review.comment'),
                            },
                        ]}
                    />
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
