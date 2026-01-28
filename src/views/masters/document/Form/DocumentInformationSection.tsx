import { useMemo, useState } from 'react'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import {
    FormFieldConfig,
    FormSectionBaseProps,
    TemplateOption,
} from '@/@types/document'
import DynamicForm from '../List/components/DynamicForm'
import { useSessionUser } from '@/store/authStore'
import { mapToOptions } from '@/helpers/optionMappers'
import Section from '../List/components/Sections'
import { Switcher } from '@/components/ui'
import getMaxValue from '@/utils/maxValue'
import { useOverviewLogic } from '../List/hooks/useOverviewLogic'

const DocumentInformationSection = ({
    readOnly,
    categoryList,
    templateList,
    departmentList,
    isEdit = false,
}: FormSectionBaseProps) => {
    const { username } = useSessionUser((state) => state.user)
    const [selectedHeaderHtml, setSelectedHeaderHtml] = useState<string>('')
    const [selectedFooterHtml, setSelectedFooterHtml] = useState<string>('')

    const {
        documentMode,
        notificationUnitOptions,
        nextReviewDate,
        reviewNotificationDate,
        handleCategoryChange,
        handleDepartmentChange,
    } = useOverviewLogic({ categoryList })

    const categoryOptions = mapToOptions(categoryList, {
        value: 'id',
        label: (category) =>
            `${category.name.toUpperCase()} - ${category.identifier}`,
    })

    const departmentOptions = mapToOptions(departmentList, {
        value: 'id',
        label: (dept) => `${dept.name.toUpperCase()} - ${dept.identifier}`,
    })

    const headerTemplateOptions: TemplateOption[] = useMemo(() => {
        return (
            templateList
                ?.filter((t) => t.type === 'header')
                .map((t) => ({
                    value: t.id,
                    type: t.type,
                    current_version: t.current_version,
                    label: t.name,
                    html: t.template?.html || '',
                    css: t.template?.css || '',
                })) || []
        )
    }, [templateList])

    const footerTemplateOptions: TemplateOption[] = useMemo(() => {
        return (
            templateList
                ?.filter((t) => t.type === 'footer')
                .map((t) => ({
                    value: t.id,
                    type: t.type,
                    current_version: t.current_version,
                    label: t.name,
                    html: t.template?.html || '',
                    css: t.template?.css || '',
                })) || []
        )
    }, [templateList])

    const documentInformationFields: FormFieldConfig[] = [
        {
            name: 'category_id',
            label: 'Document Category',
            type: 'select',
            options: categoryOptions,
            onChange: handleCategoryChange,
        },
        {
            name: 'department',
            label: 'Applicable Department(s)',
            type: 'multiSelect',
            options: departmentOptions,
            onChange: handleDepartmentChange,
        },
        {
            name: 'number',
            label: 'Document Number',
            type: 'text',
            readOnly: true,
            placeholder: 'Document Number',
        },
        {
            name: 'name',
            label: 'Document Title',
            type: 'text',
            placeholder: 'Enter Document Title',
        },
        {
            name: 'status',
            label: 'Document Status',
            type: 'select',
            defaultValue: 'controlled',
            options: [
                { value: 'controlled', label: 'Controlled' },
                { value: 'uncontrolled', label: 'Uncontrolled' },
            ],
        },
        {
            name: 'mode',
            label: 'Document Mode',
            type: 'checkbox',
            defaultValue: 'create',
            condition: () => !isEdit,
            customRender: (field) => (
                <Switcher
                    checkedContent="create"
                    unCheckedContent="upload"
                    checked={field.value === 'create'}
                    onChange={(e) => {
                        field.onChange(e ? 'create' : 'upload')
                    }}
                />
            ),
        },
    ]

    const templateConfigurationFields: FormFieldConfig[] = [
        {
            name: 'header',
            label: 'Document Header Template',
            type: 'header',
            options: headerTemplateOptions,
        },
        {
            name: 'footer',
            label: 'Document Footer Template',
            type: 'footer',
            options: footerTemplateOptions,
        },
    ]

    const reviewField: FormFieldConfig[] = [
        {
            name: 'performed_date',
            label: 'Prepared Date',
            type: 'date',
            readOnly: true,
            defaultValue: new Date(),
            minDate: new Date(),
        },
        {
            name: 'effective_date',
            label: 'Effective Date',
            type: 'date',
            placeholder: 'Select Effective Date',
        },
        {
            name: 'review_frequency',
            label: 'Review Frequency',
            type: 'select',
            options: [
                { value: 'Weekly', label: 'Weekly' },
                { value: 'Monthly', label: 'Monthly' },
                { value: 'Yearly', label: 'Yearly' },
            ],
        },
        {
            name: 'notification_unit',
            label: 'Notification Unit',
            type: 'select',
            options: notificationUnitOptions,
            condition: (values) => !!values.review_frequency,
        },
        {
            name: 'notification_value',
            label: 'Notification Lead Time',
            type: 'number',
            placeholder: 'Enter value',
            condition: (values) => !!values.review_frequency,
            customRender: (field, formValues) => (
                <Input
                    type="number"
                    min={1}
                    max={getMaxValue(
                        formValues.review_frequency,
                        formValues.notification_unit,
                    )}
                    value={field.value || ''}
                    disabled={!formValues.notification_unit || readOnly}
                    onChange={(e) => {
                        const val = e.target.value
                        if (
                            !getMaxValue(
                                formValues.review_frequency,
                                formValues.notification_unit,
                            ) ||
                            Number(val) <=
                                getMaxValue(
                                    formValues.review_frequency,
                                    formValues.notification_unit,
                                )
                        ) {
                            field.onChange(val)
                        }
                    }}
                />
            ),
        },
    ]

    const preparationDetailFields: FormFieldConfig[] = [
        {
            name: 'performed_by',
            label: 'Prepared By',
            type: 'text',
            readOnly: true,
            defaultValue: username,
        },
        {
            name: 'copy_no',
            label: 'Copy Number',
            type: 'text',
            placeholder: 'Enter Copy Number',
        },
        {
            name: 'quantity_prepared',
            label: 'Prepared Quantity',
            type: 'number',
            placeholder: 'Prepared Quantity',
        },
    ]

    return (
        <>
            <div className="gap-4 flex flex-col flex-auto">
                <Section
                    title="Document Information"
                    fields={documentInformationFields}
                    readOnly={readOnly}
                />
                {documentMode == 'create' && (
                    <Section
                        title="Template Configuration"
                        fields={templateConfigurationFields}
                        readOnly={readOnly}
                        editorExtras={{
                            selectedHeaderHtml,
                            setSelectedHeaderHtml,
                            selectedFooterHtml,
                            setSelectedFooterHtml,
                        }}
                    />
                )}
            </div>
            <div className="md:w-[370px] gap-4 flex flex-col">
                <Card>
                    <h4 className="mb-6">Review Schedule</h4>
                    <div className="grid md:grid-cols-1 gap-4">
                        <DynamicForm fields={reviewField} readOnly={readOnly} />
                    </div>
                    {(nextReviewDate || reviewNotificationDate) && (
                        <div className="mt-4 p-4 rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-green-50 shadow-sm">
                            <div className="space-y-2 ml-2">
                                {nextReviewDate && (
                                    <div className="flex items-center text-green-700 gap-2">
                                        <span className="text-lg">✅</span>
                                        <span>
                                            <b>Next Review Date:</b>{' '}
                                            {nextReviewDate}
                                        </span>
                                    </div>
                                )}

                                {reviewNotificationDate && (
                                    <div className="flex items-center text-blue-700 gap-2">
                                        <span className="text-lg">🔔</span>
                                        <span>
                                            <b>Notification Date:</b>{' '}
                                            {reviewNotificationDate}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </Card>
                {documentMode == 'create' && (
                    <Card>
                        <h4 className="mb-6">Preparation Details</h4>
                        <div className="grid md:grid-cols-1 gap-4">
                            <DynamicForm
                                fields={preparationDetailFields}
                                readOnly={readOnly}
                            />
                        </div>
                    </Card>
                )}
            </div>
        </>
    )
}

export default DocumentInformationSection
