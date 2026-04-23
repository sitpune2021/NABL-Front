import ActionColumn from '@/components/form/ActionColumn'
import { TbPencil, TbEye, TbList } from 'react-icons/tb'
import type { ColumnDef } from '@/components/shared/DataTable'
import { Template } from '@/@types/template'
import { Tag } from '@/components/ui'
import PublishArchiveCell from '@/views/masters/template/List/components/PublishArchiveCell'
import { Lab } from '@/@types/lab'

type ColumnActions = {
    onEdit: (row: Template) => void
    onView: (row: Template) => void
    onVersionsList: (row: Template) => void
    handleSubmit: (data: {
        template_id: string | number
        status: 'published' | 'archived'
    }) => Promise<void>
    labList: Lab[]
    can: (permission: string) => boolean
}

const typeColor: Record<string, string> = {
    header: 'bg-blue-300 dark:bg-blue-300 text-black',
    footer: 'bg-green-300 dark:bg-green-300 text-black',
}

export const buildTemplateColumns = ({
    onEdit,
    onView,
    onVersionsList,
    handleSubmit,
    labList,
    can,
}: ColumnActions): ColumnDef<Template>[] => {
    const labMap = new Map<number, string>()

    labList.forEach((lab) => {
        if (lab.id) {
            labMap.set(Number(lab.id), lab.name)
        }
    })
    return [
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
            header: 'Type',
            accessorKey: 'type',
            cell: ({ row }) => {
                const type = row.original.type

                return (
                    <Tag className={typeColor[type]}>
                        <span className="capitalize">{type}</span>
                    </Tag>
                )
            },
        },
        {
            header: 'Version',
            accessorKey: 'current_version',
        },
        {
            header: 'Version Count',
            accessorKey: 'versions_count',
        },
        {
            header: 'Status',
            accessorKey: 'status',
            cell: ({ row }) => (
                <PublishArchiveCell
                    status={row.original.status}
                    recordId={row.original.id}
                    onSave={(id, status) => {
                        handleSubmit({
                            template_id: id,
                            status,
                        })
                    }}
                />
            ),
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
                            show: can('masters.template.edit'),
                        },
                        {
                            icon: <TbEye />,
                            tooltip: 'View',
                            onClick: () => onView(row.original),
                            show: can('masters.template.show'),
                        },
                        {
                            icon: <TbList />,
                            tooltip: 'Versions List',
                            onClick: () => onVersionsList(row.original),
                            show: can('masters.template.version.index'),
                        },
                    ]}
                />
            ),
        },
    ]
}
