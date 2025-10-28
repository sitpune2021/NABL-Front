/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller } from 'react-hook-form'
import { Card, Checkbox, FormItem, Input } from '@/components/ui'
import SectionHeader from './SectionHeader'
import NoteItem from './NoteItem'
import FieldItem from './FieldItem'
import StandardRecursiveSection from '../StandardRecursiveSection'

interface StandardCardProps {
    index: number
    standard: any
    errors: any
    readOnly: boolean
    control: any
    watchedStandards: any
    categoryOptions: any[]
    frequencyOptions: any[]
    getFilteredDocumentOptions: (input: string) => any[]
    handleAddNote: (index: number) => void
    handleDeleteNote: (standardIndex: number, noteId: number) => void
    handleNoteChange: (
        standardIndex: number,
        noteId: number,
        value: string,
    ) => void
    handleAddField: (index: number) => void
    handleFieldChange: (
        standardIndex: number,
        fieldId: number,
        key: string,
        value: any,
    ) => void
    handleDeleteField: (standardIndex: number, fieldId: number) => void
    baseName?: string
    depth?: number
}

const StandardCard: React.FC<StandardCardProps> = ({
    index,
    standard,
    errors,
    readOnly,
    control,
    watchedStandards,
    categoryOptions,
    frequencyOptions,
    getFilteredDocumentOptions,
    handleAddNote,
    handleDeleteNote,
    handleNoteChange,
    handleAddField,
    handleFieldChange,
    handleDeleteField,
    baseName = 'standards',
    // depth = 0,
}) => {
    const path = `${baseName}.${index}`
    const current = watchedStandards?.[index]

    return (
        <Card key={standard.id} className={`mt-3`}>
            <FormItem
                label="Clause Title"
                invalid={Boolean(errors?.[path]?.title)}
                errorMessage={errors?.[path]?.title?.message}
            >
                <Controller
                    name={`${path}.title`}
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <Input
                            placeholder="Enter Title"
                            readOnly={readOnly}
                            {...field}
                        />
                    )}
                />
            </FormItem>

            <FormItem
                label="Clause Message"
                invalid={Boolean(errors?.[path]?.message)}
                errorMessage={errors?.[path]?.message?.message}
            >
                <Controller
                    name={`${path}.message`}
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
                <FormItem label="Note">
                    <Controller
                        name={`${path}.isNote`}
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
                        name={`${path}.isChild`}
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
                        name={`${path}.count`}
                        control={control}
                        render={({ field }) => (
                            <Input
                                size="sm"
                                readOnly={readOnly}
                                value={field.value}
                                onChange={(e) =>
                                    field.onChange(
                                        parseInt(e.target.value) || 0,
                                    )
                                }
                            />
                        )}
                    />
                </FormItem>
            </div>

            {/* Notes Section */}
            {current?.isNote && (
                <div className="mt-2 space-y-2">
                    <SectionHeader
                        title="Notes"
                        disabled={readOnly}
                        onAdd={() => handleAddNote(index)}
                    />
                    {current?.notes?.map((note: any) => (
                        <NoteItem
                            key={note.id}
                            note={note}
                            noteIndex={note.id}
                            readOnly={readOnly}
                            multiple={current.notes.length > 1}
                            onDelete={() => handleDeleteNote(index, note.id)}
                            onChange={(value: string) =>
                                handleNoteChange(index, note.id, value)
                            }
                        />
                    ))}

                    <SectionHeader
                        title="Fields"
                        disabled={readOnly}
                        onAdd={() => handleAddField(index)}
                    />
                    {current?.fields?.map((field: any) => (
                        <FieldItem
                            key={field.id}
                            clause={field}
                            clauseIndex={field.id}
                            categoryOptions={categoryOptions}
                            frequencyOptions={frequencyOptions}
                            getFilteredDocumentOptions={
                                getFilteredDocumentOptions
                            }
                            readOnly={readOnly}
                            multiple={current.fields.length > 1}
                            standardIndex={index}
                            baseName={`${baseName}.${index}`}
                            onChange={handleFieldChange}
                            onDelete={() => handleDeleteField(index, field.id)}
                        />
                    ))}
                </div>
            )}

            {/* Recursive Children Section Below Notes */}
            {current?.children?.length > 0 && (
                <StandardRecursiveSection
                    control={control}
                    name={`${path}.children`}
                    errors={errors}
                    readOnly={readOnly}
                    categoryOptions={categoryOptions}
                    frequencyOptions={frequencyOptions}
                    getFilteredDocumentOptions={getFilteredDocumentOptions}
                />
            )}
        </Card>
    )
}

export default StandardCard
