// columns/instrument.columns.tsx
import ActionColumn from '@/components/form/ActionColumn'
import { TbPencil, TbEye } from 'react-icons/tb'
import type { ColumnDef } from '@/components/shared/DataTable'
import { Instrument } from '@/@types/instrument'

type ColumnActions = {
    onEdit: (row: Instrument) => void
    onView: (row: Instrument) => void
    can: (permission: string) => boolean
}

export const buildInstrumentColumns = ({
    onEdit,
    onView,
    can,
}: ColumnActions): ColumnDef<Instrument>[] => [
    {
        header: 'Id',
        accessorKey: 'id',
    },
    {
        header: 'Name',
        accessorKey: 'name',
        cell: (props) => {
            const { name, identifier } = props.row.original
            return (
                <div className="flex items-center gap-2">
                    <div>
                        <div className="font-bold heading-text">{name}</div>
                        <div>{identifier}</div>
                    </div>
                </div>
            )
        },
    },
    {
        header: 'Short Name',
        accessorKey: 'short_name',
        cell: (props) => {
            const row = props.row.original
            return <span className="font-semibold">{row.short_name}</span>
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
                        show: can('masters.instrument.write'),
                    },
                    {
                        icon: <TbEye />,
                        tooltip: 'View',
                        onClick: () => onView(row.original),
                        show: can('masters.instrument.list'),
                    },
                ]}
            />
        ),
    },
]
