/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from '@hookform/resolvers/zod'
import {
    FormProvider,
    useForm,
    FieldValues,
    SubmitHandler,
    DefaultValues,
} from 'react-hook-form'
import { Form } from '../ui'

type Props<T extends FieldValues> = {
    schema: any
    defaultValues: DefaultValues<T>
    onSubmit: (values: T) => void
    children: React.ReactNode
}

export default function MasterForm<T extends FieldValues>({
    schema,
    defaultValues,
    onSubmit,
    children,
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
                className="flex w-full h-full"
                containerClassName="flex flex-col w-full justify-between"
                onSubmit={methods.handleSubmit(
                    onSubmit as SubmitHandler<FieldValues>,
                )}
            >
                {children}
            </Form>
        </FormProvider>
    )
}
