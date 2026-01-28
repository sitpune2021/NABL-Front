import ListLayout from '@/components/layouts/ListLayout'
import MenuListTableTools from './components/ListTableTools'
import MenuListSelected from './components/ListSelected'
import MenuListTable from './components/ListTable'
import { useMenuListStore } from './store/listStore'
import { useEffect } from 'react'

const MenuList = () => {
    const resetQuery = useMenuListStore((state) => state.resetQuery)

    useEffect(() => {
        return () => {
            resetQuery()
        }
    }, [resetQuery])

    return (
        <ListLayout
            title="Menu"
            TableTools={<MenuListTableTools />}
            Table={<MenuListTable />}
            SelectedComponent={<MenuListSelected />}
        />
    )
}

export default MenuList
