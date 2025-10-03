import { useEffect } from 'react'
import { Form, FormItem } from '@/components/ui/Form'
import isEmpty from 'lodash/isEmpty'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import type { CommonProps, PrefixFormSchema } from '@/@types/common'
import { Dialog, Input } from '@/components/ui'

type PrefixFormProps = {
    onFormSubmit: (values: PrefixFormSchema) => void
    defaultValues?: PrefixFormSchema
    newCategory?: boolean
    readOnly?: boolean
    dialogOpen: boolean
    setDialogOpen: (open: boolean) => void
} & CommonProps

const validationSchema = z.object({
    prefix: z
        .string()
        .min(1, { message: 'Prefix is required' })
        .max(4, { message: 'Prefix must be at most 4 characters' })
        .regex(/^[A-Z]+$/, {
            message: 'Prefix must contain only uppercase letters',
        })
        .refine((val) => !/\s{2,}/.test(val), {
            message: 'Prefix must not contain double spaces',
        }),
})

const PrefixForm = (props: PrefixFormProps) => {
    const {
        onFormSubmit,
        defaultValues = {},
        readOnly = false,
        children,
        dialogOpen,
        setDialogOpen,
    } = props

    const {
        handleSubmit,
        reset,
        formState: { errors },
        control,
    } = useForm<PrefixFormSchema>({
        defaultValues: {
            ...defaultValues,
        },
        resolver: zodResolver(validationSchema),
    })

    useEffect(() => {
        if (!isEmpty(defaultValues)) {
            reset(defaultValues)
        }
    }, [JSON.stringify(defaultValues)])

    const onSubmit = (values: PrefixFormSchema) => {
        onFormSubmit?.(values)
    }

    return (
        <Dialog isOpen={dialogOpen} onClose={() => setDialogOpen(false)}>
            <h4>Prefix</h4>
            <div className="mt-4">
                <Form
                    className="flex w-full h-full"
                    containerClassName="flex flex-col w-full justify-between"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="gap-4 flex flex-col flex-auto">
                            <FormItem
                                label="Name"
                                invalid={Boolean(errors.prefix)}
                                errorMessage={errors.prefix?.message}
                            >
                                <Controller
                                    name="prefix"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type="text"
                                            autoComplete="off"
                                            readOnly={readOnly}
                                            placeholder="Prefix"
                                            {...field}
                                        />
                                    )}
                                />
                            </FormItem>
                        </div>
                        {children}
                    </div>
                </Form>
            </div>
        </Dialog>
    )
}

export default PrefixForm
