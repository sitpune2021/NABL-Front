/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from 'react'
import Card from '@/components/ui/Card'
import Checkbox from '@/components/ui/Checkbox'
import { FormItem } from '@/components/ui/Form'
import { Controller } from 'react-hook-form'
import useClausesList from '../../clauses/List/hooks/useList'
import {
    HiChevronDown,
    HiChevronRight,
    HiFolder,
    HiDocumentText,
    HiCheckCircle,
} from 'react-icons/hi'

const buildTreeTitleKey = (items: any[] = []) => {
    if (!Array.isArray(items)) return []

    const map = new Map()

    items.forEach((it) => {
        map.set(it.titleKey, { ...it, children: [] })
    })

    const keys = Array.from(map.keys())
    const roots: any[] = []

    keys.forEach((key) => {
        const parts = key.split('-')
        parts.pop()
        const parentKey = parts.join('-')

        if (map.has(parentKey)) {
            map.get(parentKey).children.push(map.get(key))
        } else {
            roots.push(map.get(key))
        }
    })

    return roots
}

const buildTreeStandards = (items: any[] = []) => {
    if (!Array.isArray(items)) return []

    const map = new Map()

    items.forEach((it) => {
        map.set(it.number, {
            ...it,
            notes: it.note ? [it.note] : [],
            children: [...(it.children || [])],
        })
    })

    const keys = Array.from(map.keys())
    const roots: any[] = []

    keys.forEach((key) => {
        let parentKey: string | null = null

        keys.forEach((candidate) => {
            if (candidate === key) return
            if (key.startsWith(candidate + '.')) {
                if (!parentKey || candidate.length > parentKey.length) {
                    parentKey = candidate
                }
            }
        })

        if (parentKey) {
            map.get(parentKey).children.push(map.get(key))
        } else {
            roots.push(map.get(key))
        }
    })

    return roots
}

const ClauseNode = ({ node, level = 0 }: any) => {
    const [open, setOpen] = useState(true)
    const indent = { marginLeft: `${level * 24}px` }

    const hasContent =
        node.children?.length > 0 ||
        (node.notes && node.notes.length > 0) ||
        node.message ||
        node.title

    return (
        <div className="mt-3" style={indent}>
            <div
                className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-indigo-50"
                onClick={() => hasContent && setOpen(!open)}
            >
                {hasContent ? (
                    open ? (
                        <HiChevronDown className="text-indigo-600 w-5 h-5" />
                    ) : (
                        <HiChevronRight className="text-indigo-600 w-5 h-5" />
                    )
                ) : (
                    <div className="w-5" />
                )}

                <HiFolder className="text-gray-500 w-5 h-5" />

                <p className="font-semibold text-gray-800">
                    {node.number ? `${node.number}. ` : ''}{' '}
                    {node.title || node.titleKey}
                </p>
            </div>

            {open && hasContent && (
                <div className="ml-8 mt-4 space-y-4">
                    {node.message && (
                        <div className="bg-emerald-50 p-4 rounded-xl flex gap-3">
                            <HiCheckCircle className="text-emerald-600 w-5 h-5" />
                            <div>
                                <b className="text-emerald-800">Message:</b>
                                <p className="text-emerald-700 text-sm mt-1">
                                    {node.message}
                                </p>
                            </div>
                        </div>
                    )}

                    {node.notes && node.notes.length > 0 && (
                        <div className="bg-slate-100 p-4 rounded-xl">
                            <b className="text-slate-800">Notes:</b>
                            <ul className="list-disc ml-6 mt-2 text-slate-700 text-sm">
                                {node.notes.map((n: any, i: number) => (
                                    <li key={i}>{n}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {node.clauses && node.clauses.length > 0 && (
                        <div className="p-4 rounded-xl bg-white shadow-sm border">
                            <b className="text-indigo-700">Clauses:</b>
                            <div className="mt-2 space-y-2">
                                {node.clauses.map((c: any, i: number) => (
                                    <div
                                        key={i}
                                        className="p-3 bg-indigo-50 rounded"
                                    >
                                        <p>
                                            <b>Category:</b> {c.category}
                                        </p>
                                        <p>
                                            <b>Document:</b> {c.documentName}
                                        </p>
                                        <p>
                                            <b>Frequency:</b> {c.frequency}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {node.children?.map((child: any, idx: number) => (
                        <ClauseNode key={idx} node={child} level={level + 1} />
                    ))}
                </div>
            )}
        </div>
    )
}

const ClausesSection = ({ control, errors, readOnly = false }: any) => {
    const { clausesList, isLoading } = useClausesList()

    const allTrees = useMemo(() => {
        return clausesList.map((c: any) => {
            const hasStandards = c.standards?.length > 0
            const hasTitleSpecific = c.titleSpecificData?.length > 0

            return {
                ...c,
                tree: hasStandards
                    ? buildTreeStandards(c.standards)
                    : hasTitleSpecific
                      ? buildTreeTitleKey(c.titleSpecificData)
                      : [],
            }
        })
    }, [clausesList])

    return (
        <Card className="p-8">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <HiDocumentText className="text-indigo-600 w-6 h-6" />
                Clauses
            </h3>

            {isLoading && <p>Loading...</p>}

            <FormItem
                invalid={Boolean(errors.clauses)}
                errorMessage={errors.clauses?.message}
            >
                <Controller
                    name="clauses"
                    control={control}
                    render={({ field }) => {
                        const selected = field.value || []

                        return (
                            <div className="space-y-6">
                                {allTrees.map((clause: any) => (
                                    <div
                                        key={clause.id}
                                        className="p-6 bg-white rounded-xl shadow-md"
                                    >
                                        <div className="flex items-start gap-4 mb-4">
                                            <Checkbox
                                                disabled={readOnly}
                                                checked={selected.includes(
                                                    clause.id,
                                                )}
                                                onChange={(v) =>
                                                    v
                                                        ? field.onChange([
                                                              ...selected,
                                                              clause.id,
                                                          ])
                                                        : field.onChange(
                                                              selected.filter(
                                                                  (
                                                                      id: string,
                                                                  ) =>
                                                                      id !==
                                                                      clause.id,
                                                              ),
                                                          )
                                                }
                                            />
                                            <div>
                                                <p className="text-lg font-semibold">
                                                    {clause.name}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Status: {clause.status}
                                                </p>
                                            </div>
                                        </div>

                                        {clause.tree.length === 0 ? (
                                            <p className="text-gray-500">
                                                No nested data
                                            </p>
                                        ) : (
                                            clause.tree.map(
                                                (root: any, idx: number) => (
                                                    <ClauseNode
                                                        key={idx}
                                                        node={root}
                                                    />
                                                ),
                                            )
                                        )}
                                    </div>
                                ))}
                            </div>
                        )
                    }}
                />
            </FormItem>
        </Card>
    )
}

export default ClausesSection
