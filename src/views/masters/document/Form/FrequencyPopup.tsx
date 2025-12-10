/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react'
import { Dialog } from '@/components/ui/Dialog'
import Button from '@/components/ui/Button'
import { FormItem } from '@/components/ui/Form'
import { Drawer } from '@/components/ui/Drawer'
import { Select } from '@/components/ui/Select'
import Input from '@/components/ui/Input'
import TimeInput from '@/components/ui/TimeInput'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import {
    FrequencyConfig,
    FrequencyPopupProps,
    FrequencyType,
} from '@/@types/document'
import { Card } from '@/components/ui'

const FrequencyPopup = ({
    isOpen,
    onClose,
    onConfirm,
    initialData,
    initialSettings,
    triates,
}: FrequencyPopupProps) => {
    const [config, setConfig] = useState<FrequencyConfig>({
        type: 'Daily',
        interval: 1,
        count: 1,
        cutOffTime: '00:00',
        cutOffTimes: ['00:00'],
        selectedItems: [],
        itemConfigs: {},
        selectedMonth: '',
        selectedDay: '',
    })

    console.log(triates)

    const [availableDays, setAvailableDays] = useState<
        { value: string; label: string }[]
    >([])
    const [showLastDayConfirm, setShowLastDayConfirm] = useState(false)
    const [pendingDay, setPendingDay] = useState<string>('')
    const [pendingMonth, setPendingMonth] = useState<string>('')
    const [pendingConfigType, setPendingConfigType] =
        useState<FrequencyType>('Monthly')
    const [settings, setSettings] = useState<Record<string, any>>({})
    const [tempInput, setTempInput] = useState<Record<string, string>>({})

    const tables = ['location', 'department', 'user']
    const fields: Record<string, string[]> = {
        user: ['name', 'email', 'age'],
        location: ['name', 'identifier'],
        department: ['name', 'identifier'],
    }

    useEffect(() => {
        if (initialData) {
            setConfig(initialData)
            setSettings(initialSettings)
            if (
                initialData.selectedMonth &&
                (initialData.type === 'Quarterly' ||
                    initialData.type === 'Half-Yearly' ||
                    initialData.type === 'Yearly')
            ) {
                const days = generateDaysForMonth(
                    initialData.selectedMonth,
                    initialData.type,
                )
                setAvailableDays(days)
            }
        }
    }, [initialData, initialSettings])

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

    const frequencyTypes = [
        { value: 'Daily', label: 'Daily' },
        { value: 'Weekly', label: 'Weekly' },
        { value: 'Fortnightly', label: 'Fortnightly' },
        { value: 'Monthly', label: 'Monthly' },
        { value: 'Quarterly', label: 'Quarterly' },
        { value: 'Half-Yearly', label: 'Half-Yearly' },
        { value: 'Yearly', label: 'Yearly' },
    ]

    const getMonthOptions = () => {
        switch (config.type) {
            case 'Quarterly':
                return Array.from({ length: 3 }, (_, i) => ({
                    value: `Month ${i + 1}`,
                    label: `Month ${i + 1}`,
                }))
            case 'Half-Yearly':
                return Array.from({ length: 6 }, (_, i) => ({
                    value: `Month ${i + 1}`,
                    label: `Month ${i + 1}`,
                }))
            case 'Yearly':
                return Array.from({ length: 12 }, (_, i) => ({
                    value: `Month ${i + 1}`,
                    label: `Month ${i + 1}`,
                }))
            default:
                return []
        }
    }

    const getDayOptions = () => {
        switch (config.type) {
            case 'Weekly':
                return [
                    'Monday',
                    'Tuesday',
                    'Wednesday',
                    'Thursday',
                    'Friday',
                    'Saturday',
                    'Sunday',
                ].map((d) => ({ value: d, label: d }))
            case 'Monthly':
                return Array.from({ length: 31 }, (_, i) => ({
                    value: `${i + 1}`,
                    label: `Day ${i + 1}`,
                }))
            case 'Fortnightly':
                return Array.from({ length: 15 }, (_, i) => ({
                    value: `Day ${i + 1}`,
                    label: `Day ${i + 1}`,
                }))
            default:
                return []
        }
    }

    const generateDaysForMonth = (
        month: string,
        frequencyType?: FrequencyType,
    ) => {
        const currentType = frequencyType || config.type

        if (
            currentType === 'Quarterly' ||
            currentType === 'Half-Yearly' ||
            currentType === 'Yearly'
        ) {
            return Array.from({ length: 31 }, (_, i) => ({
                value: `${i + 1}`,
                label: `Day ${i + 1}`,
            }))
        }

        return []
    }

    const isLastDayCandidate = (
        day: string,
        monthName: string,
        configType: FrequencyType,
    ) => {
        const dayNum = parseInt(day)

        if (
            configType === 'Monthly' ||
            configType === 'Quarterly' ||
            configType === 'Half-Yearly' ||
            configType === 'Yearly'
        ) {
            return dayNum >= 28 && dayNum <= 31
        }

        return false
    }

    const handleDaySelection = (
        day: string,
        month: string,
        configType: FrequencyType,
    ) => {
        if (isLastDayCandidate(day, month, configType)) {
            setPendingDay(day)
            setPendingMonth(month)
            setPendingConfigType(configType)
            setShowLastDayConfirm(true)
        } else {
            finalizeDaySelection(day, month, false, configType)
        }
    }

    const finalizeDaySelection = (
        day: string,
        month: string,
        considerLastDay: boolean,
        configType: FrequencyType,
    ) => {
        let itemKey = ''

        if (configType === 'Monthly') {
            itemKey = day
        } else {
            itemKey = `${month}-${day}`
        }

        setConfig((prev) => ({
            ...prev,
            selectedItems: [day],
            selectedMonth: configType === 'Monthly' ? '' : month,
            selectedDay: day,
            itemConfigs: {
                [itemKey]: {
                    interval: 1,
                    cutOffTimes: ['09:00'],
                    considerLastDay: considerLastDay,
                },
            },
        }))

        setShowLastDayConfirm(false)

        if (considerLastDay) {
            let message = ''
            if (configType === 'Monthly') {
                message = `Notifications will be sent on the last day of every month instead of day ${day}.`
            } else {
                message = `Notifications will be sent on the last day of ${month} instead of day ${day}.`
            }

            toast.push(
                <Notification title="Last day consideration set" type="success">
                    {message}
                </Notification>,
            )
        }
    }

    useEffect(() => {
        const selectedMonth = config.selectedMonth || ''
        if (
            selectedMonth &&
            (config.type === 'Quarterly' ||
                config.type === 'Half-Yearly' ||
                config.type === 'Yearly')
        ) {
            const days = generateDaysForMonth(selectedMonth)
            setAvailableDays(days)
            if (
                !(
                    config.selectedDay &&
                    days.find((d) => d.value === config.selectedDay)
                )
            ) {
                setConfig((prev) => ({
                    ...prev,
                    selectedDay: '',
                }))
            }
        } else {
            setAvailableDays([])
        }
    }, [config.selectedMonth, config.type])
    const handleConfirm = () => {
        const selectedMonth = config.selectedMonth || ''
        const selectedDay = config.selectedDay || ''
        if (
            (config.type === 'Quarterly' ||
                config.type === 'Half-Yearly' ||
                config.type === 'Yearly') &&
            (!selectedMonth || !selectedDay)
        ) {
            toast.push(
                <Notification title="Selection incomplete" type="danger">
                    Please select both month and day.
                </Notification>,
            )
            return
        }
        if (
            (config.type === 'Weekly' ||
                config.type === 'Monthly' ||
                config.type === 'Fortnightly') &&
            !config.selectedItems?.[0]
        ) {
            toast.push(
                <Notification title="Selection incomplete" type="danger">
                    Please select a day.
                </Notification>,
            )
            return
        }

        console.log('Saving Frequency Config:', config)
        onConfirm(config, settings)
        onClose()
    }

    const updateSetting = (header: string, type: string, value: any) => {
        setSettings((prev) => ({
            ...prev,
            [header]: {
                type,
                ...prev[header],
                ...value,
            },
        }))
    }

    const addOption = (header: string, type: string) => {
        const newValue = tempInput[header]?.trim()
        if (!newValue) return

        setSettings((prev) => ({
            ...prev,
            [header]: {
                type,
                ...prev[header],
                options: [...(prev[header]?.options || []), newValue],
            },
        }))

        setTempInput((prev) => ({ ...prev, [header]: '' }))
    }
    console.log(addOption)

    const monthOptions = getMonthOptions()
    const dayOptions = getDayOptions()

    const showMonthDaySelection =
        config.type === 'Quarterly' ||
        config.type === 'Half-Yearly' ||
        config.type === 'Yearly'

    const showSingleDaySelection =
        config.type === 'Weekly' ||
        config.type === 'Monthly' ||
        config.type === 'Fortnightly'

    const showCountField = config.type !== 'Daily'

    const isCountEditable = (type: FrequencyType) => {
        return type === 'Weekly'
    }

    const selectedMonth = config.selectedMonth || ''
    const selectedDay = config.selectedDay || ''

    return (
        <>
            <Drawer
                title="Set Data Entry Frequency"
                isOpen={isOpen}
                width={800}
                onClose={onClose}
                onRequestClose={onClose}
            >
                <>
                    <Card className="mb-2">
                        <h4>⚙️ Frequency Settings</h4>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <FormItem label="Type">
                                <Select
                                    value={frequencyTypes.find(
                                        (t) => t.value === config.type,
                                    )}
                                    options={frequencyTypes}
                                    onChange={(option) => {
                                        const newType =
                                            option?.value as FrequencyType
                                        setConfig((prev) => ({
                                            ...prev,
                                            type: newType,
                                            selectedItems: [],
                                            selectedMonth: '',
                                            selectedDay: '',
                                            count: 1,
                                            itemConfigs: {},
                                        }))
                                        setAvailableDays([])
                                    }}
                                />
                            </FormItem>

                            {showCountField && (
                                <FormItem label="Count">
                                    <Input
                                        type="number"
                                        min="1"
                                        max={config.type === 'Weekly' ? 7 : 1}
                                        value={config.count}
                                        disabled={!isCountEditable(config.type)}
                                        onChange={(e) => {
                                            const value =
                                                parseInt(e.target.value) || 1
                                            if (config.type === 'Weekly') {
                                                if (value > 7) {
                                                    toast.push(
                                                        <Notification
                                                            title="Limit exceeded"
                                                            type="danger"
                                                        >
                                                            You can only select
                                                            up to 7 days in a
                                                            week.
                                                        </Notification>,
                                                    )
                                                    return
                                                }

                                                setConfig((prev) => {
                                                    const currentSelectedItems =
                                                        prev.selectedItems || []
                                                    const newSelectedItems =
                                                        currentSelectedItems.slice(
                                                            0,
                                                            value,
                                                        )

                                                    const newItemConfigs = {
                                                        ...prev.itemConfigs,
                                                    }
                                                    Object.keys(
                                                        newItemConfigs,
                                                    ).forEach((key) => {
                                                        if (
                                                            !newSelectedItems.includes(
                                                                key,
                                                            )
                                                        ) {
                                                            delete newItemConfigs[
                                                                key
                                                            ]
                                                        }
                                                    })

                                                    return {
                                                        ...prev,
                                                        count: value,
                                                        selectedItems:
                                                            newSelectedItems,
                                                        itemConfigs:
                                                            newItemConfigs,
                                                    }
                                                })
                                            } else {
                                                if (value > 1) {
                                                    toast.push(
                                                        <Notification
                                                            title="Limit exceeded"
                                                            type="danger"
                                                        >
                                                            You can only select
                                                            1 day for{' '}
                                                            {config.type.toLowerCase()}{' '}
                                                            frequency.
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
                                            }
                                        }}
                                    />
                                </FormItem>
                            )}
                        </div>

                        {showMonthDaySelection && (
                            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <h4 className="text-md font-semibold text-blue-900 mb-4 flex items-center">
                                    <span className="w-4 h-4 bg-blue-500 rounded-full mr-2"></span>
                                    Month & Day Selection
                                </h4>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    <FormItem
                                        label={
                                            config.type === 'Quarterly'
                                                ? 'Select Month (1-3)'
                                                : config.type === 'Half-Yearly'
                                                  ? 'Select Month (1-6)'
                                                  : 'Select Month'
                                        }
                                    >
                                        <Select
                                            value={monthOptions.find(
                                                (m) =>
                                                    m.value === selectedMonth,
                                            )}
                                            options={monthOptions}
                                            onChange={(option) => {
                                                if (option) {
                                                    setConfig((prev) => ({
                                                        ...prev,
                                                        selectedMonth:
                                                            option.value,
                                                        selectedDay: '',
                                                    }))
                                                }
                                            }}
                                        />
                                    </FormItem>

                                    <FormItem label="Select Day">
                                        <Select
                                            value={availableDays.find(
                                                (d) =>
                                                    d.value ===
                                                    config.selectedDay,
                                            )}
                                            options={availableDays}
                                            isDisabled={!selectedMonth}
                                            onChange={(option) => {
                                                if (option) {
                                                    handleDaySelection(
                                                        option.value,
                                                        selectedMonth,
                                                        config.type,
                                                    )
                                                }
                                            }}
                                        />
                                    </FormItem>
                                </div>
                            </div>
                        )}

                        {showSingleDaySelection && (
                            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                                <h4 className="text-md font-semibold text-green-900 mb-4 flex items-center">
                                    <span className="w-4 h-4 bg-green-500 rounded-full mr-2"></span>
                                    {config.type === 'Weekly'
                                        ? 'Day Selection'
                                        : config.type === 'Monthly'
                                          ? 'Monthly Day Selection'
                                          : 'Fortnightly Selection'}
                                </h4>
                                <FormItem
                                    label={
                                        config.type === 'Weekly'
                                            ? 'Select Days'
                                            : config.type === 'Monthly'
                                              ? 'Select Day'
                                              : 'Select Day (1-15)'
                                    }
                                >
                                    <Select
                                        isMulti={
                                            config.type === 'Weekly' &&
                                            config.count > 1
                                        }
                                        value={
                                            config.type === 'Weekly' &&
                                            config.count > 1
                                                ? dayOptions.filter((opt) =>
                                                      config.selectedItems?.includes(
                                                          opt.value,
                                                      ),
                                                  )
                                                : dayOptions.find(
                                                      (opt) =>
                                                          config
                                                              .selectedItems?.[0] ===
                                                          opt.value,
                                                  )
                                        }
                                        options={dayOptions}
                                        onChange={(selectedOptions) => {
                                            if (
                                                config.type === 'Weekly' &&
                                                config.count > 1
                                            ) {
                                                const selected = Array.isArray(
                                                    selectedOptions,
                                                )
                                                    ? selectedOptions.map(
                                                          (opt: any) =>
                                                              opt.value,
                                                      )
                                                    : []

                                                const limitedSelection =
                                                    selected.slice(
                                                        0,
                                                        config.count,
                                                    )

                                                if (
                                                    selected.length >
                                                    config.count
                                                ) {
                                                    toast.push(
                                                        <Notification
                                                            title="Selection limit"
                                                            type="danger"
                                                        >
                                                            You can only select
                                                            up to {config.count}{' '}
                                                            days.
                                                        </Notification>,
                                                    )
                                                }

                                                setConfig((prev) => {
                                                    const newItemConfigs = {
                                                        ...prev.itemConfigs,
                                                    }
                                                    limitedSelection.forEach(
                                                        (item) => {
                                                            if (
                                                                !newItemConfigs[
                                                                    item
                                                                ]
                                                            ) {
                                                                newItemConfigs[
                                                                    item
                                                                ] = {
                                                                    interval: 1,
                                                                    cutOffTimes:
                                                                        [
                                                                            '00:00',
                                                                        ],
                                                                    considerLastDay: false,
                                                                }
                                                            }
                                                        },
                                                    )
                                                    Object.keys(
                                                        newItemConfigs,
                                                    ).forEach((key) => {
                                                        if (
                                                            !limitedSelection.includes(
                                                                key,
                                                            )
                                                        ) {
                                                            delete newItemConfigs[
                                                                key
                                                            ]
                                                        }
                                                    })
                                                    return {
                                                        ...prev,
                                                        selectedItems:
                                                            limitedSelection,
                                                        itemConfigs:
                                                            newItemConfigs,
                                                    }
                                                })
                                            } else {
                                                const option =
                                                    selectedOptions as any
                                                if (option) {
                                                    const selectedDay =
                                                        option.value
                                                    if (
                                                        config.type ===
                                                        'Monthly'
                                                    ) {
                                                        handleDaySelection(
                                                            selectedDay,
                                                            '',
                                                            config.type,
                                                        )
                                                    } else {
                                                        setConfig((prev) => {
                                                            const newItemConfigs =
                                                                {
                                                                    ...prev.itemConfigs,
                                                                }

                                                            if (
                                                                !newItemConfigs[
                                                                    selectedDay
                                                                ]
                                                            ) {
                                                                newItemConfigs[
                                                                    selectedDay
                                                                ] = {
                                                                    interval: 1,
                                                                    cutOffTimes:
                                                                        [
                                                                            '00:00',
                                                                        ],
                                                                    considerLastDay: false,
                                                                }
                                                            }

                                                            Object.keys(
                                                                newItemConfigs,
                                                            ).forEach((key) => {
                                                                if (
                                                                    key !==
                                                                    selectedDay
                                                                ) {
                                                                    delete newItemConfigs[
                                                                        key
                                                                    ]
                                                                }
                                                            })

                                                            return {
                                                                ...prev,
                                                                selectedItems: [
                                                                    selectedDay,
                                                                ],
                                                                selectedDay:
                                                                    selectedDay,
                                                                itemConfigs:
                                                                    newItemConfigs,
                                                            }
                                                        })
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                </FormItem>
                            </div>
                        )}

                        {config.type !== 'Weekly' &&
                            config.type !== 'Monthly' &&
                            config.type !== 'Fortnightly' &&
                            config.type !== 'Quarterly' &&
                            config.type !== 'Half-Yearly' &&
                            config.type !== 'Yearly' && (
                                <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
                                    <FormItem label="Interval">
                                        <Input
                                            type="number"
                                            min="1"
                                            value={config.interval}
                                            onChange={(e) =>
                                                setConfig((prev) => ({
                                                    ...prev,
                                                    interval:
                                                        parseInt(
                                                            e.target.value,
                                                        ) || 1,
                                                }))
                                            }
                                        />
                                    </FormItem>
                                </div>
                            )}
                    </Card>
                    <>
                        {showMonthDaySelection &&
                            selectedMonth &&
                            selectedDay && (
                                <Card>
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-lg font-semibold text-gray-800 flex items-center">
                                            <div className="w-6 h-6 bg-orange-100 rounded-md flex items-center justify-center mr-3">
                                                <span className="text-orange-600 text-sm font-bold">
                                                    📅
                                                </span>
                                            </div>
                                            {`Per-Day Settings (${config.type} - ${selectedMonth} - Day ${selectedDay})`}
                                        </h4>
                                        {config.itemConfigs?.[
                                            `${selectedMonth}-${selectedDay}`
                                        ]?.considerLastDay && (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                                                Last Day Mode
                                            </span>
                                        )}
                                    </div>

                                    <div className="border rounded-lg p-4 bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200">
                                        <h5 className="font-medium mb-3 text-gray-800 flex items-center">
                                            <span className="w-3 h-3 bg-orange-400 rounded-full mr-2"></span>
                                            {`${selectedMonth} - Day ${selectedDay}`}
                                            {config.itemConfigs?.[
                                                `${selectedMonth}-${selectedDay}`
                                            ]?.considerLastDay && (
                                                <span className="ml-2 text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded">
                                                    (Notifications will be sent
                                                    on last day of month)
                                                </span>
                                            )}
                                        </h5>

                                        <FormItem
                                            label={`Interval for Day ${selectedDay}`}
                                        >
                                            <Input
                                                type="number"
                                                min="1"
                                                value={
                                                    config.itemConfigs?.[
                                                        `${selectedMonth}-${selectedDay}`
                                                    ]?.interval || 1
                                                }
                                                onChange={(e) => {
                                                    const val =
                                                        parseInt(
                                                            e.target.value,
                                                        ) || 1
                                                    setConfig((prev) => {
                                                        const newConfigs = {
                                                            ...prev.itemConfigs,
                                                        }
                                                        const itemKey = `${selectedMonth}-${selectedDay}`
                                                        const currentConfig =
                                                            newConfigs[
                                                                itemKey
                                                            ] || {
                                                                interval: 1,
                                                                cutOffTimes: [
                                                                    '00:00',
                                                                ],
                                                                considerLastDay: false,
                                                            }
                                                        const cutoffs = [
                                                            ...currentConfig.cutOffTimes,
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
                                                            ...currentConfig,
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

                                        <div className="mt-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
                                                <span className="w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
                                                Cut-off Times
                                            </label>
                                            {(
                                                config.itemConfigs?.[
                                                    `${selectedMonth}-${selectedDay}`
                                                ]?.cutOffTimes || ['00:00']
                                            ).map((time, i) => (
                                                <div
                                                    key={i}
                                                    className="flex items-center gap-3 mb-3 p-3 bg-white rounded-lg border border-gray-200 shadow-xs"
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
                                                                    const itemKey = `${selectedMonth}-${selectedDay}`
                                                                    const currentConfig =
                                                                        newConfigs[
                                                                            itemKey
                                                                        ] || {
                                                                            interval: 1,
                                                                            cutOffTimes:
                                                                                [
                                                                                    '00:00',
                                                                                ],
                                                                            considerLastDay: false,
                                                                        }
                                                                    const newTimes =
                                                                        [
                                                                            ...currentConfig.cutOffTimes,
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
                                                                        ...currentConfig,
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
                                            ))}
                                        </div>
                                    </div>
                                </Card>
                            )}

                        {showSingleDaySelection &&
                            config.selectedItems &&
                            config.selectedItems.length > 0 && (
                                <Card className="mb-2">
                                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                        <div className="w-6 h-6 bg-green-100 rounded-md flex items-center justify-center mr-3">
                                            <span className="text-green-600 text-sm font-bold">
                                                📊
                                            </span>
                                        </div>
                                        {config.type === 'Weekly'
                                            ? 'Per-Day Settings'
                                            : config.type === 'Monthly'
                                              ? 'Per-Day Settings (Monthly)'
                                              : 'Per-Day Settings (Fortnightly)'}
                                    </h4>

                                    {config.selectedItems.map((item) => {
                                        const dayConfig = config.itemConfigs?.[
                                            item
                                        ] || {
                                            interval: 1,
                                            cutOffTimes: ['00:00'],
                                            considerLastDay: false,
                                        }

                                        return (
                                            <div
                                                key={item}
                                                className="border rounded-lg p-4 mb-4 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200"
                                            >
                                                <h5 className="font-medium mb-3 text-gray-800 flex items-center justify-between">
                                                    <span className="flex items-center">
                                                        <span className="w-3 h-3 bg-green-400 rounded-full mr-2"></span>
                                                        {config.type ===
                                                        'Weekly'
                                                            ? item
                                                            : config.type ===
                                                                'Monthly'
                                                              ? `Day ${item}`
                                                              : item}
                                                    </span>
                                                    {dayConfig.considerLastDay && (
                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                                                            Last Day Mode
                                                        </span>
                                                    )}
                                                </h5>

                                                <FormItem
                                                    label={`Interval for ${config.type === 'Weekly' ? item : `Day ${item}`}`}
                                                >
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        value={
                                                            dayConfig.interval
                                                        }
                                                        onChange={(e) => {
                                                            const val =
                                                                parseInt(
                                                                    e.target
                                                                        .value,
                                                                ) || 1
                                                            setConfig(
                                                                (prev) => {
                                                                    const newConfigs =
                                                                        {
                                                                            ...prev.itemConfigs,
                                                                        }
                                                                    const updated =
                                                                        newConfigs[
                                                                            item
                                                                        ] ||
                                                                        dayConfig
                                                                    const cutoffs =
                                                                        [
                                                                            ...updated.cutOffTimes,
                                                                        ]
                                                                    if (
                                                                        val >
                                                                        cutoffs.length
                                                                    ) {
                                                                        for (
                                                                            let i =
                                                                                cutoffs.length;
                                                                            i <
                                                                            val;
                                                                            i++
                                                                        ) {
                                                                            cutoffs.push(
                                                                                '00:00',
                                                                            )
                                                                        }
                                                                    } else if (
                                                                        val <
                                                                        cutoffs.length
                                                                    ) {
                                                                        cutoffs.splice(
                                                                            val,
                                                                        )
                                                                    }
                                                                    newConfigs[
                                                                        item
                                                                    ] = {
                                                                        ...updated,
                                                                        interval:
                                                                            val,
                                                                        cutOffTimes:
                                                                            cutoffs,
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
                                                </FormItem>

                                                <div className="mt-4">
                                                    <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
                                                        <span className="w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
                                                        Cut-off Times
                                                    </label>

                                                    {dayConfig.cutOffTimes.map(
                                                        (time, i) => (
                                                            <div
                                                                key={i}
                                                                className="flex items-center gap-3 mb-3 p-3 bg-white rounded-lg border border-gray-200 shadow-xs"
                                                            >
                                                                <TimeInput
                                                                    format="12"
                                                                    value={
                                                                        new Date(
                                                                            `2000-01-01T${time}`,
                                                                        )
                                                                    }
                                                                    onChange={(
                                                                        date,
                                                                    ) => {
                                                                        setConfig(
                                                                            (
                                                                                prev,
                                                                            ) => {
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

                                                                                if (
                                                                                    !date
                                                                                ) {
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
                                                                                ] =
                                                                                    {
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
                                            </div>
                                        )
                                    })}
                                </Card>
                            )}

                        {config.type !== 'Weekly' &&
                            config.type !== 'Monthly' &&
                            config.type !== 'Fortnightly' &&
                            config.type !== 'Quarterly' &&
                            config.type !== 'Half-Yearly' &&
                            config.type !== 'Yearly' &&
                            config.cutOffTimes?.length > 0 && (
                                <Card className="mb-2">
                                    <FormItem label="⏰ Cut-off Times">
                                        <div className="space-y-3">
                                            {config.cutOffTimes.map(
                                                (time, i) => (
                                                    <div
                                                        key={i}
                                                        className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg border border-purple-200"
                                                    >
                                                        <TimeInput
                                                            format="12"
                                                            value={
                                                                new Date(
                                                                    `2000-01-01T${time}`,
                                                                )
                                                            }
                                                            onChange={(
                                                                date,
                                                            ) => {
                                                                setConfig(
                                                                    (prev) => {
                                                                        const newTimes =
                                                                            [
                                                                                ...prev.cutOffTimes!,
                                                                            ]
                                                                        if (
                                                                            !date
                                                                        ) {
                                                                            newTimes.splice(
                                                                                i,
                                                                                1,
                                                                            )
                                                                        } else {
                                                                            const timeString =
                                                                                date
                                                                                    .toTimeString()
                                                                                    .slice(
                                                                                        0,
                                                                                        5,
                                                                                    )
                                                                            newTimes[
                                                                                i
                                                                            ] =
                                                                                timeString
                                                                        }
                                                                        return {
                                                                            ...prev,
                                                                            cutOffTimes:
                                                                                newTimes,
                                                                        }
                                                                    },
                                                                )
                                                            }}
                                                        />
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </FormItem>
                                </Card>
                            )}
                    </>

                    <Card>
                        <h4> 📋 Field Configuration </h4>

                        {(['daily', 'oneTime'] as const).map((section) => (
                            <div key={section} className="mb-8">
                                <div className="flex items-center mb-4">
                                    <div
                                        className={`w-4 h-4 rounded-full mr-3 ${
                                            section === 'daily'
                                                ? 'bg-green-400'
                                                : 'bg-purple-400'
                                        }`}
                                    ></div>
                                    <h3 className="text-lg font-semibold text-gray-800 capitalize">
                                        {section === 'daily'
                                            ? '📅 Daily Fields'
                                            : '⏰ One-Time Fields'}
                                    </h3>
                                </div>

                                <div className="space-y-4">
                                    {triates[section].map((field, index) => {
                                        const type =
                                            field.traits?.[0]?.value ?? 'text'
                                        const saved =
                                            settings[field.headerText] || {}

                                        return (
                                            <div
                                                key={`${section}-${index}`}
                                                className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow duration-200"
                                            >
                                                <h4 className="font-semibold text-gray-800 mb-4 flex items-center justify-between">
                                                    <span className="flex items-center">
                                                        <span className="w-3 h-3 bg-blue-300 rounded-full mr-2"></span>
                                                        {field.headerText}
                                                    </span>
                                                    <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full border">
                                                        {type}
                                                    </span>
                                                </h4>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {section === 'daily' && (
                                                        <div className="flex items-center">
                                                            <label className="flex items-center cursor-pointer">
                                                                <div className="relative">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={
                                                                            saved.dynamic ||
                                                                            false
                                                                        }
                                                                        className="sr-only"
                                                                        onChange={(
                                                                            e,
                                                                        ) =>
                                                                            updateSetting(
                                                                                field.headerText,
                                                                                type,
                                                                                {
                                                                                    dynamic:
                                                                                        e
                                                                                            .target
                                                                                            .checked,
                                                                                },
                                                                            )
                                                                        }
                                                                    />
                                                                    <div
                                                                        className={`block w-12 h-6 rounded-full transition-colors ${
                                                                            saved.dynamic
                                                                                ? 'bg-green-500'
                                                                                : 'bg-gray-300'
                                                                        }`}
                                                                    ></div>
                                                                    <div
                                                                        className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                                                                            saved.dynamic
                                                                                ? 'transform translate-x-6'
                                                                                : ''
                                                                        }`}
                                                                    ></div>
                                                                </div>
                                                                <span className="ml-3 text-sm font-medium text-gray-700">
                                                                    Dynamic
                                                                    Field
                                                                </span>
                                                            </label>
                                                        </div>
                                                    )}

                                                    {saved.dynamic && (
                                                        <div className="space-y-3">
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                    Table
                                                                </label>
                                                                <select
                                                                    value={
                                                                        saved.table ||
                                                                        ''
                                                                    }
                                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        updateSetting(
                                                                            field.headerText,
                                                                            type,
                                                                            {
                                                                                table: e
                                                                                    .target
                                                                                    .value,
                                                                                field: '',
                                                                            },
                                                                        )
                                                                    }
                                                                >
                                                                    <option value="">
                                                                        Select
                                                                        Table
                                                                    </option>
                                                                    {tables.map(
                                                                        (t) => (
                                                                            <option
                                                                                key={
                                                                                    t
                                                                                }
                                                                                value={
                                                                                    t
                                                                                }
                                                                            >
                                                                                {
                                                                                    t
                                                                                }
                                                                            </option>
                                                                        ),
                                                                    )}
                                                                </select>
                                                            </div>

                                                            {saved.table && (
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                        Field
                                                                    </label>
                                                                    <select
                                                                        value={
                                                                            saved.field ||
                                                                            ''
                                                                        }
                                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                        onChange={(
                                                                            e,
                                                                        ) =>
                                                                            updateSetting(
                                                                                field.headerText,
                                                                                type,
                                                                                {
                                                                                    field: e
                                                                                        .target
                                                                                        .value,
                                                                                },
                                                                            )
                                                                        }
                                                                    >
                                                                        <option value="">
                                                                            Select
                                                                            Field
                                                                        </option>
                                                                        {fields[
                                                                            saved
                                                                                .table
                                                                        ]?.map(
                                                                            (
                                                                                f,
                                                                            ) => (
                                                                                <option
                                                                                    key={
                                                                                        f
                                                                                    }
                                                                                    value={
                                                                                        f
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        f
                                                                                    }
                                                                                </option>
                                                                            ),
                                                                        )}
                                                                    </select>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}

                                                    {!saved.dynamic && (
                                                        <>
                                                            {type ===
                                                                'text' && (
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                        Validation
                                                                    </label>
                                                                    <select
                                                                        value={
                                                                            saved.validation ||
                                                                            ''
                                                                        }
                                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                        onChange={(
                                                                            e,
                                                                        ) =>
                                                                            updateSetting(
                                                                                field.headerText,
                                                                                type,
                                                                                {
                                                                                    validation:
                                                                                        e
                                                                                            .target
                                                                                            .value,
                                                                                },
                                                                            )
                                                                        }
                                                                    >
                                                                        <option value="">
                                                                            Select
                                                                            Validation
                                                                        </option>
                                                                        <option value="alphabet">
                                                                            Alphabet
                                                                            Only
                                                                        </option>
                                                                        <option value="alphanumeric">
                                                                            Alphanumeric
                                                                        </option>
                                                                        <option value="email">
                                                                            Email
                                                                        </option>
                                                                        <option value="no-spaces">
                                                                            No
                                                                            Spaces
                                                                        </option>
                                                                    </select>
                                                                </div>
                                                            )}

                                                            {type ===
                                                                'textarea' && (
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                        Rows
                                                                    </label>
                                                                    <input
                                                                        type="number"
                                                                        value={
                                                                            saved.rows ||
                                                                            3
                                                                        }
                                                                        className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                        onChange={(
                                                                            e,
                                                                        ) =>
                                                                            updateSetting(
                                                                                field.headerText,
                                                                                type,
                                                                                {
                                                                                    rows: Number(
                                                                                        e
                                                                                            .target
                                                                                            .value,
                                                                                    ),
                                                                                },
                                                                            )
                                                                        }
                                                                    />
                                                                </div>
                                                            )}

                                                            {type ===
                                                                'number' && (
                                                                <div className="space-y-3">
                                                                    <div>
                                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                            Minimum
                                                                            Value
                                                                        </label>
                                                                        <input
                                                                            type="number"
                                                                            value={
                                                                                saved.min ??
                                                                                ''
                                                                            }
                                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                            onChange={(
                                                                                e,
                                                                            ) =>
                                                                                updateSetting(
                                                                                    field.headerText,
                                                                                    type,
                                                                                    {
                                                                                        min: Number(
                                                                                            e
                                                                                                .target
                                                                                                .value,
                                                                                        ),
                                                                                    },
                                                                                )
                                                                            }
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                            Maximum
                                                                            Value
                                                                        </label>
                                                                        <input
                                                                            type="number"
                                                                            value={
                                                                                saved.max ??
                                                                                ''
                                                                            }
                                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                            onChange={(
                                                                                e,
                                                                            ) =>
                                                                                updateSetting(
                                                                                    field.headerText,
                                                                                    type,
                                                                                    {
                                                                                        max: Number(
                                                                                            e
                                                                                                .target
                                                                                                .value,
                                                                                        ),
                                                                                    },
                                                                                )
                                                                            }
                                                                        />
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {(type ===
                                                                'checkbox' ||
                                                                type ===
                                                                    'radio' ||
                                                                type ===
                                                                    'select' ||
                                                                type ===
                                                                    'multiselect') && (
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                        Options
                                                                        (comma
                                                                        separated)
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        value={
                                                                            saved.options ||
                                                                            ''
                                                                        }
                                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                        placeholder="Option 1, Option 2, Option 3"
                                                                        onChange={(
                                                                            e,
                                                                        ) =>
                                                                            updateSetting(
                                                                                field.headerText,
                                                                                type,
                                                                                {
                                                                                    options:
                                                                                        e
                                                                                            .target
                                                                                            .value,
                                                                                },
                                                                            )
                                                                        }
                                                                    />
                                                                </div>
                                                            )}

                                                            {(type === 'date' ||
                                                                type ===
                                                                    'time' ||
                                                                type ===
                                                                    'datetime') && (
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                        {type ===
                                                                            'date' &&
                                                                            'Date Format'}
                                                                        {type ===
                                                                            'time' &&
                                                                            'Time Format'}
                                                                        {type ===
                                                                            'datetime' &&
                                                                            'DateTime Format'}
                                                                    </label>
                                                                    <select
                                                                        value={
                                                                            saved.format ||
                                                                            ''
                                                                        }
                                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                        onChange={(
                                                                            e,
                                                                        ) =>
                                                                            updateSetting(
                                                                                field.headerText,
                                                                                type,
                                                                                {
                                                                                    format: e
                                                                                        .target
                                                                                        .value,
                                                                                },
                                                                            )
                                                                        }
                                                                    >
                                                                        {type ===
                                                                            'date' && (
                                                                            <>
                                                                                <option value="YYYY-MM-DD">
                                                                                    YYYY-MM-DD
                                                                                </option>
                                                                                <option value="DD/MM/YYYY">
                                                                                    DD/MM/YYYY
                                                                                </option>
                                                                            </>
                                                                        )}
                                                                        {type ===
                                                                            'time' && (
                                                                            <>
                                                                                <option value="HH:mm">
                                                                                    HH:mm
                                                                                </option>
                                                                                <option value="hh:mm A">
                                                                                    hh:mm
                                                                                    A
                                                                                </option>
                                                                            </>
                                                                        )}
                                                                        {type ===
                                                                            'datetime' && (
                                                                            <>
                                                                                <option value="YYYY-MM-DD HH:mm">
                                                                                    YYYY-MM-DD
                                                                                    HH:mm
                                                                                </option>
                                                                                <option value="DD/MM/YYYY hh:mm A">
                                                                                    DD/MM/YYYY
                                                                                    hh:mm
                                                                                    A
                                                                                </option>
                                                                            </>
                                                                        )}
                                                                    </select>
                                                                </div>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
                    </Card>
                </>

                <div className="flex gap-2 flex-row-reverse">
                    <Button variant="solid" onClick={handleConfirm}>
                        Confirm
                    </Button>
                    <Button onClick={onClose}>Cancel</Button>
                </div>
            </Drawer>
            <Dialog
                isOpen={showLastDayConfirm}
                width={500}
                onClose={() => setShowLastDayConfirm(false)}
                onRequestClose={() => setShowLastDayConfirm(false)}
            >
                <div className="p-6">
                    <h3 className="text-lg font-semibold mb-4">
                        Last Day Consideration
                    </h3>
                    <p className="mb-4">
                        You have selected day <strong>{pendingDay}</strong>
                        {pendingConfigType === 'Monthly'
                            ? ' for monthly frequency.'
                            : ` for ${pendingMonth}.`}
                        <br />
                        <br />
                        Would you like notifications to be sent on the{' '}
                        <strong>last day of the month</strong> instead of day{' '}
                        {pendingDay}?
                    </p>
                    <div className="flex justify-end space-x-2 mt-6">
                        <Button
                            onClick={() => {
                                finalizeDaySelection(
                                    pendingDay,
                                    pendingMonth,
                                    false,
                                    pendingConfigType,
                                )
                            }}
                        >
                            No, use selected day {pendingDay}
                        </Button>
                        <Button
                            variant="solid"
                            onClick={() => {
                                finalizeDaySelection(
                                    pendingDay,
                                    pendingMonth,
                                    true,
                                    pendingConfigType,
                                )
                            }}
                        >
                            Yes, use last day of month
                        </Button>
                    </div>
                </div>
            </Dialog>
        </>
    )
}

export default FrequencyPopup
