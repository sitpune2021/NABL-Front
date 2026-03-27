import { useMemo } from 'react'
import { useParams, useNavigate } from 'react-router'
import DataTable from '@/components/shared/DataTable'
import { useDateEntryList } from '../hooks/dataentry'
import { buildDocumentDataEntryColumns } from '@/columns/document_data_entry.columns'
import { Button } from '@/components/ui'
import { TbBrandSentry } from 'react-icons/tb'
import endpointConfig from '@/configs/endpoint.config'

const DocumentEntryListTable = () => {
    const { id } = useParams()
    const navigate = useNavigate()

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
    const handleDataEntryForm = () => {
        const path = endpointConfig.master.document.dataEntry.replace(
            ':id',
            String(id),
        )
        navigate(path)
    }

    return (
        <>
            <div className="flex justify-end mb-4">
                <Button
                    variant="solid"
                    icon={<TbBrandSentry />}
                    onClick={handleDataEntryForm}
                >
                    Data Entry Form
                </Button>
            </div>

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
