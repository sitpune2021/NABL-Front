import ActionColumn from '@/components/form/ActionColumn'
import { TbEye } from 'react-icons/tb'
import type { ColumnDef } from '@/components/shared/DataTable'
import { Template } from '@/@types/template'
import IsCurrentBadge from '@/views/masters/template/List/components/IsCurrentBadge'

type ColumnActions = {
    onView: (row: Template) => void
    handleSubmit: (versionId: string | number) => void
    can: (permission: string) => boolean
}

export const buildVersionTemplateColumns = ({
    onView,
    handleSubmit,
    can,
}: ColumnActions): ColumnDef<Template>[] => [
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
            const canEdit = can('masters.template.version.edit')
            return (
                <IsCurrentBadge
                    isCurrent={is_current}
                    disabled={!canEdit}
                    onMakeCurrent={
                        canEdit ? () => handleSubmit(version_id) : undefined
                    }
                />
            )
        },
    },
    {
        header: 'Version',
        accessorKey: 'version',
    },
    {
        header: '',
        id: 'action',
        cell: ({ row }) => (
            <ActionColumn
                buttons={[
                    {
                        icon: <TbEye />,
                        tooltip: 'View',
                        onClick: () => onView(row.original),
                        show: can('masters.template.version.show'),
                    },
                ]}
            />
        ),
    },
]
