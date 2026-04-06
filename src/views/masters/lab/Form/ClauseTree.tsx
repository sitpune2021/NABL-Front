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
    numbering_type?: string
    numbering_value?: string | number | null
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

const getAllIdsFromClauses = (clauses: ClauseType[]): string[] => {
    let ids: string[] = []
    clauses.forEach((clause) => {
        ids = ids.concat(getAllDescendantIds(clause))
    })
    return ids
}
const DEPTH_COLORS: Record<number, string> = {
    0: 'bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300',
    1: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    2: 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300',
}

const DepthBadge: React.FC<{ level: number }> = ({ level }) => {
    const colorClass =
        DEPTH_COLORS[level] ??
        'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
    return (
        <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${colorClass}`}
        >
            L{level + 1}
        </span>
    )
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

    return (
        <div className="border-b border-gray-100 dark:border-gray-800 last:border-b-0">
            <div className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                {hasChildren ? (
                    <button
                        type="button"
                        disabled={readOnly}
                        className="p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-40 shrink-0"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? (
                            <ChevronDown size={15} />
                        ) : (
                            <ChevronRight size={15} />
                        )}
                    </button>
                ) : (
                    <span className="w-[22px] shrink-0" />
                )}

                <Checkbox
                    disabled={readOnly}
                    checked={selectedItems.includes(`clause-${clause.id}`)}
                    onChange={() => handleToggle(`clause-${clause.id}`, clause)}
                />

                <p className="flex-1 min-w-0 text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
                    {clause.numbering_value
                        ? `${clause.numbering_value}. `
                        : ''}
                    {clause.title}
                </p>

                <DepthBadge level={level} />
            </div>

            {open && (
                <div className="pl-9">
                    {/* Documents */}
                    {clause.documents && clause.documents.length > 0 && (
                        <div className="py-1 space-y-0.5">
                            {clause.documents.map((doc) => (
                                <div
                                    key={doc.id}
                                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
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
                                        size={14}
                                        className="text-gray-400 dark:text-gray-500 shrink-0"
                                    />
                                    <span className="text-xs text-gray-600 dark:text-gray-300 truncate">
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
                </div>
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

    const allIds = useMemo(() => getAllIdsFromClauses(clauses), [clauses])

    const isAllSelected =
        allIds.length > 0 && allIds.every((id) => selectedItems.includes(id))

    const handleSelectAll = () => {
        if (readOnly) return
        onChange?.(isAllSelected ? [] : allIds)
    }

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
                <Card className="p-6 space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-800">
                        <h3 className="text-xl font-semibold">
                            Clause Documents
                        </h3>
                        <Button
                            type="button"
                            disabled={readOnly}
                            onClick={handleSelectAll}
                        >
                            {isAllSelected ? 'Deselect All' : 'Select All'}
                        </Button>
                    </div>

                    <div className="divide-y divide-gray-100 dark:divide-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800">
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
