import ListLayout from '@/components/layouts/ListLayout'
import DocumentListSelected from '@/views/masters/document/List/components/ListSelected'
import DocumentListTableTools from '@/views/masters/document/List/components/ListTableTools'
import DocumentEntryListTableTwo from './ListTableEntryTwo'

const DocumentList = () => {
    return (
        <ListLayout
            title="Document"
            ActionTools={[]}
            TableTools={<DocumentListTableTools />}
            Table={<DocumentEntryListTableTwo />}
            SelectedComponent={<DocumentListSelected />}
        />
    )
}

export default DocumentList
