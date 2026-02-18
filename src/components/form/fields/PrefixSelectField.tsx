/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from 'react'
import { useFormContext } from 'react-hook-form'
import SelectField, { SelectOption } from './SelectField'
import { applyPrefix } from '@/utils/applyPrefix'

type Props<T> = {
    fieldName: string
    identifierField: string
    label: string
    readOnly?: boolean
    useListHook: () => {
        record: T[]
        updateTable: (params: any) => void
        tableData: any
        hasMore: boolean
        isLoading: boolean
    }
    useDetailHook?: (id: any) => { data?: T }
    mapOption: (item: T) => SelectOption
}

function PrefixSelectField<T>({
    fieldName,
    identifierField,
    label,
    readOnly,
    useListHook,
    useDetailHook,
    mapOption,
}: Props<T>) {
    const { record, updateTable, tableData, hasMore, isLoading } = useListHook()

    const { watch, getValues, setValue } = useFormContext()

    const selectedValue = watch(fieldName)

    // 👇 fetch selected record if detail hook provided
    const { data: selectedItem } = useDetailHook?.(selectedValue) || {}

    const options = useMemo(() => {
        const mapped = record.map(mapOption)

        const exists = mapped.some((opt) => opt.value === selectedValue)

        if (!exists && selectedItem) {
            mapped.unshift(mapOption(selectedItem))
        }

        return mapped
    }, [record, selectedItem, selectedValue, mapOption])

    const loadMore = () => {
        updateTable({
            pageIndex: (tableData.pageIndex ?? 1) + 1,
        })
    }

    const handlePrefixUpdate = (option: SelectOption | null) => {
        if (!option?.identifier) return

        const currentIdentifier = getValues(identifierField) || ''

        const newIdentifier = applyPrefix(currentIdentifier, option.identifier)

        setValue(identifierField, newIdentifier, {
            shouldDirty: true,
        })
    }

    return (
        <SelectField
            name={fieldName}
            label={label}
            options={options}
            readOnly={readOnly}
            isLoading={isLoading}
            hasMore={hasMore}
            onLoadMore={loadMore}
            onChangeExtra={handlePrefixUpdate}
        />
    )
}

export default PrefixSelectField
