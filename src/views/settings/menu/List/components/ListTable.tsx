import { useMemo, useState } from 'react'
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

import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Dropdown from '@/components/ui/Dropdown'

type Grouped = Record<string, Menu[]>

const MenuListTable = () => {
    const { menuList, isLoading } = useMenuList()

    const [renaming, setRenaming] = useState<string | null>(null)
    const [moduleValue, setModuleValue] = useState('')
    const [moduleOrder, setModuleOrder] = useState<string[]>([])

    const groupedCards: Grouped = useMemo(() => {
        const grouped: Grouped = {}

        menuList.forEach((m) => {
            const key = m.parent || 'Other'
            if (!grouped[key]) grouped[key] = []
            grouped[key].push(m)
        })

        return grouped
    }, [menuList])

    useMemo(() => {
        if (moduleOrder.length === 0 && Object.keys(groupedCards).length) {
            setModuleOrder(Object.keys(groupedCards))
        }
    }, [groupedCards])

    const onDragEnd = (result: DropResult) => {
        const { source, destination, type } = result
        if (!destination) return

        if (type === 'MODULE') {
            const next = Array.from(moduleOrder)
            const [removed] = next.splice(source.index, 1)
            next.splice(destination.index, 0, removed)
            setModuleOrder(next)
            return
        }

        const from = source.droppableId
        const to = destination.droppableId

        const sourceItems = Array.from(groupedCards[from] || [])
        const [moved] = sourceItems.splice(source.index, 1)

        if (from === to) {
            sourceItems.splice(destination.index, 0, moved)
        } else {
            const destItems = Array.from(groupedCards[to] || [])
            const updatedMoved = { ...moved, parent: to }
            destItems.splice(destination.index, 0, updatedMoved)
            groupedCards[to] = destItems
        }

        groupedCards[from] = sourceItems
    }

    const handleRename = (oldName: string) => {
        const newName = moduleValue.trim()
        if (!newName || newName === oldName) {
            setRenaming(null)
            return
        }

        const updatedOrder = moduleOrder.map((m) =>
            m === oldName ? newName : m,
        )

        setModuleOrder(updatedOrder)
        setRenaming(null)
    }

    if (isLoading)
        return (
            <div className="p-6 text-gray-700 dark:text-gray-300">
                Loading...
            </div>
        )

    return (
        <div className="overflow-x-auto p-4 bg-white dark:bg-gray-950 min-h-screen transition-colors">
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
                                            className="relative rounded-2xl 
                                                    bg-gray-50 dark:bg-gray-900
                                                    border border-gray-200 dark:border-gray-700
                                                    p-4 min-h-[70vh]
                                                    cursor-grab active:cursor-grabbing
                                                    shadow-sm transition-colors"
                                        >
                                            <div className="mb-4 flex items-center justify-between gap-2">
                                                {renaming === module ? (
                                                    <div className="flex items-center gap-2 w-full">
                                                        <Input
                                                            autoFocus
                                                            value={moduleValue}
                                                            onChange={(e) =>
                                                                setModuleValue(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            onBlur={() =>
                                                                handleRename(
                                                                    module,
                                                                )
                                                            }
                                                            onKeyDown={(e) => {
                                                                if (
                                                                    e.key ===
                                                                    'Enter'
                                                                )
                                                                    handleRename(
                                                                        module,
                                                                    )
                                                            }}
                                                        />
                                                        <Button
                                                            size="sm"
                                                            variant="plain"
                                                            onClick={() =>
                                                                setRenaming(
                                                                    null,
                                                                )
                                                            }
                                                        >
                                                            ✕
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">
                                                        {module}
                                                    </h3>
                                                )}

                                                <Dropdown
                                                    renderTitle={
                                                        <TbDotsVertical className="cursor-pointer text-gray-600 dark:text-gray-300" />
                                                    }
                                                >
                                                    <Dropdown.Item
                                                        onClick={() => {
                                                            setRenaming(module)
                                                            setModuleValue(
                                                                module,
                                                            )
                                                        }}
                                                    >
                                                        Rename
                                                    </Dropdown.Item>
                                                </Dropdown>
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
                                                            groupedCards[
                                                                module
                                                            ] || []
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
