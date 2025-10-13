/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, useMemo } from 'react'
import Card from '@/components/ui/Card'
import { FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Checkbox from '@/components/ui/Checkbox'
import { FormSectionBaseProps, TitleSpecificData } from '@/@types/clauses'
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

const defaultClause = {
    category: '',
    documentName: '',
    frequency: '',
    required: false,
    timezone: false,
}

const OverviewSection = ({
    control,
    errors,
    readOnly,
    setValue,
    getValues,
}: OverviewSectionProps) => {
    const { categoryList } = useCategoryList()
    const { documentList } = useDocumentList()

    // Document options with category information
    const documentOptions = useMemo(
        () =>
            documentList.map((document: any) => ({
                value: document.documentName,
                label: document.documentName,
                category: document.category,
            })),
        [documentList],
    )

    const categoryOptions = categoryList.map(
        (category: { name: string; prefix: any }) => ({
            value: category.name,
            label: `${category.name.toUpperCase()} - ${category.prefix}`,
        }),
    )

    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

    // Get filtered document options based on selected category
    const getFilteredDocumentOptions = (selectedCategory: string) => {
        if (!selectedCategory) {
            return documentOptions
        }
        return documentOptions.filter(
            (doc: any) => doc.category === selectedCategory,
        )
    }

    // Single MenuCollapse by default open
    useEffect(() => {
        const getAllKeys = (
            items: AccordionItem[],
            parentKey = '',
        ): string[] => {
            let keys: string[] = []
            items.forEach((item, idx) => {
                const key = `${parentKey}${idx}-${item.title}`

                // Main accordion key add
                keys.push(key)

                if (item.note) {
                    const requiredKey = `${key}-required`
                    keys.push(requiredKey)
                }

                if (item.children && item.children.length > 0) {
                    keys = [...keys, ...getAllKeys(item.children, key + '-')]
                }
            })
            return keys
        }

        const allKeys = getAllKeys(accordionData)
        setExpandedItems(new Set(allKeys))
    }, [])

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

    // Helper to find title index
    const findTitleIndex = (titleKey: string): number => {
        const currentData = getValues('titleSpecificData') || []
        const index = currentData.findIndex(
            (item: TitleSpecificData) => item.titleKey === titleKey,
        )
        return index
    }

    // Title-specific note handlers
    const handleAddNote = (titleKey: string) => {
        const currentData = getValues('titleSpecificData') || []
        const titleIndex = findTitleIndex(titleKey)
        if (titleIndex === -1) return

        const newData = [...currentData]
        newData[titleIndex].notes = [...newData[titleIndex].notes, '']
        setValue('titleSpecificData', newData)
    }

    const handleRemoveNote = (titleKey: string, index: number) => {
        const currentData = getValues('titleSpecificData') || []
        const titleIndex = findTitleIndex(titleKey)
        if (titleIndex === -1) return

        const newData = [...currentData]
        if (newData[titleIndex].notes.length > 1) {
            newData[titleIndex].notes = newData[titleIndex].notes.filter(
                (_: string, i: number) => i !== index,
            )
            setValue('titleSpecificData', newData)
        }
    }

    const handleNoteChange = (
        titleKey: string,
        index: number,
        value: string,
    ) => {
        const currentData = getValues('titleSpecificData') || []
        const titleIndex = findTitleIndex(titleKey)
        if (titleIndex === -1) return

        const newData = [...currentData]
        newData[titleIndex].notes[index] = value
        setValue('titleSpecificData', newData)
    }

    // Title-specific clause handlers
    const handleAddClause = (titleKey: string) => {
        const currentData = getValues('titleSpecificData') || []
        const titleIndex = findTitleIndex(titleKey)
        if (titleIndex === -1) return

        const newData = [...currentData]
        newData[titleIndex].clauses = [
            ...newData[titleIndex].clauses,
            { ...defaultClause },
        ]
        setValue('titleSpecificData', newData)
    }

    const handleRemoveClause = (titleKey: string, index: number) => {
        const currentData = getValues('titleSpecificData') || []
        const titleIndex = findTitleIndex(titleKey)
        if (titleIndex === -1) return

        const newData = [...currentData]
        if (newData[titleIndex].clauses.length > 1) {
            newData[titleIndex].clauses = newData[titleIndex].clauses.filter(
                (_: any, i: number) => i !== index,
            )
            setValue('titleSpecificData', newData)
        }
    }

    const handleClauseFieldChange = (
        titleKey: string,
        clauseIndex: number,
        field: string,
        value: any,
    ) => {
        const currentData = getValues('titleSpecificData') || []
        const titleIndex = findTitleIndex(titleKey)
        if (titleIndex === -1) return

        const newData = [...currentData]
        const currentClause = newData[titleIndex].clauses[clauseIndex]

        // If category is changed, clear the document name
        if (field === 'category' && value !== currentClause.category) {
            newData[titleIndex].clauses[clauseIndex] = {
                ...currentClause,
                category: value,
                documentName: '', // Clear document name when category changes
            }
        } else {
            newData[titleIndex].clauses[clauseIndex] = {
                ...currentClause,
                [field]: value,
            }
        }

        setValue('titleSpecificData', newData)
    }

    // UPDATED: renderRequiredSection now takes titleKey
    const renderRequiredSection = (titleKey: string) => {
        const titleIndex = findTitleIndex(titleKey)
        if (titleIndex === -1) return null

        const titleData = getValues('titleSpecificData')?.[titleIndex]
        if (!titleData) return null

        return (
            <Menu.MenuCollapse
                eventKey={`${titleKey}-required`}
                label="Required"
                expanded={isExpanded(`${titleKey}-required`)}
                data-key={`${titleKey}-required`}
                onToggle={handleToggle}
            >
                <div className="p-4 space-y-6 overflow-visible">
                    {/* Title-specific Notes */}
                    <Controller
                        name={`titleSpecificData.${titleIndex}.notes`}
                        control={control}
                        render={({ field }) => (
                            <div>
                                <h4 className="text-lg font-semibold mb-4 text-gray-700">
                                    Notes
                                </h4>
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
                                                        errors
                                                            .titleSpecificData?.[
                                                            titleIndex
                                                        ]?.notes?.[idx],
                                                    )}
                                                    errorMessage={
                                                        errors
                                                            .titleSpecificData?.[
                                                            titleIndex
                                                        ]?.notes?.[idx]?.message
                                                    }
                                                >
                                                    <Input
                                                        textArea
                                                        rows={3}
                                                        value={note}
                                                        placeholder="Write your note..."
                                                        readOnly={readOnly}
                                                        onChange={(e) =>
                                                            handleNoteChange(
                                                                titleKey,
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
                                                            onClick={() =>
                                                                handleAddNote(
                                                                    titleKey,
                                                                )
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
                                                                    titleKey,
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

                    {/* Title-specific Clauses */}
                    <Controller
                        name={`titleSpecificData.${titleIndex}.clauses`}
                        control={control}
                        render={({ field }) => (
                            <div>
                                <h4 className="text-lg font-semibold mb-4 text-gray-700">
                                    Clauses
                                </h4>
                                {(field.value || [defaultClause]).map(
                                    (clause: any, idx: number) => {
                                        const filteredDocumentOptions =
                                            getFilteredDocumentOptions(
                                                clause.category,
                                            )

                                        return (
                                            <div
                                                key={idx}
                                                className="flex items-center gap-3 mb-4"
                                            >
                                                <div className="grid grid-cols-6 gap-3 flex-1">
                                                    <FormItem
                                                        label="Category"
                                                        invalid={Boolean(
                                                            errors
                                                                .titleSpecificData?.[
                                                                titleIndex
                                                            ]?.clauses?.[idx]
                                                                ?.category,
                                                        )}
                                                        errorMessage={
                                                            errors
                                                                .titleSpecificData?.[
                                                                titleIndex
                                                            ]?.clauses?.[idx]
                                                                ?.category
                                                                ?.message
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
                                                            options={
                                                                categoryOptions
                                                            }
                                                            placeholder="Select.."
                                                            isDisabled={
                                                                readOnly
                                                            }
                                                            menuPortalTarget={
                                                                document.body
                                                            }
                                                            menuPosition="fixed"
                                                            onChange={(val) =>
                                                                handleClauseFieldChange(
                                                                    titleKey,
                                                                    idx,
                                                                    'category',
                                                                    val?.value ??
                                                                        '',
                                                                )
                                                            }
                                                        />
                                                    </FormItem>

                                                    <FormItem
                                                        label="Document Name"
                                                        invalid={Boolean(
                                                            errors
                                                                .titleSpecificData?.[
                                                                titleIndex
                                                            ]?.clauses?.[idx]
                                                                ?.documentName,
                                                        )}
                                                        errorMessage={
                                                            errors
                                                                .titleSpecificData?.[
                                                                titleIndex
                                                            ]?.clauses?.[idx]
                                                                ?.documentName
                                                                ?.message
                                                        }
                                                    >
                                                        <Select
                                                            value={
                                                                filteredDocumentOptions.find(
                                                                    (o) =>
                                                                        o.value ===
                                                                        clause.documentName,
                                                                ) || null
                                                            }
                                                            options={
                                                                filteredDocumentOptions
                                                            }
                                                            placeholder={
                                                                clause.category
                                                                    ? 'Select...'
                                                                    : ''
                                                            }
                                                            isDisabled={
                                                                readOnly ||
                                                                !clause.category
                                                            }
                                                            menuPortalTarget={
                                                                document.body
                                                            }
                                                            menuPosition="fixed"
                                                            onChange={(val) =>
                                                                handleClauseFieldChange(
                                                                    titleKey,
                                                                    idx,
                                                                    'documentName',
                                                                    val?.value ??
                                                                        '',
                                                                )
                                                            }
                                                        />
                                                    </FormItem>

                                                    <FormItem
                                                        label="Frequency"
                                                        invalid={Boolean(
                                                            errors
                                                                .titleSpecificData?.[
                                                                titleIndex
                                                            ]?.clauses?.[idx]
                                                                ?.frequency,
                                                        )}
                                                        errorMessage={
                                                            errors
                                                                .titleSpecificData?.[
                                                                titleIndex
                                                            ]?.clauses?.[idx]
                                                                ?.frequency
                                                                ?.message
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
                                                            options={
                                                                frequencyOptions
                                                            }
                                                            placeholder="Select.."
                                                            isDisabled={
                                                                readOnly
                                                            }
                                                            menuPortalTarget={
                                                                document.body
                                                            }
                                                            menuPosition="fixed"
                                                            onChange={(val) =>
                                                                handleClauseFieldChange(
                                                                    titleKey,
                                                                    idx,
                                                                    'frequency',
                                                                    val?.value ??
                                                                        '',
                                                                )
                                                            }
                                                        />
                                                    </FormItem>

                                                    <FormItem
                                                        label="Required"
                                                        invalid={Boolean(
                                                            errors
                                                                .titleSpecificData?.[
                                                                titleIndex
                                                            ]?.clauses?.[idx]
                                                                ?.required,
                                                        )}
                                                        errorMessage={
                                                            errors
                                                                .titleSpecificData?.[
                                                                titleIndex
                                                            ]?.clauses?.[idx]
                                                                ?.required
                                                                ?.message
                                                        }
                                                    >
                                                        <Checkbox
                                                            checked={
                                                                !!clause.required
                                                            }
                                                            disabled={readOnly}
                                                            onChange={(
                                                                e: boolean,
                                                            ) =>
                                                                handleClauseFieldChange(
                                                                    titleKey,
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
                                                            errors
                                                                .titleSpecificData?.[
                                                                titleIndex
                                                            ]?.clauses?.[idx]
                                                                ?.timezone,
                                                        )}
                                                        errorMessage={
                                                            errors
                                                                .titleSpecificData?.[
                                                                titleIndex
                                                            ]?.clauses?.[idx]
                                                                ?.timezone
                                                                ?.message
                                                        }
                                                    >
                                                        <Checkbox
                                                            checked={
                                                                !!clause.timezone
                                                            }
                                                            disabled={readOnly}
                                                            onChange={(
                                                                e: boolean,
                                                            ) =>
                                                                handleClauseFieldChange(
                                                                    titleKey,
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
                                                            (field.value
                                                                ?.length || 1) -
                                                                1 && (
                                                            <Button
                                                                size="sm"
                                                                icon={
                                                                    <HiPlus />
                                                                }
                                                                variant="solid"
                                                                className="bg-green-500 hover:bg-green-600"
                                                                onClick={() =>
                                                                    handleAddClause(
                                                                        titleKey,
                                                                    )
                                                                }
                                                            />
                                                        )}
                                                        {(field.value?.length ||
                                                            1) > 1 && (
                                                            <Button
                                                                size="sm"
                                                                icon={
                                                                    <TbTrash />
                                                                }
                                                                variant="solid"
                                                                className="bg-red-500 hover:bg-red-600"
                                                                onClick={() =>
                                                                    handleRemoveClause(
                                                                        titleKey,
                                                                        idx,
                                                                    )
                                                                }
                                                            />
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    },
                                )}
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

                        {/* Pass titleKey instead of eventKey */}
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
