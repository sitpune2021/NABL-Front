/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo } from 'react'
import Card from '@/components/ui/Card'
import { FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Checkbox from '@/components/ui/Checkbox'
import Select from '@/components/ui/Select'
import { Controller, useFieldArray, useWatch } from 'react-hook-form'
import { HiPlus, HiTrash } from 'react-icons/hi'
import useCategoryList from '../../category/List/hooks/useList'
import useDocumentList from '../../document/List/hooks/useList'

// Frequency options
const frequencyOptions = [
    { label: 'Daily', value: 'Daily' },
    { label: 'Weekly', value: 'Weekly' },
    { label: 'Monthly', value: 'Monthly' },
]

// Recursive component for nested children
const ChildSection = ({
    control,
    errors,
    readOnly,
    parentPath,
    level = 0,
    categoryOptions,
    documentOptions,
    getFilteredDocumentOptions,
}: any) => {
    const { fields, append, remove } = useFieldArray({
        control,
        name: `${parentPath}.children`,
    })

    const watchedChildren = useWatch({
        control,
        name: `${parentPath}.children`,
        defaultValue: [],
    })

    const handleAddChild = () => {
        append({
            title: '',
            message: '',
            isNote: false,
            isChild: false,
            count: 0,
            children: [],
            notes: [],
            fields: [],
        })
    }

    const handleAddNote = (childIndex: number) => {
        const currentChild = watchedChildren[childIndex]
        const updatedChild = {
            ...currentChild,
            notes: [
                ...(currentChild.notes || []),
                { id: Date.now(), content: '' },
            ],
        }

        remove(childIndex)
        append(updatedChild, { shouldFocus: false })
    }

    const handleDeleteNote = (childIndex: number, noteId: number) => {
        const currentChild = watchedChildren[childIndex]
        const updatedNotes = (currentChild.notes || []).filter(
            (note: any) => note.id !== noteId,
        )

        const updatedChild = {
            ...currentChild,
            notes: updatedNotes,
        }

        remove(childIndex)
        append(updatedChild, { shouldFocus: false })
    }

    const handleNoteChange = (
        childIndex: number,
        noteId: number,
        content: string,
    ) => {
        const currentChild = watchedChildren[childIndex]
        const updatedNotes = (currentChild.notes || []).map((note: any) =>
            note.id === noteId ? { ...note, content } : note,
        )

        const updatedChild = {
            ...currentChild,
            notes: updatedNotes,
        }

        remove(childIndex)
        append(updatedChild, { shouldFocus: false })
    }

    const handleAddField = (childIndex: number) => {
        const currentChild = watchedChildren[childIndex]
        const updatedChild = {
            ...currentChild,
            fields: [
                ...(currentChild.fields || []),
                {
                    id: Date.now(),
                    category: '',
                    documentName: '',
                    frequency: '',
                    isRequired: false,
                    timezone: false,
                },
            ],
        }

        remove(childIndex)
        append(updatedChild, { shouldFocus: false })
    }

    const handleDeleteField = (childIndex: number, clauseId: number) => {
        const currentChild = watchedChildren[childIndex]
        const updatedFields = (currentChild.fields || []).filter(
            (clause: any) => clause.id !== clauseId,
        )

        const updatedChild = {
            ...currentChild,
            fields: updatedFields,
        }

        remove(childIndex)
        append(updatedChild, { shouldFocus: false })
    }

    const handleFieldChange = (
        childIndex: number,
        clauseId: number,
        field: string,
        value: any,
    ) => {
        const currentChild = watchedChildren[childIndex]
        let updatedFields

        if (
            field === 'category' &&
            value !==
                currentChild.fields.find((c: any) => c.id === clauseId)
                    ?.category
        ) {
            // If category changes, clear documentName
            updatedFields = (currentChild.fields || []).map((clause: any) =>
                clause.id === clauseId
                    ? {
                          ...clause,
                          category: value,
                          documentName: '',
                      }
                    : clause,
            )
        } else {
            updatedFields = (currentChild.fields || []).map((clause: any) =>
                clause.id === clauseId ? { ...clause, [field]: value } : clause,
            )
        }

        const updatedChild = {
            ...currentChild,
            fields: updatedFields,
        }

        remove(childIndex)
        append(updatedChild, { shouldFocus: false })
    }

    // Auto-adjust children count and handle fields initialization
    useEffect(() => {
        if (!watchedChildren) return

        watchedChildren.forEach((child: any, index: number) => {
            if (child?.isChild && child?.count > 0) {
                const currentCount = child.count || 0
                const currentChildren = child.children || []

                if (currentCount > currentChildren.length) {
                    const childrenToAdd = currentCount - currentChildren.length
                    const newChildren = [...currentChildren]

                    for (let i = 0; i < childrenToAdd; i++) {
                        newChildren.push({
                            title: '',
                            message: '',
                            isNote: false,
                            isChild: false,
                            count: 0,
                            children: [],
                            notes: [],
                            fields: [],
                        })
                    }

                    const updatedChild = {
                        ...child,
                        children: newChildren,
                    }

                    remove(index)
                    append(updatedChild, { shouldFocus: false })
                } else if (currentCount < currentChildren.length) {
                    const newChildren = currentChildren.slice(0, currentCount)
                    const updatedChild = {
                        ...child,
                        children: newChildren,
                    }

                    remove(index)
                    append(updatedChild, { shouldFocus: false })
                }
            } else if (
                !child?.isChild &&
                child?.children &&
                child.children.length > 0
            ) {
                const updatedChild = {
                    ...child,
                    children: [],
                }

                remove(index)
                append(updatedChild, { shouldFocus: false })
            }

            // Handle notes array initialization
            if (child?.isNote && (!child.notes || child.notes.length === 0)) {
                const updatedChild = {
                    ...child,
                    notes: [{ id: Date.now(), content: '' }],
                }

                remove(index)
                append(updatedChild, { shouldFocus: false })
            } else if (
                !child?.isNote &&
                child?.notes &&
                child.notes.length > 0
            ) {
                const updatedChild = {
                    ...child,
                    notes: [],
                }

                remove(index)
                append(updatedChild, { shouldFocus: false })
            }

            // Handle fields array initialization
            if (child?.isNote && (!child.fields || child.fields.length === 0)) {
                const updatedChild = {
                    ...child,
                    fields: [
                        {
                            id: Date.now(),
                            category: '',
                            documentName: '',
                            frequency: '',
                            isRequired: false,
                            timezone: false,
                        },
                    ],
                }

                remove(index)
                append(updatedChild, { shouldFocus: false })
            } else if (
                !child?.isNote &&
                child?.fields &&
                child.fields.length > 0
            ) {
                const updatedChild = {
                    ...child,
                    fields: [],
                }

                remove(index)
                append(updatedChild, { shouldFocus: false })
            }
        })
    }, [watchedChildren, append, remove])

    if (fields.length === 0) {
        return null
    }

    return (
        <div
            className={`mt-4 ${level > 0 ? 'border-l-2 border-gray-200 pl-4 ml-4' : ''}`}
        >
            <div className="flex justify-between items-center mb-4">
                <h5 className="font-semibold">
                    {level === 0 ? 'Children' : `Level ${level + 1} Children`}
                </h5>
                <Button
                    size="sm"
                    type="button"
                    disabled={readOnly}
                    onClick={handleAddChild}
                >
                    <HiPlus className="text-lg" />
                </Button>
            </div>

            {fields.map((field, index) => (
                <div
                    key={field.id}
                    className="border rounded-lg p-4 mb-4 bg-gray-50"
                >
                    <div className="grid md:grid-cols-2 gap-4">
                        <FormItem
                            label="Title"
                            invalid={Boolean(
                                errors?.[parentPath]?.children?.[index]?.title,
                            )}
                            errorMessage={
                                errors?.[parentPath]?.children?.[index]?.title
                                    ?.message
                            }
                        >
                            <Controller
                                name={`${parentPath}.children.${index}.title`}
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <Input
                                        type="text"
                                        placeholder="Enter Title"
                                        readOnly={readOnly}
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>

                        <FormItem
                            label="Message"
                            invalid={Boolean(
                                errors?.[parentPath]?.children?.[index]
                                    ?.message,
                            )}
                            errorMessage={
                                errors?.[parentPath]?.children?.[index]?.message
                                    ?.message
                            }
                        >
                            <Controller
                                name={`${parentPath}.children.${index}.message`}
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <Input
                                        textArea
                                        rows={2}
                                        placeholder="Write your message..."
                                        readOnly={readOnly}
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>
                    </div>

                    <div className="flex items-center gap-6 flex-wrap mt-4">
                        <FormItem label="Note">
                            <Controller
                                name={`${parentPath}.children.${index}.isNote`}
                                control={control}
                                defaultValue={false}
                                render={({ field }) => (
                                    <Checkbox
                                        checked={field.value || false}
                                        disabled={readOnly}
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>

                        <FormItem label="Child">
                            <Controller
                                name={`${parentPath}.children.${index}.isChild`}
                                control={control}
                                defaultValue={false}
                                render={({ field }) => (
                                    <Checkbox
                                        checked={field.value || false}
                                        disabled={readOnly}
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>

                        <FormItem label="Count">
                            <Controller
                                name={`${parentPath}.children.${index}.count`}
                                control={control}
                                defaultValue={0}
                                render={({ field }) => (
                                    <Input
                                        type="number"
                                        className="w-24"
                                        placeholder="0"
                                        readOnly={readOnly}
                                        value={field.value || 0}
                                        onChange={(e) => {
                                            field.onChange(
                                                parseInt(e.target.value) || 0,
                                            )
                                        }}
                                    />
                                )}
                            />
                        </FormItem>
                    </div>

                    {/* Notes for Child */}
                    {watchedChildren[index]?.isNote && (
                        <div className="mt-4 border-t pt-4">
                            <div className="flex justify-between items-center mb-4">
                                <h6 className="font-semibold">Notes</h6>
                                <Button
                                    size="sm"
                                    type="button"
                                    disabled={readOnly}
                                    onClick={() => handleAddNote(index)}
                                >
                                    <HiPlus className="text-lg" />
                                </Button>
                            </div>

                            {watchedChildren[index]?.notes?.map(
                                (note: any, noteIndex: number) => (
                                    <div
                                        key={note.id}
                                        className="border rounded-lg p-3 mb-3 bg-white"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <h6 className="font-medium">
                                                Note {noteIndex + 1}
                                            </h6>
                                            {watchedChildren[index].notes
                                                .length > 1 && (
                                                <Button
                                                    size="sm"
                                                    type="button"
                                                    variant="solid"
                                                    color="red"
                                                    disabled={readOnly}
                                                    onClick={() =>
                                                        handleDeleteNote(
                                                            index,
                                                            note.id,
                                                        )
                                                    }
                                                >
                                                    <HiTrash className="text-lg" />
                                                </Button>
                                            )}
                                        </div>

                                        <FormItem>
                                            <Input
                                                textArea
                                                rows={2}
                                                placeholder="Write your note..."
                                                readOnly={readOnly}
                                                value={note.content || ''}
                                                onChange={(e) =>
                                                    handleNoteChange(
                                                        index,
                                                        note.id,
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </FormItem>
                                    </div>
                                ),
                            )}
                        </div>
                    )}

                    {/* Fields for Child */}
                    {watchedChildren[index]?.isNote && (
                        <div className="mt-4 border-t pt-4">
                            <div className="flex justify-between items-center mb-4">
                                <h6 className="font-semibold">Fields</h6>
                                <Button
                                    size="sm"
                                    type="button"
                                    disabled={readOnly}
                                    onClick={() => handleAddField(index)}
                                >
                                    <HiPlus className="text-lg" />
                                </Button>
                            </div>

                            {watchedChildren[index]?.fields?.map(
                                (clause: any, clauseIndex: number) => {
                                    const filteredDocumentOptions =
                                        getFilteredDocumentOptions(
                                            clause.category,
                                        )

                                    return (
                                        <div
                                            key={clause.id}
                                            className="border rounded-lg p-3 mb-3 bg-white"
                                        >
                                            <div className="flex justify-between items-center mb-3">
                                                <h6 className="font-medium">
                                                    Field {clauseIndex + 1}
                                                </h6>
                                                {watchedChildren[index].fields
                                                    .length > 1 && (
                                                    <Button
                                                        size="sm"
                                                        type="button"
                                                        variant="solid"
                                                        color="red"
                                                        disabled={readOnly}
                                                        onClick={() =>
                                                            handleDeleteField(
                                                                index,
                                                                clause.id,
                                                            )
                                                        }
                                                    >
                                                        <HiTrash className="text-lg" />
                                                    </Button>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                                                {/* Category - Select */}
                                                <FormItem label="Category">
                                                    <Select
                                                        value={
                                                            categoryOptions.find(
                                                                (o: any) =>
                                                                    o.value ===
                                                                    clause.category,
                                                            ) || null
                                                        }
                                                        options={
                                                            categoryOptions
                                                        }
                                                        placeholder="Select.."
                                                        isDisabled={readOnly}
                                                        menuPortalTarget={
                                                            document.body
                                                        }
                                                        menuPosition="fixed"
                                                        onChange={(val: any) =>
                                                            handleFieldChange(
                                                                index,
                                                                clause.id,
                                                                'category',
                                                                val?.value ||
                                                                    '',
                                                            )
                                                        }
                                                    />
                                                </FormItem>

                                                {/* Document Name - Select */}
                                                <FormItem label="Document Name">
                                                    <Select
                                                        value={
                                                            filteredDocumentOptions.find(
                                                                (o: any) =>
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
                                                                : 'Select category first'
                                                        }
                                                        isDisabled={
                                                            readOnly ||
                                                            !clause.category
                                                        }
                                                        menuPortalTarget={
                                                            document.body
                                                        }
                                                        menuPosition="fixed"
                                                        onChange={(val: any) =>
                                                            handleFieldChange(
                                                                index,
                                                                clause.id,
                                                                'documentName',
                                                                val?.value ||
                                                                    '',
                                                            )
                                                        }
                                                    />
                                                </FormItem>

                                                {/* Frequency - Select */}
                                                <FormItem label="Frequency">
                                                    <Select
                                                        value={
                                                            frequencyOptions.find(
                                                                (o: any) =>
                                                                    o.value ===
                                                                    clause.frequency,
                                                            ) || null
                                                        }
                                                        options={
                                                            frequencyOptions
                                                        }
                                                        placeholder="Select.."
                                                        isDisabled={readOnly}
                                                        menuPortalTarget={
                                                            document.body
                                                        }
                                                        menuPosition="fixed"
                                                        onChange={(val: any) =>
                                                            handleFieldChange(
                                                                index,
                                                                clause.id,
                                                                'frequency',
                                                                val?.value ||
                                                                    '',
                                                            )
                                                        }
                                                    />
                                                </FormItem>

                                                {/* Required - Checkbox */}
                                                <FormItem
                                                    label="Required"
                                                    className="flex items-center gap-2"
                                                >
                                                    <Checkbox
                                                        checked={
                                                            clause.isRequired ||
                                                            false
                                                        }
                                                        disabled={readOnly}
                                                        onChange={(
                                                            e: boolean,
                                                        ) =>
                                                            handleFieldChange(
                                                                index,
                                                                clause.id,
                                                                'isRequired',
                                                                e,
                                                            )
                                                        }
                                                    />
                                                    <span className="text-sm">
                                                        Required
                                                    </span>
                                                </FormItem>

                                                {/* Timezone - Checkbox */}
                                                <FormItem
                                                    label="Timezone"
                                                    className="flex items-center gap-2"
                                                >
                                                    <Checkbox
                                                        checked={
                                                            clause.timezone ||
                                                            false
                                                        }
                                                        disabled={readOnly}
                                                        onChange={(
                                                            e: boolean,
                                                        ) =>
                                                            handleFieldChange(
                                                                index,
                                                                clause.id,
                                                                'timezone',
                                                                e,
                                                            )
                                                        }
                                                    />
                                                    <span className="text-sm">
                                                        Timezone
                                                    </span>
                                                </FormItem>
                                            </div>
                                        </div>
                                    )
                                },
                            )}
                        </div>
                    )}

                    {/* Recursive Child Section */}
                    {watchedChildren[index]?.isChild &&
                        watchedChildren[index]?.children && (
                            <ChildSection
                                control={control}
                                errors={errors}
                                readOnly={readOnly}
                                parentPath={`${parentPath}.children.${index}`}
                                level={level + 1}
                                categoryOptions={categoryOptions}
                                documentOptions={documentOptions}
                                getFilteredDocumentOptions={
                                    getFilteredDocumentOptions
                                }
                            />
                        )}
                </div>
            ))}
        </div>
    )
}

const StandardSection = ({ control, errors, readOnly }: any) => {
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'standards',
    })

    const watchedStandards = useWatch({
        control,
        name: 'standards',
        defaultValue: [],
    })

    // Hooks for category and document lists
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

    // Get filtered document options based on selected category
    const getFilteredDocumentOptions = (selectedCategory: string) => {
        if (!selectedCategory) {
            return documentOptions
        }
        return documentOptions.filter(
            (doc: any) => doc.category === selectedCategory,
        )
    }

    useEffect(() => {
        if (fields.length === 0) {
            append({
                title: '',
                message: '',
                isNote: false,
                isChild: false,
                count: 0,
                children: [],
                notes: [],
                fields: [],
            })
        }
    }, [append, fields])

    useEffect(() => {
        if (!watchedStandards) return

        watchedStandards.forEach((standard: any, index: number) => {
            if (standard?.isChild && standard?.count > 0) {
                const currentCount = standard.count || 0
                const currentChildren = standard.children || []

                if (currentCount > currentChildren.length) {
                    const childrenToAdd = currentCount - currentChildren.length
                    const newChildren = [...currentChildren]

                    for (let i = 0; i < childrenToAdd; i++) {
                        newChildren.push({
                            title: '',
                            message: '',
                            isNote: false,
                            isChild: false,
                            count: 0,
                            children: [],
                            notes: [],
                            fields: [],
                        })
                    }

                    const updatedStandard = {
                        ...standard,
                        children: newChildren,
                    }

                    remove(index)
                    append(updatedStandard, { shouldFocus: false })
                } else if (currentCount < currentChildren.length) {
                    const newChildren = currentChildren.slice(0, currentCount)
                    const updatedStandard = {
                        ...standard,
                        children: newChildren,
                    }

                    remove(index)
                    append(updatedStandard, { shouldFocus: false })
                }
            } else if (
                !standard?.isChild &&
                standard?.children &&
                standard.children.length > 0
            ) {
                const updatedStandard = {
                    ...standard,
                    children: [],
                }

                remove(index)
                append(updatedStandard, { shouldFocus: false })
            }

            // Handle notes array initialization
            if (
                standard?.isNote &&
                (!standard.notes || standard.notes.length === 0)
            ) {
                const updatedStandard = {
                    ...standard,
                    notes: [{ id: Date.now(), content: '' }],
                }

                remove(index)
                append(updatedStandard, { shouldFocus: false })
            } else if (
                !standard?.isNote &&
                standard?.notes &&
                standard.notes.length > 0
            ) {
                const updatedStandard = {
                    ...standard,
                    notes: [],
                }

                remove(index)
                append(updatedStandard, { shouldFocus: false })
            }

            // Handle fields array initialization
            if (
                standard?.isNote &&
                (!standard.fields || standard.fields.length === 0)
            ) {
                const updatedStandard = {
                    ...standard,
                    fields: [
                        {
                            id: Date.now(),
                            category: '',
                            documentName: '',
                            frequency: '',
                            isRequired: false,
                            timezone: false,
                        },
                    ],
                }

                remove(index)
                append(updatedStandard, { shouldFocus: false })
            } else if (
                !standard?.isNote &&
                standard?.fields &&
                standard.fields.length > 0
            ) {
                const updatedStandard = {
                    ...standard,
                    fields: [],
                }

                remove(index)
                append(updatedStandard, { shouldFocus: false })
            }
        })
    }, [watchedStandards, append, remove])

    const handleAddSection = () => {
        append({
            title: '',
            message: '',
            isNote: false,
            isChild: false,
            count: 0,
            children: [],
            notes: [],
            fields: [],
        })
    }

    const handleAddNote = (parentIndex: number) => {
        const currentStandard = watchedStandards[parentIndex]
        const updatedStandard = {
            ...currentStandard,
            notes: [
                ...(currentStandard.notes || []),
                { id: Date.now(), content: '' },
            ],
        }

        remove(parentIndex)
        append(updatedStandard, { shouldFocus: false })
    }

    const handleDeleteNote = (parentIndex: number, noteId: number) => {
        const currentStandard = watchedStandards[parentIndex]
        const updatedNotes = (currentStandard.notes || []).filter(
            (note: any) => note.id !== noteId,
        )

        const updatedStandard = {
            ...currentStandard,
            notes: updatedNotes,
        }

        remove(parentIndex)
        append(updatedStandard, { shouldFocus: false })
    }

    const handleNoteChange = (
        parentIndex: number,
        noteId: number,
        content: string,
    ) => {
        const currentStandard = watchedStandards[parentIndex]
        const updatedNotes = (currentStandard.notes || []).map((note: any) =>
            note.id === noteId ? { ...note, content } : note,
        )

        const updatedStandard = {
            ...currentStandard,
            notes: updatedNotes,
        }

        remove(parentIndex)
        append(updatedStandard, { shouldFocus: false })
    }

    const handleAddField = (parentIndex: number) => {
        const currentStandard = watchedStandards[parentIndex]
        const updatedStandard = {
            ...currentStandard,
            fields: [
                ...(currentStandard.fields || []),
                {
                    id: Date.now(),
                    category: '',
                    documentName: '',
                    frequency: '',
                    isRequired: false,
                    timezone: false,
                },
            ],
        }

        remove(parentIndex)
        append(updatedStandard, { shouldFocus: false })
    }

    const handleDeleteField = (parentIndex: number, clauseId: number) => {
        const currentStandard = watchedStandards[parentIndex]
        const updatedFields = (currentStandard.fields || []).filter(
            (clause: any) => clause.id !== clauseId,
        )

        const updatedStandard = {
            ...currentStandard,
            fields: updatedFields,
        }

        remove(parentIndex)
        append(updatedStandard, { shouldFocus: false })
    }

    const handleFieldChange = (
        parentIndex: number,
        clauseId: number,
        field: string,
        value: any,
    ) => {
        const currentStandard = watchedStandards[parentIndex]
        let updatedFields

        if (
            field === 'category' &&
            value !==
                currentStandard.fields.find((c: any) => c.id === clauseId)
                    ?.category
        ) {
            // If category changes, clear documentName
            updatedFields = (currentStandard.fields || []).map((clause: any) =>
                clause.id === clauseId
                    ? {
                          ...clause,
                          category: value,
                          documentName: '',
                      }
                    : clause,
            )
        } else {
            updatedFields = (currentStandard.fields || []).map((clause: any) =>
                clause.id === clauseId ? { ...clause, [field]: value } : clause,
            )
        }

        const updatedStandard = {
            ...currentStandard,
            fields: updatedFields,
        }

        remove(parentIndex)
        append(updatedStandard, { shouldFocus: false })
    }

    return (
        <Card>
            <h4 className="mb-6 text-lg font-semibold">Standard</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
                <FormItem
                    label="Name"
                    invalid={Boolean(errors.name)}
                    errorMessage={errors.name?.message}
                >
                    <Controller
                        name="name"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <Input
                                type="text"
                                placeholder="Enter Name"
                                readOnly={readOnly}
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Unique Id"
                    invalid={Boolean(errors.id)}
                    errorMessage={errors.id?.message}
                >
                    <Controller
                        name="id"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <Input
                                type="text"
                                placeholder="Enter Unique Id"
                                readOnly={readOnly}
                                {...field}
                            />
                        )}
                    />
                </FormItem>
            </div>

            <div className="flex justify-end mb-4">
                <Button
                    size="sm"
                    type="button"
                    disabled={readOnly}
                    onClick={handleAddSection}
                >
                    <HiPlus className="text-lg" />
                </Button>
            </div>

            {fields.map((field, index) => (
                <div key={field.id} className="border rounded-lg p-4 mb-6">
                    <div className="grid md:grid-cols-2 gap-4">
                        <FormItem
                            label="Title"
                            invalid={Boolean(errors?.standards?.[index]?.title)}
                            errorMessage={
                                errors?.standards?.[index]?.title?.message
                            }
                        >
                            <Controller
                                name={`standards.${index}.title`}
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <Input
                                        type="text"
                                        placeholder="Enter Title"
                                        readOnly={readOnly}
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>

                        <FormItem
                            label="Message"
                            invalid={Boolean(
                                errors?.standards?.[index]?.message,
                            )}
                            errorMessage={
                                errors?.standards?.[index]?.message?.message
                            }
                        >
                            <Controller
                                name={`standards.${index}.message`}
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <Input
                                        textArea
                                        rows={3}
                                        placeholder="Write your message..."
                                        readOnly={readOnly}
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>
                    </div>

                    <div className="flex items-center gap-6 flex-wrap mt-4">
                        <FormItem label="Note">
                            <Controller
                                name={`standards.${index}.isNote`}
                                control={control}
                                defaultValue={false}
                                render={({ field }) => (
                                    <Checkbox
                                        checked={field.value || false}
                                        disabled={readOnly}
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>

                        <FormItem label="Child">
                            <Controller
                                name={`standards.${index}.isChild`}
                                control={control}
                                defaultValue={false}
                                render={({ field }) => (
                                    <Checkbox
                                        checked={field.value || false}
                                        disabled={readOnly}
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>

                        <FormItem label="Count">
                            <Controller
                                name={`standards.${index}.count`}
                                control={control}
                                defaultValue={0}
                                render={({ field }) => (
                                    <Input
                                        type="number"
                                        className="w-24"
                                        placeholder="0"
                                        readOnly={readOnly}
                                        value={field.value || 0}
                                        onChange={(e) => {
                                            field.onChange(
                                                parseInt(e.target.value) || 0,
                                            )
                                        }}
                                    />
                                )}
                            />
                        </FormItem>
                    </div>

                    {/* Notes Section for Parent */}
                    {watchedStandards[index]?.isNote && (
                        <div className="mt-6 space-y-6">
                            {/* Notes Subsection */}
                            <div className="border-t pt-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h5 className="font-semibold">Notes</h5>
                                    <Button
                                        size="sm"
                                        type="button"
                                        disabled={readOnly}
                                        onClick={() => handleAddNote(index)}
                                    >
                                        <HiPlus className="text-lg" />
                                    </Button>
                                </div>

                                {watchedStandards[index]?.notes?.map(
                                    (note: any, noteIndex: number) => (
                                        <div
                                            key={note.id}
                                            className="border rounded-lg p-4 mb-4 bg-gray-50"
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <h6 className="font-medium">
                                                    Note {noteIndex + 1}
                                                </h6>
                                                {watchedStandards[index].notes
                                                    .length > 1 && (
                                                    <Button
                                                        size="sm"
                                                        type="button"
                                                        variant="solid"
                                                        color="red"
                                                        disabled={readOnly}
                                                        onClick={() =>
                                                            handleDeleteNote(
                                                                index,
                                                                note.id,
                                                            )
                                                        }
                                                    >
                                                        <HiTrash className="text-lg" />
                                                    </Button>
                                                )}
                                            </div>

                                            <FormItem>
                                                <Input
                                                    textArea
                                                    rows={3}
                                                    placeholder="Write your note..."
                                                    readOnly={readOnly}
                                                    value={note.content || ''}
                                                    onChange={(e) =>
                                                        handleNoteChange(
                                                            index,
                                                            note.id,
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </FormItem>
                                        </div>
                                    ),
                                )}
                            </div>

                            {/* Fields Subsection */}
                            {watchedStandards[index]?.isNote && (
                                <div className="border-t pt-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <h5 className="font-semibold">
                                            Fields
                                        </h5>
                                        <Button
                                            size="sm"
                                            type="button"
                                            disabled={readOnly}
                                            onClick={() =>
                                                handleAddField(index)
                                            }
                                        >
                                            <HiPlus className="text-lg" />
                                        </Button>
                                    </div>

                                    {watchedStandards[index]?.fields?.map(
                                        (clause: any, clauseIndex: number) => {
                                            const filteredDocumentOptions =
                                                getFilteredDocumentOptions(
                                                    clause.category,
                                                )

                                            return (
                                                <div
                                                    key={clause.id}
                                                    className="border rounded-lg p-4 mb-4 bg-gray-50"
                                                >
                                                    <div className="flex justify-between items-center mb-4">
                                                        <h6 className="font-medium">
                                                            Field{' '}
                                                            {clauseIndex + 1}
                                                        </h6>
                                                        {watchedStandards[index]
                                                            .fields.length >
                                                            1 && (
                                                            <Button
                                                                size="sm"
                                                                type="button"
                                                                variant="solid"
                                                                color="red"
                                                                disabled={
                                                                    readOnly
                                                                }
                                                                onClick={() =>
                                                                    handleDeleteField(
                                                                        index,
                                                                        clause.id,
                                                                    )
                                                                }
                                                            >
                                                                <HiTrash className="text-lg" />
                                                            </Button>
                                                        )}
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                                        {/* Category - Select */}
                                                        <FormItem label="Category">
                                                            <Select
                                                                value={
                                                                    categoryOptions.find(
                                                                        (
                                                                            o: any,
                                                                        ) =>
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
                                                                onChange={(
                                                                    val: any,
                                                                ) =>
                                                                    handleFieldChange(
                                                                        index,
                                                                        clause.id,
                                                                        'category',
                                                                        val?.value ||
                                                                            '',
                                                                    )
                                                                }
                                                            />
                                                        </FormItem>

                                                        {/* Document Name - Select */}
                                                        <FormItem label="Document Name">
                                                            <Select
                                                                value={
                                                                    filteredDocumentOptions.find(
                                                                        (
                                                                            o: any,
                                                                        ) =>
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
                                                                        : 'Select category first'
                                                                }
                                                                isDisabled={
                                                                    readOnly ||
                                                                    !clause.category
                                                                }
                                                                menuPortalTarget={
                                                                    document.body
                                                                }
                                                                menuPosition="fixed"
                                                                onChange={(
                                                                    val: any,
                                                                ) =>
                                                                    handleFieldChange(
                                                                        index,
                                                                        clause.id,
                                                                        'documentName',
                                                                        val?.value ||
                                                                            '',
                                                                    )
                                                                }
                                                            />
                                                        </FormItem>

                                                        {/* Frequency - Select */}
                                                        <FormItem label="Frequency">
                                                            <Select
                                                                value={
                                                                    frequencyOptions.find(
                                                                        (
                                                                            o: any,
                                                                        ) =>
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
                                                                onChange={(
                                                                    val: any,
                                                                ) =>
                                                                    handleFieldChange(
                                                                        index,
                                                                        clause.id,
                                                                        'frequency',
                                                                        val?.value ||
                                                                            '',
                                                                    )
                                                                }
                                                            />
                                                        </FormItem>

                                                        {/* Required - Checkbox */}
                                                        <FormItem
                                                            label="Required"
                                                            className="flex items-center gap-2"
                                                        >
                                                            <Checkbox
                                                                checked={
                                                                    clause.isRequired ||
                                                                    false
                                                                }
                                                                disabled={
                                                                    readOnly
                                                                }
                                                                onChange={(
                                                                    e: boolean,
                                                                ) =>
                                                                    handleFieldChange(
                                                                        index,
                                                                        clause.id,
                                                                        'isRequired',
                                                                        e,
                                                                    )
                                                                }
                                                            />
                                                            <span className="text-sm">
                                                                Required
                                                            </span>
                                                        </FormItem>

                                                        {/* Timezone - Checkbox */}
                                                        <FormItem
                                                            label="Timezone"
                                                            className="flex items-center gap-2"
                                                        >
                                                            <Checkbox
                                                                checked={
                                                                    clause.timezone ||
                                                                    false
                                                                }
                                                                disabled={
                                                                    readOnly
                                                                }
                                                                onChange={(
                                                                    e: boolean,
                                                                ) =>
                                                                    handleFieldChange(
                                                                        index,
                                                                        clause.id,
                                                                        'timezone',
                                                                        e,
                                                                    )
                                                                }
                                                            />
                                                            <span className="text-sm">
                                                                Timezone
                                                            </span>
                                                        </FormItem>
                                                    </div>
                                                </div>
                                            )
                                        },
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Child Section (Recursive) */}
                    {watchedStandards[index]?.isChild && (
                        <ChildSection
                            control={control}
                            errors={errors}
                            readOnly={readOnly}
                            parentPath={`standards.${index}`}
                            level={0}
                            categoryOptions={categoryOptions}
                            documentOptions={documentOptions}
                            getFilteredDocumentOptions={
                                getFilteredDocumentOptions
                            }
                        />
                    )}
                </div>
            ))}
        </Card>
    )
}

export default StandardSection
