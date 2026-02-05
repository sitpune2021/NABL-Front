import ActionColumn from '@/components/form/ActionColumn'
import { TbPencil, TbEye, TbList } from 'react-icons/tb'
import type { ColumnDef } from '@/components/shared/DataTable'
import { Template } from '@/@types/template'
import { Tag } from '@/components/ui'
import PublishArchiveCell from '@/views/masters/template/List/components/PublishArchiveCell'

type ColumnActions = {
    onEdit: (row: Template) => void
    onView: (row: Template) => void
    onVersionsList: (row: Template) => void
    handleSubmit: (data: {
        template_id: string | number
        status: 'published' | 'archived'
    }) => Promise<void>
}

const typeColor: Record<string, string> = {
    header: 'bg-blue-300 dark:bg-blue-300 text-black',
    footer: 'bg-green-300 dark:bg-green-300 text-black',
}

export const buildTemplateColumns = ({
    onEdit,
    onView,
    onVersionsList,
    handleSubmit,
}: ColumnActions): ColumnDef<Template>[] => [
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
                        <div className="font-bold heading-text">{name}</div>
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
        header: 'Status',
        accessorKey: 'status',
        cell: ({ row }) => (
            <PublishArchiveCell
                status={row.original.status}
                recordId={row.original.id}
                onSave={(id, status) => {
                    handleSubmit({
                        template_id: id,
                        status,
                    })
                }}
            />
        ),
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
                        icon: <TbList />,
                        tooltip: 'Versions List',
                        onClick: () => onVersionsList(row.original),
                    },
                ]}
            />
        ),
    },
]
