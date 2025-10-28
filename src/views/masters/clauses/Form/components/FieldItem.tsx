/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Card, Checkbox, FormItem, Select } from '@/components/ui'
import { HiTrash } from 'react-icons/hi'

interface FieldItemProps {
    clause: any
    clauseIndex: number
    categoryOptions: any[]
    frequencyOptions: any[]
    getFilteredDocumentOptions: (input: string) => any[]
    readOnly: boolean
    onChange: (
        standardIndex: number,
        fieldId: number,
        key: string,
        value: any,
    ) => void
    onDelete: () => void
    multiple: boolean
    standardIndex: number
    baseName?: string
}

const FieldItem = ({
    clause,
    clauseIndex,
    categoryOptions,
    frequencyOptions,
    getFilteredDocumentOptions,
    readOnly,
    onChange,
    onDelete,
    multiple,
    standardIndex,
    baseName = 'standards',
}: FieldItemProps) => {
    const filteredDocumentOptions = getFilteredDocumentOptions(clause.category)

    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <h6 className="font-medium">
                    Field {clauseIndex + 1}
                    {baseName && (
                        <span className="text-xs text-gray-400 ml-2">
                            ({baseName}.fields[{clauseIndex}])
                        </span>
                    )}
                </h6>

                {multiple && (
                    <Button
                        size="sm"
                        type="button"
                        variant="solid"
                        color="red"
                        disabled={readOnly}
                        onClick={onDelete}
                    >
                        <HiTrash className="text-lg" />
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {/* Category */}
                <FormItem label="Category">
                    <Select
                        value={
                            categoryOptions.find(
                                (o: any) => o.value === clause.category,
                            ) || null
                        }
                        options={categoryOptions}
                        placeholder="Select.."
                        isDisabled={readOnly}
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                        onChange={(val: any) =>
                            onChange(
                                standardIndex,
                                clause.id,
                                'category',
                                val?.value || '',
                            )
                        }
                    />
                </FormItem>

                {/* Document Name */}
                <FormItem label="Document Name">
                    <Select
                        value={
                            filteredDocumentOptions.find(
                                (o: any) => o.value === clause.documentName,
                            ) || null
                        }
                        options={filteredDocumentOptions}
                        placeholder={
                            clause.category
                                ? 'Select...'
                                : 'Select category first'
                        }
                        isDisabled={readOnly || !clause.category}
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                        onChange={(val: any) =>
                            onChange(
                                standardIndex,
                                clause.id,
                                'documentName',
                                val?.value || '',
                            )
                        }
                    />
                </FormItem>

                {/* Frequency */}
                <FormItem label="Frequency">
                    <Select
                        value={
                            frequencyOptions.find(
                                (o: any) => o.value === clause.frequency,
                            ) || null
                        }
                        options={frequencyOptions}
                        placeholder="Select.."
                        isDisabled={readOnly}
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                        onChange={(val: any) =>
                            onChange(
                                standardIndex,
                                clause.id,
                                'frequency',
                                val?.value || '',
                            )
                        }
                    />
                </FormItem>

                {/* Required */}
                <FormItem label="Required" className="flex items-center gap-2">
                    <Checkbox
                        checked={clause.isRequired || false}
                        disabled={readOnly}
                        onChange={(e: boolean) =>
                            onChange(standardIndex, clause.id, 'isRequired', e)
                        }
                    />
                    <span className="text-sm">Required</span>
                </FormItem>

                {/* Timezone */}
                <FormItem label="Timezone" className="flex items-center gap-2">
                    <Checkbox
                        checked={clause.timezone || false}
                        disabled={readOnly}
                        onChange={(e: boolean) =>
                            onChange(standardIndex, clause.id, 'timezone', e)
                        }
                    />
                    <span className="text-sm">Timezone</span>
                </FormItem>
            </div>
        </Card>
    )
}

export default FieldItem
