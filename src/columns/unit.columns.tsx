import ActionColumn from '@/components/form/ActionColumn'
import { TbPencil, TbEye } from 'react-icons/tb'
import type { ColumnDef } from '@/components/shared/DataTable'
import { Unit } from '@/@types/unit'
import type { Lab } from '@/@types/lab'

type ColumnActions = {
    onEdit: (row: Unit) => void
    onView: (row: Unit) => void
    labList: Lab[]
}

export const buildUnitColumns = ({
    onEdit,
    onView,
    labList,
}: ColumnActions): ColumnDef<Unit>[] => {
    const labMap = new Map<number, string>()

    labList.forEach((lab) => {
        if (lab.id) {
            labMap.set(Number(lab.id), lab.name)
        }
    })

    return [
        {
            header: 'Id',
            accessorKey: 'id',
        },
        {
            header: 'Name',
            accessorKey: 'name',
            cell: ({ row }) => {
                const { name, appended_from_lab_id } = row.original

                const labName =
                    appended_from_lab_id != null
                        ? labMap.get(Number(appended_from_lab_id))
                        : null

                return (
                    <div>
                        <div className="font-bold heading-text">{name}</div>

                        {labName && (
                            <div className="mt-2">
                                <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-900 px-2 py-1 text-[11px] font-semibold text-white shadow-md">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                    </span>
                                    {labName}
                                </span>
                            </div>
                        )}
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
                    ]}
                />
            ),
        },
    ]
}
