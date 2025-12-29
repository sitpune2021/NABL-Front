/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ColumnDef } from '@/components/shared/DataTable'

type ColumnActions = {
    headers: string[]
}

export const buildDocumentDataEntryColumns = ({
    headers,
}: ColumnActions): ColumnDef<any>[] => {
    const dynamicColumns: ColumnDef<any>[] = headers.map(
        (headerName, index) => ({
            header: headerName,
            accessorFn: (row) => row.values?.[index],
            cell: ({ getValue }) => (
                <div className="whitespace-pre-wrap">
                    {String(getValue() ?? '-')}
                </div>
            ),
        }),
    )

    return [
        {
            header: 'ID',
            accessorKey: 'id',
        },

        ...dynamicColumns,
    ]
}
