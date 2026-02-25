import ListLayout from '@/components/layouts/ListLayout'
import DocumentListTableTools from './components/ListTableTools'
import DocumentListSelected from './components/ListSelected'
import DocumentEntryListTable from './components/ListTableEntry'

const DocumentList = () => {
    return (
        <ListLayout
            title="Task List"
            ActionTools={[]}
            TableTools={<DocumentListTableTools />}
            Table={<DocumentEntryListTable />}
            SelectedComponent={<DocumentListSelected />}
        />
    )
}

export default DocumentList
