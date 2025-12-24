/* eslint-disable @typescript-eslint/no-explicit-any */

const toRoman = (num: number): string => {
    const romans: [number, string][] = [
        [1000, 'M'],
        [900, 'CM'],
        [500, 'D'],
        [400, 'CD'],
        [100, 'C'],
        [90, 'XC'],
        [50, 'L'],
        [40, 'XL'],
        [10, 'X'],
        [9, 'IX'],
        [5, 'V'],
        [4, 'IV'],
        [1, 'I'],
    ]
    let result = ''
    for (const [value, symbol] of romans) {
        while (num >= value) {
            result += symbol
            num -= value
        }
    }
    return result
}

export const getNumberingValue = (
    type: string,
    index: number,
    watched: any[],
) => {
    if (!type || type === 'none') return ''

    const children_count =
        watched?.slice(0, index)?.filter((x: any) => x?.numbering_type === type)
            ?.length ?? 0

    const number = children_count + 1

    switch (type) {
        case 'numerical':
            return `${number}`

        case 'alphabetical-lower':
            return `${String.fromCharCode(97 + children_count)}`

        case 'alphabetical-upper':
            return String.fromCharCode(65 + children_count)

        case 'roman-lower':
            return `${toRoman(number).toLowerCase()}`

        case 'roman-upper':
            return `${toRoman(number)}`

        case 'dot':
            return '•'

        default:
            return ''
    }
}
