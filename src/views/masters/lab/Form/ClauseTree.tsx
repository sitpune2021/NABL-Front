/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useState } from 'react'
import { ChevronDown, ChevronRight, FileText } from 'lucide-react'
import Card from '@/components/ui/Card'
import { FormItem } from '@/components/ui/Form'
import { Select, Checkbox, Button } from '@/components/ui'
import { useStandardList } from '@/views/settings/standard/List/hooks/useList'
import { Controller } from 'react-hook-form'
import { FormSectionBaseProps } from '@/@types/lab'
import { useStandardDetail } from '@/views/settings/standard/List/hooks/useDetail'

interface DocumentType {
    id: number
    document: {
        id: number
        name: string
    }
}

interface ClauseType {
    id: number
    title: string
    message?: string
    note_message?: string
    document_links?: DocumentType[]
    children?: ClauseType[]
    numbering_type?: string
    numbering_value?: string | number | null
}

interface StandardType {
    id: number
    name: string
    status: string
}

interface ClauseItemProps {
    clause: ClauseType
    readOnly?: boolean
    level: number
    selectedDocs: number[]
    handleToggle: (id: number, type: ToggleType, clause?: ClauseType) => void
    parentNumber?: string | null | undefined | number
}

type ClauseTreeProps = FormSectionBaseProps & {
    readOnly?: boolean
}

type ToggleType = 'clause' | 'document'

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

const getAllDocumentIds = (clause: ClauseType): number[] => {
    const ids: number[] = []

    if (clause.document_links?.length) {
        ids.push(...clause.document_links.map((d) => d.id))
    }

    if (clause.children?.length) {
        clause.children.forEach((child) => {
            ids.push(...getAllDocumentIds(child))
        })
    }

    return ids
}

const ClauseItem: React.FC<ClauseItemProps> = ({
    clause,
    selectedDocs,
    handleToggle,
    readOnly,
    level,
    parentNumber, // ✅ ADD THIS
}) => {
    const [open, setOpen] = useState(true)
    const hasChildren =
        (clause.document_links?.length ?? 0) > 0 ||
        (clause.children?.length ?? 0) > 0
    const currentNumber = clause.numbering_value || ''

    const fullNumber = currentNumber
        ? parentNumber
            ? `${parentNumber}.${currentNumber}`
            : currentNumber
        : parentNumber

    return (
        <div className="border-b border-gray-100 dark:border-gray-800 last:border-b-0">
            <div className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                {hasChildren ? (
                    <Button
                        type="button"
                        size="xs"
                        shape="none"
                        variant="plain"
                        disabled={readOnly}
                        onClick={() => setOpen(!open)}
                    >
                        {open ? (
                            <ChevronDown size={15} />
                        ) : (
                            <ChevronRight size={15} />
                        )}
                    </Button>
                ) : (
                    <span className="w-[22px] shrink-0" />
                )}

                <Checkbox
                    disabled={readOnly}
                    checked={getAllDocumentIds(clause).every((id) =>
                        selectedDocs.includes(id),
                    )}
                    onChange={() => handleToggle(clause.id, 'clause', clause)}
                />
                <p className="flex-1 min-w-0 text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
                    {fullNumber} - {clause.title}
                </p>

                <DepthBadge level={level} />
            </div>

            {open && (
                <div className="pl-9">
                    {/* Documents */}
                    {clause.document_links &&
                        clause.document_links.length > 0 && (
                            <div className="py-1 space-y-0.5">
                                {clause.document_links.map((doc) => (
                                    <div
                                        key={doc.id}
                                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        <Checkbox
                                            disabled={readOnly}
                                            checked={selectedDocs.includes(
                                                doc.id,
                                            )}
                                            onChange={() =>
                                                handleToggle(doc.id, 'document')
                                            }
                                        />
                                        <FileText
                                            size={14}
                                            className="text-gray-400 dark:text-gray-500 shrink-0"
                                        />
                                        <span className="text-xs text-gray-600 dark:text-gray-300 truncate">
                                            {doc.document.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}

                    {clause.children?.map((child) => (
                        <ClauseItem
                            key={child.id}
                            clause={child}
                            selectedDocs={selectedDocs}
                            handleToggle={handleToggle}
                            readOnly={readOnly}
                            level={level + 1}
                            parentNumber={fullNumber}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

const ClauseTree: React.FC<ClauseTreeProps> = ({
    readOnly,
    control,
    errors,
}) => {
    const { standardList } = useStandardList()
    const [currentStandard, setCurrentStandard] = useState<number | null>(null)
    const { standard, isLoading } = useStandardDetail(currentStandard)
    const clauseList = standard?.clauses ?? []

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

    return (
        <div className="space-y-6">
            <Card className="p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm">
                <FormItem
                    label="Standard"
                    invalid={!!errors.standard?.standard_id}
                    errorMessage={errors.standard?.standard_id?.message}
                >
                    <Controller
                        name="standard.standard_id"
                        control={control}
                        render={({ field }) => {
                            return (
                                <Select
                                    options={standardOptions}
                                    placeholder="Select Standard"
                                    isDisabled={readOnly}
                                    value={
                                        standardOptions.find(
                                            (o) => o.value === field.value,
                                        ) || null
                                    }
                                    onChange={(opt) => {
                                        const id = opt?.value
                                            ? Number(opt.value)
                                            : null
                                        field.onChange(id) // ✅ form update
                                        setCurrentStandard(id) // ✅ local UI logic
                                    }}
                                />
                            )
                        }}
                    />
                </FormItem>
            </Card>

            {isLoading && <div>loading.....</div>}

            {currentStandard && !isLoading && !clauseList?.length && (
                <div className="text-sm text-gray-500">No clauses found</div>
            )}

            {currentStandard && clauseList?.length > 0 && (
                <Card className="p-6 space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-800">
                        <h3 className="text-xl font-semibold">
                            Clause Documents
                        </h3>
                    </div>

                    <div className="divide-y divide-gray-100 dark:divide-gray-800  overflow-hidden ">
                        <FormItem
                            label="Documents"
                            invalid={!!errors.standard?.clause_documents_link}
                            errorMessage={
                                errors.standard?.clause_documents_link?.message
                            }
                        >
                            <Controller
                                name="standard.clause_documents_link"
                                control={control}
                                render={({ field }) => {
                                    const selectedDocs = (
                                        field.value || []
                                    ).map(Number)

                                    // ✅ get ALL document IDs from entire tree
                                    const allDocIds: any[] = clauseList.flatMap(
                                        (clause: any) =>
                                            getAllDocumentIds(clause),
                                    )

                                    // ✅ check if all selected
                                    const isAllSelected =
                                        allDocIds.length > 0 &&
                                        allDocIds.every((id) =>
                                            selectedDocs.includes(id),
                                        )

                                    // ✅ SELECT ALL / DESELECT ALL
                                    const handleSelectAll = () => {
                                        if (isAllSelected) {
                                            field.onChange([]) // ❌ clear all
                                        } else {
                                            field.onChange(
                                                allDocIds.map(String),
                                            ) // ✅ select all
                                        }
                                    }

                                    // ✅ existing toggle
                                    const handleToggle = (
                                        id: number,
                                        type: ToggleType,
                                        clause?: ClauseType,
                                    ) => {
                                        let updated = [...selectedDocs]

                                        if (type === 'clause' && clause) {
                                            const clauseDocIds =
                                                getAllDocumentIds(clause)

                                            const allSelected =
                                                clauseDocIds.every((d) =>
                                                    updated.includes(d),
                                                )

                                            if (allSelected) {
                                                updated = updated.filter(
                                                    (d) =>
                                                        !clauseDocIds.includes(
                                                            d,
                                                        ),
                                                )
                                            } else {
                                                updated = Array.from(
                                                    new Set([
                                                        ...updated,
                                                        ...clauseDocIds,
                                                    ]),
                                                )
                                            }
                                        }

                                        if (type === 'document') {
                                            if (updated.includes(id)) {
                                                updated = updated.filter(
                                                    (d) => d !== id,
                                                )
                                            } else {
                                                updated.push(id)
                                            }
                                        }

                                        field.onChange(updated.map(String))
                                    }

                                    return (
                                        <>
                                            {/* 🔥 SELECT ALL BUTTON */}
                                            <div className="flex justify-end pb-2">
                                                <Button
                                                    type="button"
                                                    disabled={readOnly}
                                                    onClick={handleSelectAll}
                                                >
                                                    {isAllSelected
                                                        ? 'Deselect All'
                                                        : 'Select All'}
                                                </Button>
                                            </div>

                                            {/* TREE */}
                                            <div className="divide-y">
                                                {clauseList.map(
                                                    (clause: any) => (
                                                        <ClauseItem
                                                            key={clause.id}
                                                            clause={clause}
                                                            handleToggle={
                                                                handleToggle
                                                            }
                                                            readOnly={readOnly}
                                                            level={0}
                                                            selectedDocs={
                                                                selectedDocs
                                                            }
                                                            parentNumber={''}
                                                        />
                                                    ),
                                                )}
                                            </div>
                                        </>
                                    )
                                }}
                            />
                        </FormItem>
                    </div>
                </Card>
            )}
        </div>
    )
}

export default ClauseTree
