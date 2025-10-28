/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo } from 'react'
import Card from '@/components/ui/Card'
import { FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Checkbox from '@/components/ui/Checkbox'
import { Controller, useFieldArray, useWatch } from 'react-hook-form'
import { HiPlus } from 'react-icons/hi'
import useCategoryList from '../../category/List/hooks/useList'
import useDocumentList from '../../document/List/hooks/useList'
import SectionHeader from './components/SectionHeader'
import NoteItem from './components/NoteItem'
import FieldItem from './components/FieldItem'

const frequencyOptions = [
    { label: 'Daily', value: 'Daily' },
    { label: 'Weekly', value: 'Weekly' },
    { label: 'Monthly', value: 'Monthly' },
]

const StandardSectionTwo = ({ control, errors, readOnly }: any) => {
    const { fields, append, update } = useFieldArray({
        control,
        name: 'standards',
    })

    const watchedStandards = useWatch({
        control,
        name: 'standards',
        defaultValue: [],
    })

    const { categoryList } = useCategoryList()
    const { documentList } = useDocumentList()

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
                notes: [{ id: Date.now(), content: '' }],
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
            })
        }
    }, [fields.length, append])

    const handleAddSection = () => {
        append({
            title: '',
            message: '',
            isNote: false,
            isChild: false,
            count: 0,
            children: [
                {
                    title: '',
                    message: '',
                    isNote: false,
                    isChild: false,
                    count: 0,
                    children: [],
                    notes: [{ id: Date.now(), content: '' }],
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
                },
            ],
            notes: [{ id: Date.now(), content: '' }],
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
        })
    }

    const handleAddNote = (parentIndex: number) => {
        const currentStandard = watchedStandards?.[parentIndex]
        if (!currentStandard) return

        const updatedStandard = {
            ...currentStandard,
            notes: [
                ...(currentStandard.notes || []),
                { id: Date.now(), content: '' },
            ],
        }

        update(parentIndex, updatedStandard)
    }

    const handleDeleteNote = (parentIndex: number, noteId: number) => {
        const currentStandard = watchedStandards?.[parentIndex]
        if (!currentStandard) return

        const updatedNotes = (currentStandard.notes || []).filter(
            (note: any) => note.id !== noteId,
        )
        update(parentIndex, {
            ...currentStandard,
            notes: updatedNotes,
        })
    }

    const handleNoteChange = (
        parentIndex: number,
        noteId: number,
        content: string,
    ) => {
        const currentStandard = watchedStandards?.[parentIndex]
        if (!currentStandard) return

        const updatedNotes = (currentStandard.notes || []).map((note: any) =>
            note.id === noteId ? { ...note, content } : note,
        )

        update(parentIndex, {
            ...currentStandard,
            notes: updatedNotes,
        })
    }

    const handleAddField = (parentIndex: number) => {
        const currentStandard = watchedStandards?.[parentIndex]
        if (!currentStandard) return

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

        update(parentIndex, updatedStandard)
    }

    const handleDeleteField = (parentIndex: number, fieldId: number) => {
        const currentStandard = watchedStandards?.[parentIndex]
        if (!currentStandard) return

        const updatedFields = (currentStandard.fields || []).filter(
            (f: any) => f.id !== fieldId,
        )

        update(parentIndex, {
            ...currentStandard,
            fields: updatedFields,
        })
    }

    // ✅ Edit field data
    const handleFieldChange = (
        parentIndex: number,
        fieldId: number,
        key: string,
        value: any,
    ) => {
        const currentStandard = watchedStandards?.[parentIndex]
        if (!currentStandard) return

        const updatedFields = (currentStandard.fields || []).map(
            (field: any) =>
                field.id === fieldId
                    ? {
                          ...field,
                          [key]: key === 'category' ? value : field[key],
                          ...(key === 'category' ? { documentName: '' } : {}),
                      }
                    : field,
        )

        update(parentIndex, {
            ...currentStandard,
            fields: updatedFields,
        })
    }

    return (
        <>
            <Button
                size="sm"
                type="button"
                disabled={readOnly}
                className="sticky top-[68px] z-40 left-[1366px] mb-2"
                style={{ width: '45px' }}
                onClick={handleAddSection}
            >
                <HiPlus className="text-lg" />
            </Button>
            {fields.map((field, index) => (
                <Card key={field.id}>
                    <FormItem
                        label="Clause Title"
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
                        label="Clause Message"
                        invalid={Boolean(errors?.standards?.[index]?.message)}
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
                    <div className="flex gap-6 mb-4">
                        <FormItem
                            label="Note"
                            invalid={Boolean(
                                errors?.standards?.[index]?.isNote,
                            )}
                            errorMessage={
                                errors?.standards?.[index]?.isNote?.message
                            }
                        >
                            <Controller
                                name={`standards.${index}.isNote`}
                                control={control}
                                defaultValue={false}
                                render={({ field }) => {
                                    console.log(field)
                                    return (
                                        <Checkbox
                                            checked={field.value || false}
                                            disabled={readOnly}
                                            {...field}
                                        />
                                    )
                                }}
                            />
                        </FormItem>

                        <FormItem
                            label="Child"
                            invalid={Boolean(
                                errors?.standards?.[index]?.isChild,
                            )}
                            errorMessage={
                                errors?.standards?.[index]?.isChild?.message
                            }
                        >
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

                        <FormItem
                            label="Count"
                            invalid={Boolean(errors?.standards?.[index]?.count)}
                            errorMessage={
                                errors?.standards?.[index]?.count?.message
                            }
                        >
                            <Controller
                                name={`standards.${index}.count`}
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        size="sm"
                                        readOnly={readOnly}
                                        value={field.value}
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
                    <div className="mt-2 space-y-2">
                        {watchedStandards[index]?.isNote && (
                            <div>
                                {/* Notes Section */}
                                <SectionHeader
                                    title="Notes"
                                    disabled={readOnly}
                                    onAdd={() => handleAddNote(index)}
                                />

                                {watchedStandards[index]?.notes?.map(
                                    (note: any, noteIndex: number) => (
                                        <NoteItem
                                            key={note.id}
                                            note={note}
                                            noteIndex={noteIndex}
                                            readOnly={readOnly}
                                            multiple={
                                                watchedStandards[index].notes
                                                    .length > 1
                                            }
                                            onDelete={() =>
                                                handleDeleteNote(index, note.id)
                                            }
                                            onChange={(value: string) =>
                                                handleNoteChange(
                                                    index,
                                                    note.id,
                                                    value,
                                                )
                                            }
                                        />
                                    ),
                                )}

                                {/* Fields Section */}
                                <SectionHeader
                                    title="Fields"
                                    disabled={readOnly}
                                    onAdd={() => handleAddField(index)}
                                />

                                {watchedStandards[index]?.fields?.map(
                                    (clause: any, clauseIndex: number) => (
                                        <FieldItem
                                            key={clause.id}
                                            clause={clause}
                                            clauseIndex={clauseIndex}
                                            categoryOptions={categoryOptions}
                                            frequencyOptions={frequencyOptions}
                                            getFilteredDocumentOptions={
                                                getFilteredDocumentOptions
                                            }
                                            readOnly={readOnly}
                                            multiple={
                                                watchedStandards[index].fields
                                                    .length > 1
                                            }
                                            standardIndex={index}
                                            onChange={handleFieldChange}
                                            onDelete={() =>
                                                handleDeleteField(
                                                    index,
                                                    clause.id,
                                                )
                                            }
                                        />
                                    ),
                                )}
                            </div>
                        )}
                    </div>
                </Card>
            ))}
        </>
    )
}

export default StandardSectionTwo
