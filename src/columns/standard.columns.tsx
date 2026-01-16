import ActionColumn from '@/components/form/ActionColumn'
import { TbPencil, TbEye, TbAB } from 'react-icons/tb'
import type { ColumnDef } from '@/components/shared/DataTable'
import { Standard } from '@/@types/standard'
import { Tag } from '@/components/ui'

const statusColor: Record<string, string> = {
    draft: 'bg-yellow-100 text-yellow-700',
    published: 'bg-emerald-100 text-emerald-700',
}

type ColumnActions = {
    onEdit: (row: Standard) => void
    onView: (row: Standard) => void
    onClause: (row: Standard) => void
}

export const buildStandardColumns = ({
    onEdit,
    onView,
    onClause,
}: ColumnActions): ColumnDef<Standard>[] => [
    {
        header: 'Name',
        accessorKey: 'name',
        cell: (props) => {
            const row = props.row.original
            return <span className="font-bold">{row.name || 'No Name'}</span>
        },
    },
    {
        header: 'Created At',
        accessorKey: 'created_at',
        cell: (props) => {
            const row = props.row.original

            const formatted = new Date(row.created_at).toLocaleDateString(
                'en-IN',
                {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                },
            )

            return <span className="font-semibold">{formatted}</span>
        },
    },
    {
        header: 'Status',
        accessorKey: 'status',
        cell: (props) => {
            const row = props.row.original
            return (
                <div className="flex items-center">
                    <Tag className={statusColor[row.status]}>
                        <span className="capitalize">{row.status}</span>
                    </Tag>
                </div>
            )
        },
    },
    {
        header: '',
        id: 'action',
        cell: ({ row }) => (
            <ActionColumn
                buttons={[
                    {
                        icon: <TbPencil />,
                        tooltip: 'Edit',
                        onClick: () => onEdit(row.original),
                    },
                    {
                        icon: <TbEye />,
                        tooltip: 'View',
                        onClick: () => onView(row.original),
                    },
                    {
                        icon: <TbAB />,
                        tooltip: 'Clause',
                        onClick: () => onClause(row.original),
                    },
                ]}
            />
        ),
    },
]
