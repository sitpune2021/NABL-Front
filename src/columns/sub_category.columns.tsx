import ActionColumn from '@/components/form/ActionColumn'
import { TbPencil, TbEye } from 'react-icons/tb'
import type { ColumnDef } from '@/components/shared/DataTable'
import { SubCategory } from '@/@types/subcategory'

type ColumnActions = {
    onEdit: (row: SubCategory) => void
    onView: (row: SubCategory) => void
    can: (permission: string) => boolean
}

export const buildSubCategoryColumns = ({
    onEdit,
    onView,
    can,
}: ColumnActions): ColumnDef<SubCategory>[] => {
    return [
        {
            header: 'Category',
            accessorKey: 'category',
            cell: (props) => {
                const { name, identifier } = props.row.original.category
                return (
                    <div className="flex flex-col gap-1">
                        <div className="font-bold heading-text">{name}</div>
                        <div className="text-gray-500 text-sm">
                            {identifier}
                        </div>
                    </div>
                )
            },
        },
        {
            header: 'Sub Category',
            accessorKey: 'Sub Category',
            cell: (props) => {
                const { name, identifier, lab } = props.row.original

                return (
                    <div className="flex flex-col gap-1">
                        <div className="font-bold heading-text">{name}</div>
                        <div className="text-gray-500 text-sm">
                            {identifier}
                        </div>

                        {lab != null && (
                            <div>
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
                            show: can('masters.subcategory.edit'),
                        },
                        {
                            icon: <TbEye />,
                            tooltip: 'View',
                            onClick: () => onView(row.original),
                            show: can('masters.subcategory.show'),
                        },
                    ]}
                />
            ),
        },
    ]
}
