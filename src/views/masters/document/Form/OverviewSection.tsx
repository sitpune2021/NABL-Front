import { useEffect, useMemo, useState } from 'react'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { Controller, useWatch } from 'react-hook-form'
import { FormSectionBaseProps } from '@/@types/document'
import useCategoryList from '../../category/List/hooks/useList'
import useDepartmentList from '../../department/List/hooks/useList'
import { Select } from '@/components/ui'
import DatePicker from '@/components/ui/DatePicker'
import TimeInput from '@/components/ui/TimeInput'
import { Category } from '@/@types/category'
import useTemplateList from '../../template/List/hooks/useList'
import useUserList from '../../user/List/hooks/useList'
import { User } from '@/@types/user'

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

const wrapWithStyle = (html: string, css: string) => `
<html>
  <head>
    <style>
      body { font-family: Arial, sans-serif; font-size: 14px; }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 8px;
      }
      th, td {
        border: 1px solid #ccc;
        padding: 6px 8px;
        text-align: left;
      }
      thead {
        background: #f5f5f5;
        font-weight: bold;
      }
      tbody tr:nth-child(even) {
        background: #fafafa;
      }
        ${css}
    </style>
  </head>
  <body>
    ${html}
  </body>
</html>
`

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
        value: dept.name,
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

    const getMaxValue = () => {
        if (frequency === 'Weekly') return 6
        if (frequency === 'Monthly') return 28
        if (frequency === 'Yearly' && durationUnit === 'Day') return 28
        if (frequency === 'Yearly' && durationUnit === 'Month') return 11
        return 0
    }

    return (
        <Card>
            <h4 className="mb-6">Document Creation</h4>
            <div className="grid md:grid-cols-2 gap-4">
                <FormItem
                    label="Lab Name"
                    invalid={Boolean(errors.labName)}
                    errorMessage={errors.labName?.message}
                >
                    <Controller
                        name="labName"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                readOnly={readOnly}
                                placeholder="Enter Lab Name"
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Location"
                    invalid={Boolean(errors.location)}
                    errorMessage={errors.location?.message}
                >
                    <Controller
                        name="location"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                readOnly={readOnly}
                                placeholder="Enter Location"
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Department"
                    invalid={Boolean(errors.department)}
                    errorMessage={errors.department?.message}
                >
                    <Controller
                        name="department"
                        control={control}
                        render={({ field }) => (
                            <Select
                                {...field}
                                isMulti
                                options={departmentOptions}
                                value={departmentOptions.filter((o) =>
                                    field.value?.includes(o.value),
                                )}
                                placeholder="Select Department"
                                isDisabled={readOnly}
                                onChange={(options) => {
                                    const selected = (options ||
                                        []) as DepartmentOption[]
                                    field.onChange(selected.map((o) => o.value))
                                    handleDepartmentChange(selected)
                                }}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Category"
                    invalid={Boolean(errors.category)}
                    errorMessage={errors.category?.message}
                >
                    <Controller
                        name="category"
                        control={control}
                        render={({ field }) => (
                            <Select
                                {...field}
                                options={options}
                                value={options.find(
                                    (o: { value: string; label: string }) =>
                                        o.value === field.value,
                                )}
                                placeholder="Select Category"
                                isDisabled={readOnly}
                                onChange={(option) => {
                                    field.onChange(option?.value)
                                    handleCategoryChange(option)
                                }}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Header"
                    invalid={Boolean(errors.header)}
                    errorMessage={errors.header?.message}
                >
                    <Controller
                        name="header"
                        control={control}
                        render={({ field }) => {
                            const selectedOption = availableHeaders.find(
                                (h) => h.value === field.value,
                            )

                            return (
                                <>
                                    <Select
                                        {...field}
                                        value={selectedOption || null}
                                        options={availableHeaders}
                                        placeholder="-- Select Header --"
                                        isDisabled={readOnly}
                                        onChange={(option) => {
                                            field.onChange(option?.value || '')
                                            const html = option?.html || ''
                                            const css = option?.css || ''
                                            setSelectedHeaderHtml(
                                                html
                                                    ? wrapWithStyle(html, css)
                                                    : '',
                                            )
                                        }}
                                    />

                                    {field.value && selectedHeaderHtml && (
                                        <iframe
                                            style={{
                                                width: '100%',
                                                height: '150px',
                                                border: '1px solid #ddd',
                                                marginTop: '8px',
                                                borderRadius: '6px',
                                                background: '#fff',
                                            }}
                                            srcDoc={selectedHeaderHtml}
                                            title="Header Preview"
                                        />
                                    )}
                                </>
                            )
                        }}
                    />
                </FormItem>

                <FormItem
                    label="Footer"
                    invalid={Boolean(errors.footer)}
                    errorMessage={errors.footer?.message}
                >
                    <Controller
                        name="footer"
                        control={control}
                        render={({ field }) => {
                            const selectedOption = availableFooters.find(
                                (f) => f.value === field.value,
                            )

                            return (
                                <>
                                    <Select
                                        {...field}
                                        value={selectedOption || null}
                                        options={availableFooters}
                                        placeholder="-- Select Footer --"
                                        isDisabled={readOnly}
                                        onChange={(option) => {
                                            field.onChange(option?.value || '')
                                            const html = option?.html || ''
                                            const css = option?.css || ''
                                            setSelectedFooterHtml(
                                                html
                                                    ? wrapWithStyle(html, css)
                                                    : '',
                                            )
                                        }}
                                    />

                                    {field.value && selectedFooterHtml && (
                                        <iframe
                                            style={{
                                                width: '100%',
                                                height: '150px',
                                                border: '1px solid #ddd',
                                                marginTop: '8px',
                                                borderRadius: '6px',
                                                background: '#fff',
                                            }}
                                            srcDoc={selectedFooterHtml}
                                            title="Footer Preview"
                                        />
                                    )}
                                </>
                            )
                        }}
                    />
                </FormItem>

                <FormItem
                    label="Document Name"
                    invalid={Boolean(errors.documentName)}
                    errorMessage={errors.documentName?.message}
                >
                    <Controller
                        name="documentName"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                readOnly={readOnly}
                                placeholder="Enter Document Name"
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Document No"
                    invalid={Boolean(errors.documentNo)}
                    errorMessage={errors.documentNo?.message}
                >
                    <Controller
                        name="documentNo"
                        control={control}
                        render={({ field }) => (
                            <Input
                                readOnly
                                type="text"
                                placeholder="Document No"
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Issued No"
                    invalid={Boolean(errors.issuedNo)}
                    errorMessage={errors.issuedNo?.message}
                >
                    <Controller
                        name="issuedNo"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                readOnly={readOnly}
                                placeholder="Enter Issued No"
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Issued By"
                    invalid={Boolean(errors.issuedBy)}
                    errorMessage={errors.issuedBy?.message}
                >
                    <Controller
                        name="issuedBy"
                        control={control}
                        render={({ field }) => (
                            <Select
                                {...field}
                                options={issuedByOptions}
                                value={issuedByOptions.find(
                                    (o: { value: string; label: string }) =>
                                        o.value === field.value,
                                )}
                                placeholder="Select Issued By"
                                onChange={(option) => {
                                    field.onChange(option?.value)
                                }}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Issue Date"
                    invalid={Boolean(errors.issueDate)}
                    errorMessage={errors.issueDate?.message}
                >
                    <Controller
                        name="issueDate"
                        control={control}
                        render={({ field }) => (
                            <DatePicker
                                placeholder="Pick a date"
                                value={
                                    field.value ? new Date(field.value) : null
                                }
                                minDate={new Date()}
                                onChange={(date: Date | null) =>
                                    field.onChange(
                                        date ? date.toISOString() : undefined,
                                    )
                                }
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Copy No"
                    invalid={Boolean(errors.copyNo)}
                    errorMessage={errors.copyNo?.message}
                >
                    <Controller
                        name="copyNo"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                readOnly={readOnly}
                                placeholder="Enter Copy No"
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Date"
                    invalid={Boolean(errors.date)}
                    errorMessage={errors.date?.message}
                >
                    <Controller
                        name="date"
                        control={control}
                        render={({ field }) => (
                            <DatePicker
                                placeholder="Pick a date"
                                value={
                                    field.value ? new Date(field.value) : null
                                }
                                onChange={(date: Date | null) => {
                                    field.onChange(
                                        date ? date.toISOString() : undefined,
                                    )
                                }}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Time"
                    invalid={Boolean(errors.time)}
                    errorMessage={errors.time?.message}
                >
                    <Controller
                        name="time"
                        control={control}
                        render={({ field }) => (
                            <TimeInput
                                value={
                                    field.value ? new Date(field.value) : null
                                }
                                onChange={(date: Date | null) => {
                                    field.onChange(
                                        date ? date.toISOString() : undefined,
                                    )
                                }}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Prepared By"
                    invalid={Boolean(errors.preparedBy)}
                    errorMessage={errors.preparedBy?.message}
                >
                    <Controller
                        name="preparedBy"
                        control={control}
                        render={({ field }) => (
                            <Select
                                {...field}
                                options={preparedByOptions}
                                value={preparedByOptions.find(
                                    (o: { value: string; label: string }) =>
                                        o.value === field.value,
                                )}
                                placeholder="Select Prepared By"
                                onChange={(option) => {
                                    field.onChange(option?.value)
                                }}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Prepared By Date"
                    invalid={Boolean(errors.preparedByDate)}
                    errorMessage={errors.preparedByDate?.message}
                >
                    <Controller
                        name="preparedByDate"
                        control={control}
                        render={({ field }) => (
                            <DatePicker
                                placeholder="Pick a date"
                                value={
                                    field.value ? new Date(field.value) : null
                                }
                                onChange={(date: Date | null) =>
                                    field.onChange(
                                        date ? date.toISOString() : undefined,
                                    )
                                }
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Quantity Prepared"
                    invalid={Boolean(errors.quantityPrepared)}
                    errorMessage={errors.quantityPrepared?.message}
                >
                    <Controller
                        name="quantityPrepared"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="number"
                                readOnly={readOnly}
                                placeholder="Quantity Prepared"
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Approved By"
                    invalid={Boolean(errors.approvedBy)}
                    errorMessage={errors.approvedBy?.message}
                >
                    <Controller
                        name="approvedBy"
                        control={control}
                        render={({ field }) => (
                            <Select
                                {...field}
                                options={approvedByOptions}
                                value={approvedByOptions.find(
                                    (o: { value: string; label: string }) =>
                                        o.value === field.value,
                                )}
                                placeholder="Select Approved By"
                                onChange={(option) => {
                                    field.onChange(option?.value)
                                }}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Amendment No"
                    invalid={Boolean(errors.amendmentNo)}
                    errorMessage={errors.amendmentNo?.message}
                >
                    <Controller
                        name="amendmentNo"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                readOnly={readOnly}
                                placeholder="Enter Amendment No"
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Amendment Date"
                    invalid={Boolean(errors.amendmentDate)}
                    errorMessage={errors.amendmentDate?.message}
                >
                    <Controller
                        name="amendmentDate"
                        control={control}
                        render={({ field }) => (
                            <DatePicker
                                placeholder="Pick a date"
                                value={
                                    field.value ? new Date(field.value) : null
                                }
                                onChange={(date: Date | null) =>
                                    field.onChange(
                                        date ? date.toISOString() : undefined,
                                    )
                                }
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Effective Date"
                    invalid={!!errors.effectiveDate}
                >
                    <Controller
                        name="effectiveDate"
                        control={control}
                        render={({ field }) => (
                            <DatePicker
                                placeholder="Pick a date"
                                value={
                                    field.value ? new Date(field.value) : null
                                }
                                onChange={(date: Date | null) =>
                                    field.onChange(
                                        date ? date.toISOString() : undefined,
                                    )
                                }
                            />
                        )}
                    />
                </FormItem>

                <FormItem label="Review Frequency" invalid={!!errors.frequency}>
                    <Controller
                        name="frequency"
                        control={control}
                        render={({ field }) => (
                            <Select
                                {...field}
                                value={
                                    field.value
                                        ? {
                                              value: field.value,
                                              label: field.value,
                                          }
                                        : null
                                }
                                options={[
                                    { value: 'Weekly', label: 'Weekly' },
                                    { value: 'Monthly', label: 'Monthly' },
                                    { value: 'Yearly', label: 'Yearly' },
                                ]}
                                placeholder="Select Frequency"
                                isDisabled={readOnly}
                                onChange={(option) =>
                                    field.onChange(option?.value)
                                }
                            />
                        )}
                    />
                </FormItem>

                {frequency && (
                    <div className="grid grid-cols-2 gap-4">
                        <FormItem
                            label="Duration Value"
                            invalid={!!errors.durationValue}
                        >
                            <Controller
                                name="durationValue"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="number"
                                        placeholder="Enter value"
                                        min={1}
                                        max={getMaxValue()}
                                        value={field.value || ''}
                                        disabled={!durationUnit || readOnly}
                                        onChange={(e) => {
                                            const val = e.target.value
                                            if (
                                                !getMaxValue() ||
                                                Number(val) <= getMaxValue()
                                            ) {
                                                field.onChange(val)
                                            }
                                        }}
                                    />
                                )}
                            />
                        </FormItem>

                        <FormItem
                            label="Duration Unit"
                            invalid={!!errors.durationUnit}
                        >
                            <Controller
                                name="durationUnit"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        value={
                                            field.value
                                                ? {
                                                      value: field.value,
                                                      label: field.value,
                                                  }
                                                : null
                                        }
                                        options={unitOptions}
                                        placeholder="Select Unit"
                                        isDisabled={!frequency || readOnly}
                                        onChange={(option) =>
                                            field.onChange(option?.value)
                                        }
                                    />
                                )}
                            />
                        </FormItem>
                    </div>
                )}

                <FormItem
                    label="Status"
                    invalid={Boolean(errors.status)}
                    errorMessage={errors.status?.message}
                >
                    <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                            <Select
                                {...field}
                                value={
                                    field.value
                                        ? {
                                              value: field.value,
                                              label: field.value,
                                          }
                                        : null
                                }
                                options={[
                                    {
                                        value: 'Controlled',
                                        label: 'Controlled',
                                    },
                                    {
                                        value: 'Uncontrolled',
                                        label: 'Uncontrolled',
                                    },
                                ]}
                                placeholder="Select Status"
                                isDisabled={readOnly}
                                onChange={(option) =>
                                    field.onChange(option?.value)
                                }
                            />
                        )}
                    />
                </FormItem>
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
