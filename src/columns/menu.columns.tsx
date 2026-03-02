import { useState } from 'react'
import type { Menu } from '@/@types/menu'
import { useSWRConfig } from 'swr'
import { useMenuList } from '@/views/settings/menu/List/hooks/useList'
import Input from '@/components/ui/Input'

export const EditableName = ({ name }: { name: string }) => {
    const [editing, setEditing] = useState(false)
    const [value, setValue] = useState(name)

    const { mutate } = useMenuList()
    const { mutate: globalMutate } = useSWRConfig()

    const handleSave = async () => {
        setEditing(false)

        if (value !== name) {
            // await apiUpdateMenu(id, { name: value })
            mutate()
            globalMutate('navigation-list')
        }
    }

    if (editing) {
        return (
            <div className="flex items-center gap-2">
                <Input
                    autoFocus
                    size="sm"
                    value={value}
                    className="flex-1"
                    onChange={(e) => setValue(e.target.value)}
                    onBlur={handleSave}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSave()
                    }}
                />
            </div>
        )
    }

    return (
        <div
            className="cursor-pointer text-[15px] font-semibold text-gray-800 dark:text-gray-100 leading-snug line-clamp-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            onDoubleClick={() => setEditing(true)}
        >
            {value}
        </div>
    )
}

export const MenuCard = ({ item }: { item: Menu }) => {
    return (
        <div
            className="mx-auto h-[120px] w-[200px] rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 shadow-sm dark:shadow-none
                        hover:shadow-md dark:hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
        >
            <div className="flex flex-col gap-2">
                {item.type && (
                    <span className="w-fit rounded-full bg-purple-200 px-2 py-[2px] text-[12px] font-semibold text-black">
                        {item.type}
                    </span>
                )}

                <EditableName name={item.name} />

                {item.icon && (
                    <div className="text-[13px] text-orange-400 ">
                        {item.icon}
                    </div>
                )}
            </div>
        </div>
    )
}
