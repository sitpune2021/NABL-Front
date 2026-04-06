import { buildDocumentDataEntryColumns } from '@/columns/document_data_entry.columns'
import { DataTable } from '@/components/shared'
import { Button } from '@/components/ui'
import endpointConfig from '@/configs/endpoint.config'
import { useDateEntryList } from '@/views/masters/document/List/hooks/dataentry'
import { useMemo } from 'react'
import { TbBrandSentry } from 'react-icons/tb'
import { useNavigate, useParams } from 'react-router'

const DocumentEntryListTableTwo = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const { dataEntryList, isLoading } = useDateEntryList(id, {
        type: 'bysingle',
    })

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

export default DocumentEntryListTableTwo
