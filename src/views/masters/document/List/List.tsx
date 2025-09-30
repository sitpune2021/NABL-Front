import ListLayout from '@/components/layouts/ListLayout'
import { actionButtons } from './actionButtons'
import DocumentListTableTools from './components/ListTableTools'
import DocumentListSelected from './components/ListSelected'
import DocumentListTable from './components/ListTable'

const DocumentList = () => {
    return (
        <ListLayout
            title="Document"
            ActionTools={actionButtons}
            TableTools={<DocumentListTableTools />}
            Table={<DocumentListTable />}
            SelectedComponent={<DocumentListSelected />}
        />
    )
}

export default DocumentList
