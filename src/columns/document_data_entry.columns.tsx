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
            cell: ({ getValue }) => {
                const value = getValue()?.toString() ?? '-'
                const isUrl =
                    value.startsWith('http') || value.startsWith('https')

                if (isUrl) {
                    return (
                        <a
                            href={value}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                        >
                            View Document
                        </a>
                    )
                }
                return <div className="whitespace-pre-wrap">{value}</div>
            },
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
