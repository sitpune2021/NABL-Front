import ActionColumn from '@/components/form/ActionColumn'
import { TbPencil, TbEye } from 'react-icons/tb'
import type { ColumnDef } from '@/components/shared/DataTable'
import { Prefix } from '@/@types/prefix'

type ColumnActions = {
    onEdit: (row: Prefix) => void
    onView: (row: Prefix) => void
    can: (permission: string) => boolean
}

export const buildPrefixColumns = ({
    onEdit,
    onView,
    can,
}: ColumnActions): ColumnDef<Prefix>[] => {
    return [
        {
            header: 'For Which Master',
            accessorKey: 'prefix_master',
        },
        {
            header: 'Type',
            accessorKey: 'type',
        },
        {
            header: 'Min Length',
            accessorKey: 'min_length',
        },
        {
            header: 'Max Length',
            accessorKey: 'max_length',
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
                            show: can('settings.prefix.edit'),
                        },
                        {
                            icon: <TbEye />,
                            tooltip: 'View',
                            onClick: () => onView(row.original),
                            show: can('settings.prefix.show'),
                        },
                    ]}
                />
            ),
        },
    ]
}
