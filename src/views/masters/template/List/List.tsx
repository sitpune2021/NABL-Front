import ListLayout from '@/components/layouts/ListLayout'
import { actionButtons } from './actionButtons'
import TemplateListTableTools from './components/ListTableTools'
import TemplateListSelected from './components/ListSelected'
import TemplateListTable from './components/ListTable'

const TemplateList = () => {
    return (
        <ListLayout
            title="Template"
            ActionTools={actionButtons}
            TableTools={<TemplateListTableTools />}
            Table={<TemplateListTable />}
            SelectedComponent={<TemplateListSelected />}
        />
    )
}

export default TemplateList
