import ActionColumn from '@/components/form/ActionColumn'
import { TbPencil, TbEye } from 'react-icons/tb'
import type { ColumnDef } from '@/components/shared/DataTable'
import { Department } from '@/@types/department'

type ColumnActions = {
    onEdit: (row: Department) => void
    onView: (row: Department) => void
    can: (permission: string) => boolean
}

export const buildDepartmentColumns = ({
    onEdit,
    onView,
    can,
}: ColumnActions): ColumnDef<Department>[] => {
    return [
        {
            header: 'Id',
            accessorKey: 'id',
        },
        {
            header: 'Name',
            accessorKey: 'name',
            cell: ({ row }) => {
                const { name, identifier, lab } = row.original

                return (
                    <div>
                        <div className="font-bold heading-text">{name}</div>
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
                            show: can('masters.department.write'),
                        },
                        {
                            icon: <TbEye />,
                            tooltip: 'View',
                            onClick: () => onView(row.original),
                            show: can('masters.department.list'),
                        },
                    ]}
                />
            ),
        },
    ]
}
