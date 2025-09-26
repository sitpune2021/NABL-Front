import ListLayout from '@/components/layouts/ListLayout'
import { actionButtons } from './actionButtons'
import CategoryListTableTools from './components/ListTableTools'
import CategoryListSelected from './components/ListSelected'
import CategoryListTable from './components/ListTable'

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
