import ActionColumn from '@/components/form/ActionColumn'
import { TbPencil, TbEye } from 'react-icons/tb'
import type { ColumnDef } from '@/components/shared/DataTable'
import { PrefixConfig } from '@/@types/prefixConfig'

type ColumnActions = {
    onEdit: (row: PrefixConfig) => void
    onView: (row: PrefixConfig) => void
    can: (permission: string) => boolean
}

export const buildPrefixConfigColumns = ({
    onEdit,
    onView,
    can,
}: ColumnActions): ColumnDef<PrefixConfig>[] => {
    return [
        {
            header: 'Master',
            accessorKey: 'master_name',
            cell: ({ row }) => {
                const {
                    master_name,
                    master_key,
                    segment_count,
                    characters_max_length,
                    separator,
                } = row.original

                return (
                    <div>
                        <div className="font-bold heading-text">
                            {master_name}
                        </div>
                        <div>{master_key}</div>
                        <div className="text-xs">
                            {segment_count} parts by {separator}, max{' '}
                            {characters_max_length} chars
                        </div>
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
                            show: can('settings.prefixConfig.edit'),
                        },
                        {
                            icon: <TbEye />,
                            tooltip: 'View',
                            onClick: () => onView(row.original),
                            show: can('settings.prefixConfig.show'),
                        },
                    ]}
                />
            ),
        },
    ]
}
