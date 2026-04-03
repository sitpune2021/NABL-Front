import ActionColumn from '@/components/form/ActionColumn'
import { TbPencil, TbEye } from 'react-icons/tb'
import type { ColumnDef } from '@/components/shared/DataTable'
import { Location } from '@/@types/location'

type ColumnActions = {
    onEdit: (row: Location) => void
    onView: (row: Location) => void
    can: (permission: string) => boolean
}

export const buildLocationColumns = ({
    onEdit,
    onView,
    can,
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
            const { name, identifier, short_name, lab } = props.row.original
            return (
                <div className="flex items-center gap-2">
                    <div>
                        <div className="font-bold heading-text">
                            {name} - ({short_name})
                        </div>
                        <div>{identifier}</div>
                        {lab != null && (
                            <div className="mt-2">
                                <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-900 px-2 py-1 text-[11px] font-semibold text-white shadow-md">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                    </span>
                                    {lab.name}
                                </span>
                            </div>
                        )}
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
                        show: can('masters.location.edit'),
                    },
                    {
                        icon: <TbEye />,
                        tooltip: 'View',
                        onClick: () => onView(props.row.original),
                        show: can('masters.location.show'),
                    },
                ]}
            />
        ),
    },
]
