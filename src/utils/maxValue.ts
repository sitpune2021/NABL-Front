/* eslint-disable @typescript-eslint/no-explicit-any */
const getMaxValue = (frequency: any, notificationUnit: any) => {
    if (frequency === 'Weekly') return 6
    if (frequency === 'Monthly') return 28
    if (frequency === 'Yearly' && notificationUnit === 'Day') return 28
    if (frequency === 'Yearly' && notificationUnit === 'Month') return 11
    return 0
}
export default getMaxValue
