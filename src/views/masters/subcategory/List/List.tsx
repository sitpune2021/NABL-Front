import ListLayout from '@/components/layouts/ListLayout'
import { actionButtons } from './actionButtons'
import SubCategoryListTableTools from './components/ListTableTools'
import SubCategoryListSelected from './components/ListSelected'
import SubCategoryListTable from './components/ListTable'

const SubCategoryList = () => {
    return (
        <ListLayout
            title="SubCategory"
            ActionTools={actionButtons}
            TableTools={<SubCategoryListTableTools />}
            Table={<SubCategoryListTable />}
            SelectedComponent={<SubCategoryListSelected />}
        />
    )
}

export default SubCategoryList
