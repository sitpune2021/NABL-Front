/* eslint-disable @typescript-eslint/no-explicit-any */
export const frequencyTypes = [
    { value: 'Daily', label: 'Daily' },
    { value: 'Weekly', label: 'Weekly' },
    { value: 'Fortnightly', label: 'Fortnightly' },
    { value: 'Monthly', label: 'Monthly' },
    { value: 'Quarterly', label: 'Quarterly' },
    { value: 'Half-Yearly', label: 'Half-Yearly' },
    { value: 'Yearly', label: 'Yearly' },
]

export const getMonthOptions = (config: any) => {
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

export const getDayOptions = (config: any) => {
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

export const generateDaysForMonth = (
    month: string,
    frequencyType?: any,
    config?: any,
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

export const isLastDayCandidate = (
    day: string,
    monthName: string,
    configType: any,
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
