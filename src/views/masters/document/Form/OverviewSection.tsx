/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from 'react'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { useWatch } from 'react-hook-form'
import { FormFieldConfig, FormSectionBaseProps } from '@/@types/document'
import useCategoryList from '../../category/List/hooks/useList'
import useDepartmentList from '../../department/List/hooks/useList'
import { Category } from '@/@types/category'
import useTemplateList from '../../template/List/hooks/useList'
import useUserList from '../../user/List/hooks/useList'
import { User } from '@/@types/user'
import DynamicForm from './DynamicForm'

type OverviewSectionProps = FormSectionBaseProps
type TemplateOption = {
    value: string
    label: string
    html: string
    css: string
}

type DepartmentOption = {
    label: string
    value: string
}

const OverviewSection = ({
    control,
    errors,
    readOnly,
    setValue,
}: OverviewSectionProps) => {
    const { categoryList } = useCategoryList()
    const { departmentList } = useDepartmentList()
    const { templateList } = useTemplateList()
    const { userList } = useUserList()

    const options = categoryList.map((category: Category) => ({
        value: category.name,
        label: `${category.name.toUpperCase()} - ${category.identifier}`,
    }))

    const getUserOptions = (users: User[], roleKey: keyof User) =>
        users
            .filter((user) => user[roleKey])
            .map((user) => ({
                value: user.name,
                label: user.name.toUpperCase(),
            }))

    const preparedByOptions = getUserOptions(userList, 'preparedBy')
    const issuedByOptions = getUserOptions(userList, 'issuedBy')
    const approvedByOptions = getUserOptions(userList, 'approvedBy')

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
    const generateDocumentNo = (
        categoryOption: { value: string; label: string } | null,
        departmentOptions: { value: string; label: string }[],
    ) => {
        if (!categoryOption) return ''

        const categoryPrefix = categoryOption.label.split(' - ')[1]

        let docPrefix = categoryPrefix

        if (departmentOptions.length === 1) {
            // Only one department selected → include its prefix
            const deptPrefix = departmentOptions[0].label.split(' - ')[1]
            docPrefix = `${deptPrefix}-${categoryPrefix}`
        }

        // Multiple departments or none → only category prefix used
        return `${docPrefix}-${counter}`
    }
    const handleCategoryChange = (
        option: { value: string; label: string } | null,
    ) => {
        setSelectedCategory(option)
        const newDocNo = generateDocumentNo(option, selectedDepartments)
        setValue('documentNo', newDocNo)
    }
    const handleDepartmentChange = (options: DepartmentOption[]) => {
        setSelectedDepartments(options || [])
        const newDocNo = generateDocumentNo(selectedCategory, options || [])
        setValue('documentNo', newDocNo)
    }
    const [selectedHeaderHtml, setSelectedHeaderHtml] = useState<string>('')
    const [selectedFooterHtml, setSelectedFooterHtml] = useState<string>('')

    const availableHeaders: TemplateOption[] = useMemo(() => {
        return (
            templateList
                ?.filter((t) => t.type === 'header')
                .map((t) => ({
                    value: t.id,
                    label: t.name || t.id,
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
                    label: t.name || t.id,
                    html: t.template?.html || '',
                    css: t.template?.css || '',
                })) || []
        )
    }, [templateList])

    const frequency = useWatch({ control, name: 'frequency' })
    const effectiveDate = useWatch({ control, name: 'effectiveDate' })
    const durationValue = useWatch({ control, name: 'durationValue' })
    const durationUnit = useWatch({ control, name: 'durationUnit' })

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
        setValue('durationValue', undefined)
        setValue('durationUnit', undefined)
        setNotificationDate(null)
        setNextDate(null)
    }, [frequency, setValue])

    useEffect(() => {
        if (frequency === 'Weekly') {
            setUnitOptions([{ value: 'Day', label: 'Day' }])
        } else if (frequency === 'Monthly') {
            setUnitOptions([{ value: 'Day', label: 'Day' }])
        } else if (frequency === 'Yearly') {
            setUnitOptions([
                { value: 'Day', label: 'Day' },
                { value: 'Month', label: 'Month' },
            ])
        } else {
            setUnitOptions([])
        }
    }, [frequency])

    useEffect(() => {
        if (!effectiveDate || !frequency) {
            setNextDate(null)
            return
        }

        const start = new Date(effectiveDate)
        let next = new Date(start)

        if (frequency === 'Weekly') {
            next.setDate(start.getDate() + 7)
        } else if (frequency === 'Monthly') {
            const nextMonth = start.getMonth() + 1
            const lastDay = getLastDayOfMonth(start.getFullYear(), nextMonth)
            const target = new Date(start)
            target.setMonth(nextMonth)
            if (target.getMonth() !== nextMonth % 12) next = lastDay
            else next = target
        } else if (frequency === 'Yearly') {
            const nextYear = start.getFullYear() + 1
            const sameMonth = start.getMonth()
            const lastDayNextMonth = getLastDayOfMonth(nextYear, sameMonth)
            const candidate = new Date(nextYear, sameMonth, start.getDate())
            if (candidate.getMonth() !== sameMonth) next = lastDayNextMonth
            else next = candidate
        }

        setNextDate(next.toDateString())
    }, [effectiveDate, frequency])

    useEffect(() => {
        if (!nextDate || !durationValue || !durationUnit) {
            setNotificationDate(null)
            return
        }

        const next = new Date(nextDate)
        const notify = new Date(next)
        const val = Number(durationValue)

        if (durationUnit === 'Day') notify.setDate(next.getDate() - val)
        if (durationUnit === 'Month') notify.setMonth(next.getMonth() - val)

        setNotificationDate(notify.toDateString())
    }, [nextDate, durationValue, durationUnit])

    const getMaxValue = (frequency: any) => {
        if (frequency === 'Weekly') return 6
        if (frequency === 'Monthly') return 28
        if (frequency === 'Yearly' && durationUnit === 'Day') return 28
        if (frequency === 'Yearly' && durationUnit === 'Month') return 11
        return 0
    }

    const documentFields: FormFieldConfig[] = [
        {
            name: 'labName',
            label: 'Lab Name',
            type: 'text',
            placeholder: 'Enter Lab Name',
        },
        {
            name: 'location',
            label: 'Location',
            type: 'text',
            placeholder: 'Enter Location',
        },
        {
            name: 'department',
            label: 'Department',
            type: 'multiSelect',
            options: departmentOptions,
            onChange: handleDepartmentChange,
        },
        {
            name: 'category',
            label: 'Category',
            type: 'select',
            options,
            onChange: handleCategoryChange,
        },
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
            name: 'documentName',
            label: 'Document Name',
            type: 'text',
            placeholder: 'Enter Document Name',
        },
        {
            name: 'documentNo',
            label: 'Document No',
            type: 'text',
            readOnly: true,
            placeholder: 'Document No',
        },
        {
            name: 'issuedNo',
            label: 'Issued No',
            type: 'text',
            placeholder: 'Enter Issued No',
        },
        {
            name: 'issuedBy',
            label: 'Issued By',
            type: 'select',
            options: issuedByOptions,
        },
        {
            name: 'issueDate',
            label: 'Issue Date',
            type: 'date',
            minDate: new Date(),
            placeholder: 'Select Issue Date',
        },
        {
            name: 'copyNo',
            label: 'Copy No',
            type: 'text',
            placeholder: 'Enter Copy No',
        },
        {
            name: 'date',
            label: 'Date',
            type: 'date',
            placeholder: 'Select Date',
        },
        {
            name: 'time',
            label: 'Time',
            type: 'time',
            placeholder: 'Select Time',
        },
        {
            name: 'preparedBy',
            label: 'Prepared By',
            type: 'select',
            options: preparedByOptions,
        },
        {
            name: 'preparedByDate',
            label: 'Prepared By Date',
            type: 'date',
            placeholder: 'Select Prepared By Date',
        },
        {
            name: 'quantityPrepared',
            label: 'Quantity Prepared',
            type: 'number',
            placeholder: 'Quantity Prepared',
        },
        {
            name: 'approvedBy',
            label: 'Approved By',
            type: 'select',
            options: approvedByOptions,
        },
        {
            name: 'amendmentNo',
            label: 'Amendment No',
            type: 'text',
            placeholder: 'Enter Amendment No',
        },
        {
            name: 'amendmentDate',
            label: 'Amendment Date',
            type: 'date',
            placeholder: 'Select Amendment Date',
        },
        {
            name: 'effectiveDate',
            label: 'Effective Date',
            type: 'date',
            placeholder: 'Select Effective Date',
        },
        {
            name: 'frequency',
            label: 'Review Frequency',
            type: 'select',
            options: [
                { value: 'Weekly', label: 'Weekly' },
                { value: 'Monthly', label: 'Monthly' },
                { value: 'Yearly', label: 'Yearly' },
            ],
        },
        {
            name: 'durationUnit',
            label: 'Duration Unit',
            type: 'select',
            options: unitOptions,
            condition: (values) => !!values.frequency,
        },
        {
            name: 'durationValue',
            label: 'Duration Value',
            type: 'number',
            placeholder: 'Enter value',
            condition: (values) => !!values.frequency,
            customRender: (field, formValues) => (
                <Input
                    type="number"
                    min={1}
                    max={getMaxValue(formValues.frequency)}
                    value={field.value || ''}
                    disabled={!formValues.durationUnit || readOnly}
                    onChange={(e) => {
                        const val = e.target.value
                        if (
                            !getMaxValue(formValues.frequency) ||
                            Number(val) <= getMaxValue(formValues.frequency)
                        ) {
                            field.onChange(val)
                        }
                    }}
                />
            ),
        },
        {
            name: 'status',
            label: 'Status',
            type: 'select',
            options: [
                { value: 'Controlled', label: 'Controlled' },
                { value: 'Uncontrolled', label: 'Uncontrolled' },
            ],
        },
    ]
    const formValues = useWatch({ control })

    return (
        <Card>
            <h4 className="mb-6">Document Creation</h4>
            <DynamicForm
                control={control}
                errors={errors}
                fields={documentFields}
                formValues={formValues} // <-- fix here
                extraProps={{
                    selectedHeaderHtml,
                    setSelectedHeaderHtml,
                    selectedFooterHtml,
                    setSelectedFooterHtml,
                }}
            />

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
                                    <b>Notification Date:</b> {notificationDate}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </Card>
    )
}

export default OverviewSection
