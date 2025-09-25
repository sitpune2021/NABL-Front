import ListLayout from '@/components/layouts/ListLayout'
import { actionButtons } from './actionButtons'
import CategoryListTableTools from './components/CategoryListTableTools'
import CategoryListSelected from './components/CategoryListSelected'
import CategoryListTable from './components/CategoryListTable'

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
