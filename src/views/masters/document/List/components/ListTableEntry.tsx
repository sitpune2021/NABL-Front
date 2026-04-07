import { useMemo } from 'react'
import { useParams } from 'react-router'
import DataTable from '@/components/shared/DataTable'
import { useDateEntryList } from '../hooks/dataentry'
import { buildDocumentDataEntryColumns } from '@/columns/document_data_entry.columns'

const DocumentEntryListTable = () => {
    const { id } = useParams()

    const { dataEntryList, isLoading } = useDateEntryList(id)

    const headers = dataEntryList?.headers ?? []
    const rows = dataEntryList?.rows ?? []

    const columns = useMemo(
        () =>
            buildDocumentDataEntryColumns({
                headers,
            }),
        [headers],
    )

    return (
        <>
            <DataTable
                selectable
                columns={columns}
                data={rows}
                noData={!isLoading && rows.length === 0}
                loading={isLoading}
                skeletonAvatarColumns={[0]}
                skeletonAvatarProps={{ width: 28, height: 28 }}
            />
        </>
    )
}

export default DocumentEntryListTable
