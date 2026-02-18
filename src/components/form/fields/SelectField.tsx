/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from 'react'
import { useFormContext, useFormState } from 'react-hook-form'
import { FormItem } from '@/components/ui/Form'
import { Select } from '@/components/ui'

export type SelectOption = {
    value: any
    label: string
    identifier?: string
    [key: string]: any
}

type Props = {
    name: string
    label: string
    options: SelectOption[]
    readOnly?: boolean
    isLoading?: boolean
    hasMore?: boolean
    onLoadMore?: () => void
    onChangeExtra?: (option: SelectOption | null) => void
}

const SelectField = React.memo(
    ({
        name,
        label,
        options,
        readOnly,
        isLoading,
        hasMore,
        onLoadMore,
        onChangeExtra,
    }: Props) => {
        const { setValue, watch, control } = useFormContext()

        const { errors } = useFormState({
            control,
            name,
        })

        const fieldValue = watch(name)

        const selectedOption = useMemo(() => {
            return options.find((o) => o.value === fieldValue) || null
        }, [options, fieldValue])

        const error = errors?.[name as keyof typeof errors] as any

        return (
            <FormItem
                label={label}
                invalid={!!error}
                errorMessage={error?.message}
            >
                <Select
                    options={options}
                    value={selectedOption}
                    isDisabled={readOnly}
                    isLoading={isLoading}
                    noOptionsMessage={() =>
                        isLoading
                            ? 'Loading...'
                            : hasMore
                              ? 'Scroll to load more'
                              : 'No more options'
                    }
                    onMenuScrollToBottom={() => {
                        if (hasMore && !isLoading) {
                            onLoadMore?.()
                        }
                    }}
                    onChange={(option) => {
                        setValue(name, option?.value, {
                            shouldDirty: true,
                        })

                        onChangeExtra?.(option)
                    }}
                />
            </FormItem>
        )
    },
)

export default SelectField
