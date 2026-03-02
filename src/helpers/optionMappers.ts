export interface SelectOption<TValue = string> {
    value: TValue
    label: string
}

type ValueExtractor<T, TValue> = keyof T | ((item: T) => TValue)
type LabelExtractor<T> = (item: T) => string

interface MapOptionsConfig<T, TValue> {
    value: ValueExtractor<T, TValue>
    label: LabelExtractor<T>
    filter?: (item: T) => boolean
    extra?: (item: T) => Record<string, unknown>
}

/**
 * Generic, reusable, type-safe option mapper
 */
export const mapToOptions = <
    T,
    TValue = string,
    TExtra extends Record<string, unknown> = Record<string, never>,
>(
    items: T[],
    config: MapOptionsConfig<T, TValue> & { extra?: (item: T) => TExtra },
): (SelectOption<TValue> & TExtra)[] => {
    if (!Array.isArray(items)) return []

    return items.filter(config.filter ?? (() => true)).map(
        (item) =>
            ({
                value:
                    typeof config.value === 'function'
                        ? config.value(item)
                        : (item[config.value] as TValue),
                label: config.label(item),
                ...(config.extra?.(item) ?? ({} as TExtra)),
            }) as SelectOption<TValue> & TExtra,
    )
}
