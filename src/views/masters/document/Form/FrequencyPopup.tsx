/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react'
import { Dialog } from '@/components/ui/Dialog'
import Button from '@/components/ui/Button'
import { FormItem } from '@/components/ui/Form'
import { Select } from '@/components/ui/Select'
import Input from '@/components/ui/Input'
import TimeInput from '@/components/ui/TimeInput'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { FrequencyConfig, FrequencyType } from '@/@types/document'

interface FrequencyPopupProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: (config: FrequencyConfig) => void
    initialData?: FrequencyConfig
}

interface ItemConfig {
    interval: number
    cutOffTimes: string[]
}

interface MonthInfo {
    value: string
    label: string
    quarter: string
    half: string
    days: number
}

const FrequencyPopup = ({
    isOpen,
    onClose,
    onConfirm,
    initialData,
}: FrequencyPopupProps) => {
    const [config, setConfig] = useState<
        FrequencyConfig & { itemConfigs?: Record<string, ItemConfig> }
    >({
        type: 'Daily',
        interval: 1,
        count: 1,
        cutOffTime: '00:00',
        cutOffTimes: ['00:00'],
        selectedItems: [],
        itemConfigs: {},
    })

    const [availableMonths, setAvailableMonths] = useState<MonthInfo[]>([])
    const [availableDays, setAvailableDays] = useState<
        { value: string; label: string }[]
    >([])
    const [selectedQuarter, setSelectedQuarter] = useState<string>('')
    const [selectedHalf, setSelectedHalf] = useState<string>('')
    const [selectedMonth, setSelectedMonth] = useState<string>('')

    useEffect(() => {
        if (initialData) {
            setConfig(initialData as any)
        }
    }, [initialData])

    useEffect(() => {
        if (
            config.type !== 'Weekly' &&
            config.type !== 'Monthly' &&
            config.type !== 'Fortnightly'
        ) {
            setConfig((prev) => {
                const newTimes = [...(prev.cutOffTimes || [])]
                if (prev.interval > newTimes.length) {
                    for (let i = newTimes.length; i < prev.interval; i++) {
                        newTimes.push('00:00')
                    }
                } else if (prev.interval < newTimes.length) {
                    newTimes.splice(prev.interval)
                }
                return { ...prev, cutOffTimes: newTimes }
            })
        }
    }, [config.interval, config.type])

    useEffect(() => {
        const months: MonthInfo[] = [
            {
                value: 'January',
                label: 'January',
                quarter: 'Q1',
                half: 'H1',
                days: 31,
            },
            {
                value: 'February',
                label: 'February',
                quarter: 'Q1',
                half: 'H1',
                days: 29,
            },
            {
                value: 'March',
                label: 'March',
                quarter: 'Q1',
                half: 'H1',
                days: 31,
            },
            {
                value: 'April',
                label: 'April',
                quarter: 'Q2',
                half: 'H1',
                days: 30,
            },
            { value: 'May', label: 'May', quarter: 'Q2', half: 'H1', days: 31 },
            {
                value: 'June',
                label: 'June',
                quarter: 'Q2',
                half: 'H1',
                days: 30,
            },
            {
                value: 'July',
                label: 'July',
                quarter: 'Q3',
                half: 'H2',
                days: 31,
            },
            {
                value: 'August',
                label: 'August',
                quarter: 'Q3',
                half: 'H2',
                days: 31,
            },
            {
                value: 'September',
                label: 'September',
                quarter: 'Q3',
                half: 'H2',
                days: 30,
            },
            {
                value: 'October',
                label: 'October',
                quarter: 'Q4',
                half: 'H2',
                days: 31,
            },
            {
                value: 'November',
                label: 'November',
                quarter: 'Q4',
                half: 'H2',
                days: 30,
            },
            {
                value: 'December',
                label: 'December',
                quarter: 'Q4',
                half: 'H2',
                days: 31,
            },
        ]
        setAvailableMonths(months)
    }, [])

    const frequencyTypes = [
        { value: 'Daily', label: 'Daily' },
        { value: 'Weekly', label: 'Weekly' },
        { value: 'Fortnightly', label: 'Fortnightly' },
        { value: 'Monthly', label: 'Monthly' },
        { value: 'Quarterly', label: 'Quarterly' },
        { value: 'Half-Yearly', label: 'Half-Yearly' },
        { value: 'Yearly', label: 'Yearly' },
        { value: 'Bi-Yearly', label: 'Bi-Yearly' },
    ]

    const getDynamicOptions = () => {
        let options: { value: string; label: string }[] = []

        switch (config.type) {
            case 'Weekly':
                options = [
                    'Monday',
                    'Tuesday',
                    'Wednesday',
                    'Thursday',
                    'Friday',
                    'Saturday',
                    'Sunday',
                ].map((d) => ({ value: d, label: d }))
                break
            case 'Fortnightly':
                options = [
                    'Monday',
                    'Tuesday',
                    'Wednesday',
                    'Thursday',
                    'Friday',
                    'Saturday',
                    'Sunday',
                ].map((d) => ({ value: d, label: d }))
                break
            case 'Monthly':
                options = Array.from({ length: 31 }, (_, i) => ({
                    value: `${i + 1}`,
                    label: `Day ${i + 1}`,
                }))
                break
            case 'Quarterly':
                options = [
                    { value: 'Q1', label: 'Jan–Mar' },
                    { value: 'Q2', label: 'Apr–Jun' },
                    { value: 'Q3', label: 'Jul–Sep' },
                    { value: 'Q4', label: 'Oct–Dec' },
                ]
                break
            case 'Half-Yearly':
                options = [
                    { value: 'H1', label: 'Jan–Jun' },
                    { value: 'H2', label: 'Jul–Dec' },
                ]
                break
            case 'Yearly':
                options = [
                    'January',
                    'February',
                    'March',
                    'April',
                    'May',
                    'June',
                    'July',
                    'August',
                    'September',
                    'October',
                    'November',
                    'December',
                ].map((m) => ({ value: m, label: m }))
                break
            case 'Bi-Yearly':
                options = [
                    { value: 'B1', label: 'Year 1' },
                    { value: 'B2', label: 'Year 2' },
                ]
                break
            default:
                options = []
        }
        return options
    }

    const getAvailableMonths = () => {
        if (config.type === 'Quarterly' && selectedQuarter) {
            return availableMonths.filter(
                (month) => month.quarter === selectedQuarter,
            )
        } else if (config.type === 'Half-Yearly' && selectedHalf) {
            return availableMonths.filter(
                (month) => month.half === selectedHalf,
            )
        }
        return availableMonths
    }

    const generateDaysForMonth = (monthName: string) => {
        const month = availableMonths.find((m) => m.value === monthName)
        if (!month) return []

        return Array.from({ length: month.days }, (_, i) => ({
            value: `${i + 1}`,
            label: `Day ${i + 1}`,
        }))
    }

    const handleConfirm = () => {
        onConfirm(config)
        onClose()
    }

    const options = getDynamicOptions()
    const availableMonthsForSelection = getAvailableMonths()

    const showQuarterHalfSelection =
        (config.type === 'Quarterly' || config.type === 'Half-Yearly') &&
        !selectedQuarter &&
        !selectedHalf

    const showMonthSelection =
        (config.type === 'Quarterly' || config.type === 'Half-Yearly') &&
        (selectedQuarter || selectedHalf) &&
        !selectedMonth

    const showDaySelection =
        (config.type === 'Quarterly' ||
            config.type === 'Half-Yearly' ||
            config.type === 'Yearly') &&
        selectedMonth

    return (
        <Dialog
            isOpen={isOpen}
            width={700}
            onClose={onClose}
            onRequestClose={onClose}
        >
            <div className="p-6 max-h-[75vh] overflow-y-auto">
                <h3 className="text-lg font-semibold mb-4">
                    Set Data Entry Frequency
                </h3>

                <div className="grid grid-cols-2 gap-4">
                    <FormItem label="Type">
                        <Select
                            value={frequencyTypes.find(
                                (t) => t.value === config.type,
                            )}
                            options={frequencyTypes}
                            onChange={(option) => {
                                const newType = option?.value as FrequencyType
                                let fixedCount = 1

                                if (newType === 'Quarterly') fixedCount = 4
                                else if (newType === 'Half-Yearly')
                                    fixedCount = 2
                                else if (newType === 'Yearly') fixedCount = 12
                                else if (newType === 'Fortnightly')
                                    fixedCount = 2

                                setConfig((prev) => ({
                                    ...prev,
                                    type: newType,
                                    selectedItems: [],
                                    count: fixedCount,
                                    itemConfigs: {},
                                }))
                                setSelectedQuarter('')
                                setSelectedHalf('')
                                setSelectedMonth('')
                                setAvailableDays([])
                            }}
                        />
                    </FormItem>

                    {config.type !== 'Daily' &&
                        config.type !== 'Quarterly' &&
                        config.type !== 'Half-Yearly' &&
                        config.type !== 'Yearly' &&
                        config.type !== 'Fortnightly' && (
                            <FormItem label="Count">
                                <Input
                                    type="number"
                                    min="1"
                                    max={
                                        config.type === 'Weekly' ? 7 : undefined
                                    }
                                    value={config.count}
                                    onChange={(e) => {
                                        const value =
                                            parseInt(e.target.value) || 1
                                        if (
                                            config.type === 'Weekly' &&
                                            value > 7
                                        ) {
                                            toast.push(
                                                <Notification
                                                    title="Limit exceeded"
                                                    type="danger"
                                                >
                                                    You can only select up to 7
                                                    days in a week.
                                                </Notification>,
                                            )
                                            return
                                        }
                                        setConfig((prev) => ({
                                            ...prev,
                                            count: value,
                                            selectedItems: [],
                                            itemConfigs: {},
                                        }))
                                    }}
                                />
                            </FormItem>
                        )}

                    {(config.type === 'Quarterly' ||
                        config.type === 'Half-Yearly' ||
                        config.type === 'Yearly' ||
                        config.type === 'Fortnightly') && (
                        <FormItem label="Count">
                            <Input
                                disabled
                                type="number"
                                value={
                                    config.type === 'Quarterly'
                                        ? 4
                                        : config.type === 'Half-Yearly'
                                          ? 2
                                          : config.type === 'Fortnightly'
                                            ? 2
                                            : 12
                                }
                                className="bg-gray-100"
                            />
                        </FormItem>
                    )}

                    {showQuarterHalfSelection && (
                        <FormItem label={`Select ${config.type}`}>
                            <Select
                                value={options.find((opt) =>
                                    config.type === 'Quarterly'
                                        ? opt.value === selectedQuarter
                                        : config.type === 'Half-Yearly'
                                          ? opt.value === selectedHalf
                                          : false,
                                )}
                                options={options}
                                onChange={(option) => {
                                    if (option) {
                                        if (config.type === 'Quarterly') {
                                            setSelectedQuarter(option.value)
                                        } else if (
                                            config.type === 'Half-Yearly'
                                        ) {
                                            setSelectedHalf(option.value)
                                        }
                                        setSelectedMonth('')
                                        setAvailableDays([])
                                        setConfig((prev) => ({
                                            ...prev,
                                            selectedItems: [],
                                            itemConfigs: {},
                                        }))
                                    }
                                }}
                            />
                        </FormItem>
                    )}

                    {showMonthSelection && (
                        <FormItem label="Select Month">
                            <Select
                                value={availableMonthsForSelection.find(
                                    (m) => m.value === selectedMonth,
                                )}
                                options={availableMonthsForSelection}
                                onChange={(option) => {
                                    if (option) {
                                        setSelectedMonth(option.value)
                                        const days = generateDaysForMonth(
                                            option.value,
                                        )
                                        setAvailableDays(days)
                                        setConfig((prev) => ({
                                            ...prev,
                                            selectedItems: [],
                                            itemConfigs: {},
                                        }))
                                    }
                                }}
                            />
                        </FormItem>
                    )}

                    {config.type === 'Yearly' && !selectedMonth && (
                        <FormItem label="Select Month">
                            <Select
                                value={availableMonths.find(
                                    (m) => m.value === selectedMonth,
                                )}
                                options={availableMonths}
                                onChange={(option) => {
                                    if (option) {
                                        setSelectedMonth(option.value)
                                        const days = generateDaysForMonth(
                                            option.value,
                                        )
                                        setAvailableDays(days)
                                        setConfig((prev) => ({
                                            ...prev,
                                            selectedItems: [],
                                            itemConfigs: {},
                                        }))
                                    }
                                }}
                            />
                        </FormItem>
                    )}

                    {showDaySelection && (
                        <FormItem label="Select Days">
                            <Select
                                isMulti
                                value={availableDays.filter((d) =>
                                    config.selectedItems?.includes(d.value),
                                )}
                                options={availableDays}
                                onChange={(selectedOptions) => {
                                    const selectedDays = (
                                        selectedOptions || []
                                    ).map((opt) => opt.value)

                                    setConfig((prev) => {
                                        const newItemConfigs = {
                                            ...prev.itemConfigs,
                                        }

                                        selectedDays.forEach((day) => {
                                            const itemKey = `${selectedMonth}-${day}`

                                            if (!newItemConfigs[itemKey]) {
                                                newItemConfigs[itemKey] = {
                                                    interval: 1,
                                                    cutOffTimes: ['00:00'],
                                                }
                                            }
                                        })
                                        Object.keys(newItemConfigs).forEach(
                                            (key) => {
                                                const day = key.split('-')[1]
                                                if (
                                                    !selectedDays.includes(day)
                                                ) {
                                                    delete newItemConfigs[key]
                                                }
                                            },
                                        )

                                        return {
                                            ...prev,
                                            selectedItems: selectedDays,
                                            itemConfigs: newItemConfigs,
                                        }
                                    })
                                }}
                            />
                        </FormItem>
                    )}

                    {config.type !== 'Daily' &&
                        options.length > 0 &&
                        !showQuarterHalfSelection &&
                        !showMonthSelection &&
                        !showDaySelection &&
                        config.type !== 'Quarterly' &&
                        config.type !== 'Half-Yearly' &&
                        config.type !== 'Yearly' && (
                            <FormItem
                                label={`Select ${config.type === 'Weekly' || config.type === 'Monthly' || config.type === 'Fortnightly' ? 'Days' : 'Items'}`}
                            >
                                <Select
                                    isMulti
                                    value={options.filter((opt) =>
                                        config.selectedItems?.includes(
                                            opt.value,
                                        ),
                                    )}
                                    options={options}
                                    onChange={(selectedOptions) => {
                                        const selected = (
                                            selectedOptions || []
                                        ).map((opt) => opt.value)
                                        if (selected.length > config.count) {
                                            toast.push(
                                                <Notification
                                                    title="Selection limit"
                                                    type="danger"
                                                >
                                                    You can only select up to{' '}
                                                    {config.count}{' '}
                                                    {config.type === 'Weekly' ||
                                                    config.type === 'Monthly' ||
                                                    config.type ===
                                                        'Fortnightly'
                                                        ? 'days'
                                                        : 'items'}
                                                    .
                                                </Notification>,
                                            )
                                            return
                                        }
                                        setConfig((prev) => {
                                            const newItemConfigs = {
                                                ...prev.itemConfigs,
                                            }
                                            selected.forEach((item) => {
                                                if (!newItemConfigs[item]) {
                                                    newItemConfigs[item] = {
                                                        interval: 1,
                                                        cutOffTimes: ['00:00'],
                                                    }
                                                }
                                            })
                                            Object.keys(newItemConfigs).forEach(
                                                (key) => {
                                                    if (
                                                        !selected.includes(key)
                                                    ) {
                                                        delete newItemConfigs[
                                                            key
                                                        ]
                                                    }
                                                },
                                            )
                                            return {
                                                ...prev,
                                                selectedItems: selected,
                                                itemConfigs: newItemConfigs,
                                            }
                                        })
                                    }}
                                />
                            </FormItem>
                        )}

                    {config.type !== 'Weekly' &&
                        config.type !== 'Monthly' &&
                        config.type !== 'Fortnightly' &&
                        config.type !== 'Quarterly' &&
                        config.type !== 'Half-Yearly' &&
                        config.type !== 'Yearly' && (
                            <FormItem label="Interval">
                                <Input
                                    type="number"
                                    min="1"
                                    value={config.interval}
                                    onChange={(e) =>
                                        setConfig((prev) => ({
                                            ...prev,
                                            interval:
                                                parseInt(e.target.value) || 1,
                                        }))
                                    }
                                />
                            </FormItem>
                        )}
                </div>

                {(config.type === 'Weekly' ||
                    config.type === 'Monthly' ||
                    config.type === 'Fortnightly') &&
                    (config.selectedItems?.length ?? 0) > 0 && (
                        <div className="mt-5">
                            <h4 className="font-semibold mb-3">
                                {config.type === 'Weekly'
                                    ? 'Per-Day Settings'
                                    : config.type === 'Fortnightly'
                                      ? 'Per-Day Settings (Fortnightly)'
                                      : 'Per-Day Settings (Monthly)'}
                            </h4>

                            {config.selectedItems!.map((item) => {
                                const dayConfig = config.itemConfigs?.[
                                    item
                                ] || {
                                    interval: 1,
                                    cutOffTimes: ['00:00'],
                                }

                                return (
                                    <div
                                        key={item}
                                        className="border rounded p-3 mb-3 bg-gray-50"
                                    >
                                        <h5 className="font-medium mb-2">
                                            {config.type === 'Weekly' ||
                                            config.type === 'Fortnightly'
                                                ? item
                                                : `Day ${item}`}
                                        </h5>
                                        <FormItem
                                            label={`Interval for ${item}`}
                                        >
                                            <Input
                                                type="number"
                                                min="1"
                                                value={dayConfig.interval}
                                                onChange={(e) => {
                                                    const val =
                                                        parseInt(
                                                            e.target.value,
                                                        ) || 1
                                                    setConfig((prev) => {
                                                        const newConfigs = {
                                                            ...prev.itemConfigs,
                                                        }
                                                        const updated =
                                                            newConfigs[item] ||
                                                            dayConfig
                                                        const cutoffs = [
                                                            ...updated.cutOffTimes,
                                                        ]
                                                        if (
                                                            val > cutoffs.length
                                                        ) {
                                                            for (
                                                                let i =
                                                                    cutoffs.length;
                                                                i < val;
                                                                i++
                                                            ) {
                                                                cutoffs.push(
                                                                    '00:00',
                                                                )
                                                            }
                                                        } else if (
                                                            val < cutoffs.length
                                                        ) {
                                                            cutoffs.splice(val)
                                                        }
                                                        newConfigs[item] = {
                                                            interval: val,
                                                            cutOffTimes:
                                                                cutoffs,
                                                        }
                                                        return {
                                                            ...prev,
                                                            itemConfigs:
                                                                newConfigs,
                                                        }
                                                    })
                                                }}
                                            />
                                        </FormItem>

                                        {dayConfig.cutOffTimes.map(
                                            (time, i) => (
                                                <div
                                                    key={i}
                                                    className="flex items-center gap-2 mb-2"
                                                >
                                                    <TimeInput
                                                        format="12"
                                                        value={
                                                            new Date(
                                                                `2000-01-01T${time}`,
                                                            )
                                                        }
                                                        onChange={(date) => {
                                                            setConfig(
                                                                (prev) => {
                                                                    const newConfigs =
                                                                        {
                                                                            ...prev.itemConfigs,
                                                                        }
                                                                    const updated =
                                                                        newConfigs[
                                                                            item
                                                                        ]
                                                                    const newTimes =
                                                                        [
                                                                            ...updated.cutOffTimes,
                                                                        ]

                                                                    if (!date) {
                                                                        newTimes.splice(
                                                                            i,
                                                                            1,
                                                                        )
                                                                    } else {
                                                                        const timeStr =
                                                                            date
                                                                                .toTimeString()
                                                                                .slice(
                                                                                    0,
                                                                                    5,
                                                                                )
                                                                        newTimes[
                                                                            i
                                                                        ] =
                                                                            timeStr
                                                                    }

                                                                    newConfigs[
                                                                        item
                                                                    ] = {
                                                                        ...updated,
                                                                        cutOffTimes:
                                                                            newTimes,
                                                                    }

                                                                    return {
                                                                        ...prev,
                                                                        itemConfigs:
                                                                            newConfigs,
                                                                    }
                                                                },
                                                            )
                                                        }}
                                                    />
                                                </div>
                                            ),
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    )}

                {showDaySelection &&
                    (config.selectedItems?.length ?? 0) > 0 && (
                        <div className="mt-5">
                            <h4 className="font-semibold mb-3">
                                {`Per-Day Settings (${config.type} - ${selectedMonth})`}
                            </h4>

                            {config.selectedItems!.map((day) => {
                                const itemKey = `${selectedMonth}-${day}`
                                const dayConfig = config.itemConfigs?.[
                                    itemKey
                                ] || {
                                    interval: 1,
                                    cutOffTimes: ['00:00'],
                                }

                                return (
                                    <div
                                        key={itemKey}
                                        className="border rounded p-3 mb-3 bg-gray-50"
                                    >
                                        <h5 className="font-medium mb-2">
                                            {`${selectedMonth} - Day ${day}`}
                                        </h5>
                                        <FormItem
                                            label={`Interval for Day ${day}`}
                                        >
                                            <Input
                                                type="number"
                                                min="1"
                                                value={dayConfig.interval}
                                                onChange={(e) => {
                                                    const val =
                                                        parseInt(
                                                            e.target.value,
                                                        ) || 1
                                                    setConfig((prev) => {
                                                        const newConfigs = {
                                                            ...prev.itemConfigs,
                                                        }
                                                        const updated =
                                                            newConfigs[
                                                                itemKey
                                                            ] || dayConfig
                                                        const cutoffs = [
                                                            ...updated.cutOffTimes,
                                                        ]
                                                        if (
                                                            val > cutoffs.length
                                                        ) {
                                                            for (
                                                                let i =
                                                                    cutoffs.length;
                                                                i < val;
                                                                i++
                                                            ) {
                                                                cutoffs.push(
                                                                    '00:00',
                                                                )
                                                            }
                                                        } else if (
                                                            val < cutoffs.length
                                                        ) {
                                                            cutoffs.splice(val)
                                                        }
                                                        newConfigs[itemKey] = {
                                                            interval: val,
                                                            cutOffTimes:
                                                                cutoffs,
                                                        }
                                                        return {
                                                            ...prev,
                                                            itemConfigs:
                                                                newConfigs,
                                                        }
                                                    })
                                                }}
                                            />
                                        </FormItem>

                                        {dayConfig.cutOffTimes.map(
                                            (time, i) => (
                                                <div
                                                    key={i}
                                                    className="flex items-center gap-2 mb-2"
                                                >
                                                    <TimeInput
                                                        format="12"
                                                        value={
                                                            new Date(
                                                                `2000-01-01T${time}`,
                                                            )
                                                        }
                                                        onChange={(date) => {
                                                            setConfig(
                                                                (prev) => {
                                                                    const newConfigs =
                                                                        {
                                                                            ...prev.itemConfigs,
                                                                        }
                                                                    const updated =
                                                                        newConfigs[
                                                                            itemKey
                                                                        ]
                                                                    const newTimes =
                                                                        [
                                                                            ...updated.cutOffTimes,
                                                                        ]

                                                                    if (!date) {
                                                                        newTimes.splice(
                                                                            i,
                                                                            1,
                                                                        )
                                                                    } else {
                                                                        const timeStr =
                                                                            date
                                                                                .toTimeString()
                                                                                .slice(
                                                                                    0,
                                                                                    5,
                                                                                )
                                                                        newTimes[
                                                                            i
                                                                        ] =
                                                                            timeStr
                                                                    }

                                                                    newConfigs[
                                                                        itemKey
                                                                    ] = {
                                                                        ...updated,
                                                                        cutOffTimes:
                                                                            newTimes,
                                                                    }

                                                                    return {
                                                                        ...prev,
                                                                        itemConfigs:
                                                                            newConfigs,
                                                                    }
                                                                },
                                                            )
                                                        }}
                                                    />
                                                </div>
                                            ),
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    )}

                {config.type !== 'Weekly' &&
                    config.type !== 'Monthly' &&
                    config.type !== 'Fortnightly' &&
                    config.type !== 'Quarterly' &&
                    config.type !== 'Half-Yearly' &&
                    config.type !== 'Yearly' &&
                    config.cutOffTimes?.length > 0 && (
                        <div className="mt-4">
                            <FormItem label="Cut-off Times">
                                {config.cutOffTimes.map((time, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-2 mb-2"
                                    >
                                        <TimeInput
                                            format="12"
                                            value={
                                                new Date(`2000-01-01T${time}`)
                                            }
                                            onChange={(date) => {
                                                setConfig((prev) => {
                                                    const newTimes = [
                                                        ...prev.cutOffTimes!,
                                                    ]

                                                    if (!date) {
                                                        newTimes.splice(i, 1)
                                                    } else {
                                                        const timeString = date
                                                            .toTimeString()
                                                            .slice(0, 5)
                                                        newTimes[i] = timeString
                                                    }

                                                    return {
                                                        ...prev,
                                                        cutOffTimes: newTimes,
                                                    }
                                                })
                                            }}
                                        />
                                    </div>
                                ))}
                            </FormItem>
                        </div>
                    )}

                <div className="flex justify-end space-x-2 mt-6">
                    <Button onClick={onClose}>Cancel</Button>
                    <Button variant="solid" onClick={handleConfirm}>
                        Confirm
                    </Button>
                </div>
            </div>
        </Dialog>
    )
}

export default FrequencyPopup
