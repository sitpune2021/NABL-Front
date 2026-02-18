/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { useFormContext, useFormState } from 'react-hook-form'
import { FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'

type Props = {
    name: string
    label: string
    placeholder?: string
    readOnly?: boolean
}

const TextField = React.memo(
    ({ name, label, placeholder, readOnly }: Props) => {
        const { register, control } = useFormContext()

        const { errors } = useFormState({
            control,
            name,
        })

        const error = errors?.[name as keyof typeof errors] as any

        return (
            <FormItem
                label={label}
                invalid={!!error}
                errorMessage={error?.message}
            >
                <Input
                    placeholder={placeholder}
                    disabled={readOnly}
                    {...register(name)}
                />
            </FormItem>
        )
    },
)

export default TextField
