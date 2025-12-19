import ListLayout from '@/components/layouts/ListLayout'
import { actionButtons } from './actionButtons'
import SubCategoryListTableTools from './components/ListTableTools'
import SubCategoryListSelected from './components/ListSelected'
import SubCategoryListTable from './components/ListTable'
import { useSubCategoryListStore } from './store/listStore'
import { useEffect } from 'react'

const SubCategoryList = () => {
    const resetQuery = useSubCategoryListStore((state) => state.resetQuery)
    useEffect(() => {
        return () => {
            resetQuery()
        }
    }, [resetQuery])

    return (
        <ListLayout
            title="Sub Category"
            ActionTools={actionButtons}
            TableTools={<SubCategoryListTableTools />}
            Table={<SubCategoryListTable />}
            SelectedComponent={<SubCategoryListSelected />}
        />
    )
}

export default SubCategoryList
