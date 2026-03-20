/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState, Fragment } from 'react'
import {
    Controller,
    useFieldArray,
    useFormContext,
    useWatch,
} from 'react-hook-form'
import Card from '@/components/ui/Card'
import { FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import Menu from '@/components/ui/Menu'
import { HiPlus } from 'react-icons/hi'
import { TbTrash } from 'react-icons/tb'
import { OverviewSectionProps } from '@/@types/clauses'
import { ClausesFormSchema } from '@/schemas/clauses.schema'

type DocumentOption = {
    value: string
    label: string
    category_id: string
    document: any
}

const OverviewSection = ({
    readOnly,
    accordionData,
    categoryList,
    documentList,
    standardId,
}: OverviewSectionProps) => {
    const {
        control,
        setValue,
        formState: { errors },
    } = useFormContext<ClausesFormSchema>()
    console.log(errors)

    const documentOptions = useMemo<DocumentOption[]>(
        () =>
            documentList.map((doc: any) => ({
                value: doc.id,
                label: doc.name,
                category_id: doc.category_id,
                document: doc,
            })),
        [documentList],
    )

    const documentsByCategory = useMemo(() => {
        return documentOptions.reduce<Record<string, DocumentOption[]>>(
            (acc, doc) => {
                if (!doc.category_id) return acc
                acc[doc.category_id] ??= []
                acc[doc.category_id].push(doc)
                return acc
            },
            {},
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

    const [expanded, setExpanded] = useState<Set<string>>(new Set())

    const toggleAccordion = (isOpen: boolean, e: React.SyntheticEvent) => {
        const id = String((e.currentTarget as HTMLElement).dataset.id)
        setExpanded((prev) => {
            const next = new Set(prev)
            isOpen ? next.add(id) : next.delete(id)
            return next
        })
    }

    const ClauseDocuments = ({ clauseIndex }: { clauseIndex: number }) => {
        const { fields, append, remove } = useFieldArray({
            control,
            name: `standard_clauses.${clauseIndex}.clause_documents_tagging`,
        })

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

                <div className="flex justify-between items-center mt-4">
                    <h4>Assign Documents</h4>

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

                <div className="grid gap-4 mt-4">
                    {fields.map((fieldItem, index) => {
                        const selectedCategoryId = useWatch({
                            control,
                            name: `standard_clauses.${clauseIndex}.clause_documents_tagging.${index}.category_id`,
                        })

                        const availableDocs =
                            selectedCategoryId &&
                            documentsByCategory[String(selectedCategoryId)]
                                ? documentsByCategory[
                                      String(selectedCategoryId)
                                  ]
                                : []

                        const selectedDoc = useWatch({
                            control,
                            name: `standard_clauses.${clauseIndex}.clause_documents_tagging.${index}.documents`,
                        })

                        const getFrequencyText = () => {
                            if (!selectedDoc) return '—'

                            const parts: string[] = []

                            // Review frequency
                            if (selectedDoc.review_frequency) {
                                parts.push(
                                    `Review: ${selectedDoc.review_frequency} (${selectedDoc.notification_value} ${selectedDoc.notification_unit})`,
                                )
                            }

                            // Data entry frequency
                            if (selectedDoc.schedule) {
                                const s = selectedDoc.schedule

                                let entryText = `Entry: ${s.type} (every ${s.count})`

                                if (s.cutOffTimes?.length) {
                                    entryText += ` @ ${s.cutOffTimes.join(', ')}`
                                }

                                parts.push(entryText)
                            }

                            return parts.join(' | ')
                        }

                        return (
                            <div
                                key={fieldItem.id}
                                className="grid grid-cols-4 gap-3 items-end"
                            >
                                {/* Category */}
                                <FormItem label="Category">
                                    <Controller
                                        name={`standard_clauses.${clauseIndex}.clause_documents_tagging.${index}.category_id`}
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                classNamePrefix="react-select"
                                                options={categoryOptions}
                                                isDisabled={readOnly}
                                                menuPortalTarget={document.body}
                                                menuPosition="fixed"
                                                styles={{
                                                    menuPortal: (base) => ({
                                                        ...base,
                                                        zIndex: 9999,
                                                    }),
                                                    menu: (base) => ({
                                                        ...base,
                                                        zIndex: 9999,
                                                    }),
                                                }}
                                                value={categoryOptions.find(
                                                    (opt: any) =>
                                                        opt.value ===
                                                        field.value,
                                                )}
                                                onChange={(option: any) => {
                                                    field.onChange(
                                                        option?.value ?? '',
                                                    )
                                                    setValue(
                                                        `standard_clauses.${clauseIndex}.clause_documents_tagging.${index}.documents`,
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

                                {/* Document */}
                                <FormItem label="Document">
                                    <Controller
                                        name={`standard_clauses.${clauseIndex}.clause_documents_tagging.${index}.documents`}
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                classNamePrefix="react-select"
                                                options={availableDocs}
                                                menuPortalTarget={document.body}
                                                menuPosition="fixed"
                                                styles={{
                                                    menuPortal: (base) => ({
                                                        ...base,
                                                        zIndex: 9999,
                                                    }),
                                                    menu: (base) => ({
                                                        ...base,
                                                        zIndex: 9999,
                                                    }),
                                                }}
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
                                                isDisabled={
                                                    readOnly ||
                                                    !selectedCategoryId
                                                }
                                                onChange={(option: any) => {
                                                    const doc = option?.document
                                                    field.onChange(
                                                        doc
                                                            ? {
                                                                  id: doc.id,
                                                                  version_id:
                                                                      doc
                                                                          ?.current_version
                                                                          ?.id ??
                                                                      '',
                                                                  label: doc.name,

                                                                  review_frequency:
                                                                      doc
                                                                          ?.current_version
                                                                          ?.review_frequency,
                                                                  notification_unit:
                                                                      doc
                                                                          ?.current_version
                                                                          ?.notification_unit,
                                                                  notification_value:
                                                                      doc
                                                                          ?.current_version
                                                                          ?.notification_value,
                                                                  schedule:
                                                                      doc
                                                                          ?.current_version
                                                                          ?.schedule,
                                                              }
                                                            : {
                                                                  id: '',
                                                                  version_id:
                                                                      '',
                                                                  label: '',
                                                                  review_frequency:
                                                                      '',
                                                                  notification_unit:
                                                                      '',
                                                                  notification_value:
                                                                      '',
                                                                  schedule:
                                                                      null,
                                                              },
                                                    )
                                                }}
                                            />
                                        )}
                                    />
                                </FormItem>

                                <FormItem label="Frequency">
                                    <div className="h-10 flex items-center px-3 text-sm text-gray">
                                        {getFrequencyText()}
                                    </div>
                                </FormItem>

                                <FormItem>
                                    {!readOnly && index > 0 && (
                                        <Button
                                            type="button"
                                            variant="solid"
                                            size="xs"
                                            icon={<TbTrash />}
                                            className="bg-red-500 hover:bg-red-600 mb-2"
                                            onClick={() => remove(index)}
                                        />
                                    )}
                                </FormItem>
                            </div>
                        )
                    })}
                </div>
            </>
        )
    }

    const renderClauses = (
        clauses: any[],
        clauseIndexRef: { current: number },
    ) =>
        clauses.map((clause) => {
            const clauseIndex = clauseIndexRef.current++

            return (
                <Fragment key={clause.id}>
                    <Menu.MenuCollapse
                        data-id={clause.id}
                        eventKey={clause.id}
                        expanded={expanded.has(clause.id)}
                        label={
                            clause.numbering_value
                                ? `${clause.numbering_value} ${clause.title}`
                                : clause.title
                        }
                        onToggle={toggleAccordion}
                    >
                        <div className="bg-blue-50 border border-blue-200 p-4 mt-4 rounded-lg">
                            <p className="text-blue-800 text-sm leading-relaxed whitespace-pre-line">
                                {clause.message}
                            </p>
                        </div>

                        <Controller
                            name={`standard_clauses.${clauseIndex}.clause_id`}
                            control={control}
                            defaultValue={Number(clause.id)}
                            render={({ field }) => (
                                <Input {...field} type="hidden" />
                            )}
                        />

                        <Controller
                            name={`standard_clauses.${clauseIndex}.clause_parent_id`}
                            control={control}
                            defaultValue={
                                clause.parent_id
                                    ? Number(clause.parent_id)
                                    : undefined
                            }
                            render={({ field }) => (
                                <Input {...field} type="hidden" />
                            )}
                        />

                        <ClauseDocuments clauseIndex={clauseIndex} />

                        {clause.children?.length > 0 &&
                            renderClauses(clause.children, clauseIndexRef)}
                    </Menu.MenuCollapse>
                </Fragment>
            )
        })

    return (
        <Card>
            <Menu>
                <Controller
                    name="standard_id"
                    control={control}
                    defaultValue={Number(standardId)}
                    render={({ field }) => <Input {...field} type="hidden" />}
                />
                {renderClauses(accordionData, { current: 0 })}
            </Menu>
        </Card>
    )
}

export default OverviewSection
