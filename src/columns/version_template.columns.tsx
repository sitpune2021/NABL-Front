import ActionColumn from '@/components/form/ActionColumn'
import { TbEye } from 'react-icons/tb'
import type { ColumnDef } from '@/components/shared/DataTable'
import { Template } from '@/@types/template'

type ColumnActions = {
    onView: (row: Template) => void
    handleSubmit: (templateId: number, versionId: number) => void
}

export const buildVersionTemplateColumns = ({
    onView,
    handleSubmit,
}: ColumnActions): ColumnDef<Template>[] => [
    {
        header: 'Id',
        accessorKey: 'id',
    },
    {
        header: 'Name',
        accessorKey: 'name',
        cell: (props) => {
            const { name } = props.row.original
            return (
                <div className="flex items-center gap-2">
                    <div>
                        <div className="font-bold heading-text">{name}</div>
                    </div>
                </div>
            )
        },
    },
    {
        header: 'Is Current',
        accessorKey: 'is_current',
        cell: ({ row }) => {
            const { is_current, id: version_id } = row.original

            return (
                <div
                    className={`cursor-pointer rounded px-2 py-1 text-center
                        ${
                            is_current
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 hover:bg-yellow-100'
                        }`}
                    onDoubleClick={() => {
                        if (!is_current) {
                            handleSubmit(version_id)
                        }
                    }}
                >
                    {is_current ? 'true' : 'false'}
                </div>
            )
        },
    },
    {
        header: 'Version',
        accessorKey: 'version',
    },
    {
        header: 'Action',
        id: 'action',
        cell: ({ row }) => (
            <ActionColumn
                buttons={[
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
