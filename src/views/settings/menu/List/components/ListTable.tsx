import { useEffect, useState } from 'react'
import type { Menu } from '@/@types/menu'
import { TbDotsVertical } from 'react-icons/tb'
import { useMenuList } from '../hooks/useList'
import { MenuCard } from '@/columns/menu.columns'
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult,
} from '@hello-pangea/dnd'

type Grouped = Record<string, Menu[]>

const MenuListTable = () => {
    const { menuList, isLoading } = useMenuList()

    const [openMenu, setOpenMenu] = useState<string | null>(null)
    const [renaming, setRenaming] = useState<string | null>(null)
    const [moduleValue, setModuleValue] = useState('')
    const [moduleOrder, setModuleOrder] = useState<string[]>([])
    const [cards, setCards] = useState<Grouped>({})

    useEffect(() => {
        const grouped: Grouped = {}
        const order: string[] = []

        menuList.forEach((m) => {
            const key = m.parent || 'Other'
            if (!grouped[key]) {
                grouped[key] = []
                order.push(key)
            }
            grouped[key].push(m)
        })

        setModuleOrder(order)
        setCards(grouped)
    }, [menuList])

    const onDragEnd = (result: DropResult) => {
        const { source, destination, type } = result
        if (!destination) return

        if (type === 'MODULE') {
            const next = Array.from(moduleOrder)
            const [m] = next.splice(source.index, 1)
            next.splice(destination.index, 0, m)
            setModuleOrder(next)
            return
        }

        const from = source.droppableId
        const to = destination.droppableId

        const next = { ...cards }
        const srcItems = Array.from(next[from])
        const [moved] = srcItems.splice(source.index, 1)

        if (from === to) {
            srcItems.splice(destination.index, 0, moved)
            next[from] = srcItems
        } else {
            const destItems = Array.from(next[to] || [])
            moved.parent = to
            destItems.splice(destination.index, 0, moved)
            next[from] = srcItems
            next[to] = destItems
        }

        setCards(next)
    }

    if (isLoading) return <div className="p-6">Loading...</div>

    return (
        <div className="overflow-x-auto p-4">
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable
                    droppableId="modules"
                    direction="horizontal"
                    type="MODULE"
                >
                    {(p) => (
                        <div
                            ref={p.innerRef}
                            {...p.droppableProps}
                            className="grid grid-cols-1 md:grid-cols-4 gap-6"
                        >
                            {moduleOrder.map((module, idx) => (
                                <Draggable
                                    key={module}
                                    draggableId={module}
                                    index={idx}
                                >
                                    {(mp) => (
                                        <div
                                            ref={mp.innerRef}
                                            {...mp.draggableProps}
                                            {...mp.dragHandleProps}
                                            className="relative rounded-2xl bg-gray-50 p-4 min-h-[70vh] cursor-grab active:cursor-grabbing"
                                        >
                                            <div className="mb-4 flex items-center justify-between">
                                                {renaming === module ? (
                                                    <div className="flex items-center gap-2 w-full">
                                                        <input
                                                            autoFocus
                                                            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium shadow-sm outline-none"
                                                            value={moduleValue}
                                                            onChange={(e) =>
                                                                setModuleValue(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            onBlur={() =>
                                                                setRenaming(
                                                                    null,
                                                                )
                                                            }
                                                            onKeyDown={(e) => {
                                                                if (
                                                                    e.key ===
                                                                    'Enter'
                                                                )
                                                                    setRenaming(
                                                                        null,
                                                                    )
                                                            }}
                                                        />
                                                        <button
                                                            className="h-8 w-8 rounded-md border border-slate-300 text-slate-500"
                                                            onClick={() =>
                                                                setRenaming(
                                                                    null,
                                                                )
                                                            }
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <h3 className="text-base font-semibold text-gray-800">
                                                        {module}
                                                    </h3>
                                                )}

                                                <div className="relative">
                                                    <TbDotsVertical
                                                        className="cursor-pointer"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            setOpenMenu(
                                                                openMenu ===
                                                                    module
                                                                    ? null
                                                                    : module,
                                                            )
                                                        }}
                                                    />
                                                    {openMenu === module && (
                                                        <div className="absolute right-0 top-6 z-10 w-28 rounded-lg bg-white border shadow">
                                                            <button
                                                                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                                                                onClick={() => {
                                                                    setRenaming(
                                                                        module,
                                                                    )
                                                                    setModuleValue(
                                                                        module,
                                                                    )
                                                                    setOpenMenu(
                                                                        null,
                                                                    )
                                                                }}
                                                            >
                                                                Rename
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <Droppable
                                                droppableId={module}
                                                type="CARD"
                                            >
                                                {(cp) => (
                                                    <div
                                                        ref={cp.innerRef}
                                                        {...cp.droppableProps}
                                                        className="flex flex-col gap-3"
                                                    >
                                                        {(
                                                            cards[module] || []
                                                        ).map((item, i) => (
                                                            <Draggable
                                                                key={item.id}
                                                                draggableId={String(
                                                                    item.id,
                                                                )}
                                                                index={i}
                                                            >
                                                                {(dp) => (
                                                                    <div
                                                                        ref={
                                                                            dp.innerRef
                                                                        }
                                                                        {...dp.draggableProps}
                                                                        {...dp.dragHandleProps}
                                                                    >
                                                                        <MenuCard
                                                                            item={
                                                                                item
                                                                            }
                                                                        />
                                                                    </div>
                                                                )}
                                                            </Draggable>
                                                        ))}
                                                        {cp.placeholder}
                                                    </div>
                                                )}
                                            </Droppable>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {p.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    )
}

export default MenuListTable
