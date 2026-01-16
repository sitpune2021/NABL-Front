import ActionColumn from '@/components/form/ActionColumn'
import { TbPencil, TbEye } from 'react-icons/tb'
import type { ColumnDef } from '@/components/shared/DataTable'
import { SubCategory } from '@/@types/subcategory'

type ColumnActions = {
    onEdit: (row: SubCategory) => void
    onView: (row: SubCategory) => void
}

export const buildSubCategoryColumns = ({
    onEdit,
    onView,
}: ColumnActions): ColumnDef<SubCategory>[] => [
    {
        header: 'Id',
        accessorKey: 'id',
    },
    {
        header: 'Category',
        accessorKey: 'category',
        cell: (props) => {
            const { name, identifier } = props.row.original.category
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
        header: 'Sub Category',
        accessorKey: 'Sub Category',
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
