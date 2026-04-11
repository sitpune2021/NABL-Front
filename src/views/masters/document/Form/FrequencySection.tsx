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
import { FrequencyProps, FrequencyType } from '@/@types/document'
import { Card } from '@/components/ui'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { FREQUENCY_TYPE } from '@/constants/document.constant'
import { Option } from '@/@types/common'
import { getDayOptions, getMonthOptions } from '@/utils/dateformat'
import AamendmentSection from './AamendmentSection'
import FieldConfigurationSection from './FieldConfigurationSection'

const FrequencySection = ({
    isOpen,
    onClose,
    onConfirm,
    isEdit,
}: FrequencyProps) => {
    const {
        register,
        control,
        setValue,
        formState: { errors },
    } = useFormContext<any>()
    const [schedule] = useWatch({
        control,
        name: ['schedule'],
    })

    const monthOptions = getMonthOptions(schedule)
    const dayOptions = getDayOptions(schedule)

    const [availableDays, setAvailableDays] = useState<Option[]>([])
    const [showLastDayConfirm, setShowLastDayConfirm] = useState(false)
    const [pendingDay, setPendingDay] = useState<string>('')
    const [pendingMonth, setPendingMonth] = useState<string>('')
    const [pendingConfigType, setPendingConfigType] =
        useState<FrequencyType>('Monthly')
    const [isType, setIsType] = useState<{ show: boolean; isDay: boolean }>({
        show: false,
        isDay: false,
    })

    const isWeeklyMulti = schedule.type === 'Weekly' && schedule.count > 1

    const titleMap: Record<string, string> = {
        Weekly: 'Day Selection',
        Monthly: 'Monthly Day Selection',
        Fortnightly: 'Fortnightly Selection',
    }

    const labelMap: Record<string, string> = {
        Weekly: 'Select Days',
        Monthly: 'Select Day',
        Fortnightly: 'Select Day (1-15)',
    }

    const getTitle = () => titleMap[schedule.type] || 'Day Selection'
    const getLabel = () => labelMap[schedule.type] || 'Select Day'

    const getSelectValue = (value: string[]) => {
        if (isWeeklyMulti) {
            return dayOptions.filter((opt) => value?.includes(opt.value))
        }
        return dayOptions.find((opt) => value?.[0] === opt.value)
    }

    const syncItemConfigs = (selected: string[]) => {
        const updatedConfigs = { ...schedule.itemConfigs }

        selected.forEach((day) => {
            if (!updatedConfigs[day]) {
                updatedConfigs[day] = {
                    interval: 1,
                    cutOffTimes: ['09:00'],
                    considerLastDay: false,
                }
            }
        })

        Object.keys(updatedConfigs).forEach((key) => {
            if (!selected.includes(key)) {
                delete updatedConfigs[key]
            }
        })

        return updatedConfigs
    }

    const handleWeeklyChange = (selectedOptions: any, field: any) => {
        const selected = Array.isArray(selectedOptions)
            ? selectedOptions.map((opt) => opt.value)
            : []

        const limited = selected.slice(0, schedule.count)

        if (selected.length > schedule.count) {
            toast.push(
                <Notification title="Selection limit" type="danger">
                    You can only select up to {schedule.count} days.
                </Notification>,
            )
        }

        field.onChange(limited)
        setValue('schedule.itemConfigs', syncItemConfigs(limited))
    }

    const handleSingleDayChange = (option: any, field: any) => {
        if (!option) return

        const selectedDay = option.value

        if (schedule.type === 'Monthly') {
            handleDaySelection(selectedDay, '', schedule.type)
            return
        }

        field.onChange([selectedDay])
        setValue('schedule.selectedDay', selectedDay)
        setValue('schedule.itemConfigs', syncItemConfigs([selectedDay]))
    }

    const DEFAULT_CONFIG = {
        interval: 1,
        cutOffTimes: ['09:00'],
        considerLastDay: false,
    }

    const getConfigKey = (month?: string, day?: string) =>
        month && day ? `${month}-${day}` : ''

    const getItemConfig = (configs: any, key: string) =>
        configs?.[key] || DEFAULT_CONFIG

    const normalizeCutOffs = (times: string[], count: number) => {
        const updated = [...times]

        if (count > updated.length) {
            while (updated.length < count) updated.push('09:00')
        } else {
            updated.splice(count)
        }

        return updated
    }

    const updateInterval = (key: string, value: number, configs: any) => {
        const current = getItemConfig(configs, key)

        return {
            ...configs,
            [key]: {
                ...current,
                interval: value,
                cutOffTimes: normalizeCutOffs(current.cutOffTimes, value),
            },
        }
    }

    const updateCutOffTime = (
        key: string,
        index: number,
        date: Date | null,
        configs: any,
    ) => {
        const current = getItemConfig(configs, key)
        const times = [...current.cutOffTimes]

        if (!date) {
            times.splice(index, 1)
        } else {
            times[index] = date.toTimeString().slice(0, 5)
        }

        return {
            ...configs,
            [key]: {
                ...current,
                cutOffTimes: times,
                interval: times.length,
            },
        }
    }

    const generateDaysForMonth = (frequencyType?: FrequencyType) => {
        const currentType = frequencyType

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

    const isLastDayCandidate = (day: string, configType: FrequencyType) => {
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
        if (isLastDayCandidate(day, configType)) {
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

        setValue('schedule.selectedItems', [day])
        setValue(
            'schedule.selectedMonth',
            configType === 'Monthly' ? '' : month,
        )
        setValue('schedule.selectedDay', day)
        setValue('schedule.itemConfigs', {
            [itemKey]: {
                interval: 1,
                cutOffTimes: ['09:00'],
                considerLastDay: considerLastDay,
            },
        })

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

    const handleConfirm = () => {
        const selectedMonth = schedule.selectedMonth || ''
        const selectedDay = schedule.selectedDay || ''
        if (
            (schedule.type === 'Quarterly' ||
                schedule.type === 'Half-Yearly' ||
                schedule.type === 'Yearly') &&
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
            (schedule.type === 'Weekly' ||
                schedule.type === 'Monthly' ||
                schedule.type === 'Fortnightly') &&
            !schedule.selectedItems?.[0]
        ) {
            toast.push(
                <Notification title="Selection incomplete" type="danger">
                    Please select a day.
                </Notification>,
            )
            return
        }
        onConfirm()
    }

    useEffect(() => {
        if (!schedule.interval || schedule.interval < 1) return
        const current = schedule.cutOffTimes ?? []
        if (current.length === schedule.interval) return
        const next = Array.from(
            { length: schedule.interval },
            (_, i) => current[i] ?? '09:00',
        )
        setValue('schedule.cutOffTimes', next, {
            shouldDirty: true,
        })
    }, [schedule.interval])

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
                        <h4>Frequency Settings</h4>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <FormItem
                                label="Type"
                                invalid={!!errors.schedule?.type}
                                errorMessage={
                                    errors.schedule?.message as string
                                }
                            >
                                <Controller
                                    name="schedule.type"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            value={FREQUENCY_TYPE.find(
                                                (t) => t.value === field.value,
                                            )}
                                            options={FREQUENCY_TYPE}
                                            onChange={(option) => {
                                                field.onChange(option?.value)
                                                setValue('schedule.count', 1)
                                                setIsType({
                                                    show: !['Daily'].includes(
                                                        option?.value ||
                                                            'Daily',
                                                    ),
                                                    isDay: [
                                                        'Weekly',
                                                        'Monthly',
                                                        'Fortnightly',
                                                    ].includes(
                                                        option?.value ||
                                                            'Daily',
                                                    ),
                                                })
                                            }}
                                        />
                                    )}
                                />
                            </FormItem>

                            {isType.show && (
                                <FormItem label="Count">
                                    <Controller
                                        name="schedule.count"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                type="number"
                                                min={1}
                                                max={
                                                    schedule.type === 'Weekly'
                                                        ? 7
                                                        : 1
                                                }
                                                disabled={
                                                    schedule.type !== 'Weekly'
                                                }
                                                value={field.value}
                                                onWheel={(e) =>
                                                    (
                                                        e.target as HTMLInputElement
                                                    ).blur()
                                                }
                                                onChange={(e) => {
                                                    const value =
                                                        Number(
                                                            e.target.value,
                                                        ) || 1
                                                    if (
                                                        schedule.type ===
                                                        'Weekly'
                                                    ) {
                                                        const currentSelected =
                                                            schedule.selectedItems ||
                                                            []

                                                        const newSelectedItems =
                                                            currentSelected.slice(
                                                                0,
                                                                value,
                                                            )

                                                        const newItemConfigs = {
                                                            ...schedule.itemConfigs,
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

                                                        field.onChange(value)

                                                        setValue(
                                                            'schedule.selectedItems',
                                                            newSelectedItems,
                                                        )
                                                        setValue(
                                                            'schedule.itemConfigs',
                                                            newItemConfigs,
                                                        )

                                                        return
                                                    }

                                                    if (value > 1) {
                                                        toast.push(
                                                            <Notification
                                                                title="Limit exceeded"
                                                                type="danger"
                                                            >
                                                                You can only
                                                                select 1 day for{' '}
                                                                {schedule.type.toLowerCase()}{' '}
                                                                frequency.
                                                            </Notification>,
                                                        )
                                                        return
                                                    }
                                                    field.onChange(value)
                                                    setValue(
                                                        'schedule.selectedItems',
                                                        [],
                                                    )
                                                    setValue(
                                                        'schedule.itemConfigs',
                                                        {},
                                                    )
                                                }}
                                            />
                                        )}
                                    />
                                </FormItem>
                            )}
                        </div>

                        {isType.show && (
                            <div
                                className={`mt-6 p-4 rounded-lg border ${
                                    isType.isDay
                                        ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700'
                                        : 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-700'
                                }`}
                            >
                                <h4
                                    className={`text-md font-semibold mb-4 flex items-center ${
                                        isType.isDay
                                            ? 'text-green-900 dark:text-green-300'
                                            : 'text-blue-900 dark:text-blue-300'
                                    }`}
                                >
                                    <span
                                        className={`w-4 h-4 rounded-full mr-2 ${
                                            isType.isDay
                                                ? 'bg-green-500 dark:bg-green-400'
                                                : 'bg-blue-500 dark:bg-blue-400'
                                        }`}
                                    />
                                    {isType.isDay
                                        ? getTitle()
                                        : 'Month & Day Selection'}
                                </h4>

                                {isType.isDay ? (
                                    <FormItem label={getLabel()}>
                                        <Controller
                                            name="schedule.selectedItems"
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    isMulti={isWeeklyMulti}
                                                    options={dayOptions}
                                                    value={getSelectValue(
                                                        field.value,
                                                    )}
                                                    onChange={(options) =>
                                                        isWeeklyMulti
                                                            ? handleWeeklyChange(
                                                                  options,
                                                                  field,
                                                              )
                                                            : handleSingleDayChange(
                                                                  options,
                                                                  field,
                                                              )
                                                    }
                                                />
                                            )}
                                        />
                                    </FormItem>
                                ) : (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        <FormItem
                                            label={
                                                schedule.type === 'Quarterly'
                                                    ? 'Select Month (1-3)'
                                                    : schedule.type ===
                                                        'Half-Yearly'
                                                      ? 'Select Month (1-6)'
                                                      : 'Select Month'
                                            }
                                            invalid={
                                                !!(errors.schedule as any)
                                                    ?.selectedMonth
                                            }
                                        >
                                            <Controller
                                                name="schedule.selectedMonth"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select
                                                        value={monthOptions.find(
                                                            (m) =>
                                                                m.value ===
                                                                field.value,
                                                        )}
                                                        options={monthOptions}
                                                        onChange={(option) => {
                                                            field.onChange(
                                                                option?.value,
                                                            )
                                                            setValue(
                                                                'schedule.selectedDay',
                                                                '',
                                                            )
                                                            setAvailableDays(
                                                                generateDaysForMonth(
                                                                    schedule.type,
                                                                ),
                                                            )
                                                        }}
                                                    />
                                                )}
                                            />
                                        </FormItem>

                                        <FormItem label="Select Day">
                                            <Select
                                                value={availableDays.find(
                                                    (d) =>
                                                        d.value ===
                                                        schedule.selectedDay,
                                                )}
                                                options={availableDays}
                                                isDisabled={
                                                    !schedule.selectedMonth
                                                }
                                                onChange={(option) =>
                                                    option &&
                                                    handleDaySelection(
                                                        option.value,
                                                        schedule.selectedMonth,
                                                        schedule.type,
                                                    )
                                                }
                                            />
                                        </FormItem>
                                    </div>
                                )}
                            </div>
                        )}

                        {!isType.show && (
                            <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-20 dark:border-purple-700">
                                <FormItem label="Interval">
                                    <Input
                                        type="number"
                                        min="1"
                                        {...register('schedule.interval')}
                                        onWheel={(e) =>
                                            (
                                                e.target as HTMLInputElement
                                            ).blur()
                                        }
                                    />
                                </FormItem>
                            </div>
                        )}
                    </Card>
                    <>
                        {!isType.isDay &&
                            schedule.selectedMonth &&
                            schedule.selectedDay &&
                            (() => {
                                const itemKey = getConfigKey(
                                    schedule.selectedMonth,
                                    schedule.selectedDay,
                                )
                                const config = getItemConfig(
                                    schedule.itemConfigs,
                                    itemKey,
                                )

                                return (
                                    <Card>
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                                                {`Per-Day Settings (${schedule.type} - ${schedule.selectedMonth} - Day ${schedule.selectedDay})`}
                                            </h4>

                                            {config.considerLastDay && (
                                                <span className="badge-blue">
                                                    Last Day Mode
                                                </span>
                                            )}
                                        </div>

                                        <FormItem
                                            label={`Interval for Day ${schedule.selectedDay}`}
                                        >
                                            <Input
                                                type="number"
                                                min="1"
                                                value={config.interval}
                                                onWheel={(e) =>
                                                    (
                                                        e.target as HTMLInputElement
                                                    ).blur()
                                                }
                                                onChange={(e) =>
                                                    setValue(
                                                        'schedule.itemConfigs',
                                                        updateInterval(
                                                            itemKey,
                                                            Number(
                                                                e.target.value,
                                                            ) || 1,
                                                            schedule.itemConfigs,
                                                        ),
                                                    )
                                                }
                                            />
                                        </FormItem>

                                        <div className="mt-4">
                                            <label className="label">
                                                Cut-off Times
                                            </label>

                                            {config.cutOffTimes.map(
                                                (time: any, i: any) => (
                                                    <TimeInput
                                                        key={i}
                                                        format="12"
                                                        className="flex items-center gap-3 p-2 rounded-md bg-gray-50 dark:bg-gray-800"
                                                        value={
                                                            new Date(
                                                                `2000-01-01T${time}`,
                                                            )
                                                        }
                                                        onChange={(date) =>
                                                            setValue(
                                                                'schedule.itemConfigs',
                                                                updateCutOffTime(
                                                                    itemKey,
                                                                    i,
                                                                    date,
                                                                    schedule.itemConfigs,
                                                                ),
                                                            )
                                                        }
                                                    />
                                                ),
                                            )}
                                        </div>
                                    </Card>
                                )
                            })()}

                        {isType.isDay && schedule.selectedItems?.length > 0 && (
                            <Card className="mb-2">
                                <h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
                                    Per-Day Settings
                                </h4>

                                {schedule.selectedItems.map((item: string) => {
                                    const config = getItemConfig(
                                        schedule.itemConfigs,
                                        item,
                                    )

                                    return (
                                        <div key={item} className="card-green">
                                            <h5 className="flex justify-between">
                                                <span>{item}</span>
                                                {config.considerLastDay && (
                                                    <span className="badge-blue">
                                                        Last Day Mode
                                                    </span>
                                                )}
                                            </h5>

                                            <FormItem
                                                label={`Interval for ${item}`}
                                            >
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    value={config.interval}
                                                    onWheel={(e) =>
                                                        (
                                                            e.target as HTMLInputElement
                                                        ).blur()
                                                    }
                                                    onChange={(e) =>
                                                        setValue(
                                                            'schedule.itemConfigs',
                                                            updateInterval(
                                                                item,
                                                                Number(
                                                                    e.target
                                                                        .value,
                                                                ) || 1,
                                                                schedule.itemConfigs,
                                                            ),
                                                        )
                                                    }
                                                />
                                            </FormItem>

                                            <div className="mt-4">
                                                <label className="label">
                                                    Cut-off Times
                                                </label>

                                                {config.cutOffTimes.map(
                                                    (time: any, i: any) => (
                                                        <TimeInput
                                                            key={i}
                                                            className="flex items-center gap-3 p-2 rounded-md bg-gray-50 dark:bg-gray-800"
                                                            format="12"
                                                            value={
                                                                new Date(
                                                                    `2000-01-01T${time}`,
                                                                )
                                                            }
                                                            onChange={(date) =>
                                                                setValue(
                                                                    'schedule.itemConfigs',
                                                                    updateCutOffTime(
                                                                        item,
                                                                        i,
                                                                        date,
                                                                        schedule.itemConfigs,
                                                                    ),
                                                                )
                                                            }
                                                        />
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </Card>
                        )}

                        {!isType.show && schedule.cutOffTimes?.length > 0 && (
                            <Card className="mb-2">
                                <FormItem label="⏰ Cut-off Times">
                                    <Controller
                                        name="schedule.cutOffTimes"
                                        control={control}
                                        render={({ field }) => (
                                            <div className="space-y-3">
                                                {field.value?.map(
                                                    (
                                                        time: string,
                                                        i: number,
                                                    ) => (
                                                        <div
                                                            key={i}
                                                            className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-lg border border-purple-200 dark:border-purple-700"
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
                                                                    const updated =
                                                                        [
                                                                            ...field.value,
                                                                        ]

                                                                    updated[i] =
                                                                        date
                                                                            ? date
                                                                                  .toTimeString()
                                                                                  .slice(
                                                                                      0,
                                                                                      5,
                                                                                  )
                                                                            : '09:00'

                                                                    field.onChange(
                                                                        updated,
                                                                    )
                                                                }}
                                                            />
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        )}
                                    />
                                </FormItem>
                            </Card>
                        )}
                    </>
                </>
                <FieldConfigurationSection />
                <AamendmentSection isEdit={isEdit} />
                <div className="flex gap-2 flex-row-reverse mt-4">
                    <Button
                        variant="solid"
                        type="button"
                        onClick={handleConfirm}
                    >
                        Confirm
                    </Button>
                    <Button type="button" onClick={onClose}>
                        Cancel
                    </Button>
                </div>
            </Drawer>
            <Dialog
                isOpen={showLastDayConfirm}
                width={500}
                onClose={() => setShowLastDayConfirm(false)}
                onRequestClose={() => setShowLastDayConfirm(false)}
            >
                <div className="p-6 bg-white dark:bg-gray-800 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
                        Last Day Consideration
                    </h3>
                    <p className="mb-4 text-gray-600 dark:text-gray-300">
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

export default FrequencySection
