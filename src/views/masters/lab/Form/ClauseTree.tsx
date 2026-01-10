import { Card } from '@/components/ui'
import React, { useState } from 'react'

interface DocumentType {
    id: number
    name: string
}

interface ClauseType {
    id: number
    title: string
    documents?: DocumentType[]
    children?: ClauseType[]
}

const getAllDescendantIds = (clause: ClauseType): string[] => {
    let ids: string[] = [`clause-${clause.id}`]

    if (clause.documents) {
        clause.documents.forEach((doc) =>
            ids.push(`doc-${clause.id}-${doc.id}`),
        )
    }

    if (clause.children) {
        clause.children.forEach((child) => {
            ids = ids.concat(getAllDescendantIds(child))
        })
    }

    return ids
}

const ClauseItem: React.FC<{
    clause: ClauseType
    selectedItems: string[]
    handleToggle: (id: string, clause?: ClauseType) => void
}> = ({ clause, selectedItems, handleToggle }) => {
    const [open, setOpen] = useState(true)
    const hasChildren =
        (clause.documents && clause.documents.length > 0) ||
        (clause.children && clause.children.length > 0)
    return (
        <div className="ml-4 mt-3 border-l border-gray-200 pl-4">
            {/* Clause Row */}
            <div className="flex items-center gap-2 p-2 rounded-md hover:bg-muted">
                {/* Collapse Button */}
                {hasChildren ? (
                    <button
                        type="button"
                        className="text-xs w-6 text-center text-muted-foreground"
                        onClick={() => setOpen(!open)}
                    >
                        <span className="text-xl font-bold leading-none">
                            {open ? '▾' : '▸'}
                        </span>
                    </button>
                ) : (
                    <span className="w-6" />
                )}
                <input
                    type="checkbox"
                    className="h-4 w-4 accent-primary"
                    checked={selectedItems.includes(`clause-${clause.id}`)}
                    onChange={() => handleToggle(`clause-${clause.id}`, clause)}
                />

                <span className="font-semibold text-gray-900">
                    {clause.title}
                </span>
            </div>

            {open && (
                <>
                    {clause.documents && (
                        <div className="ml-10 mt-2 space-y-2">
                            {clause.documents.map((doc) => (
                                <label
                                    key={doc.id}
                                    className="flex items-center gap-3 p-2 rounded-md cursor-pointer text-sm hover:bg-muted"
                                >
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 accent-primary"
                                        checked={selectedItems.includes(
                                            `doc-${clause.id}-${doc.id}`,
                                        )}
                                        onChange={() =>
                                            handleToggle(
                                                `doc-${clause.id}-${doc.id}`,
                                            )
                                        }
                                    />
                                    <span className="text-gray-700">
                                        {doc.name}
                                    </span>
                                </label>
                            ))}
                        </div>
                    )}

                    {clause.children &&
                        clause.children.map((child) => (
                            <ClauseItem
                                key={child.id}
                                clause={child}
                                selectedItems={selectedItems}
                                handleToggle={handleToggle}
                            />
                        ))}
                </>
            )}
        </div>
    )
}

interface ClauseTreeProps {
    data: ClauseType[]
    selectedItems: string[] // <-- controlled selection
    onSelectionChange?: (selected: string[]) => void // callback for parent
    readOnly?: boolean // optional
}

const ClauseTree: React.FC<ClauseTreeProps> = ({
    data,
    selectedItems,
    onSelectionChange,
    readOnly = false,
}) => {
    const handleToggle = (id: string, clause?: ClauseType) => {
        if (readOnly) return // prevent changes in read-only mode

        let newSelected: string[] = []

        if (selectedItems.includes(id)) {
            if (clause) {
                const allIds = getAllDescendantIds(clause)
                newSelected = selectedItems.filter(
                    (item) => !allIds.includes(item),
                )
            } else {
                newSelected = selectedItems.filter((item) => item !== id)
            }
        } else {
            if (clause) {
                const allIds = getAllDescendantIds(clause)
                newSelected = [
                    ...selectedItems,
                    ...allIds.filter((i) => !selectedItems.includes(i)),
                ]
            } else {
                newSelected = [...selectedItems, id]
            }
        }

        onSelectionChange?.(newSelected)
    }

    return (
        <Card className="w-full p-6 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    Clause Documents
                </h3>

                {readOnly && (
                    <span className="text-sm text-muted-foreground">
                        Read only
                    </span>
                )}
            </div>
            <div className="space-y-2">
                {data.map((clause) => (
                    <ClauseItem
                        key={clause.id}
                        clause={clause}
                        selectedItems={selectedItems}
                        handleToggle={handleToggle}
                    />
                ))}
            </div>
        </Card>
    )
}

export default ClauseTree
