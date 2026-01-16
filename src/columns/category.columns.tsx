// columns/category.columns.tsx
import ActionColumn from '@/components/form/ActionColumn'
import { TbPencil, TbEye } from 'react-icons/tb'
import type { ColumnDef } from '@/components/shared/DataTable'
import { Category } from '@/@types/category'

type ColumnActions = {
    onEdit: (row: Category) => void
    onView: (row: Category) => void
}

export const buildCategoryColumns = ({
    onEdit,
    onView,
}: ColumnActions): ColumnDef<Category>[] => [
    {
        header: 'Id',
        accessorKey: 'id',
    },
    {
        header: 'Name',
        accessorKey: 'name',
        cell: ({ row }) => {
            const { name, identifier } = row.original
            return (
                <div>
                    <div className="font-bold heading-text">{name}</div>
                    <div className="text-xs opacity-70">{identifier}</div>
                </div>
            )
        },
    },
    {
        header: 'Action',
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
