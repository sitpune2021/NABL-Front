import React, { useMemo, useState, useCallback, useEffect } from 'react'
import { ChevronDown, ChevronRight, FileText } from 'lucide-react'
import Card from '@/components/ui/Card'
import { FormItem } from '@/components/ui/Form'
import { Select, Checkbox, Button } from '@/components/ui'
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

    const indentStyle = { marginLeft: `${Math.min(level * 20, 80)}px` }

    return (
        <div
            style={indentStyle}
            className="mt-3 border-l-2 border-gray-200 dark:border-gray-700 pl-4"
        >
            <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                {hasChildren ? (
                    <Button
                        size="xs"
                        variant="plain"
                        type="button"
                        disabled={readOnly}
                        className="p-1"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? (
                            <ChevronDown size={18} />
                        ) : (
                            <ChevronRight size={18} />
                        )}
                    </Button>
                ) : (
                    <div className="w-6" />
                )}

                <Checkbox
                    disabled={readOnly}
                    checked={selectedItems.includes(`clause-${clause.id}`)}
                    onChange={() => handleToggle(`clause-${clause.id}`, clause)}
                />

                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100 tracking-wide">
                        {clause.title}
                    </p>
                </div>
            </div>

            {open && (
                <>
                    {clause.documents && (
                        <div className="ml-10 mt-3 space-y-2">
                            {clause.documents.map((doc) => (
                                <div
                                    key={doc.id}
                                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                                >
                                    <Checkbox
                                        disabled={readOnly}
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
                                        className="text-gray-500 dark:text-gray-400"
                                    />
                                    <span className="text-gray-700 dark:text-gray-300 text-sm">
                                        {doc.name}
                                    </span>
                                </div>
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
            <Card className="p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm">
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
                <Card className="w-full p-6 space-y-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm">
                    <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                            Clause Documents
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
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
