/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useMemo } from 'react'
import Card from '@/components/ui/Card'
import { FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { OverviewSectionProps } from '@/@types/clauses'
import { Controller } from 'react-hook-form'
import Select from '@/components/ui/Select'
import Menu from '@/components/ui/Menu'
import { HiPlus } from 'react-icons/hi'
import { TbTrash } from 'react-icons/tb'
import useCategoryList from '../../category/List/hooks/useList'
import useDocumentList from '../../document/List/hooks/useList'
import type { MouseEvent } from 'react'

const autoFrequencyFromDocument = (docName: string, documentOptions: any[]) => {
    const doc = documentOptions.find((d) => d.value === docName)
    return doc?.frequency || ''
}
const defaultClause = {
    category: '',
    documentName: '',
    frequency: '',
}

const OverviewSection = ({
    control,
    errors,
    readOnly,
    setValue,
    getValues,
    accordionData,
}: OverviewSectionProps) => {
    const { categoryList } = useCategoryList()
    const { documentList } = useDocumentList()
    console.log(errors, 'clause errors')

    const documentOptions = useMemo(
        () =>
            documentList.map((document: any) => ({
                value: document.id,
                label: document.documentName,
                category: document.category,
                frequency: document.frequency,
            })),
        [documentList],
    )

    const categoryOptions = categoryList.map((category) => ({
        value: category.name,
        label: `${category.name.toUpperCase()} - ${category.identifier}`,
    }))

    const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set())

    useEffect(() => {
        const collectIds = (items: any[]): number[] => {
            let ids: number[] = []
            items.forEach((i) => {
                ids.push(i.id)
                if (i.children?.length > 0) {
                    ids = [...ids, ...collectIds(i.children)]
                }
            })
            return ids
        }

        const allKeys = collectIds(accordionData)
        setExpandedItems(new Set(allKeys))
    }, [])

    const handleToggle = (expanded: boolean, e: MouseEvent<HTMLDivElement>) => {
        const id = Number((e.currentTarget as any)?.dataset?.id)
        if (!id) return
        setExpandedItems((prev) => {
            const set = new Set(prev)
            expanded ? set.add(id) : set.delete(id)
            return set
        })
    }

    const isExpanded = (id: number) => expandedItems.has(id)

    const findDocIndex = (id: number): number => {
        const docs = getValues('clause_documents') || []
        return docs.findIndex((d: any) => d.id === id)
    }

    const handleNoteChange = (id: number, value: string) => {
        const docs = [...getValues('clause_documents')]
        const idx = findDocIndex(id)
        if (idx === -1) return
        docs[idx].notes = value
        setValue('clause_documents', docs)
    }

    const handleAddClause = (id: number) => {
        const docs = [...getValues('clause_documents')]
        const idx = findDocIndex(id)
        if (idx === -1) return
        docs[idx].clauses.push({ ...defaultClause })
        setValue('clause_documents', docs)
    }

    const handleRemoveClause = (id: number, index: number) => {
        const docs = [...getValues('clause_documents')]
        const idx = findDocIndex(id)
        if (idx === -1) return

        if (docs[idx].clauses.length > 1) {
            docs[idx].clauses.splice(index, 1)
            setValue('clause_documents', docs)
        }
    }

    const handleClauseFieldChange = (
        id: number,
        cIdx: number,
        field: string,
        value: any,
    ) => {
        const docs = [...getValues('clause_documents')]
        const idx = findDocIndex(id)
        if (idx === -1) return

        const clause = docs[idx].clauses[cIdx]

        if (field === 'documentName') {
            const autoFreq = autoFrequencyFromDocument(value, documentOptions)
            docs[idx].clauses[cIdx] = {
                ...clause,
                documentName: value,
                frequency: autoFreq,
            }
        } else if (field === 'category') {
            docs[idx].clauses[cIdx] = {
                ...clause,
                category: value,
                documentName: '',
                frequency: '',
            }
        } else {
            docs[idx].clauses[cIdx][field] = value
        }

        setValue('clause_documents', docs)
    }

    const renderRequiredSection = (id: number) => {
        const idx = findDocIndex(id)
        if (idx === -1) return null

        return (
            <>
                <Controller
                    name={`clause_documents.${idx}.notes`}
                    control={control}
                    render={({ field }) => (
                        <FormItem>
                            <Input
                                textArea
                                className="mt-4"
                                rows={3}
                                value={field.value}
                                placeholder="Write your note..."
                                readOnly={readOnly}
                                onChange={(e) =>
                                    handleNoteChange(id, e.target.value)
                                }
                            />
                        </FormItem>
                    )}
                />

                <Controller
                    name={`clause_documents.${idx}.clauses`}
                    control={control}
                    render={({ field }) => (
                        <>
                            <div className="flex justify-between items-center mt-4">
                                <h4>Assigning Documents To The Clause</h4>
                                {!readOnly && (
                                    <Button
                                        type="button"
                                        size="sm"
                                        icon={<HiPlus />}
                                        variant="solid"
                                        className="bg-green-500 hover:bg-green-600"
                                        onClick={() => handleAddClause(id)}
                                    />
                                )}
                            </div>

                            {field.value.map((clause: any, cIdx: number) => {
                                const filteredDocs = clause.category
                                    ? documentOptions.filter(
                                          (d) => d.category === clause.category,
                                      )
                                    : documentOptions

                                return (
                                    <div
                                        key={cIdx}
                                        className={`grid grid-cols-4 gap-3 p-4 ${cIdx != 0 ? 'pt-0' : 'mt-4'} `}
                                    >
                                        <FormItem label="Category">
                                            <Select
                                                value={categoryOptions.find(
                                                    (o) =>
                                                        o.value ===
                                                        clause.category,
                                                )}
                                                options={categoryOptions}
                                                isDisabled={readOnly}
                                                onChange={(v) =>
                                                    handleClauseFieldChange(
                                                        id,
                                                        cIdx,
                                                        'category',
                                                        v?.value,
                                                    )
                                                }
                                            />
                                        </FormItem>

                                        <FormItem label="Document Name">
                                            <Select
                                                value={filteredDocs.find(
                                                    (d) =>
                                                        d.value ===
                                                        clause.documentName,
                                                )}
                                                options={filteredDocs}
                                                isDisabled={
                                                    readOnly || !clause.category
                                                }
                                                onChange={(v) =>
                                                    handleClauseFieldChange(
                                                        id,
                                                        cIdx,
                                                        'documentName',
                                                        v?.value,
                                                    )
                                                }
                                            />
                                        </FormItem>

                                        <FormItem label="Frequency">
                                            <Input
                                                readOnly
                                                value={clause.frequency}
                                                placeholder="Auto Frequency"
                                            />
                                        </FormItem>

                                        {!readOnly &&
                                            field.value.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="solid"
                                                    size="sm"
                                                    icon={<TbTrash />}
                                                    className="bg-red-500  hover:bg-red-600"
                                                    onClick={() =>
                                                        handleRemoveClause(
                                                            id,
                                                            cIdx,
                                                        )
                                                    }
                                                />
                                            )}
                                    </div>
                                )
                            })}
                        </>
                    )}
                />
            </>
        )
    }

    const renderAccordion = (items: any[]) =>
        items.map((item) => (
            <Menu.MenuCollapse
                key={item.id}
                eventKey={item.id}
                expanded={isExpanded(item.id)}
                label={`${item.numbering_value} ${item.title}`}
                data-id={item.id}
                onToggle={handleToggle}
            >
                <div className="bg-blue-50 border border-blue-200 p-4 mt-4 rounded-lg">
                    <p className="text-blue-800 text-sm leading-relaxed whitespace-pre-line">
                        {item.message}
                    </p>
                </div>

                {item.note && renderRequiredSection(item.id)}

                {item.children?.length > 0 && renderAccordion(item.children)}
            </Menu.MenuCollapse>
        ))

    return (
        <Card>
            <Menu>{renderAccordion(accordionData)}</Menu>
        </Card>
    )
}

export default OverviewSection
