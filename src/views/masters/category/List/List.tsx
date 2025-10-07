import ListLayout from '@/components/layouts/ListLayout'
import CategoryListTableTools from './components/ListTableTools'
import CategoryListSelected from './components/ListSelected'
import CategoryListTable from './components/ListTable'
import { actionButtons } from './actionButtons'

const CategoryList = () => {
    return (
        <ListLayout
            title="Category"
            ActionTools={actionButtons}
            TableTools={<CategoryListTableTools />}
            Table={<CategoryListTable />}
            SelectedComponent={<CategoryListSelected />}
        />
    )
}

export default CategoryList
