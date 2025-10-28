/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from 'react'
import { useFieldArray, useWatch } from 'react-hook-form'
import { HiPlus } from 'react-icons/hi'
import Button from '@/components/ui/Button'
import StandardCard from './components/StandardCard'

interface StandardRecursiveSectionProps {
    control: any
    name: string
    errors: any
    readOnly: boolean
    categoryOptions: any[]
    frequencyOptions: any[]
    getFilteredDocumentOptions: (selectedCategory: string) => any[]
    isRoot?: boolean
}

const createDefaultStandard = () => ({
    id: Date.now() + Math.random(), // unique
    title: '',
    message: '',
    isNote: false,
    isChild: false,
    count: 0,
    children: [],
    notes: [{ id: Date.now() + Math.random(), content: '' }],
    fields: [
        {
            id: Date.now() + Math.random(),
            category: '',
            documentName: '',
            frequency: '',
            isRequired: false,
            timezone: false,
        },
    ],
})

const StandardRecursiveSection = ({
    control,
    name,
    errors,
    readOnly,
    categoryOptions,
    frequencyOptions,
    getFilteredDocumentOptions,
    isRoot = false,
}: StandardRecursiveSectionProps) => {
    const { fields, append, update } = useFieldArray({ control, name })
    const watchedStandards = useWatch({ control, name, defaultValue: [] })
    const hasAppended = useRef(false)

    // Append default standard at root if empty
    useEffect(() => {
        if (isRoot && !hasAppended.current && fields.length === 0) {
            append(createDefaultStandard())
            hasAppended.current = true
        }
    }, [isRoot])

    // Watch isChild & count to sync children
    useEffect(() => {
        watchedStandards?.forEach((standard: any, index: number) => {
            if (!standard || !standard.isChild) return

            const currentChildren = standard.children || []
            const targetCount = standard.count || 0

            if (targetCount > currentChildren.length) {
                const extra = Array.from(
                    { length: targetCount - currentChildren.length },
                    () => createDefaultStandard(),
                )
                update(index, {
                    ...standard,
                    children: [...currentChildren, ...extra],
                })
            } else if (targetCount < currentChildren.length) {
                update(index, {
                    ...standard,
                    children: currentChildren.slice(0, targetCount),
                })
            }
        })
    }, [watchedStandards, update])

    // Handlers
    const handleAddSection = () => append(createDefaultStandard())

    const handleAddNote = (parentIndex: number) => {
        const current = watchedStandards?.[parentIndex]
        if (!current) return
        update(parentIndex, {
            ...current,
            notes: [
                ...(current.notes || []),
                { id: Date.now() + Math.random(), content: '' },
            ],
        })
    }

    const handleDeleteNote = (parentIndex: number, noteId: number) => {
        const current = watchedStandards?.[parentIndex]
        if (!current) return
        update(parentIndex, {
            ...current,
            notes: (current.notes || []).filter((n: any) => n.id !== noteId),
        })
    }

    const handleNoteChange = (
        parentIndex: number,
        noteId: number,
        content: string,
    ) => {
        const current = watchedStandards?.[parentIndex]
        if (!current) return
        const updatedNotes = (current.notes || []).map((n: any) =>
            n.id === noteId ? { ...n, content } : n,
        )
        update(parentIndex, { ...current, notes: updatedNotes })
    }

    const handleAddField = (parentIndex: number) => {
        const current = watchedStandards?.[parentIndex]
        if (!current) return
        update(parentIndex, {
            ...current,
            fields: [
                ...(current.fields || []),
                createDefaultStandard().fields[0],
            ],
        })
    }

    const handleDeleteField = (parentIndex: number, fieldId: number) => {
        const current = watchedStandards?.[parentIndex]
        if (!current) return
        update(parentIndex, {
            ...current,
            fields: (current.fields || []).filter((f: any) => f.id !== fieldId),
        })
    }

    const handleFieldChange = (
        parentIndex: number,
        fieldId: number,
        key: string,
        value: any,
    ) => {
        const current = watchedStandards?.[parentIndex]
        if (!current) return
        const updatedFields = (current.fields || []).map((f: any) =>
            f.id === fieldId
                ? {
                      ...f,
                      [key]: value,
                      ...(key === 'category' ? { documentName: '' } : {}),
                  }
                : f,
        )
        update(parentIndex, { ...current, fields: updatedFields })
    }

    return (
        <div>
            {isRoot && (
                <Button
                    size="sm"
                    type="button"
                    disabled={readOnly}
                    className="sticky top-[68px] z-40 left-[1366px]"
                    onClick={handleAddSection}
                >
                    <HiPlus className="text-lg" />
                </Button>
            )}

            {fields.map((field, index) => (
                <>
                    <StandardCard
                        index={index}
                        standard={field}
                        errors={errors}
                        readOnly={readOnly}
                        control={control}
                        watchedStandards={watchedStandards}
                        categoryOptions={categoryOptions}
                        frequencyOptions={frequencyOptions}
                        getFilteredDocumentOptions={getFilteredDocumentOptions}
                        handleAddNote={handleAddNote}
                        handleDeleteNote={handleDeleteNote}
                        handleNoteChange={handleNoteChange}
                        handleAddField={handleAddField}
                        handleFieldChange={handleFieldChange}
                        handleDeleteField={handleDeleteField}
                        baseName={name}
                        depth={isRoot ? 0 : 1}
                    />
                </>
            ))}
        </div>
    )
}

export default StandardRecursiveSection
