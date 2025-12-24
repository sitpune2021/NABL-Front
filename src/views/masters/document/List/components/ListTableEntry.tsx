import { useMemo } from 'react'
import DataTable from '@/components/shared/DataTable'
import { useParams } from 'react-router'
import type { ColumnDef } from '@/components/shared/DataTable'
import { Document } from '@/@types/document'
import { useDateEntryList } from '../hooks/dataentry'

const DocumentEntryListTable = () => {
    const { id } = useParams()

    const { dataEntryList } = useDateEntryList(id)

    const columns: ColumnDef<Document>[] = useMemo(
        () => [
            {
                header: 'Id',
                accessorKey: 'id',
            },
            {
                header: 'Document Name',
                accessorKey: 'name',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <span className="font-semibold heading-text">
                            {row.name}
                        </span>
                    )
                },
            },
            {
                header: 'Category',
                accessorKey: 'category_id',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <span className="font-semibold">
                            {row?.category?.name}
                        </span>
                    )
                },
            },
        ],

        [],
    )

    return (
        <DataTable
            selectable
            columns={columns}
            data={dataEntryList}
            skeletonAvatarColumns={[0]}
            skeletonAvatarProps={{ width: 28, height: 28 }}
        />
    )
}

export default DocumentEntryListTable
