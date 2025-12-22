import { TableQueries } from '@/@types/common'

export const updateTableData = (
    prev: TableQueries,
    next: Partial<TableQueries>,
): TableQueries => ({
    ...prev,
    ...next,
})
