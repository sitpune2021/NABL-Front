import ActionColumn from '@/components/form/ActionColumn'
import { TbPencil, TbEye } from 'react-icons/tb'
import type { ColumnDef } from '@/components/shared/DataTable'
import { Cluster } from '@/@types/cluster'

type ColumnActions = {
    onEdit: (row: Cluster) => void
    onView: (row: Cluster) => void
}
export const buildClusterColumns = ({
    onEdit,
    onView,
}: ColumnActions): ColumnDef<Cluster>[] => [
    {
        header: 'Id',
        accessorKey: 'id',
    },
    {
        header: 'Zone',
        accessorKey: 'zone',
        cell: (props) => {
            const { name, identifier } = props.row.original.zone
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
        header: 'Cluster',
        accessorKey: 'cluster',
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
        header: 'Action',
        accessorKey: 'action',
        id: 'action',
        cell: (props) => (
            <ActionColumn
                buttons={[
                    {
                        icon: <TbPencil />,
                        tooltip: 'Edit',
                        onClick: () => onEdit(props.row.original),
                    },
                    {
                        icon: <TbEye />,
                        tooltip: 'View',
                        onClick: () => onView(props.row.original),
                    },
                ]}
            />
        ),
    },
]
