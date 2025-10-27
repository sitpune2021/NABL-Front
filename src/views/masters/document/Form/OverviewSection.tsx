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
        label: `${category.name.toUpperCase()} - ${category.prefix}`,
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
        label: `${dept.name.toUpperCase()} - ${dept.prefix}`,
    }))

    const [selectedCategory, setSelectedCategory] = useState<{
        value: string
        label: string
    } | null>(null)
    const [selectedDepartments, setSelectedDepartments] = useState<
        DepartmentOption[]
    >([])
    const [counter] = useState(1) // temporary increment
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
        setValue('documentNo', newDocNo) // update form value
    }

    const frequency = useWatch({ control, name: 'frequency' })
    const effectiveDate = useWatch({ control, name: 'effectiveDate' })
    const duration = useWatch({ control, name: 'duration' })

    const [durationOptions, setDurationOptions] = useState<
        { value: string; label: string }[]
    >([])
    const [notificationDate, setNotificationDate] = useState<string | null>(
        null,
    )
    const [selectedHeaderHtml, setSelectedHeaderHtml] = useState<string>('')
    const [selectedFooterHtml, setSelectedFooterHtml] = useState<string>('')

    useEffect(() => {
        if (frequency === 'Weekly') {
            setDurationOptions(
                Array.from({ length: 7 }, (_, i) => ({
                    value: String(i + 1),
                    label: `${i + 1} Day${i + 1 > 1 ? 's' : ''}`,
                })),
            )
        } else if (frequency === 'Monthly') {
            setDurationOptions([
                { value: '1', label: '1 Month' },
                { value: '2', label: '2 Months' },
                { value: '3', label: '3 Months' },
                { value: '6', label: '6 Months' },
                { value: '9', label: '9 Months' },
                { value: '12', label: '12 Months' },
            ])
        } else if (frequency === 'Yearly') {
            setDurationOptions([
                { value: '1', label: '1 Year' },
                { value: '2', label: '2 Years' },
                { value: '3', label: '3 Years' },
                { value: '5', label: '5 Years' },
                { value: '6', label: '6 Years' },
                { value: '8', label: '8 Years' },
                { value: '10', label: '10 Years' },
            ])
        } else {
            setDurationOptions([])
        }
    }, [frequency])

    useEffect(() => {
        if (!effectiveDate || !frequency || !duration) {
            setNotificationDate(null)
            return
        }

        const start = new Date(effectiveDate)
        const notifyDate = new Date(start)

        if (frequency === 'Weekly') {
            notifyDate.setDate(start.getDate() - parseInt(duration))
        } else if (frequency === 'Monthly') {
            notifyDate.setMonth(start.getMonth() - parseInt(duration))
        } else if (frequency === 'Yearly') {
            notifyDate.setFullYear(start.getFullYear() - parseInt(duration))
        }

        setNotificationDate(notifyDate.toDateString())
    }, [effectiveDate, frequency, duration])

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
                                onChange={(options) => {
                                    const selected = (options ||
                                        []) as DepartmentOption[]
                                    field.onChange(selected.map((o) => o.value)) // update form field with values only
                                    handleDepartmentChange(selected) // update documentNo and selectedDepartments
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
                                onChange={(option) => {
                                    field.onChange(option?.value)
                                    handleCategoryChange(option)
                                }}
                            />
                        )}
                    />
                </FormItem>

                {/* ✅ Header with preview */}
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

                {/* ✅ Footer with preview */}
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
                            // <Input
                            //     type="text"
                            //     readOnly={readOnly}
                            //     placeholder="Prepared By"
                            //     {...field}
                            // />
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
                    invalid={Boolean(errors.effectiveDate)}
                    errorMessage={errors.effectiveDate?.message}
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

                <FormItem
                    label="Review Frequency"
                    invalid={Boolean(errors.frequency)}
                    errorMessage={errors.frequency?.message}
                >
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
                                placeholder="Select Review Frequency"
                                isDisabled={readOnly}
                                onChange={(option) =>
                                    field.onChange(option?.value)
                                }
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Notification Duration"
                    invalid={Boolean(errors.duration)}
                    errorMessage={errors.duration?.message}
                >
                    <Controller
                        name="duration"
                        control={control}
                        render={({ field }) => (
                            <Select
                                {...field}
                                value={
                                    field.value
                                        ? durationOptions.find(
                                              (d) => d.value === field.value,
                                          )
                                        : null
                                }
                                options={durationOptions}
                                placeholder="Select Notification Duration"
                                isDisabled={!frequency}
                                onChange={(option) =>
                                    field.onChange(option?.value)
                                }
                            />
                        )}
                    />
                </FormItem>

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

            {notificationDate && (
                <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-700">
                    📢 Notification will trigger on: <b>{notificationDate}</b>
                </div>
            )}
        </Card>
    )
}

export default OverviewSection
