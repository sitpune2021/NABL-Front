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

const FrequencyPopup = ({
    isOpen,
    onClose,
    onConfirm,
    initialData,
}: FrequencyPopupProps) => {
    const [config, setConfig] = useState<FrequencyConfig>({
        type: 'Daily',
        interval: 1,
        count: 1,
        cutOffTime: '08:30',
        cutOffTimes: ['08:30'],
        selectedItems: [],
    })

    useEffect(() => {
        if (initialData) {
            setConfig(initialData)
        }
    }, [initialData])

    useEffect(() => {
        setConfig((prev) => {
            const newTimes = [...(prev.cutOffTimes || [])]
            if (prev.interval > newTimes.length) {
                for (let i = newTimes.length; i < prev.interval; i++) {
                    newTimes.push('08:30')
                }
            } else if (prev.interval < newTimes.length) {
                newTimes.splice(prev.interval)
            }
            return { ...prev, cutOffTimes: newTimes }
        })
    }, [config.interval])

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
                    { value: '1st Half', label: '1st Half (Day 1–15)' },
                    { value: '2nd Half', label: '2nd Half (Day 16–30)' },
                ]
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
                break
        }

        return options
    }

    const handleConfirm = () => {
        onConfirm(config)
        onClose()
    }

    const options = getDynamicOptions()

    return (
        <Dialog
            isOpen={isOpen}
            width={650}
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
                            onChange={(option) =>
                                setConfig((prev) => ({
                                    ...prev,
                                    type: option?.value as FrequencyType,
                                    selectedItems: [],
                                    count: 1,
                                }))
                            }
                        />
                    </FormItem>

                    {config.type !== 'Daily' && (
                        <FormItem label="Count">
                            <Input
                                type="number"
                                min="1"
                                max={config.type === 'Weekly' ? 7 : undefined}
                                value={config.count}
                                onChange={(e) => {
                                    const value = parseInt(e.target.value) || 1
                                    if (config.type === 'Weekly' && value > 7) {
                                        toast.push(
                                            <Notification
                                                title="Limit exceeded"
                                                type="danger"
                                            >
                                                You can only select up to 7 days
                                                in a week.
                                            </Notification>,
                                        )
                                        return
                                    }
                                    setConfig((prev) => ({
                                        ...prev,
                                        count: value,
                                        selectedItems: [],
                                    }))
                                }}
                            />
                        </FormItem>
                    )}
                    {config.type !== 'Daily' && options.length > 0 && (
                        <FormItem
                            label={`Select ${
                                config.type === 'Weekly' ? 'Days' : 'Items'
                            }`}
                        >
                            <Select
                                isMulti
                                value={options.filter((opt) =>
                                    config.selectedItems?.includes(opt.value),
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
                                                {config.type === 'Weekly'
                                                    ? 'days'
                                                    : 'items'}
                                                .
                                            </Notification>,
                                        )
                                        return
                                    }
                                    setConfig((prev) => ({
                                        ...prev,
                                        selectedItems: selected,
                                    }))
                                }}
                            />
                        </FormItem>
                    )}

                    <FormItem label="Interval">
                        <Input
                            type="number"
                            min="1"
                            value={config.interval}
                            onChange={(e) =>
                                setConfig((prev) => ({
                                    ...prev,
                                    interval: parseInt(e.target.value) || 1,
                                }))
                            }
                        />
                    </FormItem>
                </div>

                {config.cutOffTimes?.length > 0 && (
                    <div className="mt-4">
                        <FormItem label="Cut-off Times">
                            {config.cutOffTimes.map((time, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-2 mb-2"
                                >
                                    <TimeInput
                                        value={new Date(`2000-01-01T${time}`)}
                                        onChange={(date) => {
                                            const timeString = date
                                                ? date
                                                      .toTimeString()
                                                      .slice(0, 5)
                                                : '08:30'
                                            setConfig((prev) => {
                                                const newTimes = [
                                                    ...prev.cutOffTimes!,
                                                ]
                                                newTimes[i] = timeString
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
