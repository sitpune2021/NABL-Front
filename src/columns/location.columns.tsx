import ActionColumn from '@/components/form/ActionColumn'
import { TbPencil, TbEye } from 'react-icons/tb'
import type { ColumnDef } from '@/components/shared/DataTable'
import { Location } from '@/@types/location'

type ColumnActions = {
    onEdit: (row: Location) => void
    onView: (row: Location) => void
}

export const buildLocationColumns = ({
    onEdit,
    onView,
}: ColumnActions): ColumnDef<Location>[] => [
    {
        header: 'Id',
        accessorKey: 'id',
    },
    {
        header: 'Zone',
        accessorKey: 'zone',
        cell: (props) => {
            const { name, identifier } = props.row.original.cluster.zone
            return (
                <div className="flex items-center gap-2">
                    <div>
                        <div className="font-bold heading-text">{name}</div>
                        <div className="font-semibold">{identifier}</div>
                    </div>
                </div>
            )
        },
    },
    {
        header: 'Cluster',
        accessorKey: 'cluster',
        cell: (props) => {
            const { name, identifier } = props.row.original.cluster
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
        header: 'Location',
        accessorKey: 'location',
        cell: (props) => {
            const { name, identifier, short_name } = props.row.original
            return (
                <div className="flex items-center gap-2">
                    <div>
                        <div className="font-bold heading-text">
                            {name} - ({short_name})
                        </div>
                        <div>{identifier}</div>
                    </div>
                </div>
            )
        },
    },
    {
        header: '',
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
