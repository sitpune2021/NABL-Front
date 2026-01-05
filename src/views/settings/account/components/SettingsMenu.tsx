/* eslint-disable @typescript-eslint/no-explicit-any */
import Menu from '@/components/ui/Menu'
import ScrollBar from '@/components/ui/ScrollBar'
import { useSettingsStore } from '../store/settingsStore'
import useQuery from '@/utils/hooks/useQuery'
import { TbUserSquare, TbLock, TbBell, TbMapPin } from 'react-icons/tb'
import type { View } from '@/@types/account'
import type { ReactNode } from 'react'
import { useSessionUser } from '@/store/authStore'

const { MenuItem } = Menu

const menuList: { label: string; value: View; icon: ReactNode }[] = [
    { label: 'Profile', value: 'profile', icon: <TbUserSquare /> },
    { label: 'Locations', value: 'location', icon: <TbMapPin /> },
    { label: 'Security', value: 'security', icon: <TbLock /> },
    { label: 'Notification', value: 'notification', icon: <TbBell /> },
]

export const SettingsMenu = ({ onChange }: { onChange?: () => void }) => {
    const query = useQuery()

    const { currentView, setCurrentView } = useSettingsStore()

    const user: any = useSessionUser((state) => state.user)

    const currentPath = query.get('category') || query.get('label') || 'inbox'

    const handleSelect = (value: View) => {
        setCurrentView(value)
        onChange?.()
    }

    const filteredMenu = menuList.filter(
        (item) => !(user?.is_super_admin && item.value === 'location'),
    )

    return (
        <div className="flex flex-col justify-between h-full">
            <ScrollBar className="h-full overflow-y-auto">
                <Menu className="mx-2 mb-10">
                    {filteredMenu.map((menu) => (
                        <MenuItem
                            key={menu.value}
                            eventKey={menu.value}
                            className={`mb-2 ${
                                currentView === menu.value
                                    ? 'bg-gray-100 dark:bg-gray-700'
                                    : ''
                            }`}
                            isActive={currentPath === menu.value}
                            onSelect={() => handleSelect(menu.value)}
                        >
                            <span className="text-2xl ltr:mr-2 rtl:ml-2">
                                {menu.icon}
                            </span>
                            <span>{menu.label}</span>
                        </MenuItem>
                    ))}
                </Menu>
            </ScrollBar>
        </div>
    )
}

export default SettingsMenu
