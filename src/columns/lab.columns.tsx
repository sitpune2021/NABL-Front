import ActionColumn from '@/components/form/ActionColumn'
import { TbPencil, TbEye, TbLocationBolt } from 'react-icons/tb'
import type { ColumnDef } from '@/components/shared/DataTable'
import { Lab } from '@/@types/lab'

type ColumnActions = {
    onEdit: (row: Lab) => void
    onView: (row: Lab) => void
    onLocation: (row: Lab) => void
    can: (permission: string) => boolean
}

export const buildLabColumns = ({
    onEdit,
    onView,
    onLocation,
    can,
}: ColumnActions): ColumnDef<Lab>[] => [
    {
        header: 'Id',
        accessorKey: 'id',
    },
    {
        header: 'Name',
        accessorKey: 'name',
        cell: (props) => {
            const { name, lab_type } = props.row.original
            return (
                <div className="flex items-center gap-2">
                    <div>
                        <div className="font-bold heading-text">{name}</div>
                        <div>{lab_type}</div>
                    </div>
                </div>
            )
        },
    },
    {
        header: 'Lab Code',
        accessorKey: 'lab_code',
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
                        show: can('clients.lab.write'),
                    },
                    {
                        icon: <TbEye />,
                        tooltip: 'View',
                        onClick: () => onView(row.original),
                        show: can('clients.lab.list'),
                    },
                    {
                        icon: <TbLocationBolt />,
                        tooltip: 'Location',
                        onClick: () => onLocation(row.original),
                    },
                ]}
            />
        ),
    },
]
