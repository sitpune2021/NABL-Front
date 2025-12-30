import { Card } from '@/components/ui'
import React from 'react'

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
    return (
        <div style={{ marginLeft: '20px', marginTop: '10px' }}>
            <div>
                <input
                    type="checkbox"
                    checked={selectedItems.includes(`clause-${clause.id}`)}
                    onChange={() => handleToggle(`clause-${clause.id}`, clause)}
                />
                <strong>{clause.title}</strong>
            </div>

            {clause.documents &&
                clause.documents.map((doc) => (
                    <div key={doc.id} style={{ marginLeft: '20px' }}>
                        <input
                            type="checkbox"
                            checked={selectedItems.includes(
                                `doc-${clause.id}-${doc.id}`,
                            )}
                            onChange={() =>
                                handleToggle(`doc-${clause.id}-${doc.id}`)
                            }
                        />
                        {doc.name}
                    </div>
                ))}

            {clause.children &&
                clause.children.map((child) => (
                    <ClauseItem
                        key={child.id}
                        clause={child}
                        selectedItems={selectedItems}
                        handleToggle={handleToggle}
                    />
                ))}
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
        <Card className="flex flex-col space-y-4 w-full p-4">
            <h3 className="text-lg font-semibold mb-4">Clause Documents</h3>

            {data.map((clause) => (
                <ClauseItem
                    key={clause.id}
                    clause={clause}
                    selectedItems={selectedItems}
                    handleToggle={handleToggle}
                />
            ))}
        </Card>
    )
}

export default ClauseTree
