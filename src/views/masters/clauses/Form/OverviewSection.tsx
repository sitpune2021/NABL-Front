/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react'
import { Controller, useFieldArray } from 'react-hook-form'
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
    const documentOptions = documentList.map((document) => ({
        value: document.id,
        label: document.name,
        fullDocument: document,
        category_id: document.category_id,
    }))

    const categoryOptions = categoryList.map((category) => ({
        value: category.id,
        label: `${category.name.toUpperCase()} - ${category.identifier}`,
    }))

    const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set())

    // Expand all items by default
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
        setExpandedItems(new Set(collectIds(accordionData)))
    }, [accordionData])

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

    const renderClauseSection = (clauseIndex: number, clause: any) => {
        console.log(clause)

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
                          documents: { id: '', version_id: '' },
                      },
                  ]

        return (
            <>
                {/* Notes */}
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
                                    documents: { id: '', version_id: '' },
                                })
                            }
                        />
                    )}
                </div>

                <div className="grid gap-3 mt-4">
                    {displayFields.map((item, index) => {
                        const isRemovable = index > 0 && fields.length > 0

                        return (
                            <div
                                key={item.id}
                                className="grid grid-cols-4 gap-3 items-end"
                            >
                                <Controller
                                    name={`standard_clauses.${clauseIndex}.clause_documents_tagging.${index}.category_id`}
                                    control={control}
                                    render={({ field }) => (
                                        <FormItem label="Category">
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
                                                onChange={(selected) =>
                                                    field.onChange(
                                                        selected?.value || '',
                                                    )
                                                }
                                            />
                                        </FormItem>
                                    )}
                                />

                                <FormItem label="Document Name">
                                    <Controller
                                        name={`standard_clauses.${clauseIndex}.clause_documents_tagging.${index}.documents`}
                                        control={control}
                                        render={({ field }) => {
                                            const selectedCategoryId =
                                                control._formValues
                                                    .standard_clauses?.[
                                                    clauseIndex
                                                ]?.clause_documents_tagging?.[
                                                    index
                                                ]?.category_id

                                            const filteredDocuments =
                                                documentOptions.filter(
                                                    (doc) =>
                                                        doc.category_id ===
                                                        selectedCategoryId,
                                                )
                                            return (
                                                <Select
                                                    options={filteredDocuments}
                                                    isDisabled={
                                                        readOnly ||
                                                        !selectedCategoryId
                                                    }
                                                    value={
                                                        field.value?.id
                                                            ? {
                                                                  value: field
                                                                      .value.id,
                                                                  label:
                                                                      field
                                                                          .value
                                                                          .label ||
                                                                      '',
                                                              }
                                                            : null
                                                    }
                                                    onChange={(selected) => {
                                                        if (
                                                            selected?.fullDocument
                                                        ) {
                                                            const doc =
                                                                selected.fullDocument
                                                            field.onChange({
                                                                id:
                                                                    doc.id ||
                                                                    '',
                                                                version_id:
                                                                    doc
                                                                        .current_version
                                                                        .id ||
                                                                    '',
                                                                label: doc.name,
                                                            })
                                                        } else {
                                                            field.onChange({
                                                                id: '',
                                                                version_id: '',
                                                            })
                                                        }
                                                    }}
                                                />
                                            )
                                        }}
                                    />
                                </FormItem>

                                <FormItem label="Frequency">
                                    <Input
                                        readOnly
                                        placeholder="Auto Frequency"
                                    />
                                </FormItem>
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

    // Recursive accordion rendering
    const renderAccordion = (items: any[], parentIndex = 0): any => {
        return items.map((item, index) => {
            const clauseIndex = parentIndex + index

            return (
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

                    {/* Always include clause_id & clause_parent_id */}
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

                    {renderClauseSection(clauseIndex, item)}

                    {item.children?.length > 0 &&
                        renderAccordion(item.children, clauseIndex + 1)}
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
