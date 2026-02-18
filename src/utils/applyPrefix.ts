export const applyPrefix = (
    currentIdentifier: string = '',
    newPrefix: string = '',
) => {
    if (!newPrefix) return ''

    const parts = currentIdentifier.split('-')

    const suffix = parts.length > 1 ? parts.slice(1).join('-') : ''

    return suffix ? `${newPrefix}-${suffix}` : `${newPrefix}-`
}
