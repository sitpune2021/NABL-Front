import ActionColumn from '@/components/form/ActionColumn'
import { TbPencil, TbEye } from 'react-icons/tb'
import type { ColumnDef } from '@/components/shared/DataTable'
import { Template } from '@/@types/template'

type ColumnActions = {
    onEdit: (row: Template) => void
    onView: (row: Template) => void
}

export const buildVersionTemplateColumns = ({
    onEdit,
    onView,
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
        header: 'Is Current',
        accessorKey: 'is_current',
    },
    {
        header: 'Version',
        accessorKey: 'version',
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
                ]}
            />
        ),
    },
]
