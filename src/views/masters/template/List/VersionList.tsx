import ListLayout from '@/components/layouts/ListLayout'
import TemplateListTableTools from './components/ListTableTools'
import TemplateListSelected from './components/ListSelected'
import VersionListTable from './components/VersionListTable'

const VersionList = () => {
    return (
        <ListLayout
            title="Template Versions"
            TableTools={<TemplateListTableTools />}
            Table={<VersionListTable />}
            SelectedComponent={<TemplateListSelected />}
        />
    )
}

export default VersionList
