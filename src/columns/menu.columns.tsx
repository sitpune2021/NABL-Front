import { useState } from 'react'
import type { Menu } from '@/@types/menu'
import { apiUpdateMenu } from '@/services/MenuService'
import { useSWRConfig } from 'swr'
import { useMenuList } from '@/views/settings/menu/List/hooks/useList'

export const EditableName = ({ id, name }: { id: string; name: string }) => {
    const [editing, setEditing] = useState(false)
    const [value, setValue] = useState(name)

    const { mutate } = useMenuList()
    const { mutate: globalMutate } = useSWRConfig()

    const handleSave = async () => {
        setEditing(false)

        if (value !== name) {
            await apiUpdateMenu(id, { name: value })
            mutate()
            globalMutate('menu-list')
        }
    }

    if (editing) {
        return (
            <input
                autoFocus
                className="w-full rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm font-medium text-gray-800 
               shadow-inner outline-none transition-all duration-150 
               focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-300"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onBlur={handleSave}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSave()
                }}
            />
        )
    }

    return (
        <div
            className="cursor-pointer text-[15px] font-semibold text-gray-800 leading-snug line-clamp-2"
            onDoubleClick={() => setEditing(true)}
        >
            {value}
        </div>
    )
}

export const MenuCard = ({ item }: { item: Menu }) => {
    return (
        <div className="mx-auto h-[120px] w-[200px] rounded-xl border border-gray-100 bg-white p-4 shadow-sm flex flex-col justify-between">
            <div className="flex flex-col gap-2">
                {item.type && (
                    <span className="w-fit rounded-full bg-purple-200 px-2 py-[2px] text-[12px] font-semibold text-black">
                        {item.type}
                    </span>
                )}

                <EditableName id={item.id} name={item.name} />

                {item.icon && (
                    <div className="text-[13px] text-orange-400 ">
                        {item.icon}
                    </div>
                )}
            </div>
        </div>
    )
}
