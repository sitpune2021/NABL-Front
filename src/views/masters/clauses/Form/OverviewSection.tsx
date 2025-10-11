/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from 'react'
import Card from '@/components/ui/Card'
import { FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Checkbox from '@/components/ui/Checkbox'
import { FormSectionBaseProps } from '@/@types/clauses'
import { Controller } from 'react-hook-form'
import Select from '@/components/ui/Select'
import Menu from '@/components/ui/Menu'
import { HiPlus } from 'react-icons/hi'
import { TbTrash } from 'react-icons/tb'
import type { MouseEvent } from 'react'
import { accordionData, AccordionItem } from '../../../../mock/data/clausesData'
import useCategoryList from '../../category/List/hooks/useList'
import useDocumentList from '../../document/List/hooks/useList'

type OverviewSectionProps = FormSectionBaseProps & {
    setValue: any
    getValues: any
}

const frequencyOptions = [
    { label: 'Daily', value: 'Daily' },
    { label: 'Weekly', value: 'Weekly' },
    { label: 'Monthly', value: 'Monthly' },
]

const OverviewSection = ({
    control,
    errors,
    readOnly,
    setValue,
    getValues,
}: OverviewSectionProps) => {
    const { categoryList } = useCategoryList()
    const { documentList } = useDocumentList()

    const documentOptions = documentList.map((document: any) => ({
        value: document.documentName,
        label: document.documentName,
        category: document.category,
    }))

    const categoryOptions = categoryList.map(
        (category: { name: string; prefix: any }) => ({
            value: category.name,
            label: `${category.name.toUpperCase()} - ${category.prefix}`,
        }),
    )

    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

    const handleToggle = (expanded: boolean, e: MouseEvent<HTMLDivElement>) => {
        const key = (e.currentTarget as any)?.dataset?.key as string
        if (!key) return
        setExpandedItems((prev) => {
            const newSet = new Set(prev)
            expanded ? newSet.add(key) : newSet.delete(key)
            return newSet
        })
    }

    const isExpanded = (key: string) => expandedItems.has(key)

    const handleAddNote = () => {
        const currentNotes = getValues('notes') || ['']
        setValue('notes', [...currentNotes, ''])
    }

    const handleRemoveNote = (index: number) => {
        const currentNotes = getValues('notes') || ['']
        if (currentNotes.length > 1) {
            const newNotes = currentNotes.filter(
                (_: string, i: number) => i !== index,
            )
            setValue('notes', newNotes)
        }
    }

    const handleNoteChange = (index: number, value: string) => {
        const currentNotes = getValues('notes') || ['']
        const newNotes = [...currentNotes]
        newNotes[index] = value
        setValue('notes', newNotes)
    }

    const handleAddClause = () => {
        const currentClauses = getValues('clauses') || [
            {
                category: '',
                documentName: '',
                frequency: '',
                required: false,
                timezone: false,
            },
        ]
        setValue('clauses', [
            ...currentClauses,
            {
                category: '',
                documentName: '',
                frequency: '',
                required: false,
                timezone: false,
            },
        ])
    }

    const handleRemoveClause = (index: number) => {
        const currentClauses = getValues('clauses') || [
            {
                category: '',
                documentName: '',
                frequency: '',
                required: false,
                timezone: false,
            },
        ]
        if (currentClauses.length > 1) {
            const newClauses = currentClauses.filter(
                (_: any, i: number) => i !== index,
            )
            setValue('clauses', newClauses)
        }
    }

    const handleClauseFieldChange = (
        clauseIndex: number,
        field: string,
        value: any,
    ) => {
        const currentClauses = getValues('clauses') || [
            {
                category: '',
                documentName: '',
                frequency: '',
                required: false,
                timezone: false,
            },
        ]
        const newClauses = [...currentClauses]
        newClauses[clauseIndex] = {
            ...newClauses[clauseIndex],
            [field]: value,
        }
        setValue('clauses', newClauses)
    }

    const renderRequiredSection = (eventKey: string) => {
        return (
            <Menu.MenuCollapse
                eventKey={`${eventKey}-required`}
                label="Required"
                expanded={isExpanded(`${eventKey}-required`)}
                data-key={`${eventKey}-required`}
                onToggle={handleToggle}
            >
                <div className="p-4 space-y-6 overflow-visible">
                    <Controller
                        name="notes"
                        control={control}
                        render={({ field }) => (
                            <div>
                                {(field.value || ['']).map(
                                    (note: string, idx: number) => (
                                        <div
                                            key={idx}
                                            className="flex items-start gap-3 mb-4"
                                        >
                                            <div className="flex-1">
                                                <FormItem
                                                    label={`Note ${idx + 1}`}
                                                    invalid={Boolean(
                                                        errors.notes?.[idx],
                                                    )}
                                                    errorMessage={
                                                        errors.notes?.[idx]
                                                            ?.message
                                                    }
                                                >
                                                    <Input
                                                        textArea
                                                        rows={3}
                                                        value={note}
                                                        placeholder={`Write your note ${idx + 1}...`}
                                                        readOnly={readOnly}
                                                        onChange={(e) =>
                                                            handleNoteChange(
                                                                idx,
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </FormItem>
                                            </div>

                                            {!readOnly && (
                                                <div className="flex flex-col gap-2 mt-8">
                                                    {idx ===
                                                        (field.value?.length ||
                                                            1) -
                                                            1 && (
                                                        <Button
                                                            size="sm"
                                                            icon={<HiPlus />}
                                                            variant="solid"
                                                            className="bg-green-500 hover:bg-green-600"
                                                            onClick={
                                                                handleAddNote
                                                            }
                                                        />
                                                    )}
                                                    {(field.value?.length ||
                                                        1) > 1 && (
                                                        <Button
                                                            size="sm"
                                                            icon={<TbTrash />}
                                                            variant="solid"
                                                            className="bg-red-500 hover:bg-red-600"
                                                            onClick={() =>
                                                                handleRemoveNote(
                                                                    idx,
                                                                )
                                                            }
                                                        />
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ),
                                )}
                            </div>
                        )}
                    />

                    <Controller
                        name="clauses"
                        control={control}
                        render={({ field }) => (
                            <div>
                                {(
                                    field.value || [
                                        {
                                            category: '',
                                            documentName: '',
                                            frequency: '',
                                            required: false,
                                            timezone: false,
                                        },
                                    ]
                                ).map((clause: any, idx: number) => (
                                    <div
                                        key={idx}
                                        className="flex items-center gap-3 mb-4"
                                    >
                                        <div className="grid grid-cols-6 gap-3 flex-1">
                                            <FormItem
                                                label="Category"
                                                invalid={Boolean(
                                                    errors.clauses?.[idx]
                                                        ?.category,
                                                )}
                                                errorMessage={
                                                    errors.clauses?.[idx]
                                                        ?.category?.message
                                                }
                                            >
                                                <Select
                                                    value={
                                                        categoryOptions.find(
                                                            (o: {
                                                                value: any
                                                            }) =>
                                                                o.value ===
                                                                clause.category,
                                                        ) || null
                                                    }
                                                    options={categoryOptions}
                                                    placeholder="Select.."
                                                    isDisabled={readOnly}
                                                    menuPortalTarget={
                                                        document.body
                                                    }
                                                    menuPosition="fixed"
                                                    onChange={(val) =>
                                                        handleClauseFieldChange(
                                                            idx,
                                                            'category',
                                                            val?.value ?? '',
                                                        )
                                                    }
                                                />
                                            </FormItem>

                                            <FormItem
                                                label="Document Name"
                                                invalid={Boolean(
                                                    errors.clauses?.[idx]
                                                        ?.documentName,
                                                )}
                                                errorMessage={
                                                    errors.clauses?.[idx]
                                                        ?.documentName?.message
                                                }
                                            >
                                                <Select
                                                    value={
                                                        documentOptions.find(
                                                            (o) =>
                                                                o.value ===
                                                                clause.documentName,
                                                        ) || null
                                                    }
                                                    options={documentOptions}
                                                    placeholder="Select.."
                                                    isDisabled={readOnly}
                                                    menuPortalTarget={
                                                        document.body
                                                    }
                                                    menuPosition="fixed"
                                                    onChange={(val) =>
                                                        handleClauseFieldChange(
                                                            idx,
                                                            'documentName',
                                                            val?.value ?? '',
                                                        )
                                                    }
                                                />
                                            </FormItem>

                                            <FormItem
                                                label="Frequency"
                                                invalid={Boolean(
                                                    errors.clauses?.[idx]
                                                        ?.frequency,
                                                )}
                                                errorMessage={
                                                    errors.clauses?.[idx]
                                                        ?.frequency?.message
                                                }
                                            >
                                                <Select
                                                    value={
                                                        frequencyOptions.find(
                                                            (o) =>
                                                                o.value ===
                                                                clause.frequency,
                                                        ) || null
                                                    }
                                                    options={frequencyOptions}
                                                    placeholder="Select.."
                                                    isDisabled={readOnly}
                                                    menuPortalTarget={
                                                        document.body
                                                    }
                                                    menuPosition="fixed"
                                                    onChange={(val) =>
                                                        handleClauseFieldChange(
                                                            idx,
                                                            'frequency',
                                                            val?.value ?? '',
                                                        )
                                                    }
                                                />
                                            </FormItem>

                                            <FormItem
                                                label="Required"
                                                invalid={Boolean(
                                                    errors.clauses?.[idx]
                                                        ?.required,
                                                )}
                                                errorMessage={
                                                    errors.clauses?.[idx]
                                                        ?.required?.message
                                                }
                                            >
                                                <Checkbox
                                                    checked={!!clause.required}
                                                    disabled={readOnly}
                                                    onChange={(e: boolean) =>
                                                        handleClauseFieldChange(
                                                            idx,
                                                            'required',
                                                            e,
                                                        )
                                                    }
                                                />
                                            </FormItem>

                                            <FormItem
                                                label="Timezone"
                                                invalid={Boolean(
                                                    errors.clauses?.[idx]
                                                        ?.timezone,
                                                )}
                                                errorMessage={
                                                    errors.clauses?.[idx]
                                                        ?.timezone?.message
                                                }
                                            >
                                                <Checkbox
                                                    checked={!!clause.timezone}
                                                    disabled={readOnly}
                                                    onChange={(e: boolean) =>
                                                        handleClauseFieldChange(
                                                            idx,
                                                            'timezone',
                                                            e,
                                                        )
                                                    }
                                                />
                                            </FormItem>
                                        </div>

                                        {!readOnly && (
                                            <div className="flex flex-col gap-2 mt-6">
                                                {idx ===
                                                    (field.value?.length || 1) -
                                                        1 && (
                                                    <Button
                                                        size="sm"
                                                        icon={<HiPlus />}
                                                        variant="solid"
                                                        className="bg-green-500 hover:bg-green-600"
                                                        onClick={
                                                            handleAddClause
                                                        }
                                                    />
                                                )}
                                                {(field.value?.length || 1) >
                                                    1 && (
                                                    <Button
                                                        size="sm"
                                                        icon={<TbTrash />}
                                                        variant="solid"
                                                        className="bg-red-500 hover:bg-red-600"
                                                        onClick={() =>
                                                            handleRemoveClause(
                                                                idx,
                                                            )
                                                        }
                                                    />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    />
                </div>
            </Menu.MenuCollapse>
        )
    }

    const renderAccordion = (items: AccordionItem[], parentKey = '') => {
        return items.map((item, idx) => {
            const key = `${parentKey}${idx}-${item.title}`
            return (
                <Menu.MenuCollapse
                    key={key}
                    eventKey={key}
                    label={item.title}
                    expanded={isExpanded(key)}
                    data-key={key}
                    onToggle={handleToggle}
                >
                    <div className="p-4 space-y-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-blue-800 text-sm leading-relaxed whitespace-pre-line">
                                {item.message}
                            </p>
                        </div>

                        {item.note && renderRequiredSection(key)}

                        {item.children && item.children.length > 0 && (
                            <div className="pl-4">
                                {renderAccordion(item.children, key + '-')}
                            </div>
                        )}
                    </div>
                </Menu.MenuCollapse>
            )
        })
    }

    return (
        <Card className="p-6">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
                <Menu>{renderAccordion(accordionData)}</Menu>
            </div>
        </Card>
    )
}

export default OverviewSection
