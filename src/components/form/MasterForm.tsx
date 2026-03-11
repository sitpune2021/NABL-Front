/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from '@hookform/resolvers/zod'
import {
    FormProvider,
    useForm,
    FieldValues,
    DefaultValues,
} from 'react-hook-form'
import { Form } from '../ui'

type Props<T extends FieldValues> = {
    schema: any
    defaultValues?: DefaultValues<T>
    onSubmit: (values: T) => void
    children: React.ReactNode
    className?: string
    containerClassName?: string
}

export default function MasterForm<T extends FieldValues>({
    schema,
    defaultValues,
    onSubmit,
    children,
    className = 'flex w-full h-full',
    containerClassName = 'flex flex-col w-full justify-between',
}: Props<T>) {
    const methods = useForm<T>({
        resolver: zodResolver(schema),
        defaultValues,
        mode: 'onSubmit',
        reValidateMode: 'onChange',
    })

    return (
        <FormProvider {...methods}>
            <Form
                className={className}
                containerClassName={containerClassName}
                onSubmit={methods.handleSubmit(onSubmit)}
            >
                {children}
            </Form>
        </FormProvider>
    )
}
