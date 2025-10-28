/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Checkbox, FormItem, Select } from '@/components/ui'
import { HiTrash } from 'react-icons/hi'

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
}: any) => {
    const filteredDocumentOptions = getFilteredDocumentOptions(clause.category)

    return (
        <div className="border rounded-lg p-4 mb-4 bg-gray-50">
            <div className="flex justify-between items-center mb-4">
                <h6 className="font-medium">Field {clauseIndex + 1}</h6>
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
        </div>
    )
}

export default FieldItem
