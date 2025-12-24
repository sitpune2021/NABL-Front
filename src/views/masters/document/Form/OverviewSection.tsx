/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from 'react'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { useWatch } from 'react-hook-form'
import {
    DepartmentOption,
    FormFieldConfig,
    FormSectionBaseProps,
    TemplateOption,
} from '@/@types/document'
import { Category } from '@/@types/category'
import DynamicForm from './DynamicForm'
import { Checkbox } from '@/components/ui'
import { useSessionUser } from '@/store/authStore'
import { generateDocumentNo } from '@/utils/resolveFieldValue'

const OverviewSection = ({
    control,
    errors,
    readOnly,
    setValue,
    categoryList,
    templateList,
    departmentList,
    isEdit = false,
}: FormSectionBaseProps) => {
    const { username } = useSessionUser((state) => state.user)

    const options = categoryList.map((category: Category) => ({
        value: category.id,
        label: `${category.name.toUpperCase()} - ${category.identifier}`,
    }))

    const departmentOptions = departmentList.map((dept) => ({
        value: dept.id,
        label: `${dept.name.toUpperCase()} - ${dept.identifier}`,
    }))

    const [selectedCategory, setSelectedCategory] = useState<{
        value: string
        label: string
    } | null>(null)
    const [selectedDepartments, setSelectedDepartments] = useState<
        DepartmentOption[]
    >([])
    const [counter] = useState(1)

    const handleCategoryChange = (
        option: { value: string; label: string } | null,
    ) => {
        setSelectedCategory(option)
        const newDocNo = generateDocumentNo(
            option,
            selectedDepartments,
            categoryList,
            counter,
        )
        setValue('number', newDocNo)
    }
    const handleDepartmentChange = (options: DepartmentOption[]) => {
        setSelectedDepartments(options || [])
        const newDocNo = generateDocumentNo(
            selectedCategory,
            options || [],
            categoryList,
            counter,
        )
        setValue('number', newDocNo)
    }
    const [selectedHeaderHtml, setSelectedHeaderHtml] = useState<string>('')
    const [selectedFooterHtml, setSelectedFooterHtml] = useState<string>('')

    const availableHeaders: TemplateOption[] = useMemo(() => {
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

    const availableFooters: TemplateOption[] = useMemo(() => {
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

    const reviewFrequency = useWatch({ control, name: 'review_frequency' })
    const effectiveDate = useWatch({ control, name: 'effective_date' })
    const notification_value = useWatch({ control, name: 'notification_value' })
    const notification_unit = useWatch({ control, name: 'notification_unit' })
    const mode = useWatch({ control, name: 'mode' })

    const [notificationDate, setNotificationDate] = useState<string | null>(
        null,
    )
    const [unitOptions, setUnitOptions] = useState<
        { value: string; label: string }[]
    >([])
    const [nextDate, setNextDate] = useState<string | null>(null)

    function getLastDayOfMonth(year: number, month: number) {
        return new Date(year, month + 1, 0)
    }

    useEffect(() => {
        if (reviewFrequency === 'Weekly') {
            setUnitOptions([{ value: 'Day', label: 'Day' }])
        } else if (reviewFrequency === 'Monthly') {
            setUnitOptions([{ value: 'Day', label: 'Day' }])
        } else if (reviewFrequency === 'Yearly') {
            setUnitOptions([
                { value: 'Day', label: 'Day' },
                { value: 'Month', label: 'Month' },
            ])
        } else {
            setUnitOptions([])
        }
    }, [reviewFrequency])

    useEffect(() => {
        if (!effectiveDate || !reviewFrequency) {
            setNextDate(null)
            return
        }

        const start = new Date(effectiveDate)
        let next = new Date(start)

        if (reviewFrequency === 'Weekly') {
            next.setDate(start.getDate() + 7)
        } else if (reviewFrequency === 'Monthly') {
            const nextMonth = start.getMonth() + 1
            const lastDay = getLastDayOfMonth(start.getFullYear(), nextMonth)
            const target = new Date(start)
            target.setMonth(nextMonth)
            if (target.getMonth() !== nextMonth % 12) next = lastDay
            else next = target
        } else if (reviewFrequency === 'Yearly') {
            const nextYear = start.getFullYear() + 1
            const sameMonth = start.getMonth()
            const lastDayNextMonth = getLastDayOfMonth(nextYear, sameMonth)
            const candidate = new Date(nextYear, sameMonth, start.getDate())
            if (candidate.getMonth() !== sameMonth) next = lastDayNextMonth
            else next = candidate
        }

        setNextDate(next.toDateString())
    }, [effectiveDate, reviewFrequency])

    useEffect(() => {
        if (!nextDate || !notification_value || !notification_unit) {
            setNotificationDate(null)
            return
        }

        const next = new Date(nextDate)
        const notify = new Date(next)
        const val = Number(notification_value)

        if (notification_unit === 'Day') notify.setDate(next.getDate() - val)
        if (notification_unit === 'Month')
            notify.setMonth(next.getMonth() - val)

        setNotificationDate(notify.toDateString())
    }, [nextDate, notification_value, notification_unit])

    const getMaxValue = (frequency: any) => {
        if (frequency === 'Weekly') return 6
        if (frequency === 'Monthly') return 28
        if (frequency === 'Yearly' && notification_unit === 'Day') return 28
        if (frequency === 'Yearly' && notification_unit === 'Month') return 11
        return 0
    }

    const documentFieldOne: FormFieldConfig[] = [
        {
            name: 'category_id',
            label: 'Category',
            type: 'select',
            options,
            onChange: handleCategoryChange,
        },
        {
            name: 'department',
            label: 'Department',
            type: 'multiSelect',
            options: departmentOptions,
            onChange: handleDepartmentChange,
        },
        {
            name: 'number',
            label: 'Document No',
            type: 'text',
            readOnly: true,
            placeholder: 'Document No',
        },
        {
            name: 'name',
            label: 'Document Name',
            type: 'text',
            placeholder: 'Enter Document Name',
        },
        {
            name: 'status',
            label: 'Status',
            type: 'select',
            defaultValue: 'controlled',
            options: [
                { value: 'controlled', label: 'Controlled' },
                { value: 'uncontrolled', label: 'Uncontrolled' },
            ],
        },
        {
            name: 'mode',
            label: `Document Mode ${mode === 'create' ? '(Create)' : '(Upload)'}`,
            type: 'checkbox',
            defaultValue: 'create',
            condition: () => !isEdit, // 👈 only show when isEdit is true
            customRender: (field) => (
                <Checkbox
                    disabled={readOnly}
                    checked={field.value === 'create'} // <-- show correct toggle
                    onChange={(checked) => {
                        field.onChange(checked ? 'create' : 'upload')
                    }}
                />
            ),
        },
    ]

    const documentFieldTwo: FormFieldConfig[] = [
        {
            name: 'header',
            label: 'Header',
            type: 'header',
            options: availableHeaders,
        },
        {
            name: 'footer',
            label: 'Footer',
            type: 'footer',
            options: availableFooters,
        },
        {
            name: 'copy_no',
            label: 'Copy No',
            type: 'text',
            placeholder: 'Enter Copy No',
        },
        {
            name: 'quantity_prepared',
            label: 'Quantity Prepared',
            type: 'number',
            placeholder: 'Quantity Prepared',
        },
    ]

    const documentFieldThree: FormFieldConfig[] = [
        {
            name: 'workflow_state',
            label: 'Workflow State',
            type: 'text',
            readOnly: true,
            defaultValue: 'prepared',
        },
        {
            name: 'step_type',
            label: 'Step',
            type: 'text',
            readOnly: true,
            defaultValue: 'prepared',
        },
        {
            name: 'performed_by',
            label: 'prepared By',
            type: 'text',
            readOnly: true,
            defaultValue: username,
        },
        {
            name: 'performed_date',
            label: 'prepared Date',
            type: 'date',
            readOnly: true,
            defaultValue: new Date(),
            minDate: new Date(),
        },
    ]

    const documentFieldFour: FormFieldConfig[] = [
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
            label: 'Notification Duration Unit',
            type: 'select',
            options: unitOptions,
            condition: (values) => !!values.review_frequency,
        },
        {
            name: 'notification_value',
            label: 'Duration Value',
            type: 'number',
            placeholder: 'Enter value',
            condition: (values) => !!values.review_frequency,
            customRender: (field, formValues) => (
                <Input
                    type="number"
                    min={1}
                    max={getMaxValue(formValues.review_frequency)}
                    value={field.value || ''}
                    disabled={!formValues.notification_unit || readOnly}
                    onChange={(e) => {
                        const val = e.target.value
                        if (
                            !getMaxValue(formValues.review_frequency) ||
                            Number(val) <=
                                getMaxValue(formValues.review_frequency)
                        ) {
                            field.onChange(val)
                        }
                    }}
                />
            ),
        },
    ]

    const formValues = useWatch({ control })

    return (
        <>
            <div className="gap-4 flex flex-col flex-auto">
                <Card>
                    <h4 className="mb-6">Overview</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                        <DynamicForm
                            control={control}
                            errors={errors}
                            fields={documentFieldOne}
                            formValues={formValues} // <-- fix here
                            readOnly={readOnly}
                            extraProps={{
                                selectedHeaderHtml,
                                setSelectedHeaderHtml,
                                selectedFooterHtml,
                                setSelectedFooterHtml,
                            }}
                        />
                    </div>
                </Card>
                {mode == 'create' && (
                    <Card>
                        <h4 className="mb-6">Mode Create Fields</h4>
                        <div className="grid md:grid-cols-2 gap-4">
                            <DynamicForm
                                control={control}
                                errors={errors}
                                fields={documentFieldTwo}
                                formValues={formValues} // <-- fix here
                                readOnly={readOnly}
                                extraProps={{
                                    selectedHeaderHtml,
                                    setSelectedHeaderHtml,
                                    selectedFooterHtml,
                                    setSelectedFooterHtml,
                                }}
                            />
                        </div>
                    </Card>
                )}
            </div>
            <div className="md:w-[370px] gap-4 flex flex-col">
                <Card>
                    <h4 className="mb-6">Review Schedual</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                        <DynamicForm
                            control={control}
                            errors={errors}
                            fields={documentFieldThree}
                            formValues={formValues} // <-- fix here
                            readOnly={readOnly}
                            extraProps={{
                                selectedHeaderHtml,
                                setSelectedHeaderHtml,
                                selectedFooterHtml,
                                setSelectedFooterHtml,
                            }}
                        />
                    </div>
                    <div className="grid md:grid-cols-1 gap-4">
                        <DynamicForm
                            control={control}
                            errors={errors}
                            fields={documentFieldFour}
                            formValues={formValues} // <-- fix here
                            readOnly={readOnly}
                            extraProps={{
                                selectedHeaderHtml,
                                setSelectedHeaderHtml,
                                selectedFooterHtml,
                                setSelectedFooterHtml,
                            }}
                        />
                    </div>

                    {(nextDate || notificationDate) && (
                        <div className="mt-4 p-4 rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-green-50 shadow-sm">
                            <div className="space-y-2 ml-2">
                                {nextDate && (
                                    <div className="flex items-center text-green-700 gap-2">
                                        <span className="text-lg">✅</span>
                                        <span>
                                            <b>Next Review Date:</b> {nextDate}
                                        </span>
                                    </div>
                                )}

                                {notificationDate && (
                                    <div className="flex items-center text-blue-700 gap-2">
                                        <span className="text-lg">🔔</span>
                                        <span>
                                            <b>Notification Date:</b>{' '}
                                            {notificationDate}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </>
    )
}

export default OverviewSection
