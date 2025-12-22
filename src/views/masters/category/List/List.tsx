import ListLayout from '@/components/layouts/ListLayout'
import CategoryListTableTools from './components/ListTableTools'
import CategoryListSelected from './components/ListSelected'
import CategoryListTable from './components/ListTable'
import { actionButtons } from './actionButtons'
import { useCategoryListStore } from './store/listStore'
import { useEffect } from 'react'

const CategoryList = () => {
    const resetQuery = useCategoryListStore((state) => state.resetQuery)
    useEffect(() => {
        return () => {
            resetQuery()
        }
    }, [resetQuery])

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
