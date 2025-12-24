/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from 'react'
import { Controller, useFieldArray, useWatch } from 'react-hook-form'
import Card from '@/components/ui/Card'
import { FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import Menu from '@/components/ui/Menu'
import { HiPlus } from 'react-icons/hi'
import { TbTrash } from 'react-icons/tb'
import { OverviewSectionProps } from '@/@types/clauses'

const OverviewSection = ({
    control,
    readOnly,
    accordionData,
    categoryList,
    documentList,
}: OverviewSectionProps) => {
    const documentOptions = useMemo(
        () =>
            documentList.map((document) => ({
                value: document.id,
                label: document.name,
                fullDocument: document,
                category_id: document.category_id,
            })),
        [documentList],
    )

    const documentsByCategory = useMemo(() => {
        return documentOptions.reduce(
            (acc: any, doc: any) => {
                if (!acc[doc.category_id]) acc[doc.category_id] = []
                acc[doc.category_id].push(doc)
                return acc
            },
            {} as Record<string, typeof documentOptions>,
        )
    }, [documentOptions])

    const categoryOptions = useMemo(
        () =>
            categoryList.map((category) => ({
                value: category.id,
                label: `${category.name.toUpperCase()} - ${category.identifier}`,
            })),
        [categoryList],
    )

    const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set())

    const handleToggle = (expanded: boolean, e: any) => {
        const id = Number((e.currentTarget as any)?.dataset?.id)
        if (!id) return
        setExpandedItems((prev) => {
            const set = new Set(prev)
            expanded ? set.add(id) : set.delete(id)
            return set
        })
    }

    const isExpanded = (id: number) => expandedItems.has(id)

    const ClauseItem = ({ clauseIndex }: { clauseIndex: number }) => {
        const { fields, append, remove } = useFieldArray({
            control,
            name: `standard_clauses.${clauseIndex}.clause_documents_tagging`,
        })

        const displayFields =
            fields.length > 0
                ? fields
                : [
                      {
                          id: 'default',
                          category_id: '',
                          documents: { id: '', version_id: '', label: '' },
                      },
                  ]

        return (
            <>
                <Controller
                    name={`standard_clauses.${clauseIndex}.notes`}
                    control={control}
                    render={({ field }) => (
                        <FormItem>
                            <Input
                                textArea
                                className="mt-4"
                                rows={3}
                                placeholder="Write your note..."
                                readOnly={readOnly}
                                {...field}
                            />
                        </FormItem>
                    )}
                />

                {/* Documents */}
                <div className="flex justify-between items-center mt-4">
                    <h4>Assigning Documents To The Clause</h4>
                    {!readOnly && (
                        <Button
                            type="button"
                            size="sm"
                            icon={<HiPlus />}
                            variant="solid"
                            className="bg-green-500 hover:bg-green-600"
                            onClick={() =>
                                append({
                                    category_id: '',
                                    documents: {
                                        id: '',
                                        version_id: '',
                                        label: '',
                                    },
                                })
                            }
                        />
                    )}
                </div>

                <div className="grid gap-3 mt-4">
                    {displayFields.map((item, index) => {
                        const isRemovable = index > 0 && fields.length > 0

                        const selectedCategoryId = useWatch({
                            control,
                            name: `standard_clauses.${clauseIndex}.clause_documents_tagging.${index}.category_id`,
                        })

                        const filteredDocuments = selectedCategoryId
                            ? documentsByCategory[selectedCategoryId] || []
                            : []

                        return (
                            <div
                                key={item.id}
                                className="grid grid-cols-4 gap-3 items-end"
                            >
                                <FormItem label="Category">
                                    <Controller
                                        name={`standard_clauses.${clauseIndex}.clause_documents_tagging.${index}.category_id`}
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                options={categoryOptions}
                                                isDisabled={readOnly}
                                                value={
                                                    categoryOptions.find(
                                                        (opt) =>
                                                            opt.value ===
                                                            field.value,
                                                    ) || null
                                                }
                                                menuPortalTarget={document.body}
                                                onChange={(selected) => {
                                                    field.onChange(
                                                        selected?.value || '',
                                                    )
                                                    const docFieldName = `standard_clauses.${clauseIndex}.clause_documents_tagging.${index}.documents`
                                                    control.setValue(
                                                        docFieldName,
                                                        {
                                                            id: '',
                                                            version_id: '',
                                                            label: '',
                                                        },
                                                    )
                                                }}
                                            />
                                        )}
                                    />
                                </FormItem>

                                <FormItem label="Documents">
                                    <Controller
                                        name={`standard_clauses.${clauseIndex}.clause_documents_tagging.${index}.documents`}
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                options={filteredDocuments}
                                                value={
                                                    field.value?.id
                                                        ? {
                                                              value: field.value
                                                                  .id,
                                                              label: field.value
                                                                  .label,
                                                          }
                                                        : null
                                                }
                                                menuPortalTarget={document.body}
                                                isDisabled={
                                                    readOnly ||
                                                    !selectedCategoryId
                                                }
                                                onChange={(selected) => {
                                                    if (
                                                        selected?.fullDocument
                                                    ) {
                                                        const doc =
                                                            selected.fullDocument
                                                        field.onChange({
                                                            id: doc.id || '',
                                                            version_id:
                                                                doc
                                                                    .current_version
                                                                    ?.id || '',
                                                            label: doc.name,
                                                        })
                                                    } else {
                                                        field.onChange({
                                                            id: '',
                                                            version_id: '',
                                                            label: '',
                                                        })
                                                    }
                                                }}
                                            />
                                        )}
                                    />
                                </FormItem>

                                {/* Frequency */}
                                <FormItem label="Frequency">
                                    <Input
                                        readOnly
                                        placeholder="Auto Frequency"
                                    />
                                </FormItem>

                                {/* Remove Button */}
                                {!readOnly && isRemovable && (
                                    <Button
                                        type="button"
                                        variant="solid"
                                        size="sm"
                                        icon={<TbTrash />}
                                        className="bg-red-500 hover:bg-red-600"
                                        onClick={() => remove(index)}
                                    />
                                )}
                            </div>
                        )
                    })}
                </div>
            </>
        )
    }

    // Global index counter for all clauses
    let globalClauseIndex = 0

    const renderAccordion = (items: any[]): any => {
        return items.map((item) => {
            const clauseIndex = globalClauseIndex
            globalClauseIndex++

            const label = item.numbering_value
                ? `${item.numbering_value} ${item.title}`
                : item.title

            return (
                <Menu.MenuCollapse
                    key={item.id}
                    eventKey={item.id}
                    expanded={isExpanded(item.id)}
                    label={label}
                    data-id={item.id}
                    onToggle={handleToggle}
                >
                    <div className="bg-blue-50 border border-blue-200 p-4 mt-4 rounded-lg">
                        <p className="text-blue-800 text-sm leading-relaxed whitespace-pre-line">
                            {item.message}
                        </p>
                    </div>

                    <Controller
                        name={`standard_clauses.${clauseIndex}.clause_id`}
                        control={control}
                        defaultValue={item.id}
                        render={() => null}
                    />
                    <Controller
                        name={`standard_clauses.${clauseIndex}.clause_parent_id`}
                        control={control}
                        defaultValue={item.parent_id}
                        render={() => null}
                    />

                    <ClauseItem clauseIndex={clauseIndex} />

                    {item.children?.length > 0 &&
                        renderAccordion(item.children)}
                </Menu.MenuCollapse>
            )
        })
    }

    return (
        <Card>
            <Menu>{renderAccordion(accordionData)}</Menu>
        </Card>
    )
}

export default OverviewSection
