import React, { useMemo, useState, useCallback, useEffect } from 'react'
import { ChevronDown, ChevronRight, FileText } from 'lucide-react'
import Card from '@/components/ui/Card'
import { FormItem } from '@/components/ui/Form'
import { Select } from '@/components/ui'
import { useStandardList } from '@/views/settings/standard/List/hooks/useList'

interface DocumentType {
    id: number
    name: string
}

interface ClauseType {
    id: number
    title: string
    message?: string
    note_message?: string
    documents?: DocumentType[]
    children?: ClauseType[]
}

interface StandardType {
    id: number
    name: string
    status: string
}

const getAllDescendantIds = (clause: ClauseType): string[] => {
    let ids: string[] = [`clause-${clause.id}`]

    clause.documents?.forEach((doc) => {
        ids.push(`doc-${clause.id}-${doc.id}`)
    })

    clause.children?.forEach((child) => {
        ids = ids.concat(getAllDescendantIds(child))
    })

    return ids
}

interface ClauseItemProps {
    clause: ClauseType
    selectedItems: string[]
    handleToggle: (id: string, clause?: ClauseType) => void
    readOnly?: boolean
    level: number
}

const ClauseItem: React.FC<ClauseItemProps> = ({
    clause,
    selectedItems,
    handleToggle,
    readOnly,
    level,
}) => {
    const [open, setOpen] = useState(true)
    const hasChildren =
        (clause.documents?.length ?? 0) > 0 ||
        (clause.children?.length ?? 0) > 0

    const indentClass = `ml-${Math.min(level * 4, 16)}`

    return (
        <div className={`${indentClass} mt-2 border-l-2 border-gray-200 pl-4`}>
            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                {hasChildren ? (
                    <button
                        type="button"
                        className="flex items-center justify-center w-6 h-6 text-gray-500 hover:text-gray-700 focus:outline-none rounded"
                        aria-expanded={open}
                        onClick={() => setOpen(!open)}
                    >
                        {open ? (
                            <ChevronDown size={20} />
                        ) : (
                            <ChevronRight size={20} />
                        )}
                    </button>
                ) : (
                    <div className="w-6" />
                )}

                <input
                    type="checkbox"
                    disabled={readOnly}
                    className="h-5 w-5 mt-0.5 text-blue-600 border-gray-300 rounded"
                    checked={selectedItems.includes(`clause-${clause.id}`)}
                    onChange={() => handleToggle(`clause-${clause.id}`, clause)}
                />

                <div className="flex-1 min-w-0">
                    <label
                        htmlFor={`clause-${clause.id}`}
                        className="cursor-pointer text-sm font-extrabold text-gray-900 tracking-wide"
                    >
                        {clause.title}
                    </label>
                </div>
            </div>

            {open && (
                <>
                    {clause.documents && (
                        <div className="ml-10 mt-3 space-y-2">
                            {clause.documents.map((doc) => (
                                <label
                                    key={doc.id}
                                    className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-50"
                                >
                                    <input
                                        type="checkbox"
                                        disabled={readOnly}
                                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                                        checked={selectedItems.includes(
                                            `doc-${clause.id}-${doc.id}`,
                                        )}
                                        onChange={() =>
                                            handleToggle(
                                                `doc-${clause.id}-${doc.id}`,
                                            )
                                        }
                                    />
                                    <FileText
                                        size={16}
                                        className="text-gray-500"
                                    />
                                    <span className="text-gray-700 text-sm">
                                        {doc.name}
                                    </span>
                                </label>
                            ))}
                        </div>
                    )}

                    {clause.children?.map((child) => (
                        <ClauseItem
                            key={child.id}
                            clause={child}
                            selectedItems={selectedItems}
                            handleToggle={handleToggle}
                            readOnly={readOnly}
                            level={level + 1}
                        />
                    ))}
                </>
            )}
        </div>
    )
}

interface ClauseTreeProps {
    readOnly?: boolean
    clauses: ClauseType[]
    selectedItems: string[]
    standardId?: number | null
    onChange?: (v: string[]) => void
    onStandardChange?: (id: number) => void
}

const ClauseTree: React.FC<ClauseTreeProps> = ({
    readOnly,
    clauses,
    selectedItems,
    standardId,
    onChange,
    onStandardChange,
}) => {
    const { standardList } = useStandardList()
    const [currentStandard, setCurrentStandard] = useState<number | null>(null)

    useEffect(() => {
        if (standardId) {
            setCurrentStandard(standardId)
        }
    }, [standardId])

    const standards: StandardType[] = useMemo(() => {
        if (!Array.isArray(standardList)) return []
        return standardList.filter(
            (s) => s.status?.toLowerCase() === 'published',
        )
    }, [standardList])

    const standardOptions = useMemo(
        () =>
            standards.map((s) => ({
                value: s.id,
                label: s.name.toUpperCase(),
            })),
        [standards],
    )

    const handleToggle = useCallback(
        (id: string, clause?: ClauseType) => {
            if (readOnly) return

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

            onChange?.(newSelected)
        },
        [selectedItems, onChange, readOnly],
    )

    return (
        <div className="space-y-6">
            <Card className="p-4">
                <FormItem label="Standard">
                    <Select
                        options={standardOptions}
                        placeholder="Select Standard"
                        isDisabled={readOnly}
                        value={standardOptions.find(
                            (o) => o.value === currentStandard,
                        )}
                        onChange={(opt) => {
                            if (opt?.value) {
                                const id = Number(opt.value)
                                setCurrentStandard(id)
                                onStandardChange?.(id)
                                onChange?.([])
                            }
                        }}
                    />
                </FormItem>
            </Card>

            {clauses.length > 0 && (
                <Card className="w-full p-6 space-y-4 border border-gray-200 shadow-sm">
                    <div className="border-b border-gray-200 pb-4">
                        <h3 className="text-xl font-semibold text-gray-900">
                            Clause Documents
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                            Select the clauses and documents
                        </p>
                    </div>

                    <div className="space-y-1">
                        {clauses.map((clause) => (
                            <ClauseItem
                                key={clause.id}
                                clause={clause}
                                selectedItems={selectedItems}
                                handleToggle={handleToggle}
                                readOnly={readOnly}
                                level={0}
                            />
                        ))}
                    </div>
                </Card>
            )}
        </div>
    )
}

export default ClauseTree
