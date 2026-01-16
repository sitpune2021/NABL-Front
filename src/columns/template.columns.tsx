import ActionColumn from '@/components/form/ActionColumn'
import { TbPencil, TbEye, TbList } from 'react-icons/tb'
import type { ColumnDef } from '@/components/shared/DataTable'
import { Template } from '@/@types/template'
import { Tag } from '@/components/ui'

type ColumnActions = {
    onEdit: (row: Template) => void
    onView: (row: Template) => void
    onVersionsList: (row: Template) => void
}

const typeColor: Record<string, string> = {
    header: 'bg-blue-300 dark:bg-blue-300 text-black',
    footer: 'bg-green-300 dark:bg-green-300 text-black',
}

export const buildTemplateColumns = ({
    onEdit,
    onView,
    onVersionsList,
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
        header: 'Action',
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
