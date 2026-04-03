/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import Select from '../Select'

type Option = {
    label: string
    value: number | string
}

type Props = {
    options: Option[]
    value: (number | string)[]
    onChange?: (selected: Option[]) => void
    onValueChange?: (ids: (number | string)[]) => void
    isDisabled?: boolean
    placeholder?: string
}

export default function MultiSelect({
    options = [],
    value = [],
    onChange,
    onValueChange,
    isDisabled = false,
    placeholder = 'Select options',
}: Props) {
    const [inputValue, setInputValue] = useState('')

    const allOption = { label: 'Select All', value: '__all__' }

    const filtered = options.filter((o) =>
        o.label.toLowerCase().includes(inputValue.toLowerCase()),
    )

    const selected = options.filter((o) => value.includes(o.value))

    const isAllSelected =
        filtered.length &&
        filtered.every((o) => selected.some((s) => s.value === o.value))

    const unique = (arr: Option[]) =>
        Array.from(new Map(arr.map((i) => [i.value, i])).values())

    const handleChange = (selectedOptions: any) => {
        if (!selectedOptions) {
            onValueChange?.([])
            onChange?.([])
            return
        }

        const hasAll = selectedOptions.some(
            (o: Option) => o.value === '__all__',
        )

        let updated: Option[] = selected

        if (hasAll) {
            updated = isAllSelected
                ? selected.filter(
                      (s) => !filtered.some((f) => f.value === s.value),
                  )
                : unique([...selected, ...filtered])
        } else if (inputValue) {
            const filteredVals = filtered.map((o) => o.value)

            updated = unique([
                ...selected.filter((s) => !filteredVals.includes(s.value)),
                ...selectedOptions,
            ])
        } else {
            updated = selectedOptions
        }

        // 🔥 dual output
        onValueChange?.(updated.map((o) => o.value)) // IDs
        onChange?.(updated) // full objects
    }

    return (
        <Select
            isMulti
            options={[allOption, ...options]}
            value={selected}
            isDisabled={isDisabled}
            closeMenuOnSelect={false}
            hideSelectedOptions={false}
            controlShouldRenderValue={false}
            placeholder={
                selected.length ? `${selected.length} selected` : placeholder
            }
            inputValue={inputValue}
            getOptionLabel={(o: Option) =>
                o.value === '__all__'
                    ? isAllSelected
                        ? 'Unselect All'
                        : 'Select All'
                    : o.label
            }
            onInputChange={setInputValue}
            onChange={handleChange}
        />
    )
}
